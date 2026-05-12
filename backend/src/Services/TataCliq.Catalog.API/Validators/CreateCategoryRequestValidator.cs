using FluentValidation;
using TataCliq.Catalog.API.DTOs;

namespace TataCliq.Catalog.API.Validators;

public sealed class CreateCategoryRequestValidator : AbstractValidator<CreateCategoryRequest>
{
    public CreateCategoryRequestValidator()
    {
        RuleFor(x => x.Name).NotEmpty().Length(2, 100);
        RuleFor(x => x.ImageUrl).MaximumLength(1000).When(x => x.ImageUrl is not null);
    }
}
