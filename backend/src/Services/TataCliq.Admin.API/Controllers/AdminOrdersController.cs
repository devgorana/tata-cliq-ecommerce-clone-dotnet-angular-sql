using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TataCliq.Admin.API.DTOs;
using TataCliq.Admin.API.Services;

namespace TataCliq.Admin.API.Controllers;

[ApiController]
[Route("api/admin/orders")]
[Authorize(Roles = "Admin")]
public sealed class AdminOrdersController(IAdminService adminService) : ControllerBase
{
    [HttpGet]
    [ProducesResponseType<IReadOnlyList<AdminOrderDto>>(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetOrders(CancellationToken ct)
    {
        var orders = await adminService.GetAdminOrdersAsync(ct);
        return Ok(orders);
    }
}
