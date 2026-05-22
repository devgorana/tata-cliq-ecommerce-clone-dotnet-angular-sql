using TataCliq.Infrastructure.Entities.Auth;

namespace TataCliq.Auth.API.Services;

public interface ITokenService
{
    string GenerateAccessToken(ApplicationUser user, IList<string> roles, Guid? sellerId = null, bool mfaVerified = false);
    string GenerateRefreshToken();
    DateTime AccessTokenExpiresAt { get; }
}
