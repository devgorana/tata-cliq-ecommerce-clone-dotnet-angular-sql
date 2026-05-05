using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TataCliq.Admin.API.DTOs;
using TataCliq.Admin.API.Services;

namespace TataCliq.Admin.API.Controllers;

[ApiController]
[Route("api/admin/products")]
[Authorize(Roles = "Admin")]
public sealed class AdminProductsController(IAdminService adminService) : ControllerBase
{
    [HttpGet]
    [ProducesResponseType<IReadOnlyList<AdminProductDto>>(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetProducts(CancellationToken ct)
    {
        var products = await adminService.GetAdminProductsAsync(ct);
        return Ok(products);
    }
}
