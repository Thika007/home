using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace QRMenuPlatform.API.Models;

public class OrderItem
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    public int OrderId { get; set; }
    
    [ForeignKey("OrderId")]
    public Order Order { get; set; } = null!;
    
    [Required]
    public int MenuItemId { get; set; }
    
    [ForeignKey("MenuItemId")]
    public MenuItem MenuItem { get; set; } = null!;
    
    [Required]
    [MaxLength(200)]
    public string ItemName { get; set; } = string.Empty;
    
    [Required]
    public int Quantity { get; set; }
    
    [Required]
    [Column(TypeName = "decimal(18,2)")]
    public decimal UnitPrice { get; set; }
    
    [Required]
    [Column(TypeName = "decimal(18,2)")]
    public decimal TotalPrice { get; set; }
    
    [MaxLength(500)]
    public string? SpecialInstructions { get; set; }
    
    public int? PriceOptionId { get; set; }
    
    [MaxLength(100)]
    public string? PriceOptionName { get; set; }
}

