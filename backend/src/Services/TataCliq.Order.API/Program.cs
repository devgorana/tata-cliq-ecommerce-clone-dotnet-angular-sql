using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Serilog;
using TataCliq.Infrastructure.Persistence;
using TataCliq.Order.API.Services;
using TataCliq.Order.API.Validators;
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
           .Enrich.WithProperty("Service", "Order.API"));

    // DbContext
    builder.Services.AddDbContext<AppDbContext>(opt =>
        opt.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"),
            sql => sql.MigrationsAssembly(typeof(AppDbContext).Assembly.FullName))
           .AddInterceptors(new SaveChangesAuditInterceptor()));

    // JWT RS256 — Polly retry + 15-min key cache (ENH-AUTH-007)
    builder.Services.AddResilientJwtBearer(builder.Configuration);
    builder.Services.AddAuthorization();

    // App services
    builder.Services.AddScoped<IOrderService, OrderService>();
    builder.Services.AddScoped<ISellerOrderService, SellerOrderService>();

    // FluentValidation
    builder.Services.AddValidatorsFromAssemblyContaining<PlaceOrderValidator>();

    builder.Services.AddControllers();

    // OpenAPI / Swagger
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

    using (var scope = app.Services.CreateScope())
    {
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        try
        {
            for (int attempt = 1; attempt <= 5; attempt++)
            {
                try
                {
                    await db.Database.MigrateAsync();
                    break;
                }
                catch (Microsoft.Data.SqlClient.SqlException ex) when (ex.Number == 1801)
                {
                    if (attempt < 5)
                        await Task.Delay(TimeSpan.FromSeconds(attempt * 2));
                }
            }
        }
        catch (Exception ex) { Log.Error(ex, "Order.API — migration failed, continuing"); }
    }

    app.UseResponseCompression();
    app.UseSerilogRequestLogging();
    app.UseCors();
    app.UseSecurityHeaders();
    app.UseCorrelationId();
    app.UseExceptionMiddleware();

    if (!app.Environment.IsProduction())
    {
        app.MapOpenApi();
        app.UseSwaggerUI(c => c.SwaggerEndpoint("/openapi/v1.json", "Order API v1"));
    }

    app.MapHealthChecks("/health");
    app.UseAuthentication();
    app.UseAuthorization();
    app.MapControllers();

    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "Order.API terminated unexpectedly");
}
finally
{
    Log.CloseAndFlush();
}
