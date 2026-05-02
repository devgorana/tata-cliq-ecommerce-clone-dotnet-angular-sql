using FluentValidation;
using TataCliq.Catalog.API.DTOs;

namespace TataCliq.Catalog.API.Validators;

public sealed class ProductQueryValidator : AbstractValidator<ProductQueryDto>
{
    public ProductQueryValidator()
    {
        RuleFor(x => x.Page).GreaterThanOrEqualTo(1);
        RuleFor(x => x.PageSize).InclusiveBetween(1, 100);
        RuleFor(x => x.MinPrice).GreaterThanOrEqualTo(0).When(x => x.MinPrice.HasValue);
        RuleFor(x => x.MaxPrice).GreaterThan(x => x.MinPrice ?? 0).When(x => x.MaxPrice.HasValue);
    }
}
