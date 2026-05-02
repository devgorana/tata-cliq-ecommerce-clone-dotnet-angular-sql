using AutoMapper;
using TataCliq.Catalog.API.DTOs;
using TataCliq.Infrastructure.Entities.Catalog;

namespace TataCliq.Catalog.API.Mapping;

public sealed class CatalogMappingProfile : Profile
{
    public CatalogMappingProfile()
    {
        CreateMap<Product, ProductDto>()
            .ConstructUsing((p, _) => new ProductDto(
                p.Id,
                p.Name,
                p.Slug,
                p.Description ?? string.Empty,
                p.BasePrice,
                p.DiscountedPrice,
                p.BrandId,
                p.Brand?.Name ?? string.Empty,
                p.CategoryId,
                p.Category?.Name ?? string.Empty,
                p.Images.OrderBy(i => i.DisplayOrder).Select(i => i.Url).ToList(),
                p.AverageRating,
                p.ReviewCount,
                p.IsActive
            ));

        CreateMap<Category, CategoryDto>()
            .ConstructUsing((c, _) => new CategoryDto(
                c.Id, c.Name, c.Slug, c.ParentId, c.ImageUrl
            ));

        CreateMap<Brand, BrandDto>()
            .ConstructUsing((b, _) => new BrandDto(
                b.Id, b.Name, b.Slug, b.LogoUrl
            ));
    }
}
