using System.Security.Cryptography;
using FluentValidation;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Serilog;
using TataCliq.Infrastructure.Entities.Auth;
using TataCliq.Infrastructure.Persistence;
using TataCliq.SharedKernel.Extensions;
using TataCliq.SharedKernel.HealthChecks;
using TataCliq.User.API.Mapping;
using TataCliq.User.API.Services;
using TataCliq.User.API.Validators;

Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .CreateBootstrapLogger();

try
{
    var builder = WebApplication.CreateBuilder(args);

    builder.Host.UseSerilog((ctx, cfg) =>
        cfg.ReadFrom.Configuration(ctx.Configuration)
           .Enrich.FromLogContext()
           .Enrich.WithProperty("Service", "User.API"));

    // DbContext
    builder.Services.AddDbContext<AppDbContext>(opt =>
        opt.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"),
            sql => sql.MigrationsAssembly(typeof(AppDbContext).Assembly.FullName))
           .AddInterceptors(new SaveChangesAuditInterceptor()));

    // Identity (read-only — auth is owned by Auth.API; needed for UserManager)
    builder.Services.AddIdentityCore<ApplicationUser>()
        .AddRoles<IdentityRole<Guid>>()
        .AddEntityFrameworkStores<AppDbContext>();

    // JWT RS256 (verify only — no private key needed)
    var rsa = RSA.Create();
    var publicKeyPem = builder.Configuration["Jwt:PublicKey"]
        ?? throw new InvalidOperationException("Jwt:PublicKey not configured.");
    rsa.ImportFromPem(publicKeyPem);

    builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
        .AddJwtBearer(opt =>
        {
            opt.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = builder.Configuration["Jwt:Issuer"],
                ValidAudience = builder.Configuration["Jwt:Audience"],
                IssuerSigningKey = new RsaSecurityKey(rsa),
                ClockSkew = TimeSpan.Zero
            };
        });

    builder.Services.AddAuthorization();

    // AutoMapper
    builder.Services.AddAutoMapper(cfg => cfg.AddProfile<UserMappingProfile>());

    // App services
    builder.Services.AddScoped<IUserService, UserService>();
    builder.Services.AddScoped<IWalletService, WalletService>();
    builder.Services.AddScoped<INotificationService, NotificationService>();

    // FluentValidation
    builder.Services.AddValidatorsFromAssemblyContaining<UpdateProfileValidator>();

    builder.Services.AddControllers();
    builder.Services.AddOpenApi();
    builder.Services.AddEndpointsApiExplorer();

    // Response compression — Brotli + Gzip
    builder.Services.AddResponseCompression(opt =>
    {
        opt.EnableForHttps = true;
        opt.Providers.Add<Microsoft.AspNetCore.ResponseCompression.BrotliCompressionProvider>();
        opt.Providers.Add<Microsoft.AspNetCore.ResponseCompression.GzipCompressionProvider>();
    });

    // CORS — configurable via AllowedOrigins env/config
    var allowedOrigins = builder.Configuration.GetSection("AllowedOrigins").Get<string[]>()
                         ?? ["http://localhost:4200", "http://localhost:4201"];
    builder.Services.AddCors(opt =>
        opt.AddDefaultPolicy(p =>
            p.WithOrigins(allowedOrigins)
             .AllowAnyHeader()
             .AllowAnyMethod()));

    // Health checks
    var connString = builder.Configuration.GetConnectionString("DefaultConnection")!;
    builder.Services.AddHealthChecks()
        .AddCheck("sqlserver", new DatabaseHealthCheck(connString), tags: ["db", "ready"]);

    var app = builder.Build();

    app.UseResponseCompression();
    app.UseSerilogRequestLogging();
    app.UseCors();
    app.UseSecurityHeaders();
    app.UseCorrelationId();
    app.UseExceptionMiddleware();

    if (!app.Environment.IsProduction())
    {
        app.MapOpenApi();
        app.UseSwaggerUI(c => c.SwaggerEndpoint("/openapi/v1.json", "User API v1"));
    }

    app.MapHealthChecks("/health");
    app.UseAuthentication();
    app.UseAuthorization();
    app.MapControllers();

    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "User.API terminated unexpectedly");
}
finally
{
    Log.CloseAndFlush();
}
