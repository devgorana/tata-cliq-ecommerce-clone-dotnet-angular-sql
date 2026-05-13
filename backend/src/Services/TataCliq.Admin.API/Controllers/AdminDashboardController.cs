using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TataCliq.Admin.API.DTOs;
using TataCliq.Admin.API.Services;

namespace TataCliq.Admin.API.Controllers;

[ApiController]
[Route("api/v1/admin/dashboard")]
[Authorize(Roles = "Admin")]
public sealed class AdminDashboardController(IAdminService adminService) : ControllerBase
{
    [HttpGet("metrics")]
    [ProducesResponseType<DashboardMetricsDto>(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetMetrics(CancellationToken ct)
    {
        var metrics = await adminService.GetDashboardMetricsAsync(ct);
        return Ok(metrics);
    }
}
