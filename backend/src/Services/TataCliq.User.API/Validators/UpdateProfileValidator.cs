using FluentValidation;
using TataCliq.User.API.DTOs;

namespace TataCliq.User.API.Validators;

public class UpdateProfileValidator : AbstractValidator<UpdateProfileRequestDto>
{
    public UpdateProfileValidator()
    {
        RuleFor(x => x.FirstName).NotEmpty().MaximumLength(100);
        RuleFor(x => x.LastName).NotEmpty().MaximumLength(100);
        RuleFor(x => x.DateOfBirth)
            .LessThan(DateTime.UtcNow).When(x => x.DateOfBirth.HasValue)
            .WithMessage("Date of birth must be in the past.");
    }
}
