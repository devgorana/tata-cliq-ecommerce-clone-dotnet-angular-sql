using TataCliq.SharedKernel.Domain;

namespace TataCliq.Infrastructure.Entities.Analytics;

public class ProductView : BaseEntity<Guid>
{
    public Guid ProductId { get; set; }
    public DateTime ViewedAt { get; set; }
    public Guid? UserId { get; set; }
    public string? SessionId { get; set; }
    public string? Source { get; set; }
}
