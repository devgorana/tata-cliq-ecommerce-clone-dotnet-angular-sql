using Microsoft.AspNetCore.Builder;
using TataCliq.SharedKernel.Middleware;

namespace TataCliq.SharedKernel.Extensions;

public static class ExceptionMiddlewareExtensions
{
    public static IApplicationBuilder UseExceptionMiddleware(this IApplicationBuilder app)
        => app.UseMiddleware<ExceptionMiddleware>();
}
