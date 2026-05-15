using TataCliq.SharedKernel.Domain;

namespace TataCliq.Infrastructure.Entities.Catalog;

public class Review : BaseEntity<Guid>
{
    public Guid   ProductId { get; set; }
    public Guid   UserId    { get; set; }
    public int    Rating    { get; set; }   // 1–5
    public string Title     { get; set; } = string.Empty;
    public string Body      { get; set; } = string.Empty;
    public string Author    { get; set; } = string.Empty;

    public Product Product { get; set; } = null!;
}
