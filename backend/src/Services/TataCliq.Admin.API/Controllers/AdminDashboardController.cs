using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TataCliq.Admin.API.DTOs;
using TataCliq.Admin.API.Services;

namespace TataCliq.Admin.API.Controllers;

[ApiController]
[Route("api/v1/admin/dashboard")]
[Authorize(Roles = "Admin,SuperAdmin")]
public sealed class AdminDashboardController(IAdminService adminService) : ControllerBase
{
    [HttpGet("metrics")]
    [ProducesResponseType<DashboardMetricsDto>(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetMetrics(CancellationToken ct)
    {
        var metrics = await adminService.GetDashboardMetricsAsync(ct);
        return Ok(metrics);
    }

    [HttpGet("revenue")]
    [ProducesResponseType<IReadOnlyList<RevenueDataDto>>(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetRevenue([FromQuery] int days = 30, CancellationToken ct = default)
    {
        var data = await adminService.GetRevenueAnalyticsAsync(Math.Clamp(days, 7, 365), ct);
        return Ok(data);
    }
}
