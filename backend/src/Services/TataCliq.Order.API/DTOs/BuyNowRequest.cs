namespace TataCliq.Order.API.DTOs;

public record BuyNowRequest(
    Guid    ProductId,
    string? Size,
    string? Colour,
    int     Quantity
);
