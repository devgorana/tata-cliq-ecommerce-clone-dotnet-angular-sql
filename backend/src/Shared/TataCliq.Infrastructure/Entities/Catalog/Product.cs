using TataCliq.SharedKernel.Domain;

namespace TataCliq.Infrastructure.Entities.Catalog;

public class Product : BaseEntity<Guid>
{
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? Description { get; set; }
    public decimal BasePrice { get; set; }
    public decimal? DiscountedPrice { get; set; }
    public Guid CategoryId { get; set; }
    public Guid BrandId { get; set; }
    public double AverageRating { get; set; }
    public int ReviewCount { get; set; }
    public bool IsActive { get; set; } = true;
    public Guid? SellerId { get; set; }

    /// <summary>
    /// ENH-CAT-010 — Free-form product specifications stored as a JSON string.
    /// Example: {"material":"100% Cotton","fit":"Slim Fit","pattern":"Solid","care":"Machine Wash"}
    /// The database engine extracts individual scalar values into persisted computed columns
    /// (e.g. SpecMaterial) so they can be efficiently indexed and filtered.
    /// </summary>
    public string? SpecificationsJson { get; set; }

    /// <summary>
    /// ENH-CAT-010 — Persisted computed column: JSON_VALUE(SpecificationsJson, '$.material').
    /// Populated automatically by SQL Server; read-only in the application layer.
    /// Enables O(log n) filtered queries: WHERE SpecMaterial = 'Cotton'
    /// without JSON parsing on every row.
    /// </summary>
    public string? SpecMaterial { get; set; }

    public Category Category { get; set; } = null!;
    public Brand Brand { get; set; } = null!;
    public ICollection<ProductVariant> Variants { get; set; } = [];
    public ICollection<ProductImage> Images { get; set; } = [];
    public ICollection<ProductAttribute> Attributes { get; set; } = [];
}
