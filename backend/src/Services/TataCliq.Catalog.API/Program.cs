using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Serilog;
using TataCliq.Catalog.API.Mapping;
using TataCliq.Catalog.API.Services;
using TataCliq.Catalog.API.Validators;
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
           .Enrich.WithProperty("Service", "Catalog.API"));

    // DbContext
    builder.Services.AddDbContext<AppDbContext>(opt =>
        opt.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"),
            sql => sql.MigrationsAssembly(typeof(AppDbContext).Assembly.FullName))
           .AddInterceptors(new SaveChangesAuditInterceptor()));

    // JWT RS256 — Polly retry + 15-min key cache (ENH-AUTH-007)
    builder.Services.AddResilientJwtBearer(builder.Configuration);
    builder.Services.AddAuthorization();

    // Redis distributed cache (falls back to NullCacheService when Redis is not configured)
    var redisConn = builder.Configuration.GetConnectionString("Redis");
    if (!string.IsNullOrEmpty(redisConn))
    {
        builder.Services.AddStackExchangeRedisCache(opt => opt.Configuration = redisConn);
        builder.Services.AddSingleton<ICacheService, RedisCacheService>();
    }
    else
    {
        builder.Services.AddDistributedMemoryCache();
        builder.Services.AddSingleton<ICacheService, NullCacheService>();
    }

    // App services
    builder.Services.AddScoped<ICatalogService, CatalogService>();
    builder.Services.AddScoped<ISellerCatalogService, SellerCatalogService>();
    // ENH-PDP-001 — Pincode delivery estimate
    builder.Services.AddScoped<IPincodeService, PincodeService>();
    // ENH-SRCH-002 — Search autocomplete + typeahead
    builder.Services.AddScoped<ISearchSuggestService, SearchSuggestService>();
    // ENH-PDP-002 — EMI Calculator
    builder.Services.Configure<EmiSettings>(
        builder.Configuration.GetSection(EmiSettings.Section));
    builder.Services.AddSingleton<IEmiCalculatorService, EmiCalculatorService>();
    // ENH-CAT-002 — Flash Sale Module
    builder.Services.AddScoped<IFlashSaleService, FlashSaleService>();
    // ENH-PROMO-003 — Flash Sale Price Lock (race-condition-safe)
    builder.Services.AddScoped<IFlashSalePriceLockService, FlashSalePriceLockService>();
    // ENH-AI-001/002 — Personalised feed + trending fallback
    builder.Services.AddScoped<IPersonalisedFeedService, PersonalisedFeedService>();
    // ENH-PDP-005 / ENH-AI-004 — Related product rails (Similar, Complete the Look, FBT)
    builder.Services.AddScoped<IRelatedProductsService, RelatedProductsService>();
    // ENH-CAT-007 — SEO Canonicalisation
    builder.Services.AddScoped<ISeoService, SeoService>();
    // ENH-CAT-001 — Recently Viewed Products Rail (last 12 per user)
    builder.Services.AddScoped<IRecentlyViewedService, RecentlyViewedService>();
    // ENH-CAT-008 — Category Slug 301-Redirect on Rename
    builder.Services.AddScoped<ICategorySlugRedirectService, CategorySlugRedirectService>();
    // ENH-PDP-004 — Q&A Section
    builder.Services.AddScoped<IQnaService, QnaService>();
    // ENH-PDP-006 — Back-in-Stock Notification
    builder.Services.AddScoped<IBackInStockService, BackInStockService>();
    // ENH-ADMIN-005 — Dynamic Attribute Filtering (EAV facets)
    builder.Services.AddScoped<IDynamicAttributeFilterService, DynamicAttributeFilterService>();

    // AutoMapper
    builder.Services.AddAutoMapper(cfg => cfg.AddProfile<CatalogMappingProfile>());

    // FluentValidation
    builder.Services.AddValidatorsFromAssemblyContaining<ProductQueryValidator>();

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

    // Health checks — SQL Server connectivity
    var connString = builder.Configuration.GetConnectionString("DefaultConnection")!;
    builder.Services.AddHealthChecks()
        .AddCheck("sqlserver", new DatabaseHealthCheck(connString), tags: ["db", "ready"]);

    var app = builder.Build();

    // Apply any pending EF migrations on startup so the Product.SellerId column
    // (and future schema changes) are present before the first request is served.
    using (var scope = app.Services.CreateScope())
    {
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        try
        {
            // Retry up to 5 times to handle race condition where another service
            // is creating the database at the same time.
            for (int attempt = 1; attempt <= 5; attempt++)
            {
                try
                {
                    await db.Database.MigrateAsync();
                    break;
                }
                catch (Microsoft.Data.SqlClient.SqlException ex) when (ex.Number == 1801)
                {
                    // Database already exists — another service created it first.
                    // Wait briefly and retry so our migrations still apply.
                    if (attempt < 5)
                        await Task.Delay(TimeSpan.FromSeconds(attempt * 2));
                }
            }
        }
        catch (Exception ex) { Log.Error(ex, "Catalog.API — migration failed, continuing"); }
    }

    app.UseResponseCompression();
    app.UseSerilogRequestLogging();
    app.UseCors();
    app.UseSecurityHeaders();
    app.UseCorrelationId();
    app.UseW3CTracing(); // ENH-ADMIN-007
    app.UseExceptionMiddleware();

    if (!app.Environment.IsProduction())
    {
        app.MapOpenApi();
        app.UseSwaggerUI(c => c.SwaggerEndpoint("/openapi/v1.json", "Catalog API v1"));
    }

    app.MapHealthChecks("/health");
    app.UseAuthentication();
    app.UseAuthorization();
    app.MapControllers();

    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "Catalog.API terminated unexpectedly");
}
finally
{
    Log.CloseAndFlush();
}
