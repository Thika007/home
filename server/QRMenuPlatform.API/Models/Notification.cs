using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace QRMenuPlatform.API.Models;

public class Notification
{
    [Key]
    public int Id { get; set; }
    
    public int? UserId { get; set; } // Nullable for guest notifications
    
    [ForeignKey("UserId")]
    public User? User { get; set; }
    
    [MaxLength(100)]
    public string? GuestIdentifier { get; set; } // Cookie-based identifier for guest users
    
    [Required]
    public int RestaurantId { get; set; }
    
    [ForeignKey("RestaurantId")]
    public Restaurant Restaurant { get; set; } = null!;
    
    public int? OrderId { get; set; } // Nullable for non-order notifications
    
    [ForeignKey("OrderId")]
    public Order? Order { get; set; }
    
    [Required]
    [MaxLength(50)]
    public string Type { get; set; } = string.Empty; // "order_confirmed", "order_cancelled", "order_pending", etc.
    
    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(1000)]
    public string Message { get; set; } = string.Empty;
    
    [Required]
    public bool IsRead { get; set; } = false;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

