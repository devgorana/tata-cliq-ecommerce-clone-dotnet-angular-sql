namespace TataCliq.Catalog.API.DTOs;

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
