using TataCliq.Auth.API.DTOs;
using TataCliq.SharedKernel.Domain;

namespace TataCliq.Auth.API.Services;

public interface IAuthService
{
    Task<Result<AuthResponseDto>> RegisterAsync(RegisterRequestDto dto, CancellationToken ct = default);
    Task<Result<AuthResponseDto>> LoginAsync(LoginRequestDto dto, CancellationToken ct = default);
    Task<Result<AuthResponseDto>> RefreshAsync(string refreshToken, CancellationToken ct = default);
    Task<Result> LogoutAsync(string refreshToken, CancellationToken ct = default);
}
