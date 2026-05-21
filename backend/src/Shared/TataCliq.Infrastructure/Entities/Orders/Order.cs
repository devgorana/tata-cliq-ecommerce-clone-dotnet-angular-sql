using System.ComponentModel.DataAnnotations;
using TataCliq.Infrastructure.Entities.Auth;
using TataCliq.SharedKernel.Domain;

namespace TataCliq.Infrastructure.Entities.Orders;

public enum OrderStatus
{
    Pending,
    Confirmed,
    Processing,
    Shipped,
    OutForDelivery,
    Delivered,
    Cancelled,
    Returned
}

public class Order : BaseEntity<Guid>
{
    public Guid UserId { get; set; }
    public string OrderNumber { get; set; } = string.Empty;
    public OrderStatus Status { get; set; } = OrderStatus.Pending;
    public decimal SubTotal { get; set; }
    public decimal DiscountAmount { get; set; }
    public decimal DeliveryCharge { get; set; }
    public decimal TotalAmount { get; set; }
    public string? CouponCode { get; set; }
    public Guid ShippingAddressId { get; set; }

    /// <summary>
    /// SQL Server rowversion — optimistic concurrency token for concurrent status updates (ENH-ORD-002).
    /// </summary>
    [Timestamp]
    public byte[] RowVersion { get; set; } = [];

    public ApplicationUser User { get; set; } = null!;
    public ICollection<OrderItem> Items { get; set; } = [];
    public ICollection<OrderStatusHistory> StatusHistory { get; set; } = [];
}
