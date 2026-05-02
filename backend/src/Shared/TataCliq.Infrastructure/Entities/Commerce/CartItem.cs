using TataCliq.Infrastructure.Entities.Catalog;
using TataCliq.SharedKernel.Domain;

namespace TataCliq.Infrastructure.Entities.Commerce;

public class CartItem : BaseEntity<Guid>
{
    public Guid CartId { get; set; }
    public Guid ProductVariantId { get; set; }
    public int Quantity { get; set; }

    public Cart Cart { get; set; } = null!;
    public ProductVariant ProductVariant { get; set; } = null!;
}
