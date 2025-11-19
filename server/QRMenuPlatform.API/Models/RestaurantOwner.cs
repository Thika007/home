using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace QRMenuPlatform.API.Models;

public class RestaurantOwner
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    public int UserId { get; set; }
    
    [ForeignKey("UserId")]
    public User User { get; set; } = null!;
    
    public bool IsApproved { get; set; } = false;
    public DateTime? ApprovedAt { get; set; }
    public int? ApprovedBy { get; set; } // SystemAdmin Id
    
    [MaxLength(500)]
    public string? ProfilePictureUrl { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation
    public Restaurant? Restaurant { get; set; }
}

