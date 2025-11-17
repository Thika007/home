using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace QRMenuPlatform.API.Models;

public class OperatingHour
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    public int RestaurantId { get; set; }
    
    [ForeignKey("RestaurantId")]
    public Restaurant Restaurant { get; set; } = null!;
    
    [Required]
    [MaxLength(20)]
    public string Day { get; set; } = string.Empty; // Monday, Tuesday, etc.
    
    [Required]
    [MaxLength(50)]
    public string Time { get; set; } = string.Empty; // "00:00 - 23:59"
    
    public bool IsOpen { get; set; } = true;
}

