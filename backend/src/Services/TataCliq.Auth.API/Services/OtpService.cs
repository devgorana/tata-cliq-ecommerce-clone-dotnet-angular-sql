using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using TataCliq.Infrastructure.Entities.Auth;
using TataCliq.Infrastructure.Persistence;
using TataCliq.SharedKernel.Domain;

namespace TataCliq.Auth.API.Services;

public class OtpService(
    AppDbContext db,
    UserManager<ApplicationUser> userManager,
    ILogger<OtpService> logger) : IOtpService
{
    public async Task<Result> SendForgotPasswordOtpAsync(string email)
    {
        var user = await userManager.FindByEmailAsync(email);
        if (user is null)
            return Result.Success(); // Don't reveal if email exists

        // Invalidate any existing OTPs for this email/purpose
        var existing = await db.OtpCodes
            .IgnoreQueryFilters()
            .Where(o => o.Email == email && o.Purpose == OtpPurpose.PasswordReset && !o.IsUsed)
            .ToListAsync();
        existing.ForEach(o => o.IsUsed = true);

        var code = GenerateCode();
        db.OtpCodes.Add(new OtpCode
        {
            Id        = Guid.NewGuid(),
            Email     = email,
            Code      = code,
            Purpose   = OtpPurpose.PasswordReset,
            ExpiresAt = DateTime.UtcNow.AddMinutes(15),
        });

        await db.SaveChangesAsync();

        // In dev: log to console (in prod: send via MailKit/SMS)
        logger.LogInformation("Password reset OTP for {Email}: {Code} (expires 15 min)", email, code);

        return Result.Success();
    }

    public async Task<Result> VerifyOtpAsync(string email, string code, string purpose)
    {
        if (!Enum.TryParse<OtpPurpose>(purpose, true, out var purposeEnum))
            return Result.Failure(new Error("OTP.InvalidPurpose", "Invalid OTP purpose."));

        var otp = await db.OtpCodes
            .IgnoreQueryFilters()
            .FirstOrDefaultAsync(o =>
                o.Email == email &&
                o.Code  == code &&
                o.Purpose == purposeEnum &&
                !o.IsUsed);

        if (otp is null)
            return Result.Failure(new Error("OTP.Invalid", "Invalid or expired OTP."));

        if (otp.ExpiresAt < DateTime.UtcNow)
        {
            otp.IsUsed = true;
            await db.SaveChangesAsync();
            return Result.Failure(new Error("OTP.Expired", "OTP has expired."));
        }

        return Result.Success();
    }

    public async Task<Result> ResetPasswordAsync(string email, string code, string newPassword)
    {
        var verifyResult = await VerifyOtpAsync(email, code, nameof(OtpPurpose.PasswordReset));
        if (verifyResult.IsFailure) return verifyResult;

        var user = await userManager.FindByEmailAsync(email);
        if (user is null)
            return Result.Failure(new Error("User.NotFound", "User not found."));

        var token = await userManager.GeneratePasswordResetTokenAsync(user);
        var result = await userManager.ResetPasswordAsync(user, token, newPassword);
        if (!result.Succeeded)
        {
            var msg = string.Join("; ", result.Errors.Select(e => e.Description));
            return Result.Failure(new Error("Identity.Error", msg));
        }

        // Mark OTP as used
        var otp = await db.OtpCodes
            .IgnoreQueryFilters()
            .FirstOrDefaultAsync(o =>
                o.Email == email &&
                o.Code  == code &&
                o.Purpose == OtpPurpose.PasswordReset &&
                !o.IsUsed);

        if (otp is not null)
        {
            otp.IsUsed = true;
            await db.SaveChangesAsync();
        }

        return Result.Success();
    }

    private static string GenerateCode() =>
        Random.Shared.Next(100000, 999999).ToString();
}
