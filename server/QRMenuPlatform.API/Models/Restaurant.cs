using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace QRMenuPlatform.API.Models;

public class Restaurant
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    public int OwnerId { get; set; }
    
    [ForeignKey("OwnerId")]
    public RestaurantOwner Owner { get; set; } = null!;
    
    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;
    
    [MaxLength(500)]
    public string? Tagline { get; set; }
    
    [MaxLength(2000)]
    public string? Description { get; set; }
    
    [Required]
    [MaxLength(500)]
    public string Address { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(100)]
    public string ContactEmail { get; set; } = string.Empty;
    
    [MaxLength(20)]
    public string? ContactPhone { get; set; }
    
    [MaxLength(500)]
    public string? HeroImageUrl { get; set; }
    
    [MaxLength(500)]
    public string? AboutImageUrl { get; set; }
    
    [MaxLength(500)]
    public string? LogoUrl { get; set; }
    
    [MaxLength(200)]
    public string? AboutTitle { get; set; }
    
    [MaxLength(2000)]
    public string? AboutBody { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    
    // Navigation
    public RestaurantSettings? Settings { get; set; }
    public ICollection<OperatingHour> OperatingHours { get; set; } = new List<OperatingHour>();
    public ICollection<Menu> Menus { get; set; } = new List<Menu>();
    public ICollection<Order> Orders { get; set; } = new List<Order>();
}

