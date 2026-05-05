using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TataCliq.Admin.API.DTOs;
using TataCliq.Admin.API.Services;

namespace TataCliq.Admin.API.Controllers;

[ApiController]
[Route("api/admin/users")]
[Authorize(Roles = "Admin")]
public sealed class AdminUsersController(IAdminService adminService) : ControllerBase
{
    [HttpGet]
    [ProducesResponseType<IReadOnlyList<AdminUserDto>>(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetUsers(CancellationToken ct)
    {
        var users = await adminService.GetAdminUsersAsync(ct);
        return Ok(users);
    }

    [HttpPost("create-seller")]
    [ProducesResponseType<CreateSellerResponse>(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<IActionResult> CreateSeller([FromBody] CreateSellerRequest req, CancellationToken ct)
    {
        var (success, error, result) = await adminService.CreateSellerAsync(req, ct);

        if (!success)
        {
            if (error.Contains("already exists"))
                return Conflict(new { message = error });
            return BadRequest(new { message = error });
        }

        return StatusCode(StatusCodes.Status201Created, result);
    }
}
