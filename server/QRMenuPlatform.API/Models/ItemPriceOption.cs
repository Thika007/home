using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace QRMenuPlatform.API.Models;

public class ItemPriceOption
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    public int MenuItemId { get; set; }
    
    [ForeignKey("MenuItemId")]
    public MenuItem MenuItem { get; set; } = null!;
    
    [Required]
    [MaxLength(100)]
    public string OptionName { get; set; } = string.Empty; // e.g., "Small", "Large"
    
    [Required]
    [Column(TypeName = "decimal(18,2)")]
    public decimal Price { get; set; }
    
    public int DisplayOrder { get; set; } = 0;
}

