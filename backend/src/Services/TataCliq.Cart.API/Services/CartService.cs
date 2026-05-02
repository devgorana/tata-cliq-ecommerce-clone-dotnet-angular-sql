using Microsoft.EntityFrameworkCore;
using TataCliq.Cart.API.DTOs;
using TataCliq.Infrastructure.Entities.Admin;
using TataCliq.Infrastructure.Persistence;
using CartEntity     = TataCliq.Infrastructure.Entities.Commerce.Cart;
using CartItemEntity = TataCliq.Infrastructure.Entities.Commerce.CartItem;

namespace TataCliq.Cart.API.Services;

public interface ICartService
{
    Task<CartDto>  GetCartAsync(Guid userId, CancellationToken ct = default);
    Task<CartDto>  AddItemAsync(Guid userId, Guid productVariantId, int quantity, CancellationToken ct = default);
    Task<CartDto>  UpdateItemAsync(Guid userId, Guid cartItemId, int quantity, CancellationToken ct = default);
    Task<CartDto>  RemoveItemAsync(Guid userId, Guid cartItemId, CancellationToken ct = default);
    Task<CartDto>  ApplyCouponAsync(Guid userId, string code, CancellationToken ct = default);
}

public sealed class CartService(AppDbContext db) : ICartService
{
    public async Task<CartDto> GetCartAsync(Guid userId, CancellationToken ct = default)
    {
        var cart = await GetOrCreateCartAsync(userId, ct);
        return MapCart(cart, null, 0m);
    }

    public async Task<CartDto> AddItemAsync(Guid userId, Guid productVariantId, int quantity, CancellationToken ct = default)
    {
        var cart = await GetOrCreateCartAsync(userId, ct);

        var existing = cart.Items.FirstOrDefault(i => i.ProductVariantId == productVariantId);
        if (existing is not null)
        {
            existing.Quantity = Math.Min(existing.Quantity + quantity, 20);
        }
        else
        {
            cart.Items.Add(new CartItemEntity
            {
                CartId           = cart.Id,
                ProductVariantId = productVariantId,
                Quantity         = quantity
            });
        }

        await db.SaveChangesAsync(ct);
        await db.Entry(cart).ReloadAsync(ct);
        cart = await LoadCartAsync(cart.Id, ct);
        return MapCart(cart!, null, 0m);
    }

    public async Task<CartDto> UpdateItemAsync(Guid userId, Guid cartItemId, int quantity, CancellationToken ct = default)
    {
        var cart = await GetOrCreateCartAsync(userId, ct);
        var item = cart.Items.FirstOrDefault(i => i.Id == cartItemId)
            ?? throw new KeyNotFoundException("Cart item not found.");

        item.Quantity = quantity;
        await db.SaveChangesAsync(ct);
        cart = await LoadCartAsync(cart.Id, ct);
        return MapCart(cart!, null, 0m);
    }

    public async Task<CartDto> RemoveItemAsync(Guid userId, Guid cartItemId, CancellationToken ct = default)
    {
        var cart = await GetOrCreateCartAsync(userId, ct);
        var item = cart.Items.FirstOrDefault(i => i.Id == cartItemId)
            ?? throw new KeyNotFoundException("Cart item not found.");

        db.CartItems.Remove(item);
        await db.SaveChangesAsync(ct);
        cart = await LoadCartAsync(cart.Id, ct);
        return MapCart(cart!, null, 0m);
    }

    public async Task<CartDto> ApplyCouponAsync(Guid userId, string code, CancellationToken ct = default)
    {
        var coupon = await db.Coupons
            .AsNoTracking()
            .FirstOrDefaultAsync(c =>
                c.Code == code.ToUpperInvariant() &&
                c.IsActive &&
                (c.ExpiresAt == null || c.ExpiresAt > DateTime.UtcNow) &&
                (c.TotalUsageLimit == null || c.UsedCount < c.TotalUsageLimit),
                ct)
            ?? throw new InvalidOperationException("Invalid or expired coupon.");

        var cart = await GetOrCreateCartAsync(userId, ct);
        var subTotal = CalculateSubTotal(cart);

        if (coupon.MinOrderAmount.HasValue && subTotal < coupon.MinOrderAmount.Value)
            throw new InvalidOperationException($"Minimum order amount of ₹{coupon.MinOrderAmount:F0} required.");

        var discount = coupon.DiscountType == DiscountType.Percentage
            ? subTotal * coupon.DiscountValue / 100m
            : coupon.DiscountValue;

        if (coupon.MaxDiscountCap.HasValue)
            discount = Math.Min(discount, coupon.MaxDiscountCap.Value);

        return MapCart(cart, code.ToUpperInvariant(), discount);
    }

    // ── helpers ──────────────────────────────────────────────────────────────

    private async Task<CartEntity> GetOrCreateCartAsync(Guid userId, CancellationToken ct)
    {
        var cart = await db.Carts
            .Include(c => c.Items)
                .ThenInclude(ci => ci.ProductVariant)
                    .ThenInclude(pv => pv.Product)
                        .ThenInclude(p => p.Images)
            .FirstOrDefaultAsync(c => c.UserId == userId, ct);

        if (cart is not null) return cart;

        cart = new CartEntity { UserId = userId };
        db.Carts.Add(cart);
        await db.SaveChangesAsync(ct);
        return cart;
    }

    private async Task<CartEntity?> LoadCartAsync(Guid cartId, CancellationToken ct) =>
        await db.Carts
            .Include(c => c.Items)
                .ThenInclude(ci => ci.ProductVariant)
                    .ThenInclude(pv => pv.Product)
                        .ThenInclude(p => p.Images)
            .FirstOrDefaultAsync(c => c.Id == cartId, ct);

    private static decimal CalculateSubTotal(CartEntity cart) =>
        cart.Items.Sum(i =>
        {
            var price = i.ProductVariant.PriceOverride
                     ?? i.ProductVariant.Product.DiscountedPrice
                     ?? i.ProductVariant.Product.BasePrice;
            return price * i.Quantity;
        });

    private static CartDto MapCart(CartEntity cart, string? couponCode, decimal discount)
    {
        var items = cart.Items.Select(i =>
        {
            var unitPrice = i.ProductVariant.PriceOverride
                         ?? i.ProductVariant.Product.DiscountedPrice
                         ?? i.ProductVariant.Product.BasePrice;
            var imageUrl = i.ProductVariant.Product.Images
                .OrderBy(img => img.DisplayOrder)
                .Select(img => img.Url)
                .FirstOrDefault();
            return new CartItemDto(
                i.Id,
                i.ProductVariantId,
                i.ProductVariant.ProductId,
                i.ProductVariant.Product.Name,
                imageUrl,
                i.ProductVariant.Size,
                i.ProductVariant.Colour,
                unitPrice,
                i.Quantity,
                unitPrice * i.Quantity
            );
        }).ToList();

        var subTotal = items.Sum(i => i.TotalPrice);
        var total    = Math.Max(subTotal - discount, 0m);
        return new CartDto(cart.Id, items, subTotal, discount, total, couponCode);
    }
}
