using System.ComponentModel.DataAnnotations;

namespace TataCliq.Catalog.API.DTOs;

public record ProductQueryDto
{
    public Guid?   CategoryId { get; init; }
    public Guid?   BrandId    { get; init; }
    public decimal? MinPrice  { get; init; }
    public decimal? MaxPrice  { get; init; }
    public string? Sort       { get; init; }

    [Range(1, int.MaxValue)]
    public int Page     { get; init; } = 1;

    [Range(1, 100)]
    public int PageSize { get; init; } = 24;
}
