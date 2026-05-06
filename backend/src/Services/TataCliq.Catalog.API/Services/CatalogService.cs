using AutoMapper;
using Microsoft.EntityFrameworkCore;
using TataCliq.Catalog.API.DTOs;
using TataCliq.Infrastructure.Persistence;

namespace TataCliq.Catalog.API.Services;

public interface ICatalogService
{
    Task<ProductListDto> GetProductsAsync(ProductQueryDto query, CancellationToken ct = default);
    Task<ProductDto?>    GetProductAsync(Guid id, CancellationToken ct = default);
    Task<IReadOnlyList<CategoryDto>> GetCategoriesAsync(CancellationToken ct = default);
    Task<IReadOnlyList<BrandDto>>    GetBrandsAsync(CancellationToken ct = default);
}

public sealed class CatalogService(AppDbContext db, IMapper mapper) : ICatalogService
{
    public async Task<ProductListDto> GetProductsAsync(ProductQueryDto query, CancellationToken ct = default)
    {
        var q = db.Products
            .Include(p => p.Brand)
            .Include(p => p.Category)
            .Include(p => p.Images)
            .Include(p => p.Variants)
            .AsNoTracking();

        if (query.CategoryId.HasValue)
            q = q.Where(p => p.CategoryId == query.CategoryId.Value);

        if (query.BrandId.HasValue)
            q = q.Where(p => p.BrandId == query.BrandId.Value);

        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            var search = query.Search.Trim();
            q = q.Where(p => p.Name.Contains(search) || 
                             (p.Description != null && p.Description.Contains(search)) ||
                             p.Brand.Name.Contains(search));
        }

        if (query.MinPrice.HasValue)
            q = q.Where(p => p.BasePrice >= query.MinPrice.Value);

        if (query.MaxPrice.HasValue)
            q = q.Where(p => p.BasePrice <= query.MaxPrice.Value);

        if (query.MinDiscount.HasValue)
        {
            var pct = (decimal)query.MinDiscount.Value;
            // Keep only products where DiscountedPrice exists and the discount % >= requested minimum.
            // Expressed without division: (BasePrice - DiscountedPrice) * 100 >= BasePrice * pct
            q = q.Where(p => p.DiscountedPrice != null &&
                              (p.BasePrice - p.DiscountedPrice.Value) * 100m >= p.BasePrice * pct);
        }

        q = query.Sort switch
        {
            "price_asc"  => q.OrderBy(p => p.BasePrice),
            "price_desc" => q.OrderByDescending(p => p.BasePrice),
            "newest"     => q.OrderByDescending(p => p.CreatedAt),
            "rating"     => q.OrderByDescending(p => p.AverageRating),
            _            => q.OrderByDescending(p => p.CreatedAt),
        };

        var total = await q.CountAsync(ct);
        var items = await q
            .Skip((query.Page - 1) * query.PageSize)
            .Take(query.PageSize)
            .ToListAsync(ct);

        var dtos = items.Select(p => mapper.Map<ProductDto>(p)).ToList();
        return new ProductListDto(dtos, total, query.Page, query.PageSize);
    }

    public async Task<ProductDto?> GetProductAsync(Guid id, CancellationToken ct = default)
    {
        var product = await db.Products
            .Include(p => p.Brand)
            .Include(p => p.Category)
            .Include(p => p.Images)
            .Include(p => p.Variants)
            .AsNoTracking()
            .FirstOrDefaultAsync(p => p.Id == id, ct);

        return product is null ? null : mapper.Map<ProductDto>(product);
    }

    public async Task<IReadOnlyList<CategoryDto>> GetCategoriesAsync(CancellationToken ct = default)
    {
        var cats = await db.Categories.AsNoTracking().ToListAsync(ct);
        return cats.Select(c => mapper.Map<CategoryDto>(c)).ToList();
    }

    public async Task<IReadOnlyList<BrandDto>> GetBrandsAsync(CancellationToken ct = default)
    {
        var brands = await db.Brands.AsNoTracking().ToListAsync(ct);
        return brands.Select(b => mapper.Map<BrandDto>(b)).ToList();
    }
}
