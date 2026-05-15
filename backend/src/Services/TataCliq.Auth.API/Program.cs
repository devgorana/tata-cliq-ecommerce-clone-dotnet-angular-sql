using System.Security.Cryptography;
using FluentValidation;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Serilog;
using TataCliq.Auth.API.Services;
using TataCliq.Auth.API.Validators;
using TataCliq.Infrastructure.Entities.Auth;
using TataCliq.Infrastructure.Persistence;
using TataCliq.SharedKernel.Extensions;

Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .CreateBootstrapLogger();

try
{
    var builder = WebApplication.CreateBuilder(args);

    builder.Host.UseSerilog((ctx, cfg) =>
        cfg.ReadFrom.Configuration(ctx.Configuration)
           .Enrich.FromLogContext()
           .Enrich.WithProperty("Service", "Auth.API"));

    // DbContext
    builder.Services.AddDbContext<AppDbContext>(opt =>
        opt.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"),
            sql => sql.MigrationsAssembly(typeof(AppDbContext).Assembly.FullName))
           .AddInterceptors(new SaveChangesAuditInterceptor()));

    // Identity
    builder.Services.AddIdentity<ApplicationUser, IdentityRole<Guid>>(opt =>
    {
        opt.Password.RequireDigit = true;
        opt.Password.RequiredLength = 8;
        opt.Password.RequireUppercase = true;
        opt.Password.RequireNonAlphanumeric = false;
        opt.User.RequireUniqueEmail = true;
    })
    .AddEntityFrameworkStores<AppDbContext>()
    .AddDefaultTokenProviders();

    // JWT RS256
    var rsa = RSA.Create();
    var publicKeyPem = builder.Configuration["Jwt:PublicKey"]
        ?? throw new InvalidOperationException("Jwt:PublicKey not configured.");
    rsa.ImportFromPem(publicKeyPem);

    builder.Services.AddAuthentication(opt =>
    {
        opt.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        opt.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
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

    // App services
    builder.Services.AddScoped<ITokenService, TokenService>();
    builder.Services.AddScoped<IAuthService, AuthService>();
    builder.Services.AddScoped<IOtpService, OtpService>();

    // FluentValidation
    builder.Services.AddValidatorsFromAssemblyContaining<LoginRequestValidator>();

    builder.Services.AddControllers();

    // OpenAPI / Swagger (Swashbuckle 10.x + ASP.NET Core OpenAPI)
    builder.Services.AddOpenApi();
    builder.Services.AddEndpointsApiExplorer();

    // CORS — Angular dev server (storefront + admin panel)
    builder.Services.AddCors(opt =>
        opt.AddDefaultPolicy(p =>
            p.WithOrigins("http://localhost:4200", "http://localhost:4201")
             .AllowAnyHeader()
             .AllowAnyMethod()));

    var app = builder.Build();

    app.UseSerilogRequestLogging();
    app.UseCors();
    app.UseCorrelationId();
    app.UseExceptionMiddleware();

    // Seed roles, admin user, and catalog data on startup
    using (var scope = app.Services.CreateScope())
    {
        var db      = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var userMgr = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
        var roleMgr = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole<Guid>>>();
        try
        {
            await TataCliq.Infrastructure.Persistence.DbSeeder.SeedAsync(db, userMgr, roleMgr);
        }
        catch (Exception seedEx)
        {
            Log.Error(seedEx, "Database seeding failed — API will continue without seed data");
        }
    }

    app.MapOpenApi();
    app.UseSwaggerUI(c => c.SwaggerEndpoint("/openapi/v1.json", "Auth API v1"));

    app.UseAuthentication();
    app.UseAuthorization();
    app.MapControllers();

    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "Auth.API terminated unexpectedly");
}
finally
{
    Log.CloseAndFlush();
}
