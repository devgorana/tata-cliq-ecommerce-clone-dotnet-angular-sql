namespace TataCliq.Catalog.API.DTOs;

public record ReviewDto(
    Guid   Id,
    Guid   ProductId,
    Guid   UserId,
    string Author,
    int    Rating,
    string Title,
    string Body,
    DateTime CreatedAt
);

public record CreateReviewRequest(
    int    Rating,
    string Title,
    string Body
);
