using TataCliq.Infrastructure.Entities.Admin;

namespace TataCliq.Admin.API.DTOs;

public record BannerDto(
    Guid            Id,
    string          Title,
    string          ImageUrl,
    string?         LinkUrl,
    BannerPlacement Placement,
    int             DisplayOrder,
    bool            IsActive,
    DateTime?       StartsAt,
    DateTime?       EndsAt);

public record CreateBannerRequest(
    string          Title,
    string          ImageUrl,
    string?         LinkUrl,
    BannerPlacement Placement,
    int             DisplayOrder,
    bool            IsActive,
    DateTime?       StartsAt,
    DateTime?       EndsAt);

public record UpdateBannerRequest(
    string          Title,
    string          ImageUrl,
    string?         LinkUrl,
    BannerPlacement Placement,
    int             DisplayOrder,
    bool            IsActive,
    DateTime?       StartsAt,
    DateTime?       EndsAt);
