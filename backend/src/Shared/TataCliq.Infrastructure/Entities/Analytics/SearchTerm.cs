using TataCliq.SharedKernel.Domain;

namespace TataCliq.Infrastructure.Entities.Analytics;

public class SearchTerm : BaseEntity<Guid>
{
    public string Term { get; set; } = string.Empty;
    public int Count { get; set; } = 1;
    public DateTime LastSearchedAt { get; set; }
}
