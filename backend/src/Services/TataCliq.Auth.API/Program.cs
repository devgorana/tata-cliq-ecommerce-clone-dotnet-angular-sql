using System.Security.Cryptography;
using Azure.Communication.Email;
using FluentValidation;
using Hangfire;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Serilog;
using TataCliq.Auth.API.Options;
using TataCliq.Auth.API.Services;
using TataCliq.Auth.API.Validators;
using TataCliq.Infrastructure.Entities.Auth;
using TataCliq.Infrastructure.Persistence;
using TataCliq.SharedKernel.Extensions;
using TataCliq.SharedKernel.HealthChecks;

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
        // ENH-AUTH-005: 5 failures trigger lockout; default duration overridden by LockoutService doubling
        opt.Lockout.MaxFailedAccessAttempts = 5;
        opt.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(30);
        opt.Lockout.AllowedForNewUsers = true;
    })
    .AddEntityFrameworkStores<AppDbContext>()
    .AddDefaultTokenProviders();

    // JWT RS256 — Polly retry + 15-min key cache (ENH-AUTH-007)
    builder.Services.AddResilientJwtBearer(builder.Configuration);
    builder.Services.AddAuthorization();

    // OTP delivery channel — config-driven: "Logging" (dev) or "AzureCommunication" (prod)
    var otpOptions = builder.Configuration
        .GetSection(OtpDeliveryOptions.SectionName)
        .Get<OtpDeliveryOptions>() ?? new OtpDeliveryOptions();
    builder.Services.AddSingleton(otpOptions);

    if (otpOptions.Provider == "AzureCommunication")
    {
        var acsConnStr = otpOptions.AzureCommunication?.ConnectionString
            ?? throw new InvalidOperationException("OtpDelivery:AzureCommunication:ConnectionString not configured.");
        builder.Services.AddSingleton(new EmailClient(acsConnStr));
        builder.Services.AddScoped<IOtpDeliveryChannel, AzureCommunicationOtpDeliveryChannel>();
    }
    else if (otpOptions.Provider == "Smtp")
    {
        // ENH-NOTIF-004: MailKit SMTP + Hangfire background delivery
        var smtpOpts = otpOptions.Smtp ?? new SmtpEmailOptions();
        builder.Services.AddSingleton(smtpOpts);
        builder.Services.AddScoped<ISmtpMailSender, MailKitSmtpSender>();
        builder.Services.AddScoped<OtpEmailJob>();
        builder.Services.AddScoped<IOtpDeliveryChannel, HangfireOtpDeliveryChannel>();

        builder.Services.AddHangfire(config => config
            .SetDataCompatibilityLevel(CompatibilityLevel.Version_180)
            .UseSimpleAssemblyNameTypeSerializer()
            .UseRecommendedSerializerSettings()
            .UseSqlServerStorage(builder.Configuration.GetConnectionString("DefaultConnection")));
        builder.Services.AddHangfireServer(opt => opt.Queues = ["otp-delivery", "default"]);
    }
    else
    {
        builder.Services.AddScoped<IOtpDeliveryChannel, LoggingOtpDeliveryChannel>();
    }

    // SMS delivery channel — dev: logging; replace with ACS SMS / MSG91 in production
    builder.Services.AddScoped<ISmsDeliveryChannel, LoggingSmsDeliveryChannel>();

    // IMemoryCache — used by AccountMergeService for merge-token TTL (ENH-AUTH-003)
    builder.Services.AddMemoryCache();

    // IHttpContextAccessor — used by AuthService to capture device info (ENH-AUTH-004)
    builder.Services.AddHttpContextAccessor();

    // App services
    builder.Services.AddScoped<ITokenService, TokenService>();
    builder.Services.AddScoped<IAuthService, AuthService>();
    builder.Services.AddScoped<IOtpService, OtpService>();
    builder.Services.AddScoped<IAccountMergeService, AccountMergeService>();
    builder.Services.AddScoped<ISessionService, SessionService>();
    builder.Services.AddScoped<ILockoutService, LockoutService>();
    builder.Services.AddScoped<IMfaService, MfaService>();

    // ENH-AUTH-001 — Facebook OAuth 2.0 service + dedicated HttpClient
    builder.Services.AddHttpClient<IFacebookAuthService, FacebookAuthService>(client =>
    {
        client.DefaultRequestHeaders.Add("Accept", "application/json");
        client.Timeout = TimeSpan.FromSeconds(10);
    });

    // ENH-AUTH-002 — Apple Sign-In service + dedicated HttpClient (fetches Apple JWKS)
    builder.Services.AddHttpClient<IAppleAuthService, AppleAuthService>(client =>
    {
        client.DefaultRequestHeaders.Add("Accept", "application/json");
        client.Timeout = TimeSpan.FromSeconds(10);
    });

    // FluentValidation
    builder.Services.AddValidatorsFromAssemblyContaining<LoginRequestValidator>();

    builder.Services.AddControllers();

    // OpenAPI / Swagger (Swashbuckle 10.x + ASP.NET Core OpenAPI)
    builder.Services.AddOpenApi();
    builder.Services.AddEndpointsApiExplorer();

    // Response compression — Brotli + Gzip
    builder.Services.AddResponseCompression(opt =>
    {
        opt.EnableForHttps = true;
        opt.Providers.Add<Microsoft.AspNetCore.ResponseCompression.BrotliCompressionProvider>();
        opt.Providers.Add<Microsoft.AspNetCore.ResponseCompression.GzipCompressionProvider>();
    });

    // CORS — configurable via AllowedOrigins env/config; fallback to localhost dev origins
    var allowedOrigins = builder.Configuration.GetSection("AllowedOrigins").Get<string[]>()
                         ?? ["http://localhost:4200", "http://localhost:4201"];
    builder.Services.AddCors(opt =>
        opt.AddDefaultPolicy(p =>
            p.WithOrigins(allowedOrigins)
             .AllowAnyHeader()
             .AllowAnyMethod()));

    // Health checks — SQL Server connectivity
    var connString = builder.Configuration.GetConnectionString("DefaultConnection")!;
    builder.Services.AddHealthChecks()
        .AddCheck("sqlserver", new DatabaseHealthCheck(connString), tags: ["db", "ready"]);

    var app = builder.Build();

    app.UseResponseCompression();
    app.UseSerilogRequestLogging();
    app.UseCors();
    app.UseSecurityHeaders();
    app.UseCorrelationId();
    app.UseW3CTracing(); // ENH-ADMIN-007
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

    // Hangfire dashboard — Smtp provider, non-production only
    if (otpOptions.Provider == "Smtp" && !app.Environment.IsProduction())
        app.UseHangfireDashboard("/hangfire");

    // Swagger only in non-production environments
    if (!app.Environment.IsProduction())
    {
        app.MapOpenApi();
        app.UseSwaggerUI(c => c.SwaggerEndpoint("/openapi/v1.json", "Auth API v1"));
    }

    app.MapHealthChecks("/health");
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
