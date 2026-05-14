using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using TataCliq.Infrastructure.Entities.Auth;
using TataCliq.Infrastructure.Entities.Catalog;

namespace TataCliq.Infrastructure.Persistence;

public static class DbSeeder
{
    public static async Task SeedAsync(
        AppDbContext db,
        UserManager<ApplicationUser> userManager,
        RoleManager<IdentityRole<Guid>> roleManager)
    {
        await db.Database.MigrateAsync();
        await SeedRolesAsync(roleManager);
        await SeedAdminUserAsync(userManager);
        await SeedCatalogAsync(db);
    }

    // ── Roles ─────────────────────────────────────────────────────────────────

    private static async Task SeedRolesAsync(RoleManager<IdentityRole<Guid>> roleManager)
    {
        foreach (var role in new[] { "Admin", "Customer", "Seller" })
        {
            if (!await roleManager.RoleExistsAsync(role))
                await roleManager.CreateAsync(new IdentityRole<Guid>(role));
        }
    }

    // ── Admin user ────────────────────────────────────────────────────────────

    private static async Task SeedAdminUserAsync(UserManager<ApplicationUser> userManager)
    {
        const string email    = "admin@tatacliq.com";
        const string password = "Admin@123";

        if (await userManager.FindByEmailAsync(email) is not null) return;

        var admin = new ApplicationUser
        {
            Id             = Guid.NewGuid(),
            UserName       = email,
            Email          = email,
            EmailConfirmed = true,
            FirstName      = "Admin",
            LastName       = "TataCliq",
        };

        var result = await userManager.CreateAsync(admin, password);
        if (result.Succeeded)
            await userManager.AddToRoleAsync(admin, "Admin");
    }

    // ── Catalog ───────────────────────────────────────────────────────────────

    private static async Task SeedCatalogAsync(AppDbContext db)
    {
        // Reset existing product data
        if (await db.Products.IgnoreQueryFilters().AnyAsync())
        {
            await db.CartItems.IgnoreQueryFilters().ExecuteDeleteAsync();
            await db.WishlistItems.IgnoreQueryFilters().ExecuteDeleteAsync();
            await db.OrderItems.IgnoreQueryFilters().ExecuteDeleteAsync();
            
            await db.ProductVariants.IgnoreQueryFilters().ExecuteDeleteAsync();
            await db.ProductImages.IgnoreQueryFilters().ExecuteDeleteAsync();
            await db.Products.IgnoreQueryFilters().ExecuteDeleteAsync();
        }

        // Category IDs
        var catMen        = Guid.NewGuid();
        var catWomen      = Guid.NewGuid();
        var catKids       = Guid.NewGuid();
        var catFootwear   = Guid.NewGuid();
        var catJewellery  = Guid.NewGuid();
        var catBeauty     = Guid.NewGuid();

        if (!await db.Categories.IgnoreQueryFilters().AnyAsync())
        {
            db.Categories.AddRange(
                Cat(catMen,       "Men",       "men"),
                Cat(catWomen,     "Women",     "women"),
                Cat(catKids,      "Kids",      "kids"),
                Cat(catFootwear,  "Footwear",  "footwear"),
                Cat(catJewellery, "Jewellery", "jewellery"),
                Cat(catBeauty,    "Beauty",    "beauty")
            );
        }
        else
        {
            var existingCategories = await db.Categories.IgnoreQueryFilters().ToListAsync();
            catMen       = existingCategories.FirstOrDefault(c => c.Slug == "men")?.Id       ?? catMen;
            catWomen     = existingCategories.FirstOrDefault(c => c.Slug == "women")?.Id     ?? catWomen;
            catKids      = existingCategories.FirstOrDefault(c => c.Slug == "kids")?.Id      ?? catKids;
            catFootwear  = existingCategories.FirstOrDefault(c => c.Slug == "footwear")?.Id  ?? catFootwear;
            catJewellery = existingCategories.FirstOrDefault(c => c.Slug == "jewellery")?.Id ?? catJewellery;
            catBeauty    = existingCategories.FirstOrDefault(c => c.Slug == "beauty")?.Id    ?? catBeauty;
        }

        // Brand IDs
        var bNike      = Guid.NewGuid();
        var bPuma      = Guid.NewGuid();
        var bAdidas    = Guid.NewGuid();
        var bLevis     = Guid.NewGuid();
        var bHM        = Guid.NewGuid();
        var bTanishq   = Guid.NewGuid();
        var bCaratLane = Guid.NewGuid();
        var bZara      = Guid.NewGuid();
        var bBata      = Guid.NewGuid();
        var bLakme     = Guid.NewGuid();

        if (!await db.Brands.IgnoreQueryFilters().AnyAsync())
        {
            db.Brands.AddRange(
                Br(bNike,      "Nike",       "nike"),
                Br(bPuma,      "Puma",       "puma"),
                Br(bAdidas,    "Adidas",     "adidas"),
                Br(bLevis,     "Levi's",     "levis"),
                Br(bHM,        "H&M",        "hm"),
                Br(bTanishq,   "Tanishq",    "tanishq"),
                Br(bCaratLane, "CaratLane",  "caratlane"),
                Br(bZara,      "Zara",       "zara"),
                Br(bBata,      "Bata",       "bata"),
                Br(bLakme,     "Lakmé",      "lakme")
            );
        }
        else
        {
            var existingBrands = await db.Brands.IgnoreQueryFilters().ToListAsync();
            bNike      = existingBrands.FirstOrDefault(b => b.Slug == "nike")?.Id       ?? bNike;
            bPuma      = existingBrands.FirstOrDefault(b => b.Slug == "puma")?.Id       ?? bPuma;
            bAdidas    = existingBrands.FirstOrDefault(b => b.Slug == "adidas")?.Id     ?? bAdidas;
            bLevis     = existingBrands.FirstOrDefault(b => b.Slug == "levis")?.Id      ?? bLevis;
            bHM        = existingBrands.FirstOrDefault(b => b.Slug == "hm")?.Id         ?? bHM;
            bTanishq   = existingBrands.FirstOrDefault(b => b.Slug == "tanishq")?.Id    ?? bTanishq;
            bCaratLane = existingBrands.FirstOrDefault(b => b.Slug == "caratlane")?.Id  ?? bCaratLane;
            bZara      = existingBrands.FirstOrDefault(b => b.Slug == "zara")?.Id       ?? bZara;
            bBata      = existingBrands.FirstOrDefault(b => b.Slug == "bata")?.Id       ?? bBata;
            bLakme     = existingBrands.FirstOrDefault(b => b.Slug == "lakme")?.Id      ?? bLakme;
        }

        var products = new List<Product>();
        int imgSeed = 10;
        var rand = new Random(42);

        // ── Men (100) ──────────────────────────────────────────────────────────
        string[] menAdjectives = { "Classic", "Premium", "Casual", "Formal", "Slim Fit", "Relaxed Fit", "Vintage", "Modern", "Essential", "Signature" };
        string[] menNouns = { "T-Shirt", "Chinos", "Jeans", "Shirt", "Shorts", "Jacket", "Hoodie", "Sweater", "Polo", "Blazer" };
        Guid[] menBrands = { bNike, bLevis, bHM, bPuma, bZara, bAdidas };
        products.AddRange(GenerateProducts(catMen, menAdjectives, menNouns, menBrands, "S,M,L,XL", "Black,White,Navy,Grey,Blue", "menswear", ref imgSeed, rand));

        // ── Women (100) ────────────────────────────────────────────────────────
        string[] womenAdjectives = { "Elegant", "Casual", "Floral", "Chic", "Vintage", "Modern", "Designer", "Essential", "Classic", "Boho" };
        string[] womenNouns = { "Dress", "Blouse", "Skirt", "Jeans", "Top", "Cardigan", "Jacket", "Jumpsuit", "Leggings", "Tunic" };
        Guid[] womenBrands = { bZara, bLevis, bHM, bNike, bPuma, bAdidas };
        products.AddRange(GenerateProducts(catWomen, womenAdjectives, womenNouns, womenBrands, "XS,S,M,L,XL", "Black,White,Red,Pink,Blue", "womenswear", ref imgSeed, rand));

        // ── Kids (100) ─────────────────────────────────────────────────────────
        string[] kidsAdjectives = { "Cute", "Playful", "Comfy", "Bright", "Cool", "Basic", "Active", "Fun", "Cozy", "Stylish" };
        string[] kidsNouns = { "T-Shirt", "Shorts", "Dress", "Jacket", "Sweater", "Pajamas", "Romper", "Jeans", "Hoodie", "Top" };
        Guid[] kidsBrands = { bHM, bLevis, bNike, bPuma, bAdidas, bZara };
        products.AddRange(GenerateProducts(catKids, kidsAdjectives, kidsNouns, kidsBrands, "2-3Y,4-5Y,6-7Y,8-9Y", "Red,Blue,Green,Yellow,Pink", "kidswear", ref imgSeed, rand));

        // ── Footwear (100) ─────────────────────────────────────────────────────
        string[] footwearAdjectives = { "Comfortable", "Athletic", "Classic", "Stylish", "Premium", "Casual", "Formal", "Running", "Lightweight", "Durable" };
        string[] footwearNouns = { "Sneakers", "Boots", "Loafers", "Sandals", "Heels", "Flats", "Oxfords", "Slippers", "Trainers", "Wedges" };
        Guid[] footwearBrands = { bNike, bPuma, bAdidas, bBata, bZara, bLevis };
        products.AddRange(GenerateProducts(catFootwear, footwearAdjectives, footwearNouns, footwearBrands, "6,7,8,9,10,11", "Black,Brown,White,Navy,Grey", "shoes", ref imgSeed, rand));

        // ── Jewellery (100) ────────────────────────────────────────────────────
        string[] jewelleryAdjectives = { "Elegant", "Stunning", "Classic", "Diamond", "Gold", "Vintage", "Contemporary", "Bridal", "Minimal", "Statement" };
        string[] jewelleryNouns = { "Necklace", "Ring", "Earrings", "Bracelet", "Bangle", "Pendant", "Anklet", "Mangalsutra", "Nose Pin", "Brooch" };
        Guid[] jewelleryBrands = { bTanishq, bCaratLane, bZara };
        products.AddRange(GenerateProducts(catJewellery, jewelleryAdjectives, jewelleryNouns, jewelleryBrands, "ONE SIZE", "Gold,Rose Gold,Silver,White Gold", "jewellery", ref imgSeed, rand));

        // ── Beauty (100) ───────────────────────────────────────────────────────
        string[] beautyAdjectives = { "Hydrating", "Matte", "Radiant", "Anti-Aging", "Natural", "Organic", "Luminous", "Soothing", "Long-Lasting", "Flawless" };
        string[] beautyNouns = { "Lipstick", "Foundation", "Serum", "Moisturizer", "Mascara", "Cleanser", "Toner", "Eyeshadow", "Blush", "Primer" };
        Guid[] beautyBrands = { bLakme, bZara, bHM };
        products.AddRange(GenerateProducts(catBeauty, beautyAdjectives, beautyNouns, beautyBrands, "ONE SIZE", "Regular", "cosmetics", ref imgSeed, rand));

        const int batchSize = 100;
        for (int i = 0; i < products.Count; i += batchSize)
        {
            var batch = products.Skip(i).Take(batchSize).ToList();
            db.Products.AddRange(batch);
            await db.SaveChangesAsync();
        }
    }

    // ── Entity factory helpers ────────────────────────────────────────────────

    private static Category Cat(Guid id, string name, string slug) =>
        new() { Id = id, Name = name, Slug = slug };

    private static Brand Br(Guid id, string name, string slug) =>
        new() { Id = id, Name = name, Slug = slug };

    private static List<Product> GenerateProducts(
        Guid categoryId, string[] adjectives, string[] nouns, Guid[] brands, 
        string sizes, string colors, string imageKeyword, ref int imgSeed, Random rand)
    {
        var list = new List<Product>();
        
        foreach (var adj in adjectives)
        {
            foreach (var noun in nouns)
            {
                var productId = Guid.NewGuid();
                var name = $"{adj} {noun}";
                var desc = $"A high-quality {name.ToLowerInvariant()} for your daily needs.";
                
                var basePrice = Math.Round((decimal)(rand.NextDouble() * 5000 + 500) / 100) * 100 - 1;
                var discPrice = rand.NextDouble() > 0.3 ? basePrice - (Math.Round((decimal)(rand.NextDouble() * 1000 + 100) / 100) * 100) : (decimal?)null;
                if (discPrice <= 0) discPrice = basePrice * 0.8m;
                
                var brandId = brands[rand.Next(brands.Length)];
                var slug = Slugify($"{name}-{imgSeed}");
                
                var variants = new List<ProductVariant>();
                int skuIdx = 0;

                var sizeArray = sizes.Split(',');
                var colorArray = colors.Split(',');

                var selectedSizes = sizeArray.OrderBy(x => rand.Next()).Take(2).ToArray();
                var selectedColors = colorArray.OrderBy(x => rand.Next()).Take(2).ToArray();

                foreach (var size in selectedSizes)
                foreach (var colour in selectedColors)
                {
                    variants.Add(new ProductVariant
                    {
                        Id = Guid.NewGuid(),
                        ProductId = productId,
                        Size = size.Trim(),
                        Colour = colour.Trim(),
                        Sku = $"{slug}-{skuIdx++}",
                        StockQuantity = rand.Next(10, 100),
                        PriceOverride = null,
                    });
                }

                var images = new List<ProductImage>
                {
                    new() { Id = Guid.NewGuid(), ProductId = productId, Url = $"https://loremflickr.com/600/600/{imageKeyword}?lock={imgSeed}", DisplayOrder = 0, IsPrimary = true },
                    new() { Id = Guid.NewGuid(), ProductId = productId, Url = $"https://loremflickr.com/600/600/{imageKeyword}?lock={imgSeed + 1}", DisplayOrder = 1, IsPrimary = false },
                };
                imgSeed += 2;

                list.Add(new Product
                {
                    Id = productId,
                    Name = name,
                    Slug = slug,
                    Description = desc,
                    BasePrice = basePrice,
                    DiscountedPrice = discPrice,
                    CategoryId = categoryId,
                    BrandId = brandId,
                    AverageRating = Math.Round(3.5 + rand.NextDouble() * 1.5, 1),
                    ReviewCount = rand.Next(10, 500),
                    IsActive = true,
                    Variants = variants,
                    Images = images,
                });
            }
        }
        
        return list;
    }

    private static string Slugify(string name) =>
        name.ToLowerInvariant()
            .Replace(" ", "-")
            .Replace("'", "")
            .Replace("&", "and")
            .Replace("/", "-")
            .Replace("(", "")
            .Replace(")", "");
}
