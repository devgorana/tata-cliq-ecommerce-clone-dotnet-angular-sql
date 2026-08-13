using Microsoft.IdentityModel.Tokens;

namespace TataCliq.SharedKernel.Jwt;

public interface IJwksKeyProvider
{
    IEnumerable<SecurityKey> GetSigningKeys();
}
