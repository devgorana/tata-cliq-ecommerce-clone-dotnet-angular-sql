using TataCliq.SharedKernel.Domain;

namespace TataCliq.Infrastructure.Entities.Catalog;

public class CategoryAttribute : BaseEntity<Guid>
{
    public Guid CategoryId { get; set; }
    public Guid AttributeDefinitionId { get; set; }
    public int DisplayOrder { get; set; } = 0;

    public Category Category { get; set; } = null!;
    public AttributeDefinition AttributeDefinition { get; set; } = null!;
}
