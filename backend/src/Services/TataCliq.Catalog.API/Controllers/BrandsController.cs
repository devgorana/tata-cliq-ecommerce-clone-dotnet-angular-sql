using Microsoft.AspNetCore.Mvc;
using TataCliq.Catalog.API.DTOs;
using TataCliq.Catalog.API.Services;

namespace TataCliq.Catalog.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class BrandsController(ICatalogService catalogService) : ControllerBase
{
    [HttpGet]
    [ProducesResponseType<IReadOnlyList<BrandDto>>(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetBrands(CancellationToken ct)
    {
        var brands = await catalogService.GetBrandsAsync(ct);
        return Ok(brands);
    }
}
