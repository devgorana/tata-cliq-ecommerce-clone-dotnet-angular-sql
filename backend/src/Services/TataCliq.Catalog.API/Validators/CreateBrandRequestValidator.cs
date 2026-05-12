using FluentValidation;
using TataCliq.Catalog.API.DTOs;

namespace TataCliq.Catalog.API.Validators;

public sealed class CreateBrandRequestValidator : AbstractValidator<CreateBrandRequest>
{
    public CreateBrandRequestValidator()
    {
        RuleFor(x => x.Name).NotEmpty().Length(2, 100);
        RuleFor(x => x.LogoUrl).MaximumLength(1000).When(x => x.LogoUrl is not null);
    }
}
