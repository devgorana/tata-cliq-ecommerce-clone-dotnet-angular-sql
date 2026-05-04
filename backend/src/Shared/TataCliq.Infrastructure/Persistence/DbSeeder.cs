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
        if (await db.Products.AnyAsync()) return;

        // Category IDs
        var catMen         = Guid.NewGuid();
        var catWomen       = Guid.NewGuid();
        var catKids        = Guid.NewGuid();
        var catFootwear    = Guid.NewGuid();
        var catElectronics = Guid.NewGuid();
        var catBeauty      = Guid.NewGuid();

        db.Categories.AddRange(
            Cat(catMen,         "Men",         "men"),
            Cat(catWomen,       "Women",       "women"),
            Cat(catKids,        "Kids",        "kids"),
            Cat(catFootwear,    "Footwear",    "footwear"),
            Cat(catElectronics, "Electronics", "electronics"),
            Cat(catBeauty,      "Beauty",      "beauty")
        );

        // Brand IDs
        var bNike    = Guid.NewGuid();
        var bPuma    = Guid.NewGuid();
        var bAdidas  = Guid.NewGuid();
        var bLevis   = Guid.NewGuid();
        var bHM      = Guid.NewGuid();
        var bSamsung = Guid.NewGuid();
        var bApple   = Guid.NewGuid();
        var bZara    = Guid.NewGuid();
        var bBata    = Guid.NewGuid();
        var bLakme   = Guid.NewGuid();

        db.Brands.AddRange(
            Br(bNike,    "Nike",    "nike"),
            Br(bPuma,    "Puma",    "puma"),
            Br(bAdidas,  "Adidas",  "adidas"),
            Br(bLevis,   "Levi's",  "levis"),
            Br(bHM,      "H&M",     "hm"),
            Br(bSamsung, "Samsung", "samsung"),
            Br(bApple,   "Apple",   "apple"),
            Br(bZara,    "Zara",    "zara"),
            Br(bBata,    "Bata",    "bata"),
            Br(bLakme,   "Lakmé",   "lakme")
        );

        var products = new List<Product>();
        int img = 10; // picsum seed offset

        // ── Men (20) ──────────────────────────────────────────────────────────
        AddBatch(products, catMen, ref img, new[]
        {
            P("Classic Polo T-Shirt",         "Relaxed fit cotton polo.",            999m,  799m,  bNike,   "S,M,L,XL",    "Black,White,Navy"),
            P("Slim Fit Chinos",              "Stretch twill chinos.",               1499m, 1199m, bLevis,  "30,32,34,36", "Khaki,Olive,Black"),
            P("Casual Linen Shirt",           "Breathable linen shirt.",             1299m, null,  bHM,     "S,M,L,XL",    "White,Blue,Pink"),
            P("Jogger Pants",                 "Comfortable joggers.",                 899m,  699m,  bPuma,   "S,M,L,XL",    "Grey,Black,Navy"),
            P("Graphic Print Tee",            "100% cotton graphic tee.",             599m,  null,  bNike,   "S,M,L,XL",    "White,Black,Red"),
            P("Denim Jacket",                 "Classic denim jacket.",               2499m, 1999m, bLevis,  "S,M,L,XL",    "Blue,Dark Blue"),
            P("Formal Dress Shirt",           "Easy-iron formal shirt.",             1799m, 1499m, bZara,   "S,M,L,XL",    "White,Light Blue"),
            P("Track Pants",                  "Moisture-wicking track pants.",        799m,  649m,  bAdidas, "S,M,L,XL",    "Black,Navy,Red"),
            P("Hoodie Sweatshirt",            "Fleece pullover hoodie.",             1599m, 1299m, bNike,   "S,M,L,XL",    "Grey,Black,Blue"),
            P("Cargo Shorts",                 "Multi-pocket cargo shorts.",           999m,  799m,  bHM,     "30,32,34,36", "Olive,Khaki,Black"),
            P("Cotton Crew Neck Sweater",     "Soft crew-neck pullover.",            1399m, null,  bZara,   "S,M,L,XL",    "Beige,Grey,Navy"),
            P("Slim Fit Jeans",               "Stretch slim-fit denim.",             1899m, 1499m, bLevis,  "30,32,34,36", "Blue,Dark Blue,Black"),
            P("Bomber Jacket",                "Lightweight bomber jacket.",          2999m, 2499m, bAdidas, "S,M,L,XL",    "Black,Olive,Navy"),
            P("Sports T-Shirt",               "DryFit sports tee.",                   699m,  549m,  bPuma,   "S,M,L,XL",    "Red,Black,Blue"),
            P("Ethnic Kurta",                 "Cotton printed kurta.",               1299m,  999m,  bHM,     "S,M,L,XL",    "White,Beige,Blue"),
            P("Printed Bermuda",              "Casual printed shorts.",               799m,  649m,  bNike,   "30,32,34,36", "Navy,White,Red"),
            P("Waistcoat Blazer Set",         "Semi-formal blazer.",                 3499m, 2999m, bZara,   "S,M,L,XL",    "Black,Navy,Charcoal"),
            P("Round Neck T-Shirt 5-Pack",    "Everyday basics pack.",               1299m,  999m,  bHM,     "S,M,L,XL",    "White,Black"),
            P("Thermal Innerwear Set",        "Warm thermal top and bottom.",         999m,  799m,  bPuma,   "S,M,L,XL",    "Black,White"),
            P("Athleisure Shorts",            "4-way stretch shorts.",                799m,  null,  bAdidas, "S,M,L,XL",    "Black,Blue,Red"),
        });

        // ── Women (20) ────────────────────────────────────────────────────────
        AddBatch(products, catWomen, ref img, new[]
        {
            P("Floral Wrap Dress",            "Chiffon floral wrap dress.",          1999m, 1499m, bZara,   "XS,S,M,L",    "Pink,Blue,Green"),
            P("High-Waist Jeans",             "Stretch high-waist skinny jeans.",    1899m, 1499m, bLevis,  "26,28,30,32", "Blue,Black,White"),
            P("Casual Crop Top",              "Tie-front crop top.",                  799m,  649m,  bHM,     "XS,S,M,L",    "White,Yellow,Pink"),
            P("Palazzo Pants",                "Flowy palazzo trousers.",              999m,  799m,  bZara,   "XS,S,M,L",    "Black,Navy,Maroon"),
            P("Blazer Jacket",                "Structured blazer jacket.",           2499m, 1999m, bZara,   "XS,S,M,L",    "Black,White,Camel"),
            P("Cotton Kurta",                 "Hand-block print kurta.",             1199m,  999m,  bHM,     "XS,S,M,L",    "Blue,Green,Red"),
            P("Maxi Skirt",                   "Floral print maxi skirt.",            1599m, 1299m, bZara,   "XS,S,M,L",    "Floral,Black"),
            P("Sports Bra",                   "High-impact sports bra.",              799m,  649m,  bNike,   "XS,S,M,L",    "Black,Blue,Pink"),
            P("Yoga Leggings",                "4-way stretch yoga leggings.",         999m,  799m,  bPuma,   "XS,S,M,L",    "Black,Navy,Purple"),
            P("Formal Shirt Women",           "Slim-fit formal shirt.",              1499m, 1199m, bHM,     "XS,S,M,L",    "White,Blue,Black"),
            P("Embroidered Salwar Kameez",    "Traditional embroidered set.",        2999m, 2499m, bHM,     "XS,S,M,L",    "Blue,Red,Green"),
            P("Denim Jacket Women",           "Oversized denim jacket.",             2299m, 1799m, bLevis,  "XS,S,M,L",    "Blue,Light Blue"),
            P("Shift Dress",                  "Cotton A-line shift dress.",          1399m, 1099m, bZara,   "XS,S,M,L",    "White,Stripes"),
            P("Oversized Hoodie Women",       "Cozy oversized fleece hoodie.",       1799m, 1499m, bNike,   "XS,S,M,L",    "Grey,Pink,Black"),
            P("Trench Coat",                  "Classic double-breasted trench.",     3999m, 3299m, bZara,   "XS,S,M,L",    "Beige,Black,Navy"),
            P("Ribbed Tank Top",              "Cotton ribbed tank.",                  599m,  null,  bHM,     "XS,S,M,L",    "White,Black,Nude"),
            P("Track Suit Set Women",         "Matching hoodie and pants set.",      2499m, 1999m, bAdidas, "XS,S,M,L",    "Black,Navy,Pink"),
            P("Flare Jeans",                  "70s inspired flare denim.",           2199m, 1799m, bLevis,  "26,28,30,32", "Blue,Black"),
            P("Linen Co-ord Set",             "Relaxed linen top and trouser.",      1999m, 1599m, bHM,     "XS,S,M,L",    "White,Beige,Sage"),
            P("Mini Skirt",                   "Pleated mini skirt.",                  899m,  699m,  bZara,   "XS,S,M,L",    "Black,Plaid,Camel"),
        });

        // ── Kids (10) ─────────────────────────────────────────────────────────
        AddBatch(products, catKids, ref img, new[]
        {
            P("Kids Cotton T-Shirt",          "Soft cotton printed tee.",             499m,  null,  bHM,     "2-3Y,4-5Y,6-7Y,8-9Y", "Red,Blue,Green"),
            P("Kids Denim Shorts",            "Stretch denim shorts.",                699m,  549m,  bLevis,  "2-3Y,4-5Y,6-7Y,8-9Y", "Blue,Black"),
            P("Girls Frock",                  "Cotton smocked dress.",                999m,  799m,  bHM,     "2-3Y,4-5Y,6-7Y,8-9Y", "Pink,Yellow,White"),
            P("Boys Tracksuit",               "Fleece tracksuit set.",               1299m,  999m,  bPuma,   "2-3Y,4-5Y,6-7Y,8-9Y", "Blue,Black"),
            P("Kids Hoodie",                  "Warm fleece hoodie.",                  999m,  799m,  bNike,   "2-3Y,4-5Y,6-7Y,8-9Y", "Grey,Navy,Red"),
            P("Kids Ethnic Kurta Pajama",     "Cotton kurta with pajama.",           1199m,  null,  bHM,     "2-3Y,4-5Y,6-7Y,8-9Y", "White,Blue"),
            P("Girls Leggings 3-Pack",        "Comfortable cotton leggings.",         799m,  649m,  bHM,     "2-3Y,4-5Y,6-7Y,8-9Y", "Multicolor"),
            P("Boys Cargo Shorts",            "4-pocket cargo shorts.",               699m,  549m,  bAdidas, "2-3Y,4-5Y,6-7Y,8-9Y", "Olive,Khaki"),
            P("Kids Winter Jacket",           "Padded winter jacket.",               1799m, 1399m, bNike,   "2-3Y,4-5Y,6-7Y,8-9Y", "Navy,Red,Black"),
            P("Kids Pyjama Set",              "Cotton pyjama 2-piece set.",           599m,  null,  bHM,     "2-3Y,4-5Y,6-7Y,8-9Y", "Blue,Pink,Grey"),
        });

        // ── Footwear (15) ─────────────────────────────────────────────────────
        AddBatch(products, catFootwear, ref img, new[]
        {
            P("Air Max Running Shoes",        "Cushioned running shoes.",            5999m, 4999m, bNike,   "7,8,9,10,11", "Black-White,White-Red"),
            P("Suede Sneakers",               "Retro suede casual sneakers.",        3999m, 3499m, bPuma,   "7,8,9,10,11", "White,Grey,Navy"),
            P("Ultraboost Running",           "Responsive boost midsole.",           7999m, 6999m, bAdidas, "7,8,9,10,11", "Black,White"),
            P("Classic Leather Oxford",       "Formal leather oxford shoes.",        3499m, 2999m, bBata,   "7,8,9,10,11", "Black,Tan"),
            P("Slip-on Loafers",              "Comfortable slip-on loafers.",        2499m, 1999m, bBata,   "7,8,9,10,11", "Black,Brown,Navy"),
            P("Canvas Sneakers",              "Lightweight canvas sneakers.",        1499m, 1199m, bPuma,   "7,8,9,10,11", "White,Black,Red"),
            P("Sports Sandals",               "Quick-dry sport sandals.",             999m,  799m,  bNike,   "7,8,9,10,11", "Black,Blue"),
            P("Women Heeled Pumps",           "Block heel pumps.",                   2999m, 2499m, bBata,   "5,6,7,8",     "Black,Nude,Red"),
            P("Women Ballet Flats",           "Classic ballet flats.",               1799m, 1499m, bBata,   "5,6,7,8",     "Black,Nude,Gold"),
            P("Women Wedge Sandals",          "Espadrille wedge sandals.",           2199m, 1799m, bPuma,   "5,6,7,8",     "Tan,Black,White"),
            P("Kids Sneakers",                "Velcro strap kids sneakers.",         1299m,  999m,  bNike,   "1,2,3,4,5",   "Blue,Pink,Black"),
            P("Men Ankle Boots",              "Chelsea ankle boots.",                4499m, 3699m, bBata,   "7,8,9,10,11", "Black,Brown"),
            P("Gym Training Shoes",           "Flat sole training shoes.",           3499m, 2999m, bAdidas, "7,8,9,10,11", "Black,White"),
            P("Flip Flops",                   "Comfortable beach flip flops.",        499m,  null,  bPuma,   "7,8,9,10,11", "Black,Blue,Red"),
            P("Winter Snow Boots",            "Waterproof snow boots.",              4999m, 3999m, bNike,   "7,8,9,10,11", "Black,Brown,Grey"),
        });

        // ── Electronics (20) ─────────────────────────────────────────────────
        AddBatch(products, catElectronics, ref img, new[]
        {
            P("Wireless Earbuds",             "ANC earbuds with 24h battery.",       8999m, 7499m, bSamsung, "ONE SIZE", "Black,White"),
            P("Smartwatch Pro",               "GPS fitness smartwatch.",            14999m,12999m, bSamsung, "ONE SIZE", "Black,Silver,Gold"),
            P("Bluetooth Speaker",            "360 degree sound portable speaker.", 4999m, 3999m, bSamsung, "ONE SIZE", "Black,Blue,Red"),
            P("Noise Cancelling Headphones",  "Over-ear ANC headphones.",          12999m,10999m, bApple,   "ONE SIZE", "Black,Silver,White"),
            P("USB-C Hub 7-in-1",             "Multiport USB-C hub.",               2999m, 2499m, bSamsung, "ONE SIZE", "Silver,Grey"),
            P("Wireless Charging Pad",        "15W fast wireless charger.",         1999m, 1599m, bSamsung, "ONE SIZE", "Black,White"),
            P("Phone Case Clear",             "Shockproof transparent case.",        499m,  null,  bApple,   "ONE SIZE", "Clear"),
            P("Screen Protector 2-Pack",      "Tempered glass screen guard.",        399m,  null,  bSamsung, "ONE SIZE", "Clear"),
            P("Laptop Stand Aluminium",       "Adjustable aluminium laptop stand.", 2499m, 1999m, bSamsung, "ONE SIZE", "Silver,Black"),
            P("Mechanical Keyboard",          "TKL mechanical keyboard.",           5999m, 4999m, bSamsung, "ONE SIZE", "Black,White"),
            P("Gaming Mouse",                 "16000 DPI gaming mouse.",            3499m, 2999m, bSamsung, "ONE SIZE", "Black,White"),
            P("LED Desk Lamp",                "Touch control LED lamp.",            1999m, 1599m, bSamsung, "ONE SIZE", "White,Black"),
            P("Power Bank 20000mAh",          "20000mAh dual-port power bank.",    3999m, 3299m, bSamsung, "ONE SIZE", "Black,White,Blue"),
            P("Car Phone Mount",              "Magnetic car dashboard mount.",       799m,  599m,  bSamsung, "ONE SIZE", "Black,Silver"),
            P("Smart Home Hub",               "Voice-controlled smart hub.",        7999m, 6499m, bSamsung, "ONE SIZE", "White"),
            P("Mini Projector",               "Full HD mini projector.",           19999m,16999m, bSamsung, "ONE SIZE", "Black,White"),
            P("Fitness Tracker Band",         "Heart rate and sleep tracker.",      4999m, 3999m, bSamsung, "ONE SIZE", "Black,Blue,Pink"),
            P("Portable SSD 1TB",             "USB-C portable SSD.",               8999m, 7499m, bSamsung, "ONE SIZE", "Black,Silver"),
            P("Smart LED Bulb 4-Pack",        "WiFi RGB smart bulbs.",             2999m, 2499m, bSamsung, "ONE SIZE", "White"),
            P("Webcam 1080p",                 "Full HD webcam with mic.",           3499m, 2799m, bSamsung, "ONE SIZE", "Black,White"),
        });

        // ── Beauty (15) ───────────────────────────────────────────────────────
        AddBatch(products, catBeauty, ref img, new[]
        {
            P("Matte Lipstick",               "Long-lasting matte lipstick.",        599m,  null,  bLakme,  "ONE SIZE", "Red,Nude,Pink,Berry"),
            P("Foundation SPF30",             "Lightweight foundation.",            1199m,  999m,  bLakme,  "ONE SIZE", "Ivory,Beige,Tan,Deep"),
            P("Kajal Eyeliner",               "Smudge-proof kajal.",                 299m,  null,  bLakme,  "ONE SIZE", "Black"),
            P("Mascara Volumizing",           "Extreme volume mascara.",             599m,  499m,  bLakme,  "ONE SIZE", "Black"),
            P("Face Moisturiser SPF50",       "Daily SPF50 moisturiser.",            899m,  749m,  bLakme,  "ONE SIZE", "Regular"),
            P("Vitamin C Serum",              "Brightening vitamin C serum.",       1499m, 1199m, bLakme,  "ONE SIZE", "Regular"),
            P("Eyeshadow Palette",            "12-shade nude palette.",             1299m,  999m,  bLakme,  "ONE SIZE", "Nudes,Smoky"),
            P("Compact Powder",               "Oil-control compact.",                699m,  null,  bLakme,  "ONE SIZE", "Ivory,Beige,Tan"),
            P("Blush Palette",                "3-shade blush palette.",              899m,  699m,  bLakme,  "ONE SIZE", "Peach,Rose,Berry"),
            P("Highlighter Stick",            "Glow highlighter stick.",             799m,  null,  bLakme,  "ONE SIZE", "Gold,Pink,Bronze"),
            P("Makeup Remover Wipes",         "Gentle cleansing wipes 25-pack.",    399m,  null,  bLakme,  "ONE SIZE", "Regular"),
            P("Lip Gloss",                    "High-shine lip gloss.",               449m,  null,  bLakme,  "ONE SIZE", "Clear,Pink,Red"),
            P("Setting Spray",                "Long-lasting makeup setting spray.", 799m,  649m,  bLakme,  "ONE SIZE", "Regular"),
            P("BB Cream",                     "5-in-1 tinted BB cream.",            999m,  799m,  bLakme,  "ONE SIZE", "Light,Medium,Dark"),
            P("Lip Liner Set",                "3-piece lip liner set.",              599m,  null,  bLakme,  "ONE SIZE", "Nudes,Reds"),
        });

        db.Products.AddRange(products);
        await db.SaveChangesAsync();
    }

    // ── Entity factory helpers ────────────────────────────────────────────────

    private static Category Cat(Guid id, string name, string slug) =>
        new() { Id = id, Name = name, Slug = slug };

    private static Brand Br(Guid id, string name, string slug) =>
        new() { Id = id, Name = name, Slug = slug };

    private record ProductDef(
        string  Name,
        string  Desc,
        decimal BasePrice,
        decimal? DiscPrice,
        Guid    BrandId,
        string  Sizes,   // comma-separated
        string  Colours  // comma-separated
    );

    private static ProductDef P(
        string name, string desc, decimal basePrice, decimal? discPrice,
        Guid brandId, string sizes, string colours)
        => new(name, desc, basePrice, discPrice, brandId, sizes, colours);

    private static void AddBatch(
        List<Product> list, Guid categoryId, ref int imgSeed, IEnumerable<ProductDef> defs)
    {
        foreach (var d in defs)
        {
            var productId = Guid.NewGuid();
            var slug      = Slugify(d.Name);

            var variants  = new List<ProductVariant>();
            int skuIdx    = 0;

            foreach (var size in d.Sizes.Split(','))
            foreach (var colour in d.Colours.Split(','))
            {
                variants.Add(new ProductVariant
                {
                    Id            = Guid.NewGuid(),
                    ProductId     = productId,
                    Size          = size.Trim(),
                    Colour        = colour.Trim(),
                    Sku           = $"{slug}-{skuIdx++}",
                    StockQuantity = 50,
                    PriceOverride = null,
                });
            }

            var images = new List<ProductImage>
            {
                new() { Id = Guid.NewGuid(), ProductId = productId, Url = $"https://picsum.photos/seed/{imgSeed}/600/600",     DisplayOrder = 0, IsPrimary = true  },
                new() { Id = Guid.NewGuid(), ProductId = productId, Url = $"https://picsum.photos/seed/{imgSeed + 1}/600/600", DisplayOrder = 1, IsPrimary = false },
            };
            imgSeed += 2;

            list.Add(new Product
            {
                Id              = productId,
                Name            = d.Name,
                Slug            = slug,
                Description     = d.Desc,
                BasePrice       = d.BasePrice,
                DiscountedPrice = d.DiscPrice,
                CategoryId      = categoryId,
                BrandId         = d.BrandId,
                AverageRating   = Math.Round(3.5 + Random.Shared.NextDouble() * 1.5, 1),
                ReviewCount     = Random.Shared.Next(10, 500),
                IsActive        = true,
                Variants        = variants,
                Images          = images,
            });
        }
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
