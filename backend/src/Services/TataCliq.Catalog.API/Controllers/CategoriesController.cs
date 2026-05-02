using Microsoft.AspNetCore.Mvc;
using TataCliq.Catalog.API.DTOs;
using TataCliq.Catalog.API.Services;

namespace TataCliq.Catalog.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class CategoriesController(ICatalogService catalogService) : ControllerBase
{
    [HttpGet]
    [ProducesResponseType<IReadOnlyList<CategoryDto>>(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetCategories(CancellationToken ct)
    {
        var categories = await catalogService.GetCategoriesAsync(ct);
        return Ok(categories);
    }
}
