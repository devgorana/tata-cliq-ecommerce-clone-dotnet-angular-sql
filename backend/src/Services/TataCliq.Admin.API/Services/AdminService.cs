using AutoMapper;
using Microsoft.EntityFrameworkCore;
using TataCliq.Admin.API.DTOs;
using TataCliq.Infrastructure.Entities.Admin;
using TataCliq.Infrastructure.Persistence;

namespace TataCliq.Admin.API.Services;

public interface IAdminService
{
    // Banners
    Task<IReadOnlyList<BannerDto>> GetBannersAsync(CancellationToken ct = default);
    Task<BannerDto?>              GetBannerAsync(Guid id, CancellationToken ct = default);
    Task<BannerDto>               CreateBannerAsync(CreateBannerRequest req, CancellationToken ct = default);
    Task<BannerDto?>              UpdateBannerAsync(Guid id, UpdateBannerRequest req, CancellationToken ct = default);
    Task<bool>                    DeleteBannerAsync(Guid id, CancellationToken ct = default);

    // Coupons
    Task<IReadOnlyList<CouponDto>> GetCouponsAsync(CancellationToken ct = default);
    Task<CouponDto?>               GetCouponAsync(Guid id, CancellationToken ct = default);
    Task<CouponDto>                CreateCouponAsync(CreateCouponRequest req, CancellationToken ct = default);
    Task<CouponDto?>               UpdateCouponAsync(Guid id, UpdateCouponRequest req, CancellationToken ct = default);
    Task<bool>                     DeleteCouponAsync(Guid id, CancellationToken ct = default);
}

public sealed class AdminService(AppDbContext db, IMapper mapper) : IAdminService
{
    // ── Banners ────────────────────────────────────────────────────────────

    public async Task<IReadOnlyList<BannerDto>> GetBannersAsync(CancellationToken ct = default)
    {
        var banners = await db.Banners.AsNoTracking()
            .OrderBy(b => b.DisplayOrder)
            .ToListAsync(ct);
        return banners.Select(b => mapper.Map<BannerDto>(b)).ToList();
    }

    public async Task<BannerDto?> GetBannerAsync(Guid id, CancellationToken ct = default)
    {
        var banner = await db.Banners.AsNoTracking()
            .FirstOrDefaultAsync(b => b.Id == id, ct);
        return banner is null ? null : mapper.Map<BannerDto>(banner);
    }

    public async Task<BannerDto> CreateBannerAsync(CreateBannerRequest req, CancellationToken ct = default)
    {
        var banner = mapper.Map<Banner>(req);
        banner.Id = Guid.NewGuid();
        db.Banners.Add(banner);
        await db.SaveChangesAsync(ct);
        return mapper.Map<BannerDto>(banner);
    }

    public async Task<BannerDto?> UpdateBannerAsync(Guid id, UpdateBannerRequest req, CancellationToken ct = default)
    {
        var banner = await db.Banners.FirstOrDefaultAsync(b => b.Id == id, ct);
        if (banner is null) return null;
        mapper.Map(req, banner);
        await db.SaveChangesAsync(ct);
        return mapper.Map<BannerDto>(banner);
    }

    public async Task<bool> DeleteBannerAsync(Guid id, CancellationToken ct = default)
    {
        var banner = await db.Banners.FirstOrDefaultAsync(b => b.Id == id, ct);
        if (banner is null) return false;
        banner.IsDeleted = true;
        await db.SaveChangesAsync(ct);
        return true;
    }

    // ── Coupons ────────────────────────────────────────────────────────────

    public async Task<IReadOnlyList<CouponDto>> GetCouponsAsync(CancellationToken ct = default)
    {
        var coupons = await db.Coupons.AsNoTracking()
            .OrderBy(c => c.Code)
            .ToListAsync(ct);
        return coupons.Select(c => mapper.Map<CouponDto>(c)).ToList();
    }

    public async Task<CouponDto?> GetCouponAsync(Guid id, CancellationToken ct = default)
    {
        var coupon = await db.Coupons.AsNoTracking()
            .FirstOrDefaultAsync(c => c.Id == id, ct);
        return coupon is null ? null : mapper.Map<CouponDto>(coupon);
    }

    public async Task<CouponDto> CreateCouponAsync(CreateCouponRequest req, CancellationToken ct = default)
    {
        var coupon = mapper.Map<Coupon>(req);
        coupon.Id = Guid.NewGuid();
        db.Coupons.Add(coupon);
        await db.SaveChangesAsync(ct);
        return mapper.Map<CouponDto>(coupon);
    }

    public async Task<CouponDto?> UpdateCouponAsync(Guid id, UpdateCouponRequest req, CancellationToken ct = default)
    {
        var coupon = await db.Coupons.FirstOrDefaultAsync(c => c.Id == id, ct);
        if (coupon is null) return null;
        mapper.Map(req, coupon);
        await db.SaveChangesAsync(ct);
        return mapper.Map<CouponDto>(coupon);
    }

    public async Task<bool> DeleteCouponAsync(Guid id, CancellationToken ct = default)
    {
        var coupon = await db.Coupons.FirstOrDefaultAsync(c => c.Id == id, ct);
        if (coupon is null) return false;
        coupon.IsDeleted = true;
        await db.SaveChangesAsync(ct);
        return true;
    }
}
