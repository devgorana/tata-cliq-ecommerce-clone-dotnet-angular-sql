using TataCliq.SharedKernel.Domain;

namespace TataCliq.Infrastructure.Entities.Catalog;

public class ProductVariant : BaseEntity<Guid>
{
    public Guid ProductId { get; set; }
    public string Size { get; set; } = string.Empty;
    public string? Colour { get; set; }
    public string Sku { get; set; } = string.Empty;
    public int StockQuantity { get; set; }
    public decimal? PriceOverride { get; set; }

    public Product Product { get; set; } = null!;
}
