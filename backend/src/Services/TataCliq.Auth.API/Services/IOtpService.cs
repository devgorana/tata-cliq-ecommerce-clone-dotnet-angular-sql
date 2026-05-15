using TataCliq.SharedKernel.Domain;

namespace TataCliq.Auth.API.Services;

public interface IOtpService
{
    Task<Result> SendForgotPasswordOtpAsync(string email);
    Task<Result> VerifyOtpAsync(string email, string code, string purpose);
    Task<Result> ResetPasswordAsync(string email, string code, string newPassword);
}
