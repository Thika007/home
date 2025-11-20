using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace QRMenuPlatform.API.Models;

public class MenuItem
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    public int CategoryId { get; set; }
    
    [ForeignKey("CategoryId")]
    public Category Category { get; set; } = null!;
    
    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;
    
    [MaxLength(1000)]
    public string? Description { get; set; }
    
    [Required]
    [Column(TypeName = "decimal(18,2)")]
    public decimal Price { get; set; }
    
    [MaxLength(500)]
    public string? ImageUrl { get; set; }
    
    public bool IsAvailable { get; set; } = true;
    public bool IsVisible { get; set; } = true;
    
    public int DisplayOrder { get; set; } = 0;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    
    // Additional fields
    [MaxLength(500)]
    public string? Labels { get; set; }
    
    [MaxLength(1000)]
    public string? DisplayOn { get; set; } // JSON serialized array
    
    [MaxLength(100)]
    public string? Size { get; set; }
    
    [MaxLength(50)]
    public string? Unit { get; set; }
    
    [MaxLength(50)]
    public string? PreparationTime { get; set; }
    
    public bool Featured { get; set; } = false;
    
    [MaxLength(200)]
    public string? Recommended { get; set; }
    
    public bool MarkAsSoldOut { get; set; } = false;
    
    // Future fields (for next version)
    [MaxLength(500)]
    public string? IngredientWarnings { get; set; }
    
    [MaxLength(200)]
    public string? TaxCategories { get; set; }
    
    // Navigation
    public ICollection<ItemPriceOption> PriceOptions { get; set; } = new List<ItemPriceOption>();
    public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
}

