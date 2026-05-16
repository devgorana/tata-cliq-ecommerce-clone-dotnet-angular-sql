namespace TataCliq.Media.API.Services;

public interface IStorageService
{
    Task<string> UploadAsync(Stream fileStream, string fileName, string contentType, CancellationToken cancellationToken = default);
    Task DeleteAsync(string storageKey, CancellationToken cancellationToken = default);
    string GetPublicUrl(string storageKey);
}
