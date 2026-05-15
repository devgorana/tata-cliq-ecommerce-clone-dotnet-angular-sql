using FluentValidation;
using TataCliq.Catalog.API.DTOs;

namespace TataCliq.Catalog.API.Validators;

public sealed class CreateReviewRequestValidator : AbstractValidator<CreateReviewRequest>
{
    public CreateReviewRequestValidator()
    {
        RuleFor(x => x.Rating)
            .InclusiveBetween(1, 5)
            .WithMessage("Rating must be between 1 and 5.");

        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Review title is required.")
            .MaximumLength(120).WithMessage("Title must not exceed 120 characters.");

        RuleFor(x => x.Body)
            .NotEmpty().WithMessage("Review body is required.")
            .MaximumLength(2000).WithMessage("Review body must not exceed 2000 characters.");
    }
}
