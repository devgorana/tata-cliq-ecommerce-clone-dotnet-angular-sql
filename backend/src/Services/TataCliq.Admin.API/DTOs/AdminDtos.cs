namespace TataCliq.Admin.API.DTOs;

public record AdminOrderDto(
    Guid     Id,
    string   OrderNumber,
    string   UserEmail,
    decimal  TotalAmount,
    string   Status,
    DateTime CreatedAt,
    int      ItemCount);

public record AdminUserDto(
    Guid                   Id,
    string                 Email,
    string                 FirstName,
    string                 LastName,
    IReadOnlyList<string>  Roles,
    bool                   EmailConfirmed,
    DateTime               CreatedAt);

public record AdminProductDto(
    Guid     Id,
    string   Name,
    string   BrandName,
    string   CategoryName,
    decimal  Price,
    bool     InStock,
    bool     IsActive,
    DateTime CreatedAt);

public record CreateSellerRequest(
    string FirstName,
    string LastName,
    string Email,
    string Password);

public record CreateSellerResponse(
    Guid   Id,
    string Email,
    string FirstName,
    string LastName);
