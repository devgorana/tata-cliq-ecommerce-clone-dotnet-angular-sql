using TataCliq.SharedKernel.Domain;

namespace TataCliq.Infrastructure.Entities.Auth;

public enum OtpPurpose { PasswordReset, EmailVerification, PhoneVerification }

public class OtpCode : BaseEntity<Guid>
{
    public string Email { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public OtpPurpose Purpose { get; set; }
    public DateTime ExpiresAt { get; set; }
    public bool IsUsed { get; set; } = false;
    public int Attempts { get; set; } = 0;
}
