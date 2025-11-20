using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace QRMenuPlatform.API.Models;

public class Order
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    [MaxLength(50)]
    public string OrderId { get; set; } = string.Empty; // Invoice ID
    
    [Required]
    public int RestaurantId { get; set; }
    
    [ForeignKey("RestaurantId")]
    public Restaurant Restaurant { get; set; } = null!;
    
    public int? CustomerId { get; set; }
    
    [ForeignKey("CustomerId")]
    public Customer? Customer { get; set; }
    
    [Required]
    [MaxLength(20)]
    public string PaymentMethod { get; set; } = "pending"; // cash, card, online, pending
    
    [Required]
    [MaxLength(20)]
    public string DeliveryMethod { get; set; } = "dine-in"; // pickup, delivery, dine-in
    
    [Required]
    [MaxLength(20)]
    public string Status { get; set; } = "pending"; // pending, confirmed, rejected, completed, cancelled
    
    [Column(TypeName = "decimal(18,2)")]
    public decimal Subtotal { get; set; }
    
    [Column(TypeName = "decimal(18,2)")]
    public decimal TipAmount { get; set; }
    
    [Column(TypeName = "decimal(18,2)")]
    public decimal Total { get; set; }
    
    [MaxLength(500)]
    public string? SpecialInstructions { get; set; }
    
    [MaxLength(50)]
    public string? TableNumber { get; set; }
    
    public int? NumberOfPassengers { get; set; }
    
    [MaxLength(100)]
    public string? GuestName { get; set; }
    
    [MaxLength(100)]
    public string? GuestEmail { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    public DateTime? ConfirmedAt { get; set; }
    public DateTime? CompletedAt { get; set; }
    
    // Navigation
    public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
}

