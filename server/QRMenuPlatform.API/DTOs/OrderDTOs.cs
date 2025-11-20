namespace QRMenuPlatform.API.DTOs;

public class CreateOrderRequest
{
    public int RestaurantId { get; set; }
    public string DeliveryMethod { get; set; } = "dine-in"; // "dine-in" or "takeaway"
    public string? TableNumber { get; set; }
    public int? NumberOfPassengers { get; set; }
    public string PaymentMethod { get; set; } = "cash"; // "cash" or "card"
    public decimal Subtotal { get; set; }
    public decimal TipAmount { get; set; }
    public decimal Total { get; set; }
    public string? SpecialInstructions { get; set; }
    public bool CheckoutAsGuest { get; set; } = false;
    public string? GuestName { get; set; }
    public string? GuestEmail { get; set; }
    public List<CreateOrderItemRequest> Items { get; set; } = new();
}

public class CreateOrderItemRequest
{
    public int MenuItemId { get; set; }
    public string ItemName { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal TotalPrice { get; set; }
    public string? SpecialInstructions { get; set; }
    public int? PriceOptionId { get; set; }
    public string? PriceOptionName { get; set; }
}

public class OrderResponse
{
    public int Id { get; set; }
    public string OrderId { get; set; } = string.Empty;
    public int RestaurantId { get; set; }
    public string RestaurantName { get; set; } = string.Empty;
    public int? CustomerId { get; set; }
    public string? CustomerName { get; set; }
    public string? CustomerEmail { get; set; }
    public string PaymentMethod { get; set; } = string.Empty;
    public string DeliveryMethod { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public decimal Subtotal { get; set; }
    public decimal TipAmount { get; set; }
    public decimal Total { get; set; }
    public string? SpecialInstructions { get; set; }
    public string? TableNumber { get; set; }
    public int? NumberOfPassengers { get; set; }
    public string? GuestName { get; set; }
    public string? GuestEmail { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public DateTime? ConfirmedAt { get; set; }
    public DateTime? CompletedAt { get; set; }
    public List<OrderItemResponse> Items { get; set; } = new();
}

public class OrderItemResponse
{
    public int Id { get; set; }
    public int MenuItemId { get; set; }
    public string ItemName { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal TotalPrice { get; set; }
    public string? SpecialInstructions { get; set; }
    public int? PriceOptionId { get; set; }
    public string? PriceOptionName { get; set; }
}

public class UpdateOrderStatusRequest
{
    public string Status { get; set; } = string.Empty; // "confirmed", "cancelled", "completed", etc.
}
