using AutoMapper;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Moq;
using TataCliq.Catalog.API.DTOs;
using TataCliq.Catalog.API.Services;
using TataCliq.Infrastructure.Entities.Catalog;
using TataCliq.Infrastructure.Persistence;
using Xunit;

namespace TataCliq.Catalog.Tests;

public sealed class CatalogServiceTests : IDisposable
{
    private readonly AppDbContext _db;
    private readonly Mock<IMapper> _mapperMock;
    private readonly CatalogService _sut;

    public CatalogServiceTests()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        _db = new AppDbContext(options);

        _mapperMock = new Mock<IMapper>();
        _mapperMock
            .Setup(m => m.Map<ProductDto>(It.IsAny<Product>()))
            .Returns<Product>(p => new ProductDto(
                p.Id, p.Name, p.Slug,
                p.Description ?? string.Empty,
                p.BasePrice, p.DiscountedPrice,
                p.BrandId, string.Empty,
                p.CategoryId, string.Empty,
                new List<string>(),
                new List<ProductVariantDto>(),
                p.AverageRating, p.ReviewCount, p.IsActive));

        _sut = new CatalogService(_db, _mapperMock.Object);
    }

    public void Dispose() => _db.Dispose();

    private async Task<(Brand brand, Category category)> SeedAsync()
    {
        var brand    = new Brand    { Id = Guid.NewGuid(), Name = "Test Brand",    Slug = "test-brand"    };
        var category = new Category { Id = Guid.NewGuid(), Name = "Test Category", Slug = "test-category" };
        _db.Brands.Add(brand);
        _db.Categories.Add(category);
        await _db.SaveChangesAsync();
        return (brand, category);
    }

    [Fact]
    public async Task GetProductsAsync_ReturnsPagedResult()
    {
        var (brand, category) = await SeedAsync();

        _db.Products.AddRange(
            new Product { Id = Guid.NewGuid(), Name = "Product A", Slug = "product-a", BasePrice = 100, BrandId = brand.Id, CategoryId = category.Id, IsActive = true },
            new Product { Id = Guid.NewGuid(), Name = "Product B", Slug = "product-b", BasePrice = 200, BrandId = brand.Id, CategoryId = category.Id, IsActive = true }
        );
        await _db.SaveChangesAsync();

        var result = await _sut.GetProductsAsync(new ProductQueryDto { Page = 1, PageSize = 24 });

        result.TotalCount.Should().Be(2);
        result.Items.Should().HaveCount(2);
        result.Page.Should().Be(1);
        result.PageSize.Should().Be(24);
    }

    [Fact]
    public async Task GetProductAsync_ValidId_ReturnsProduct()
    {
        var (brand, category) = await SeedAsync();
        var productId = Guid.NewGuid();

        _db.Products.Add(new Product
        {
            Id = productId, Name = "My Product", Slug = "my-product",
            BasePrice = 500, BrandId = brand.Id, CategoryId = category.Id, IsActive = true
        });
        await _db.SaveChangesAsync();

        var result = await _sut.GetProductAsync(productId);

        result.Should().NotBeNull();
        result!.Id.Should().Be(productId);
        result.Name.Should().Be("My Product");
        result.Price.Should().Be(500);
    }

    [Fact]
    public async Task GetProductAsync_InvalidId_ReturnsNull()
    {
        var result = await _sut.GetProductAsync(Guid.NewGuid());

        result.Should().BeNull();
    }
}
