using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TataCliq.User.API.Services;

namespace TataCliq.User.API.Controllers;

[ApiController]
[Route("api/v1/users/me/notifications")]
[Authorize]
public class NotificationsController(INotificationService notificationService) : ControllerBase
{
    private Guid UserId => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet]
    public async Task<IActionResult> GetNotifications(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] bool unreadOnly = false)
    {
        var notifications = await notificationService.GetNotificationsAsync(UserId, page, pageSize, unreadOnly);
        return Ok(notifications);
    }

    [HttpPost("{id:guid}/read")]
    public async Task<IActionResult> MarkRead(Guid id)
    {
        await notificationService.MarkReadAsync(UserId, id);
        return NoContent();
    }

    [HttpPost("read-all")]
    public async Task<IActionResult> MarkAllRead()
    {
        await notificationService.MarkAllReadAsync(UserId);
        return NoContent();
    }

    [HttpGet("unread-count")]
    public async Task<IActionResult> GetUnreadCount()
    {
        var count = await notificationService.GetUnreadCountAsync(UserId);
        return Ok(new { Count = count });
    }
}
