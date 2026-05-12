using Microsoft.AspNetCore.Mvc;
using TataCliq.Catalog.API.DTOs;
using TataCliq.Catalog.API.Services;
using TataCliq.SharedKernel.DTOs;

namespace TataCliq.Catalog.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class ProductsController(ICatalogService catalogService) : ControllerBase
{
    [HttpGet]
    [ProducesResponseType<PagedResult<ProductDto>>(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetProducts([FromQuery] ProductQueryDto query, CancellationToken ct)
    {
        var result = await catalogService.GetProductsAsync(query, ct);
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    [ProducesResponseType<ProductDto>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetProduct(Guid id, CancellationToken ct)
    {
        var product = await catalogService.GetProductAsync(id, ct);
        return product is null ? NotFound() : Ok(product);
    }
}
