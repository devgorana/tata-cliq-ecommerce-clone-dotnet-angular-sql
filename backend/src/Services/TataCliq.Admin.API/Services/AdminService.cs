using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using TataCliq.Admin.API.DTOs;
using TataCliq.Infrastructure.Entities.Admin;
using TataCliq.Infrastructure.Entities.Auth;
using TataCliq.Infrastructure.Entities.Orders;
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

    // Admin dashboard
    Task<IReadOnlyList<AdminOrderDto>>   GetAdminOrdersAsync(CancellationToken ct = default);
    Task<IReadOnlyList<AdminUserDto>>    GetAdminUsersAsync(CancellationToken ct = default);
    Task<IReadOnlyList<AdminProductDto>> GetAdminProductsAsync(CancellationToken ct = default);
    Task<(bool Success, string Error, CreateSellerResponse? Result)> CreateSellerAsync(
        CreateSellerRequest req, CancellationToken ct = default);

    Task<AdminOrderDto?> UpdateOrderStatusAsync(Guid orderId, string status, CancellationToken ct = default);
    Task<AdminProductDto?> UpdateProductStatusAsync(Guid productId, bool isActive, CancellationToken ct = default);
}

public sealed class AdminService(
    AppDbContext db,
    IMapper mapper,
    UserManager<ApplicationUser> userManager) : IAdminService
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

    // ── Admin Dashboard ────────────────────────────────────────────────────

    public async Task<IReadOnlyList<AdminOrderDto>> GetAdminOrdersAsync(CancellationToken ct = default)
    {
        var orders = await db.Orders
            .AsNoTracking()
            .Include(o => o.User)
            .Include(o => o.Items)
            .OrderByDescending(o => o.CreatedAt)
            .Take(200)
            .ToListAsync(ct);

        return orders.Select(o => new AdminOrderDto(
            o.Id,
            o.OrderNumber,
            o.User.Email ?? string.Empty,
            o.TotalAmount,
            o.Status.ToString(),
            o.CreatedAt,
            o.Items.Count)).ToList();
    }

    public async Task<IReadOnlyList<AdminUserDto>> GetAdminUsersAsync(CancellationToken ct = default)
    {
        var users = await db.Users
            .AsNoTracking()
            .Where(u => !u.IsDeleted)
            .OrderByDescending(u => u.CreatedAt)
            .Take(500)
            .ToListAsync(ct);

        var result = new List<AdminUserDto>(users.Count);
        foreach (var user in users)
        {
            var roles = await userManager.GetRolesAsync(user);
            result.Add(new AdminUserDto(
                user.Id,
                user.Email ?? string.Empty,
                user.FirstName,
                user.LastName,
                roles.ToList(),
                user.EmailConfirmed,
                user.CreatedAt));
        }
        return result;
    }

    public async Task<IReadOnlyList<AdminProductDto>> GetAdminProductsAsync(CancellationToken ct = default)
    {
        var products = await db.Products
            .AsNoTracking()
            .Include(p => p.Brand)
            .Include(p => p.Category)
            .Include(p => p.Variants)
            .OrderByDescending(p => p.CreatedAt)
            .Take(500)
            .ToListAsync(ct);

        return products.Select(p => new AdminProductDto(
            p.Id,
            p.Name,
            p.Brand.Name,
            p.Category.Name,
            p.BasePrice,
            p.Variants.Any(v => v.StockQuantity > 0),
            p.IsActive,
            p.CreatedAt)).ToList();
    }

    public async Task<(bool Success, string Error, CreateSellerResponse? Result)> CreateSellerAsync(
        CreateSellerRequest req, CancellationToken ct = default)
    {
        var existing = await userManager.FindByEmailAsync(req.Email);
        if (existing is not null)
            return (false, "A user with this email already exists.", null);

        var user = new ApplicationUser
        {
            Id             = Guid.NewGuid(),
            UserName       = req.Email,
            Email          = req.Email,
            FirstName      = req.FirstName,
            LastName       = req.LastName,
            EmailConfirmed = true,
            CreatedAt      = DateTime.UtcNow,
            UpdatedAt      = DateTime.UtcNow
        };

        var identityResult = await userManager.CreateAsync(user, req.Password);
        if (!identityResult.Succeeded)
        {
            var msg = string.Join("; ", identityResult.Errors.Select(e => e.Description));
            return (false, msg, null);
        }

        await userManager.AddToRoleAsync(user, "Seller");

        return (true, string.Empty, new CreateSellerResponse(
            user.Id, user.Email!, user.FirstName, user.LastName));
    }

    public async Task<AdminOrderDto?> UpdateOrderStatusAsync(Guid orderId, string status, CancellationToken ct = default)
    {
        var order = await db.Orders
            .Include(o => o.User)
            .Include(o => o.Items)
            .FirstOrDefaultAsync(o => o.Id == orderId, ct);

        if (order is null) return null;

        if (!Enum.TryParse<OrderStatus>(status, ignoreCase: true, out var parsed))
            throw new ArgumentException($"Invalid order status: {status}");

        order.Status = parsed;
        await db.SaveChangesAsync(ct);

        return new AdminOrderDto(
            order.Id,
            order.OrderNumber,
            order.User.Email ?? string.Empty,
            order.TotalAmount,
            order.Status.ToString(),
            order.CreatedAt,
            order.Items.Count);
    }

    public async Task<AdminProductDto?> UpdateProductStatusAsync(Guid productId, bool isActive, CancellationToken ct = default)
    {
        var product = await db.Products
            .Include(p => p.Brand)
            .Include(p => p.Category)
            .Include(p => p.Variants)
            .FirstOrDefaultAsync(p => p.Id == productId, ct);

        if (product is null) return null;

        product.IsActive = isActive;
        await db.SaveChangesAsync(ct);

        return new AdminProductDto(
            product.Id,
            product.Name,
            product.Brand.Name,
            product.Category.Name,
            product.BasePrice,
            product.Variants.Any(v => v.StockQuantity > 0),
            product.IsActive,
            product.CreatedAt);
    }
}
