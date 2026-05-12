namespace TataCliq.Catalog.API.DTOs;

// ── Read DTOs ────────────────────────────────────────────────────────────────

public record ProductVariantDto(
    Guid    Id,
    string  Size,
    string? Colour,
    int     StockQuantity,
    decimal? PriceOverride
);

public record ProductDto(
    Guid   Id,
    string Name,
    string Slug,
    string Description,
    decimal Price,
    decimal? SalePrice,
    Guid   BrandId,
    string BrandName,
    Guid   CategoryId,
    string CategoryName,
    IReadOnlyList<string> ImageUrls,
    IReadOnlyList<ProductVariantDto> Variants,
    double Rating,
    int    ReviewCount,
    bool   InStock
);

public record ProductListDto(
    IReadOnlyList<ProductDto> Items,
    int TotalCount,
    int Page,
    int PageSize
);

public record CategoryDto(
    Guid   Id,
    string Name,
    string Slug,
    Guid?  ParentId,
    string? ImageUrl
);

public record BrandDto(
    Guid   Id,
    string Name,
    string Slug,
    string? LogoUrl
);

// ── Write DTOs ───────────────────────────────────────────────────────────────

public record CreateProductRequest(
    string                Name,
    string                Description,
    Guid                  BrandId,
    Guid                  CategoryId,
    decimal               Price,
    decimal?              SalePrice,
    IReadOnlyList<string> ImageUrls
);

public record UpdateProductRequest(
    string   Name,
    string   Description,
    decimal  Price,
    decimal? SalePrice,
    bool     IsActive
);

public record CreateCategoryRequest(
    string  Name,
    Guid?   ParentId,
    string? ImageUrl
);

public record CreateBrandRequest(
    string  Name,
    string? LogoUrl
);
