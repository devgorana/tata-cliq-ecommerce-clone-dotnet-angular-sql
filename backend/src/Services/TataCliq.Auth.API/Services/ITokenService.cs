using TataCliq.Infrastructure.Entities.Auth;

namespace TataCliq.Auth.API.Services;

public interface ITokenService
{
    string GenerateAccessToken(ApplicationUser user, IList<string> roles);
    string GenerateRefreshToken();
    DateTime AccessTokenExpiresAt { get; }
}
