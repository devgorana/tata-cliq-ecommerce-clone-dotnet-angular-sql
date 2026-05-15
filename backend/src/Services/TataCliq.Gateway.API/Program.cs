using System.Security.Cryptography;
using System.Threading.RateLimiting;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.IdentityModel.Tokens;
using Serilog;

Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .CreateBootstrapLogger();

try
{
    var builder = WebApplication.CreateBuilder(args);

    builder.Host.UseSerilog((ctx, cfg) =>
        cfg.ReadFrom.Configuration(ctx.Configuration)
           .Enrich.FromLogContext()
           .Enrich.WithProperty("Service", "Gateway.API"));

    // JWT RS256 — pre-validate tokens at the gateway
    var publicKeyPem = builder.Configuration["Jwt:PublicKey"];
    if (!string.IsNullOrEmpty(publicKeyPem))
    {
        var rsa = RSA.Create();
        rsa.ImportFromPem(publicKeyPem);

        builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(opt =>
            {
                opt.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer           = true,
                    ValidateAudience         = true,
                    ValidateLifetime         = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer              = builder.Configuration["Jwt:Issuer"],
                    ValidAudience            = builder.Configuration["Jwt:Audience"],
                    IssuerSigningKey         = new RsaSecurityKey(rsa),
                    ClockSkew                = TimeSpan.Zero,
                };
            });

        builder.Services.AddAuthorization();
    }

    // Rate limiting
    builder.Services.AddRateLimiter(opt =>
    {
        opt.AddFixedWindowLimiter("auth-limiter", cfg =>
        {
            cfg.PermitLimit         = 20;
            cfg.Window              = TimeSpan.FromMinutes(1);
            cfg.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
            cfg.QueueLimit          = 0;
        });

        opt.AddFixedWindowLimiter("global-limiter", cfg =>
        {
            cfg.PermitLimit         = 200;
            cfg.Window              = TimeSpan.FromMinutes(1);
            cfg.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
            cfg.QueueLimit          = 10;
        });

        opt.RejectionStatusCode = 429;
    });

    // CORS — allow both Angular apps
    builder.Services.AddCors(opt =>
        opt.AddDefaultPolicy(p =>
            p.WithOrigins("http://localhost:4200", "http://localhost:4201")
             .AllowAnyHeader()
             .AllowAnyMethod()));

    // YARP
    builder.Services.AddReverseProxy()
        .LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"));

    var app = builder.Build();

    app.UseSerilogRequestLogging();
    app.UseCors();
    app.UseRateLimiter();

    if (!string.IsNullOrEmpty(publicKeyPem))
    {
        app.UseAuthentication();
        app.UseAuthorization();
    }

    // Security headers
    app.Use(async (ctx, next) =>
    {
        ctx.Response.Headers.Append("X-Content-Type-Options", "nosniff");
        ctx.Response.Headers.Append("X-Frame-Options", "DENY");
        ctx.Response.Headers.Append("X-XSS-Protection", "1; mode=block");
        ctx.Response.Headers.Append("Referrer-Policy", "strict-origin-when-cross-origin");
        await next();
    });

    // Health check endpoint
    app.MapGet("/health", () => Results.Ok(new
    {
        Status = "Healthy",
        Service = "TataCliq Gateway",
        Timestamp = DateTime.UtcNow,
    }));

    app.MapReverseProxy();

    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "Gateway.API terminated unexpectedly");
}
finally
{
    Log.CloseAndFlush();
}
