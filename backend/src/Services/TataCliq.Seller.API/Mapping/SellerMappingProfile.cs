using AutoMapper;
using TataCliq.Infrastructure.Entities.Seller;
using TataCliq.Seller.API.DTOs;

namespace TataCliq.Seller.API.Mapping;

public class SellerMappingProfile : Profile
{
    public SellerMappingProfile()
    {
        CreateMap<Infrastructure.Entities.Seller.Seller, SellerProfileDto>()
            .ConstructUsing(s => new SellerProfileDto(
                s.Id, s.StoreName, s.Slug, s.Description, s.LogoUrl,
                s.GstNumber, s.PanNumber, s.Status.ToString(),
                s.CommissionRate, s.ApprovedAt, s.CreatedAt));

        CreateMap<SellerPayout, PayoutDto>()
            .ConstructUsing(p => new PayoutDto(
                p.Id, p.Amount, p.Status.ToString(),
                p.TransactionReference, p.ProcessedAt,
                p.Notes, p.CreatedAt));
    }
}
