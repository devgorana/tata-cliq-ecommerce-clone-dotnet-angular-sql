using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TataCliq.Catalog.API.DTOs;
using TataCliq.Catalog.API.Services;

namespace TataCliq.Catalog.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class CategoriesController(
    ICatalogService catalogService,
    IValidator<CreateCategoryRequest> createValidator) : ControllerBase
{
    [HttpGet]
    [ProducesResponseType<IReadOnlyList<CategoryDto>>(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetCategories(CancellationToken ct)
    {
        var categories = await catalogService.GetCategoriesAsync(ct);
        return Ok(categories);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType<CategoryDto>(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> CreateCategory([FromBody] CreateCategoryRequest req, CancellationToken ct)
    {
        var validation = await createValidator.ValidateAsync(req, ct);
        if (!validation.IsValid) return BadRequest(validation.Errors);

        var category = await catalogService.CreateCategoryAsync(req, ct);
        return StatusCode(StatusCodes.Status201Created, category);
    }
}
