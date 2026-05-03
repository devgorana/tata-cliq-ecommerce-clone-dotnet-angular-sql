using TataCliq.Infrastructure.Entities.Admin;

namespace TataCliq.Admin.API.DTOs;

public record CouponDto(
    Guid         Id,
    string       Code,
    string       Description,
    DiscountType DiscountType,
    decimal      DiscountValue,
    decimal?     MinOrderAmount,
    decimal?     MaxDiscountCap,
    int?         UsageLimitPerUser,
    int?         TotalUsageLimit,
    int          UsedCount,
    bool         IsActive,
    DateTime?    StartsAt,
    DateTime?    ExpiresAt);

public record CreateCouponRequest(
    string       Code,
    string       Description,
    DiscountType DiscountType,
    decimal      DiscountValue,
    decimal?     MinOrderAmount,
    decimal?     MaxDiscountCap,
    int?         UsageLimitPerUser,
    int?         TotalUsageLimit,
    bool         IsActive,
    DateTime?    StartsAt,
    DateTime?    ExpiresAt);

public record UpdateCouponRequest(
    string       Description,
    DiscountType DiscountType,
    decimal      DiscountValue,
    decimal?     MinOrderAmount,
    decimal?     MaxDiscountCap,
    int?         UsageLimitPerUser,
    int?         TotalUsageLimit,
    bool         IsActive,
    DateTime?    StartsAt,
    DateTime?    ExpiresAt);
