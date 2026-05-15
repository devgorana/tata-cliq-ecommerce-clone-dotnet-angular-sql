using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using TataCliq.Infrastructure.Entities.Admin;
using TataCliq.Infrastructure.Entities.Auth;
using TataCliq.Infrastructure.Entities.Catalog;
using TataCliq.Infrastructure.Entities.Commerce;
using TataCliq.Infrastructure.Entities.Orders;
using TataCliq.Infrastructure.Entities.Payments;

namespace TataCliq.Infrastructure.Persistence;

public class AppDbContext : IdentityDbContext<ApplicationUser, IdentityRole<Guid>, Guid>
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    // Auth
    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();
    public DbSet<UserAddress> UserAddresses => Set<UserAddress>();

    // Catalog
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Brand> Brands => Set<Brand>();
    public DbSet<Product> Products => Set<Product>();
    public DbSet<ProductVariant> ProductVariants => Set<ProductVariant>();
    public DbSet<ProductImage> ProductImages => Set<ProductImage>();
    public DbSet<Review> Reviews => Set<Review>();

    // Commerce
    public DbSet<Cart> Carts => Set<Cart>();
    public DbSet<CartItem> CartItems => Set<CartItem>();
    public DbSet<Wishlist> Wishlists => Set<Wishlist>();
    public DbSet<WishlistItem> WishlistItems => Set<WishlistItem>();

    // Orders
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<OrderItem> OrderItems => Set<OrderItem>();
    public DbSet<OrderStatusHistory> OrderStatusHistories => Set<OrderStatusHistory>();

    // Payments
    public DbSet<Payment> Payments => Set<Payment>();

    // Admin
    public DbSet<Banner> Banners => Set<Banner>();
    public DbSet<Coupon> Coupons => Set<Coupon>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // Schema assignments
        builder.Entity<ApplicationUser>().ToTable("Users", "auth");
        builder.Entity<IdentityRole<Guid>>().ToTable("Roles", "auth");
        builder.Entity<IdentityUserRole<Guid>>().ToTable("UserRoles", "auth");
        builder.Entity<IdentityUserClaim<Guid>>().ToTable("UserClaims", "auth");
        builder.Entity<IdentityUserLogin<Guid>>().ToTable("UserLogins", "auth");
        builder.Entity<IdentityRoleClaim<Guid>>().ToTable("RoleClaims", "auth");
        builder.Entity<IdentityUserToken<Guid>>().ToTable("UserTokens", "auth");
        builder.Entity<RefreshToken>().ToTable("RefreshTokens", "auth");
        builder.Entity<UserAddress>().ToTable("Addresses", "auth");

        builder.Entity<Category>().ToTable("Categories", "catalog");
        builder.Entity<Brand>().ToTable("Brands", "catalog");
        builder.Entity<Product>().ToTable("Products", "catalog");
        builder.Entity<ProductVariant>().ToTable("ProductVariants", "catalog");
        builder.Entity<ProductImage>().ToTable("ProductImages", "catalog");
        builder.Entity<Review>().ToTable("Reviews", "catalog");

        builder.Entity<Cart>().ToTable("Carts", "commerce");
        builder.Entity<CartItem>().ToTable("CartItems", "commerce");
        builder.Entity<Wishlist>().ToTable("Wishlists", "commerce");
        builder.Entity<WishlistItem>().ToTable("WishlistItems", "commerce");

        builder.Entity<Order>().ToTable("Orders", "orders");
        builder.Entity<OrderItem>().ToTable("OrderItems", "orders");
        builder.Entity<OrderStatusHistory>().ToTable("OrderStatusHistory", "orders");

        builder.Entity<Payment>().ToTable("Payments", "payments");

        builder.Entity<Banner>().ToTable("Banners", "admin");
        builder.Entity<Coupon>().ToTable("Coupons", "admin");

        // Global soft-delete query filters
        builder.Entity<RefreshToken>().HasQueryFilter(e => !e.IsDeleted);
        builder.Entity<UserAddress>().HasQueryFilter(e => !e.IsDeleted);
        builder.Entity<Category>().HasQueryFilter(e => !e.IsDeleted);
        builder.Entity<Brand>().HasQueryFilter(e => !e.IsDeleted);
        builder.Entity<Product>().HasQueryFilter(e => !e.IsDeleted);
        builder.Entity<ProductVariant>().HasQueryFilter(e => !e.IsDeleted);
        builder.Entity<ProductImage>().HasQueryFilter(e => !e.IsDeleted);
        builder.Entity<Review>().HasQueryFilter(e => !e.IsDeleted);
        builder.Entity<Cart>().HasQueryFilter(e => !e.IsDeleted);
        builder.Entity<CartItem>().HasQueryFilter(e => !e.IsDeleted);
        builder.Entity<Wishlist>().HasQueryFilter(e => !e.IsDeleted);
        builder.Entity<WishlistItem>().HasQueryFilter(e => !e.IsDeleted);
        builder.Entity<Order>().HasQueryFilter(e => !e.IsDeleted);
        builder.Entity<OrderItem>().HasQueryFilter(e => !e.IsDeleted);
        builder.Entity<OrderStatusHistory>().HasQueryFilter(e => !e.IsDeleted);
        builder.Entity<Payment>().HasQueryFilter(e => !e.IsDeleted);
        builder.Entity<Banner>().HasQueryFilter(e => !e.IsDeleted);
        builder.Entity<Coupon>().HasQueryFilter(e => !e.IsDeleted);

        // Indexes
        builder.Entity<Product>().HasIndex(p => p.Slug).IsUnique();
        builder.Entity<Category>().HasIndex(c => c.Slug).IsUnique();
        builder.Entity<Brand>().HasIndex(b => b.Slug).IsUnique();
        builder.Entity<ProductVariant>().HasIndex(v => v.Sku).IsUnique();
        builder.Entity<Coupon>().HasIndex(c => c.Code).IsUnique();
        builder.Entity<Order>().HasIndex(o => o.OrderNumber).IsUnique();
        builder.Entity<RefreshToken>().HasIndex(t => t.Token).IsUnique();

        // Self-referencing category hierarchy
        builder.Entity<Category>()
            .HasOne(c => c.Parent)
            .WithMany(c => c.Children)
            .HasForeignKey(c => c.ParentId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
