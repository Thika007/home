using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace QRMenuPlatform.API.Models;

public class RestaurantSettings
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    public int RestaurantId { get; set; }
    
    [ForeignKey("RestaurantId")]
    public Restaurant Restaurant { get; set; } = null!;
    
    [Required]
    [MaxLength(10)]
    public string Currency { get; set; } = "LKR";
    
    [Required]
    [MaxLength(50)]
    public string DefaultLanguage { get; set; } = "English";
    
    public string Languages { get; set; } = "[\"English\"]"; // JSON array
    
    public bool DefaultFoodImage { get; set; } = true;
    
    // Order Settings (stored as JSON)
    public string OrderSettings { get; set; } = "{\"enableTip\":true,\"enableCancelOrder\":false,\"invoicePrefix\":\"INVOICE\",\"enableInvoiceNotes\":true,\"enableScheduledOrders\":false}";
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
}

