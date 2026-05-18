using Microsoft.AspNetCore.Mvc;
using TataCliq.Auth.API.DTOs;
using TataCliq.Auth.API.Services;

namespace TataCliq.Auth.API.Controllers;

[ApiController]
[Route("api/v1/auth")]
public class OtpController(IOtpService otpService) : ControllerBase
{
    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
    {
        await otpService.SendForgotPasswordOtpAsync(request.Email);
        return Ok(new { Message = "If that email exists, a reset code has been sent." });
    }

    [HttpPost("verify-otp")]
    public async Task<IActionResult> VerifyOtp([FromBody] VerifyOtpRequest request)
    {
        var result = await otpService.VerifyOtpAsync(request.Email, request.Code, request.Purpose);
        if (result.IsFailure)
            return BadRequest(new { result.Error.Code, result.Error.Message });
        return Ok(new { Message = "OTP verified successfully." });
    }

    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
    {
        var result = await otpService.ResetPasswordAsync(request.Email, request.Code, request.NewPassword);
        if (result.IsFailure)
            return BadRequest(new { result.Error.Code, result.Error.Message });
        return Ok(new { Message = "Password reset successfully." });
    }
}
