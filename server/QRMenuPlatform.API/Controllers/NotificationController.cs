using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QRMenuPlatform.API.Data;
using QRMenuPlatform.API.DTOs;
using QRMenuPlatform.API.Models;
using System.Security.Claims;

namespace QRMenuPlatform.API.Controllers;

[ApiController]
[Route("api/notifications")]
public class NotificationController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<NotificationController> _logger;

    public NotificationController(
        ApplicationDbContext context,
        ILogger<NotificationController> logger)
    {
        _context = context;
        _logger = logger;
    }

    private int? GetCurrentUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (int.TryParse(userIdClaim, out var userId))
        {
            return userId;
        }
        return null;
    }

    [HttpGet]
    public async Task<IActionResult> GetNotifications()
    {
        var userId = GetCurrentUserId();
        var guestIdentifier = Request.Cookies["guestId"];

        if (!userId.HasValue && string.IsNullOrEmpty(guestIdentifier))
        {
            return Ok(new List<NotificationResponse>()); // Return empty list for guests without identifier
        }

        var notifications = await _context.Notifications
            .Where(n => 
                (userId.HasValue && n.UserId == userId.Value) ||
                (!string.IsNullOrEmpty(guestIdentifier) && n.GuestIdentifier == guestIdentifier)
            )
            .OrderByDescending(n => n.CreatedAt)
            .Select(n => new NotificationResponse
            {
                Id = n.Id,
                UserId = n.UserId,
                GuestIdentifier = n.GuestIdentifier,
                RestaurantId = n.RestaurantId,
                OrderId = n.OrderId,
                Type = n.Type,
                Title = n.Title,
                Message = n.Message,
                IsRead = n.IsRead,
                CreatedAt = n.CreatedAt
            })
            .ToListAsync();

        return Ok(notifications);
    }

    [HttpGet("unread-count")]
    public async Task<IActionResult> GetUnreadCount()
    {
        var userId = GetCurrentUserId();
        var guestIdentifier = Request.Cookies["guestId"];

        if (!userId.HasValue && string.IsNullOrEmpty(guestIdentifier))
        {
            return Ok(new UnreadCountResponse { Count = 0 });
        }

        var count = await _context.Notifications
            .CountAsync(n => 
                !n.IsRead && (
                    (userId.HasValue && n.UserId == userId.Value) ||
                    (!string.IsNullOrEmpty(guestIdentifier) && n.GuestIdentifier == guestIdentifier)
                )
            );

        return Ok(new UnreadCountResponse { Count = count });
    }

    [HttpPut("{id}/read")]
    public async Task<IActionResult> MarkAsRead(int id)
    {
        var userId = GetCurrentUserId();
        var guestIdentifier = Request.Cookies["guestId"];

        if (!userId.HasValue && string.IsNullOrEmpty(guestIdentifier))
        {
            return Unauthorized(new { message = "User not authenticated" });
        }

        var notification = await _context.Notifications
            .FirstOrDefaultAsync(n => n.Id == id && (
                (userId.HasValue && n.UserId == userId.Value) ||
                (!string.IsNullOrEmpty(guestIdentifier) && n.GuestIdentifier == guestIdentifier)
            ));

        if (notification == null)
        {
            return NotFound(new { message = "Notification not found" });
        }

        notification.IsRead = true;
        await _context.SaveChangesAsync();

        return Ok(new { message = "Notification marked as read" });
    }

    [HttpPut("read-all")]
    public async Task<IActionResult> MarkAllAsRead()
    {
        var userId = GetCurrentUserId();
        var guestIdentifier = Request.Cookies["guestId"];

        if (!userId.HasValue && string.IsNullOrEmpty(guestIdentifier))
        {
            return Unauthorized(new { message = "User not authenticated" });
        }

        var notifications = await _context.Notifications
            .Where(n => 
                !n.IsRead && (
                    (userId.HasValue && n.UserId == userId.Value) ||
                    (!string.IsNullOrEmpty(guestIdentifier) && n.GuestIdentifier == guestIdentifier)
                )
            )
            .ToListAsync();

        foreach (var notification in notifications)
        {
            notification.IsRead = true;
        }

        await _context.SaveChangesAsync();

        return Ok(new { message = "All notifications marked as read" });
    }
}

