using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using TataCliq.Infrastructure.Entities.Auth;
using TataCliq.Infrastructure.Entities.Commerce;
using TataCliq.Infrastructure.Persistence;
using TataCliq.SharedKernel.Domain;
using TataCliq.User.API.DTOs;

namespace TataCliq.User.API.Services;

public class UserService : IUserService
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly AppDbContext _db;
    private readonly IMapper _mapper;

    public UserService(UserManager<ApplicationUser> userManager, AppDbContext db, IMapper mapper)
    {
        _userManager = userManager;
        _db = db;
        _mapper = mapper;
    }

    public async Task<Result<UserProfileResponseDto>> GetProfileAsync(Guid userId, CancellationToken ct = default)
    {
        var user = await _userManager.FindByIdAsync(userId.ToString());
        if (user is null)
            return Result.Failure<UserProfileResponseDto>(Error.NotFound("User"));

        return Result.Success(_mapper.Map<UserProfileResponseDto>(user));
    }

    public async Task<Result<UserProfileResponseDto>> UpdateProfileAsync(Guid userId, UpdateProfileRequestDto dto, CancellationToken ct = default)
    {
        var user = await _userManager.FindByIdAsync(userId.ToString());
        if (user is null)
            return Result.Failure<UserProfileResponseDto>(Error.NotFound("User"));

        user.FirstName = dto.FirstName;
        user.LastName = dto.LastName;
        user.DateOfBirth = dto.DateOfBirth;

        await _userManager.UpdateAsync(user);
        return Result.Success(_mapper.Map<UserProfileResponseDto>(user));
    }

    public async Task<Result<IReadOnlyList<AddressResponseDto>>> GetAddressesAsync(Guid userId, CancellationToken ct = default)
    {
        var addresses = await _db.UserAddresses
            .Where(a => a.UserId == userId)
            .OrderByDescending(a => a.IsDefault)
            .ThenByDescending(a => a.CreatedAt)
            .ToListAsync(ct);

        return Result.Success(_mapper.Map<IReadOnlyList<AddressResponseDto>>(addresses));
    }

    public async Task<Result<AddressResponseDto>> CreateAddressAsync(Guid userId, CreateAddressRequestDto dto, CancellationToken ct = default)
    {
        if (dto.IsDefault)
        {
            await _db.UserAddresses
                .Where(a => a.UserId == userId && a.IsDefault)
                .ExecuteUpdateAsync(s => s.SetProperty(a => a.IsDefault, false), ct);
        }

        var address = _mapper.Map<UserAddress>(dto);
        address.Id = Guid.NewGuid();
        address.UserId = userId;

        _db.UserAddresses.Add(address);
        await _db.SaveChangesAsync(ct);

        return Result.Success(_mapper.Map<AddressResponseDto>(address));
    }

    public async Task<Result> DeleteAddressAsync(Guid userId, Guid addressId, CancellationToken ct = default)
    {
        var address = await _db.UserAddresses
            .FirstOrDefaultAsync(a => a.Id == addressId && a.UserId == userId, ct);

        if (address is null)
            return Result.Failure(Error.NotFound("Address"));

        address.IsDeleted = true;
        await _db.SaveChangesAsync(ct);
        return Result.Success();
    }

    public async Task<Result<IReadOnlyList<WishlistItemResponseDto>>> GetWishlistAsync(Guid userId, CancellationToken ct = default)
    {
        var wishlist = await _db.Wishlists
            .Include(w => w.Items)
                .ThenInclude(i => i.Product)
                    .ThenInclude(p => p.Brand)
            .Include(w => w.Items)
                .ThenInclude(i => i.Product)
                    .ThenInclude(p => p.Images)
            .FirstOrDefaultAsync(w => w.UserId == userId, ct);

        if (wishlist is null)
            return Result.Success<IReadOnlyList<WishlistItemResponseDto>>([]);

        var items = _mapper.Map<IReadOnlyList<WishlistItemResponseDto>>(wishlist.Items);
        return Result.Success(items);
    }

    public async Task<Result> AddToWishlistAsync(Guid userId, Guid productId, CancellationToken ct = default)
    {
        var productExists = await _db.Products.AnyAsync(p => p.Id == productId, ct);
        if (!productExists)
            return Result.Failure(Error.NotFound("Product"));

        var wishlist = await _db.Wishlists
            .Include(w => w.Items)
            .FirstOrDefaultAsync(w => w.UserId == userId, ct);

        if (wishlist is null)
        {
            wishlist = new Wishlist { Id = Guid.NewGuid(), UserId = userId };
            _db.Wishlists.Add(wishlist);
        }

        var alreadyAdded = wishlist.Items.Any(i => i.ProductId == productId);
        if (alreadyAdded)
            return Result.Success();

        wishlist.Items.Add(new WishlistItem { Id = Guid.NewGuid(), WishlistId = wishlist.Id, ProductId = productId });
        await _db.SaveChangesAsync(ct);
        return Result.Success();
    }

    public async Task<Result> RemoveFromWishlistAsync(Guid userId, Guid productId, CancellationToken ct = default)
    {
        var wishlist = await _db.Wishlists
            .Include(w => w.Items)
            .FirstOrDefaultAsync(w => w.UserId == userId, ct);

        if (wishlist is null)
            return Result.Success();

        var item = wishlist.Items.FirstOrDefault(i => i.ProductId == productId);
        if (item is null)
            return Result.Success();

        item.IsDeleted = true;
        await _db.SaveChangesAsync(ct);
        return Result.Success();
    }
}
