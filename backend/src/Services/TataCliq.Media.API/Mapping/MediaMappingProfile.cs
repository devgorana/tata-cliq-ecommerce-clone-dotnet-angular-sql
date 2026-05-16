using AutoMapper;
using TataCliq.Infrastructure.Entities.Media;
using TataCliq.Media.API.DTOs;

namespace TataCliq.Media.API.Mapping;

public class MediaMappingProfile : Profile
{
    public MediaMappingProfile()
    {
        CreateMap<MediaFile, MediaDto>()
            .ConstructUsing(src => new MediaDto(
                src.Id,
                src.FileName,
                src.OriginalFileName,
                src.ContentType,
                src.SizeBytes,
                src.StorageUrl,
                src.ThumbnailUrl,
                src.Type.ToString(),
                src.AltText,
                src.CreatedAt
            ));
    }
}
