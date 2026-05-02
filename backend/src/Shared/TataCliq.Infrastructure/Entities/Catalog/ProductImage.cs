using TataCliq.SharedKernel.Domain;

namespace TataCliq.Infrastructure.Entities.Catalog;

public class ProductImage : BaseEntity<Guid>
{
    public Guid ProductId { get; set; }
    public string Url { get; set; } = string.Empty;
    public int DisplayOrder { get; set; }
    public bool IsPrimary { get; set; }

    public Product Product { get; set; } = null!;
}
