using AutoMapper;
using TataCliq.Admin.API.DTOs;
using TataCliq.Infrastructure.Entities.Admin;

namespace TataCliq.Admin.API.Mapping;

public sealed class AdminMappingProfile : Profile
{
    public AdminMappingProfile()
    {
        CreateMap<Banner, BannerDto>();
        CreateMap<CreateBannerRequest, Banner>();
        CreateMap<UpdateBannerRequest, Banner>();

        CreateMap<Coupon, CouponDto>();
        CreateMap<CreateCouponRequest, Coupon>();
        CreateMap<UpdateCouponRequest, Coupon>()
            .ForMember(dest => dest.Code, opt => opt.Ignore());
    }
}
