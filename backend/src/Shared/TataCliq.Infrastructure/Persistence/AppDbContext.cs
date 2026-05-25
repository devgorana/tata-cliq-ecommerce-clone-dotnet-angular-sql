using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using TataCliq.Infrastructure.Entities.Admin;
using TataCliq.Infrastructure.Entities.Analytics;
using TataCliq.Infrastructure.Entities.Auth;
using TataCliq.Infrastructure.Entities.Catalog;
using TataCliq.Infrastructure.Entities.Commerce;
using TataCliq.Infrastructure.Entities.Media;
using TataCliq.Infrastructure.Entities.Notifications;
using TataCliq.Infrastructure.Entities.Orders;
using TataCliq.Infrastructure.Entities.Payments;
using TataCliq.Infrastructure.Entities.Seller;
using TataCliq.Infrastructure.Entities.Wallet;

namespace TataCliq.Infrastructure.Persistence;

public class AppDbContext : IdentityDbContext<ApplicationUser, IdentityRole<Guid>, Guid>
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    // Auth
    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();
    public DbSet<UserAddress> UserAddresses => Set<UserAddress>();
    public DbSet<OtpCode> OtpCodes => Set<OtpCode>();

    // Catalog
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Brand> Brands => Set<Brand>();
    public DbSet<Product> Products => Set<Product>();
    public DbSet<ProductVariant> ProductVariants => Set<ProductVariant>();
    public DbSet<ProductImage> ProductImages => Set<ProductImage>();
    public DbSet<Review> Reviews => Set<Review>();
    public DbSet<AttributeDefinition> AttributeDefinitions => Set<AttributeDefinition>();
    public DbSet<CategoryAttribute> CategoryAttributes => Set<CategoryAttribute>();
    public DbSet<ProductAttribute> ProductAttributes => Set<ProductAttribute>();
    public DbSet<ProductVariantOption> ProductVariantOptions => Set<ProductVariantOption>();
    public DbSet<PincodeServiceability> PincodeServiceabilities => Set<PincodeServiceability>();

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
    public DbSet<Banner>   Banners   => Set<Banner>();
    public DbSet<Coupon>   Coupons   => Set<Coupon>();
    public DbSet<AuditLog> AuditLogs => Set<AuditLog>();

    // Seller
    public DbSet<Entities.Seller.Seller> Sellers => Set<Entities.Seller.Seller>();
    public DbSet<SellerInventory> SellerInventories => Set<SellerInventory>();
    public DbSet<SellerPayout> SellerPayouts => Set<SellerPayout>();

    // Media
    public DbSet<MediaFile> MediaFiles => Set<MediaFile>();

    // Wallet
    public DbSet<Wallet> Wallets => Set<Wallet>();
    public DbSet<WalletTransaction> WalletTransactions => Set<WalletTransaction>();

    // Analytics
    public DbSet<DailyRevenue> DailyRevenues => Set<DailyRevenue>();
    public DbSet<ProductView> ProductViews => Set<ProductView>();
    public DbSet<SearchTerm> SearchTerms => Set<SearchTerm>();

    // Notifications
    public DbSet<NotificationTemplate> NotificationTemplates => Set<NotificationTemplate>();
    public DbSet<NotificationLog> NotificationLogs => Set<NotificationLog>();
    public DbSet<NotificationOutbox> NotificationOutbox => Set<NotificationOutbox>();
    public DbSet<FcmDeviceToken> FcmDeviceTokens => Set<FcmDeviceToken>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // Auth schema
        builder.Entity<ApplicationUser>().ToTable("Users", "auth");
        builder.Entity<IdentityRole<Guid>>().ToTable("Roles", "auth");
        builder.Entity<IdentityUserRole<Guid>>().ToTable("UserRoles", "auth");
        builder.Entity<IdentityUserClaim<Guid>>().ToTable("UserClaims", "auth");
        builder.Entity<IdentityUserLogin<Guid>>().ToTable("UserLogins", "auth");
        builder.Entity<IdentityRoleClaim<Guid>>().ToTable("RoleClaims", "auth");
        builder.Entity<IdentityUserToken<Guid>>().ToTable("UserTokens", "auth");
        builder.Entity<RefreshToken>().ToTable("RefreshTokens", "auth");
        builder.Entity<UserAddress>().ToTable("Addresses", "auth");
        builder.Entity<OtpCode>().ToTable("OtpCodes", "auth");

        // Catalog schema
        builder.Entity<Category>().ToTable("Categories", "catalog");
        builder.Entity<Brand>().ToTable("Brands", "catalog");
        builder.Entity<Product>().ToTable("Products", "catalog");
        builder.Entity<ProductVariant>().ToTable("ProductVariants", "catalog");
        builder.Entity<ProductImage>().ToTable("ProductImages", "catalog");
        builder.Entity<Review>().ToTable("Reviews", "catalog");
        builder.Entity<AttributeDefinition>().ToTable("AttributeDefinitions", "catalog");
        builder.Entity<CategoryAttribute>().ToTable("CategoryAttributes", "catalog");
        builder.Entity<ProductAttribute>().ToTable("ProductAttributes", "catalog");
        builder.Entity<ProductVariantOption>().ToTable("ProductVariantOptions", "catalog");
        builder.Entity<PincodeServiceability>(e =>
        {
            e.ToTable("PincodeServiceabilities", "catalog");
            e.Property(p => p.Pincode).HasMaxLength(10).IsRequired();
            e.Property(p => p.City).HasMaxLength(100);
            e.Property(p => p.FreeDeliveryThreshold).HasColumnType("decimal(10,2)");
            e.HasIndex(p => p.Pincode).IsUnique();
        });

        // Commerce schema
        builder.Entity<Cart>().ToTable("Carts", "commerce");
        builder.Entity<CartItem>().ToTable("CartItems", "commerce");
        builder.Entity<Wishlist>().ToTable("Wishlists", "commerce");
        builder.Entity<WishlistItem>().ToTable("WishlistItems", "commerce");

        // Orders schema — ENH-ORD-001: CK constraints guard valid OrderStatus enum values (0–7)
        builder.Entity<Order>().ToTable("Orders", "orders",
            t => t.HasCheckConstraint("CK_Orders_Status", "[Status] IN (0,1,2,3,4,5,6,7)"));
        builder.Entity<OrderItem>().ToTable("OrderItems", "orders");
        builder.Entity<OrderStatusHistory>().ToTable("OrderStatusHistory", "orders",
            t => t.HasCheckConstraint("CK_OrderStatusHistory_Status", "[Status] IN (0,1,2,3,4,5,6,7)"));

        // Payments schema
        builder.Entity<Payment>().ToTable("Payments", "payments");

        // Admin schema
        builder.Entity<Banner>().ToTable("Banners", "admin");
        builder.Entity<Coupon>().ToTable("Coupons", "admin");

        // AuditLogs — append-only, no soft-delete filter, no query filter
        builder.Entity<AuditLog>(e =>
        {
            e.ToTable("AuditLogs", "admin");
            e.HasKey(a => a.Id);
            e.Property(a => a.Action).HasMaxLength(100).IsRequired();
            e.Property(a => a.EntityType).HasMaxLength(100).IsRequired();
            e.Property(a => a.EntityId).HasMaxLength(100);
            e.Property(a => a.ActorName).HasMaxLength(256);
            e.Property(a => a.IpAddress).HasMaxLength(50);
            // Indexes for common query patterns
            e.HasIndex(a => new { a.EntityType, a.EntityId });
            e.HasIndex(a => new { a.ActorId, a.Timestamp });
            e.HasIndex(a => a.ExpiresAt);  // retention cleanup jobs
        });

        // Seller schema
        builder.Entity<Entities.Seller.Seller>().ToTable("Sellers", "seller");
        builder.Entity<SellerInventory>().ToTable("SellerInventory", "seller");
        builder.Entity<SellerPayout>().ToTable("SellerPayouts", "seller");

        // Media schema
        builder.Entity<MediaFile>().ToTable("MediaFiles", "media");

        // Wallet schema
        builder.Entity<Wallet>().ToTable("Wallets", "wallet");
        builder.Entity<WalletTransaction>().ToTable("WalletTransactions", "wallet");

        // Analytics schema
        builder.Entity<DailyRevenue>().ToTable("DailyRevenue", "analytics");
        builder.Entity<ProductView>().ToTable("ProductViews", "analytics");
        builder.Entity<SearchTerm>().ToTable("SearchTerms", "analytics");

        // Notifications schema
        builder.Entity<NotificationTemplate>().ToTable("NotificationTemplates", "notifications");
        builder.Entity<NotificationLog>().ToTable("NotificationLogs", "notifications");
        builder.Entity<NotificationOutbox>().ToTable("NotificationOutbox", "notifications");
        builder.Entity<FcmDeviceToken>(e =>
        {
            e.ToTable("FcmDeviceTokens", "notifications");
            e.Property(t => t.DeviceId).HasMaxLength(256).IsRequired();
            e.Property(t => t.Token).HasMaxLength(4096).IsRequired();
            e.Property(t => t.Platform).HasMaxLength(50).IsRequired();
            // Unique constraint: one active token per user per device
            e.HasIndex(t => new { t.UserId, t.DeviceId }).IsUnique();
        });

        // Global soft-delete query filters
        builder.Entity<RefreshToken>().HasQueryFilter(e => !e.IsDeleted);
        builder.Entity<UserAddress>().HasQueryFilter(e => !e.IsDeleted);
        builder.Entity<OtpCode>().HasQueryFilter(e => !e.IsDeleted);
        builder.Entity<Category>().HasQueryFilter(e => !e.IsDeleted);
        builder.Entity<Brand>().HasQueryFilter(e => !e.IsDeleted);
        builder.Entity<Product>().HasQueryFilter(e => !e.IsDeleted);
        builder.Entity<ProductVariant>().HasQueryFilter(e => !e.IsDeleted);
        builder.Entity<ProductImage>().HasQueryFilter(e => !e.IsDeleted);
        builder.Entity<Review>().HasQueryFilter(e => !e.IsDeleted);
        builder.Entity<AttributeDefinition>().HasQueryFilter(e => !e.IsDeleted);
        builder.Entity<CategoryAttribute>().HasQueryFilter(e => !e.IsDeleted);
        builder.Entity<ProductAttribute>().HasQueryFilter(e => !e.IsDeleted);
        builder.Entity<ProductVariantOption>().HasQueryFilter(e => !e.IsDeleted);
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
        builder.Entity<Entities.Seller.Seller>().HasQueryFilter(e => !e.IsDeleted);
        builder.Entity<SellerInventory>().HasQueryFilter(e => !e.IsDeleted);
        builder.Entity<SellerPayout>().HasQueryFilter(e => !e.IsDeleted);
        builder.Entity<MediaFile>().HasQueryFilter(e => !e.IsDeleted);
        builder.Entity<Wallet>().HasQueryFilter(e => !e.IsDeleted);
        builder.Entity<WalletTransaction>().HasQueryFilter(e => !e.IsDeleted);
        builder.Entity<NotificationLog>().HasQueryFilter(e => !e.IsDeleted);
        builder.Entity<FcmDeviceToken>().HasQueryFilter(e => !e.IsDeleted);

        // Indexes
        builder.Entity<Product>().HasIndex(p => p.Slug).IsUnique();
        builder.Entity<Category>().HasIndex(c => c.Slug).IsUnique();
        builder.Entity<Brand>().HasIndex(b => b.Slug).IsUnique();
        builder.Entity<ProductVariant>().HasIndex(v => v.Sku).IsUnique();
        builder.Entity<Coupon>().HasIndex(c => c.Code).IsUnique();
        builder.Entity<Order>().HasIndex(o => o.OrderNumber).IsUnique();
        builder.Entity<RefreshToken>().HasIndex(t => t.Token).IsUnique();
        builder.Entity<Entities.Seller.Seller>().HasIndex(s => s.Slug).IsUnique();
        builder.Entity<Entities.Seller.Seller>().HasIndex(s => s.UserId).IsUnique();
        builder.Entity<Wallet>().HasIndex(w => w.UserId).IsUnique();
        builder.Entity<SearchTerm>().HasIndex(st => st.Term).IsUnique();
        builder.Entity<AttributeDefinition>().HasIndex(a => a.Name).IsUnique();
        builder.Entity<OtpCode>().HasIndex(o => new { o.Email, o.Purpose, o.IsUsed });
        builder.Entity<OtpCode>().HasIndex(o => new { o.PhoneNumber, o.Purpose, o.IsUsed });

        // Self-referencing category hierarchy
        builder.Entity<Category>()
            .HasOne(c => c.Parent)
            .WithMany(c => c.Children)
            .HasForeignKey(c => c.ParentId)
            .OnDelete(DeleteBehavior.Restrict);

        // CategoryAttribute relationships
        builder.Entity<CategoryAttribute>()
            .HasOne(ca => ca.Category)
            .WithMany(c => c.CategoryAttributes)
            .HasForeignKey(ca => ca.CategoryId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<CategoryAttribute>()
            .HasOne(ca => ca.AttributeDefinition)
            .WithMany(a => a.CategoryAttributes)
            .HasForeignKey(ca => ca.AttributeDefinitionId)
            .OnDelete(DeleteBehavior.Cascade);

        // ProductAttribute relationships
        builder.Entity<ProductAttribute>()
            .HasOne(pa => pa.Product)
            .WithMany(p => p.Attributes)
            .HasForeignKey(pa => pa.ProductId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<ProductAttribute>()
            .HasOne(pa => pa.AttributeDefinition)
            .WithMany(a => a.ProductAttributes)
            .HasForeignKey(pa => pa.AttributeDefinitionId)
            .OnDelete(DeleteBehavior.Restrict);

        // ProductVariantOption relationships
        builder.Entity<ProductVariantOption>()
            .HasOne(pvo => pvo.ProductVariant)
            .WithMany(v => v.Options)
            .HasForeignKey(pvo => pvo.ProductVariantId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<ProductVariantOption>()
            .HasOne(pvo => pvo.AttributeDefinition)
            .WithMany(a => a.VariantOptions)
            .HasForeignKey(pvo => pvo.AttributeDefinitionId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Entity<ProductVariantOption>()
            .HasIndex(pvo => new { pvo.ProductVariantId, pvo.AttributeDefinitionId })
            .IsUnique();

        builder.Entity<PincodeServiceability>().HasQueryFilter(e => !e.IsDeleted);

        // Seller relationships
        builder.Entity<SellerInventory>()
            .HasOne(si => si.Seller)
            .WithMany(s => s.Inventory)
            .HasForeignKey(si => si.SellerId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<SellerPayout>()
            .HasOne(sp => sp.Seller)
            .WithMany(s => s.Payouts)
            .HasForeignKey(sp => sp.SellerId)
            .OnDelete(DeleteBehavior.Cascade);

        // Wallet relationships
        builder.Entity<WalletTransaction>()
            .HasOne(wt => wt.Wallet)
            .WithMany(w => w.Transactions)
            .HasForeignKey(wt => wt.WalletId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
