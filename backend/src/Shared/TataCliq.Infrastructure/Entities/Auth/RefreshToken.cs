using TataCliq.SharedKernel.Domain;

namespace TataCliq.Infrastructure.Entities.Auth;

public class RefreshToken : BaseEntity<Guid>
{
    public Guid UserId { get; set; }
    public string Token { get; set; } = string.Empty;
    public DateTime ExpiresAt { get; set; }
    public bool IsRevoked { get; set; }
    public string? ReplacedByToken { get; set; }

    public ApplicationUser User { get; set; } = null!;
}
