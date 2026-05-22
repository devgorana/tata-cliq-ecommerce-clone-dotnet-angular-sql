using Microsoft.AspNetCore.Mvc;
using TataCliq.Auth.API.DTOs;
using TataCliq.Auth.API.Services;

namespace TataCliq.Auth.API.Controllers;

/// <summary>
/// ENH-AUTH-003 — Social account merge endpoints.
/// POST /api/v1/auth/social/callback  — handle social login; return MERGE_REQUIRED or NEW_ACCOUNT.
/// POST /api/v1/auth/merge/confirm    — complete merge after password challenge.
/// </summary>
[ApiController]
[Route("api/v1/auth")]
public sealed class SocialAuthController(IAccountMergeService mergeService) : ControllerBase
{
    [HttpPost("social/callback")]
    public async Task<IActionResult> SocialCallback(
        [FromBody] SocialCallbackRequest request,
        CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(request.Provider))
            return BadRequest(new { message = "Provider is required." });
        if (string.IsNullOrWhiteSpace(request.Email))
            return BadRequest(new { message = "Email is required." });
        if (string.IsNullOrWhiteSpace(request.ProviderUserId))
            return BadRequest(new { message = "ProviderUserId is required." });

        try
        {
            var response = await mergeService.HandleSocialCallbackAsync(request, ct);
            return Ok(response);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }

    [HttpPost("merge/confirm")]
    public async Task<IActionResult> ConfirmMerge(
        [FromBody] MergeConfirmRequest request,
        CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(request.MergeToken))
            return BadRequest(new { message = "MergeToken is required." });
        if (string.IsNullOrWhiteSpace(request.Password))
            return BadRequest(new { message = "Password is required." });

        try
        {
            var auth = await mergeService.ConfirmMergeAsync(request, ct);
            return Ok(auth);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}
