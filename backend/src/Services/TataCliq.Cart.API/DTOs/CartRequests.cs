namespace TataCliq.Cart.API.DTOs;

public record AddToCartRequest(Guid ProductVariantId, int Quantity);

public record UpdateCartItemRequest(int Quantity);

public record ApplyCouponRequest(string Code);
