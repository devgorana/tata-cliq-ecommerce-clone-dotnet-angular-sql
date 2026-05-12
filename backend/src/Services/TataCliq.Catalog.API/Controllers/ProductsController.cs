using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TataCliq.Catalog.API.DTOs;
using TataCliq.Catalog.API.Services;
using TataCliq.SharedKernel.DTOs;

namespace TataCliq.Catalog.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class ProductsController(
    ICatalogService catalogService,
    IValidator<CreateProductRequest> createValidator,
    IValidator<UpdateProductRequest> updateValidator) : ControllerBase
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

    [HttpPost]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType<ProductDto>(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> CreateProduct([FromBody] CreateProductRequest req, CancellationToken ct)
    {
        var validation = await createValidator.ValidateAsync(req, ct);
        if (!validation.IsValid) return BadRequest(validation.Errors);

        var product = await catalogService.CreateProductAsync(req, ct);
        return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, product);
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType<ProductDto>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateProduct(Guid id, [FromBody] UpdateProductRequest req, CancellationToken ct)
    {
        var validation = await updateValidator.ValidateAsync(req, ct);
        if (!validation.IsValid) return BadRequest(validation.Errors);

        var product = await catalogService.UpdateProductAsync(id, req, ct);
        return product is null ? NotFound() : Ok(product);
    }
}
