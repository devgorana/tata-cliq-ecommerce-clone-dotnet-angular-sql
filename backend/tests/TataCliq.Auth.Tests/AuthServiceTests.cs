using FluentAssertions;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging.Abstractions;
using Moq;
using TataCliq.Auth.API.DTOs;
using TataCliq.Auth.API.Services;
using TataCliq.Infrastructure.Entities.Auth;
using TataCliq.Infrastructure.Persistence;
using Xunit;

namespace TataCliq.Auth.Tests;

public sealed class AuthServiceTests : IDisposable
{
    private readonly Mock<UserManager<ApplicationUser>> _userManagerMock;
    private readonly Mock<ITokenService> _tokenServiceMock;
    private readonly AppDbContext _db;
    private readonly AuthService _sut;

    public AuthServiceTests()
    {
        var store = new Mock<IUserStore<ApplicationUser>>();
        _userManagerMock = new Mock<UserManager<ApplicationUser>>(
            store.Object, null!, null!, null!, null!, null!, null!, null!, null!);

        _tokenServiceMock = new Mock<ITokenService>();
        _tokenServiceMock.Setup(t => t.GenerateAccessToken(
                It.IsAny<ApplicationUser>(), It.IsAny<IList<string>>()))
            .Returns("fake-access-token");
        _tokenServiceMock.Setup(t => t.GenerateRefreshToken())
            .Returns("fake-refresh-token");
        _tokenServiceMock.Setup(t => t.AccessTokenExpiresAt)
            .Returns(DateTime.UtcNow.AddHours(1));

        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        _db = new AppDbContext(options);

        _sut = new AuthService(
            _userManagerMock.Object,
            _tokenServiceMock.Object,
            _db,
            NullLogger<AuthService>.Instance);
    }

    public void Dispose() => _db.Dispose();

    [Fact]
    public async Task LoginAsync_ValidCredentials_ReturnsToken()
    {
        var user = new ApplicationUser
        {
            Id = Guid.NewGuid(), Email = "user@test.com",
            FirstName = "Test", LastName = "User"
        };
        var dto = new LoginRequestDto("user@test.com", "Password@123");

        _userManagerMock.Setup(m => m.FindByEmailAsync(dto.Email)).ReturnsAsync(user);
        _userManagerMock.Setup(m => m.CheckPasswordAsync(user, dto.Password)).ReturnsAsync(true);
        _userManagerMock.Setup(m => m.GetRolesAsync(user))
            .ReturnsAsync(new List<string> { "Customer" });

        var result = await _sut.LoginAsync(dto);

        result.IsSuccess.Should().BeTrue();
        result.Value.AccessToken.Should().Be("fake-access-token");
        result.Value.User.Email.Should().Be("user@test.com");
    }

    [Fact]
    public async Task LoginAsync_WrongPassword_ReturnsFailureResult()
    {
        var user = new ApplicationUser { Id = Guid.NewGuid(), Email = "user@test.com" };
        var dto = new LoginRequestDto("user@test.com", "wrongpassword");

        _userManagerMock.Setup(m => m.FindByEmailAsync(dto.Email)).ReturnsAsync(user);
        _userManagerMock.Setup(m => m.CheckPasswordAsync(user, dto.Password)).ReturnsAsync(false);

        var result = await _sut.LoginAsync(dto);

        result.IsFailure.Should().BeTrue();
        result.Error.Code.Should().Be("Auth.InvalidCredentials");
    }

    [Fact]
    public async Task LoginAsync_UserNotFound_ReturnsFailureResult()
    {
        var dto = new LoginRequestDto("nobody@test.com", "Password@123");
        _userManagerMock.Setup(m => m.FindByEmailAsync(dto.Email))
            .ReturnsAsync((ApplicationUser?)null);

        var result = await _sut.LoginAsync(dto);

        result.IsFailure.Should().BeTrue();
        result.Error.Code.Should().Be("Auth.InvalidCredentials");
    }

    [Fact]
    public async Task RegisterAsync_NewUser_CreatesUserAndReturnsToken()
    {
        var dto = new RegisterRequestDto("Jane", "Doe", "jane@test.com", "Password@123", "Password@123");

        _userManagerMock.Setup(m => m.FindByEmailAsync(dto.Email))
            .ReturnsAsync((ApplicationUser?)null);
        _userManagerMock.Setup(m => m.CreateAsync(It.IsAny<ApplicationUser>(), dto.Password))
            .ReturnsAsync(IdentityResult.Success);
        _userManagerMock.Setup(m => m.AddToRoleAsync(It.IsAny<ApplicationUser>(), "Customer"))
            .ReturnsAsync(IdentityResult.Success);
        _userManagerMock.Setup(m => m.GetRolesAsync(It.IsAny<ApplicationUser>()))
            .ReturnsAsync(new List<string> { "Customer" });

        var result = await _sut.RegisterAsync(dto);

        result.IsSuccess.Should().BeTrue();
        result.Value.AccessToken.Should().Be("fake-access-token");
        result.Value.User.Email.Should().Be("jane@test.com");
    }

    [Fact]
    public async Task RegisterAsync_DuplicateEmail_ReturnsFailureResult()
    {
        var existing = new ApplicationUser { Id = Guid.NewGuid(), Email = "taken@test.com" };
        var dto = new RegisterRequestDto("John", "Doe", "taken@test.com", "Password@123", "Password@123");

        _userManagerMock.Setup(m => m.FindByEmailAsync(dto.Email)).ReturnsAsync(existing);

        var result = await _sut.RegisterAsync(dto);

        result.IsFailure.Should().BeTrue();
        result.Error.Code.Should().Be("User.Conflict");
    }
}
