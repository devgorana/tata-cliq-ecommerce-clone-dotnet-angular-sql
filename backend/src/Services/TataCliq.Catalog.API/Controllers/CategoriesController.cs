using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TataCliq.Catalog.API.DTOs;
using TataCliq.Catalog.API.Services;

namespace TataCliq.Catalog.API.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
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

    [HttpGet("{id:guid}/attributes")]
    [ProducesResponseType<IReadOnlyList<AttributeDefinitionDto>>(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetCategoryAttributes(Guid id, CancellationToken ct)
    {
        var attrs = await catalogService.GetCategoryAttributesAsync(id, ct);
        return Ok(attrs);
    }

    [HttpPost("{id:guid}/attributes")]
    [Authorize(Roles = "Admin,SuperAdmin")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> MapAttribute(Guid id, [FromBody] MapCategoryAttributeRequest req, CancellationToken ct)
    {
        await catalogService.MapCategoryAttributeAsync(id, req, ct);
        return NoContent();
    }

    [HttpPost]
    [Authorize(Roles = "Admin,SuperAdmin")]
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
