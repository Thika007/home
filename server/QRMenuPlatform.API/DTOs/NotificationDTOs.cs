namespace QRMenuPlatform.API.DTOs;

public class NotificationResponse
{
    public int Id { get; set; }
    public int? UserId { get; set; }
    public string? GuestIdentifier { get; set; }
    public int RestaurantId { get; set; }
    public int? OrderId { get; set; }
    public string Type { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public bool IsRead { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class UnreadCountResponse
{
    public int Count { get; set; }
}

