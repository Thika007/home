using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace QRMenuPlatform.API.Models;

public class Category
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    public int MenuId { get; set; }
    
    [ForeignKey("MenuId")]
    public Menu Menu { get; set; } = null!;
    
    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;
    
    [MaxLength(500)]
    public string? Description { get; set; }
    
    public int DisplayOrder { get; set; } = 0;
    public bool IsVisible { get; set; } = true;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    
    // Navigation
    public ICollection<MenuItem> MenuItems { get; set; } = new List<MenuItem>();
}

