using System.ComponentModel.DataAnnotations;

namespace TataCliq.Catalog.API.DTOs;

public record ProductQueryDto
{
    public Guid?   CategoryId { get; init; }
    public Guid?   BrandId    { get; init; }
    public string? Search     { get; init; }
    public decimal? MinPrice  { get; init; }
    public decimal? MaxPrice  { get; init; }
    public string? Sort       { get; init; }

    /// <summary>Minimum discount percentage (1–99). Only products with DiscountedPrice set and
    /// discount &gt;= this value are returned.</summary>
    [Range(1, 99)]
    public int? MinDiscount { get; init; }

    [Range(1, int.MaxValue)]
    public int Page     { get; init; } = 1;

    [Range(1, 100)]
    public int PageSize { get; init; } = 24;
}
