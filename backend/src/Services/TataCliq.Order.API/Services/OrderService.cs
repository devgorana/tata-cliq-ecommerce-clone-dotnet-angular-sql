using Microsoft.EntityFrameworkCore;
using TataCliq.Infrastructure.Entities.Admin;
using TataCliq.Infrastructure.Entities.Auth;
using TataCliq.Infrastructure.Entities.Orders;
using TataCliq.Infrastructure.Persistence;
using TataCliq.Order.API.DTOs;
using TataCliq.Order.API.Exceptions;
using OrderEntity              = TataCliq.Infrastructure.Entities.Orders.Order;
using OrderItemEntity          = TataCliq.Infrastructure.Entities.Orders.OrderItem;
using OrderStatusHistoryEntity = TataCliq.Infrastructure.Entities.Orders.OrderStatusHistory;
using OrderStatusEnum          = TataCliq.Infrastructure.Entities.Orders.OrderStatus;

namespace TataCliq.Order.API.Services;

public interface IOrderService
{
    Task<OrderDto>                PlaceOrderAsync(Guid userId, PlaceOrderRequest request, CancellationToken ct = default);
    Task<OrderDto>                BuyNowAsync(Guid userId, BuyNowRequest request, CancellationToken ct = default);
    Task<IReadOnlyList<OrderDto>> GetOrdersAsync(Guid userId, CancellationToken ct = default);
    Task<OrderDto?>               GetOrderAsync(Guid userId, Guid orderId, CancellationToken ct = default);
    Task                          CancelOrderAsync(Guid userId, Guid orderId, CancellationToken ct = default);
}

public sealed class OrderService(AppDbContext db) : IOrderService
{
    private const decimal DeliveryChargeThreshold = 999m;
    private const decimal FlatDeliveryCharge      = 49m;

    public async Task<OrderDto> PlaceOrderAsync(Guid userId, PlaceOrderRequest request, CancellationToken ct = default)
    {
        var cart = await db.Carts
            .Include(c => c.Items)
                .ThenInclude(ci => ci.ProductVariant)
                    .ThenInclude(pv => pv.Product)
                        .ThenInclude(p => p.Images)
            .FirstOrDefaultAsync(c => c.UserId == userId, ct);

        if (cart is null || !cart.Items.Any())
            throw new InvalidOperationException("Cart is empty.");

        // Resolve or create shipping address
        var address = await db.UserAddresses
            .FirstOrDefaultAsync(a =>
                a.UserId == userId &&
                a.AddressLine1 == request.AddressLine1 &&
                a.City == request.City &&
                a.PinCode == request.Pincode, ct);

        if (address is null)
        {
            address = new UserAddress
            {
                UserId        = userId,
                Label         = "Shipping",
                RecipientName = string.Empty,
                PhoneNumber   = string.Empty,
                AddressLine1  = request.AddressLine1,
                AddressLine2  = request.AddressLine2,
                City          = request.City,
                State         = request.State,
                PinCode       = request.Pincode,
                IsDefault     = false
            };
            db.UserAddresses.Add(address);
            await db.SaveChangesAsync(ct);
        }

        // Coupon validation
        decimal discount   = 0m;
        string? couponCode = null;

        if (!string.IsNullOrWhiteSpace(request.CouponCode))
        {
            var coupon = await db.Coupons
                .FirstOrDefaultAsync(c =>
                    c.Code == request.CouponCode.ToUpperInvariant() &&
                    c.IsActive &&
                    (c.ExpiresAt == null || c.ExpiresAt > DateTime.UtcNow) &&
                    (c.TotalUsageLimit == null || c.UsedCount < c.TotalUsageLimit),
                    ct);

            if (coupon is not null)
            {
                var subTotalForCoupon = cart.Items.Sum(i =>
                {
                    var p = i.ProductVariant.PriceOverride
                         ?? i.ProductVariant.Product.DiscountedPrice
                         ?? i.ProductVariant.Product.BasePrice;
                    return p * i.Quantity;
                });

                discount = coupon.DiscountType == DiscountType.Percentage
                    ? subTotalForCoupon * coupon.DiscountValue / 100m
                    : coupon.DiscountValue;

                if (coupon.MaxDiscountCap.HasValue)
                    discount = Math.Min(discount, coupon.MaxDiscountCap.Value);

                coupon.UsedCount++;
                couponCode = coupon.Code;
            }
        }

        // Re-validate inventory — detect items that went OOS since Add-to-Cart (EC-INV-002)
        var oosItems = cart.Items
            .Where(ci => ci.ProductVariant.StockQuantity < ci.Quantity)
            .Select(ci =>
            {
                var details = string.IsNullOrEmpty(ci.ProductVariant.Colour)
                    ? ci.ProductVariant.Size
                    : $"{ci.ProductVariant.Size} / {ci.ProductVariant.Colour}";
                return new OosItem(
                    ci.ProductVariantId,
                    ci.ProductVariant.Product.Name,
                    details,
                    ci.Quantity,
                    ci.ProductVariant.StockQuantity
                );
            })
            .ToList();

        if (oosItems.Count > 0)
            throw new InventoryValidationException(oosItems);

        // Build order items
        var orderItems = cart.Items.Select(ci =>
        {
            var unitPrice = ci.ProductVariant.PriceOverride
                         ?? ci.ProductVariant.Product.DiscountedPrice
                         ?? ci.ProductVariant.Product.BasePrice;
            var imageUrl = ci.ProductVariant.Product.Images
                .OrderBy(img => img.DisplayOrder)
                .Select(img => img.Url)
                .FirstOrDefault();
            var variantDetails = string.IsNullOrEmpty(ci.ProductVariant.Colour)
                ? ci.ProductVariant.Size
                : $"{ci.ProductVariant.Size} / {ci.ProductVariant.Colour}";
            return new OrderItemEntity
            {
                ProductVariantId = ci.ProductVariantId,
                ProductName      = ci.ProductVariant.Product.Name,
                VariantDetails   = variantDetails,
                ImageUrl         = imageUrl,
                Quantity         = ci.Quantity,
                UnitPrice        = unitPrice,
                TotalPrice       = unitPrice * ci.Quantity
            };
        }).ToList();

        var subTotal       = orderItems.Sum(i => i.TotalPrice);
        var deliveryCharge = subTotal >= DeliveryChargeThreshold ? 0m : FlatDeliveryCharge;
        var totalAmount    = Math.Max(subTotal - discount, 0m) + deliveryCharge;

        var order = new OrderEntity
        {
            UserId            = userId,
            OrderNumber       = GenerateOrderNumber(),
            Status            = OrderStatusEnum.Pending,
            SubTotal          = subTotal,
            DiscountAmount    = discount,
            DeliveryCharge    = deliveryCharge,
            TotalAmount       = totalAmount,
            CouponCode        = couponCode,
            ShippingAddressId = address.Id,
            Items             = orderItems,
            StatusHistory     =
            [
                new OrderStatusHistoryEntity { Status = OrderStatusEnum.Pending, Note = "Order placed" }
            ]
        };

        // Decrement stock atomically — RowVersion on ProductVariant provides optimistic lock
        foreach (var ci in cart.Items)
        {
            ci.ProductVariant.StockQuantity -= ci.Quantity;
        }

        db.Orders.Add(order);
        db.CartItems.RemoveRange(cart.Items);

        try
        {
            await db.SaveChangesAsync(ct);
        }
        catch (DbUpdateConcurrencyException)
        {
            throw new ConcurrentCheckoutException();
        }

        return MapOrder(order);
    }

    public async Task<OrderDto> BuyNowAsync(Guid userId, BuyNowRequest request, CancellationToken ct = default)
    {
        var variantQuery = db.ProductVariants
            .Include(v => v.Product)
                .ThenInclude(p => p.Images)
            .Where(v => v.ProductId == request.ProductId);

        if (!string.IsNullOrWhiteSpace(request.Size))
            variantQuery = variantQuery.Where(v => v.Size == request.Size);

        if (!string.IsNullOrWhiteSpace(request.Colour))
            variantQuery = variantQuery.Where(v => v.Colour == request.Colour);

        var variant = await variantQuery.FirstOrDefaultAsync(ct)
            ?? throw new KeyNotFoundException("Product variant not found.");

        if (variant.StockQuantity < request.Quantity)
            throw new InventoryValidationException(
            [
                new OosItem(
                    variant.Id,
                    variant.Product.Name,
                    variant.Colour is null ? variant.Size : $"{variant.Size} / {variant.Colour}",
                    request.Quantity,
                    variant.StockQuantity
                )
            ]);

        var unitPrice = variant.PriceOverride
                     ?? variant.Product.DiscountedPrice
                     ?? variant.Product.BasePrice;

        var subTotal       = unitPrice * request.Quantity;
        var deliveryCharge = subTotal >= DeliveryChargeThreshold ? 0m : FlatDeliveryCharge;
        var totalAmount    = subTotal + deliveryCharge;

        var imageUrl       = variant.Product.Images
            .OrderBy(i => i.DisplayOrder)
            .Select(i => i.Url)
            .FirstOrDefault();

        // Get or create a default address for this user
        var address = await db.UserAddresses
            .FirstOrDefaultAsync(a => a.UserId == userId, ct);

        if (address is null)
        {
            address = new TataCliq.Infrastructure.Entities.Auth.UserAddress
            {
                UserId        = userId,
                Label         = "Home",
                RecipientName = "Customer",
                PhoneNumber   = "9999999999",
                AddressLine1  = "123 Main Street",
                AddressLine2  = null,
                City          = "Mumbai",
                State         = "Maharashtra",
                PinCode       = "400001",
                IsDefault     = true
            };
            db.UserAddresses.Add(address);
            await db.SaveChangesAsync(ct);
        }

        var orderItem = new OrderItemEntity
        {
            ProductVariantId = variant.Id,
            ProductName      = variant.Product.Name,
            VariantDetails   = variant.Colour is null ? variant.Size : $"{variant.Size} / {variant.Colour}",
            ImageUrl         = imageUrl,
            Quantity         = request.Quantity,
            UnitPrice        = unitPrice,
            TotalPrice       = unitPrice * request.Quantity
        };

        var order = new OrderEntity
        {
            UserId            = userId,
            OrderNumber       = GenerateOrderNumber(),
            Status            = OrderStatusEnum.Confirmed,
            SubTotal          = subTotal,
            DiscountAmount    = 0m,
            DeliveryCharge    = deliveryCharge,
            TotalAmount       = totalAmount,
            CouponCode        = null,
            ShippingAddressId = address.Id,
            Items             = [orderItem],
            StatusHistory     =
            [
                new OrderStatusHistoryEntity { Status = OrderStatusEnum.Confirmed, Note = "Buy Now — order confirmed" }
            ]
        };

        // Decrement stock with optimistic concurrency lock
        variant.StockQuantity -= request.Quantity;

        db.Orders.Add(order);

        try
        {
            await db.SaveChangesAsync(ct);
        }
        catch (DbUpdateConcurrencyException)
        {
            throw new ConcurrentCheckoutException();
        }

        return MapOrder(order);
    }

    public async Task<IReadOnlyList<OrderDto>> GetOrdersAsync(Guid userId, CancellationToken ct = default)
    {
        var orders = await db.Orders
            .Include(o => o.Items)
            .AsNoTracking()
            .Where(o => o.UserId == userId)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync(ct);

        return orders.Select(MapOrder).ToList();
    }

    public async Task<OrderDto?> GetOrderAsync(Guid userId, Guid orderId, CancellationToken ct = default)
    {
        var order = await db.Orders
            .Include(o => o.Items)
            .AsNoTracking()
            .FirstOrDefaultAsync(o => o.Id == orderId && o.UserId == userId, ct);

        return order is null ? null : MapOrder(order);
    }

    public async Task CancelOrderAsync(Guid userId, Guid orderId, CancellationToken ct = default)
    {
        var order = await db.Orders
            .Include(o => o.StatusHistory)
            .FirstOrDefaultAsync(o => o.Id == orderId && o.UserId == userId, ct)
            ?? throw new KeyNotFoundException("Order not found.");

        // ENH-ORD-001: validate transition through the state machine
        OrderStateMachine.ThrowIfInvalid(order.Status, OrderStatusEnum.Cancelled);

        order.Status = OrderStatusEnum.Cancelled;
        order.StatusHistory.Add(new OrderStatusHistoryEntity
        {
            OrderId = order.Id,
            Status  = OrderStatusEnum.Cancelled,
            Note    = "Cancelled by customer"
        });

        await db.SaveChangesAsync(ct);
    }

    // ── helpers ──────────────────────────────────────────────────────────────

    private static string GenerateOrderNumber() =>
        $"ORD-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString("N")[..6].ToUpperInvariant()}";

    private static OrderDto MapOrder(OrderEntity o) =>
        new(
            o.Id,
            o.OrderNumber,
            o.Status.ToString(),
            o.SubTotal,
            o.DiscountAmount,
            o.DeliveryCharge,
            o.TotalAmount,
            o.CouponCode,
            o.CreatedAt,
            o.Items.Select(i => new OrderItemDto(
                i.Id,
                i.ProductVariant?.ProductId ?? Guid.Empty,
                i.ProductName,
                i.ImageUrl,
                i.VariantDetails,
                i.UnitPrice,
                i.Quantity,
                i.TotalPrice
            )).ToList()
        );
}
