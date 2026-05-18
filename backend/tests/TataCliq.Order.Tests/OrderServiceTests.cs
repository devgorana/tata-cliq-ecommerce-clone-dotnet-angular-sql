using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using TataCliq.Infrastructure.Entities.Auth;
using TataCliq.Infrastructure.Entities.Catalog;
using TataCliq.Infrastructure.Persistence;
using TataCliq.Order.API.DTOs;
using TataCliq.Order.API.Services;
using Xunit;
using CartEntity     = TataCliq.Infrastructure.Entities.Commerce.Cart;
using CartItemEntity = TataCliq.Infrastructure.Entities.Commerce.CartItem;
using OrderEntity    = TataCliq.Infrastructure.Entities.Orders.Order;
using OrderItemEntity = TataCliq.Infrastructure.Entities.Orders.OrderItem;
using OrderStatusEnum = TataCliq.Infrastructure.Entities.Orders.OrderStatus;
using OrderStatusHistoryEntity = TataCliq.Infrastructure.Entities.Orders.OrderStatusHistory;

namespace TataCliq.Order.Tests;

public sealed class OrderServiceTests : IDisposable
{
    private readonly AppDbContext _db;
    private readonly OrderService _sut;
    private readonly Guid _userId = Guid.NewGuid();

    public OrderServiceTests()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        _db  = new AppDbContext(options);
        _sut = new OrderService(_db);
    }

    public void Dispose() => _db.Dispose();

    // ── helpers ──────────────────────────────────────────────────────────────

    private async Task<Guid> SeedOrderAsync(OrderStatusEnum status)
    {
        var addressId = Guid.NewGuid();
        var address = new UserAddress
        {
            Id           = addressId,
            UserId       = _userId,
            Label        = "Home",
            RecipientName = "Test User",
            PhoneNumber  = "9999999999",
            AddressLine1 = "123 Main St",
            City         = "Mumbai",
            State        = "MH",
            PinCode      = "400001",
            IsDefault    = true
        };
        _db.UserAddresses.Add(address);

        var variantId = Guid.NewGuid();
        var order = new OrderEntity
        {
            Id                = Guid.NewGuid(),
            UserId            = _userId,
            OrderNumber       = $"ORD-TEST-{Guid.NewGuid():N}"[..20],
            Status            = status,
            SubTotal          = 500m,
            DiscountAmount    = 0m,
            DeliveryCharge    = 49m,
            TotalAmount       = 549m,
            ShippingAddressId = addressId,
            StatusHistory     = [new OrderStatusHistoryEntity { Status = status, Note = "Test" }],
            Items             = [new OrderItemEntity
            {
                Id               = Guid.NewGuid(),
                ProductVariantId = variantId,
                ProductName      = "Test Product",
                Quantity         = 1,
                UnitPrice        = 500m,
                TotalPrice       = 500m
            }]
        };
        _db.Orders.Add(order);
        await _db.SaveChangesAsync();
        return order.Id;
    }

    // ── tests ─────────────────────────────────────────────────────────────────

    [Fact]
    public async Task PlaceOrderAsync_EmptyCart_ThrowsInvalidOperationException()
    {
        var request = new PlaceOrderRequest(
            "123 Main St", null, "Mumbai", "Maharashtra", "400001", "COD", null);

        var act = async () => await _sut.PlaceOrderAsync(_userId, request);

        await act.Should().ThrowAsync<InvalidOperationException>()
            .WithMessage("*Cart is empty*");
    }

    [Fact]
    public async Task GetOrdersAsync_MultipleOrders_ReturnsAllUserOrders()
    {
        await SeedOrderAsync(OrderStatusEnum.Pending);
        await SeedOrderAsync(OrderStatusEnum.Confirmed);

        var orders = await _sut.GetOrdersAsync(_userId);

        orders.Should().HaveCount(2);
    }

    [Fact]
    public async Task GetOrderAsync_ValidId_ReturnsOrder()
    {
        var orderId = await SeedOrderAsync(OrderStatusEnum.Pending);

        var order = await _sut.GetOrderAsync(_userId, orderId);

        order.Should().NotBeNull();
        order!.Status.Should().Be("Pending");
    }

    [Fact]
    public async Task GetOrderAsync_OtherUserOrder_ReturnsNull()
    {
        var orderId = await SeedOrderAsync(OrderStatusEnum.Pending);
        var otherUserId = Guid.NewGuid();

        var order = await _sut.GetOrderAsync(otherUserId, orderId);

        order.Should().BeNull();
    }

    [Fact]
    public async Task CancelOrderAsync_PendingOrder_SetsStatusToCancelled()
    {
        var orderId = await SeedOrderAsync(OrderStatusEnum.Pending);

        await _sut.CancelOrderAsync(_userId, orderId);

        var order = await _db.Orders.FindAsync(orderId);
        order!.Status.Should().Be(OrderStatusEnum.Cancelled);
    }

    [Fact]
    public async Task CancelOrderAsync_ConfirmedOrder_SetsStatusToCancelled()
    {
        var orderId = await SeedOrderAsync(OrderStatusEnum.Confirmed);

        await _sut.CancelOrderAsync(_userId, orderId);

        var order = await _db.Orders.FindAsync(orderId);
        order!.Status.Should().Be(OrderStatusEnum.Cancelled);
    }

    [Fact]
    public async Task CancelOrderAsync_DeliveredOrder_ThrowsInvalidOperationException()
    {
        var orderId = await SeedOrderAsync(OrderStatusEnum.Delivered);

        var act = async () => await _sut.CancelOrderAsync(_userId, orderId);

        await act.Should().ThrowAsync<InvalidOperationException>()
            .WithMessage("*Order cannot be cancelled*");
    }

    [Fact]
    public async Task CancelOrderAsync_ShippedOrder_ThrowsInvalidOperationException()
    {
        var orderId = await SeedOrderAsync(OrderStatusEnum.Shipped);

        var act = async () => await _sut.CancelOrderAsync(_userId, orderId);

        await act.Should().ThrowAsync<InvalidOperationException>()
            .WithMessage("*Order cannot be cancelled*");
    }

    [Fact]
    public async Task CancelOrderAsync_NonExistentOrder_ThrowsKeyNotFoundException()
    {
        var act = async () => await _sut.CancelOrderAsync(_userId, Guid.NewGuid());

        await act.Should().ThrowAsync<KeyNotFoundException>()
            .WithMessage("*Order not found*");
    }
}
