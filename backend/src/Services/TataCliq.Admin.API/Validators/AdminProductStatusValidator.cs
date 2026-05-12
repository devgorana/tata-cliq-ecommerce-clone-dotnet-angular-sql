using FluentValidation;
using TataCliq.Admin.API.DTOs;

namespace TataCliq.Admin.API.Validators;

public sealed class AdminProductStatusValidator : AbstractValidator<UpdateProductStatusRequest>
{
    public AdminProductStatusValidator()
    {
        RuleFor(x => x.IsActive).NotNull();
    }
}
