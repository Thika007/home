namespace QRMenuPlatform.API.DTOs;

public class MenuRequest
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public bool IsActive { get; set; } = true;
    public bool IsDefault { get; set; } = false;
}

public class MenuResponse
{
    public int Id { get; set; }
    public int RestaurantId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public bool IsActive { get; set; }
    public bool IsDefault { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public List<CategoryResponse>? Categories { get; set; }
}

public class CategoryRequest
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int DisplayOrder { get; set; } = 0;
    public bool IsVisible { get; set; } = true;
}

public class CategoryResponse
{
    public int Id { get; set; }
    public int MenuId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int DisplayOrder { get; set; }
    public bool IsVisible { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public List<MenuItemResponse>? MenuItems { get; set; }
}

public class MenuItemRequest
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public string? ImageUrl { get; set; }
    public bool IsAvailable { get; set; } = true;
    public bool IsVisible { get; set; } = true;
    public int DisplayOrder { get; set; } = 0;
    public List<PriceOptionRequest>? PriceOptions { get; set; }
    // Additional fields
    public string? Labels { get; set; }
    public List<string>? DisplayOn { get; set; }
    public string? Size { get; set; }
    public string? Unit { get; set; }
    public string? PreparationTime { get; set; }
    public bool Featured { get; set; } = false;
    public string? Recommended { get; set; }
    public bool MarkAsSoldOut { get; set; } = false;
}

public class PriceOptionRequest
{
    public string OptionName { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int DisplayOrder { get; set; } = 0;
}

public class MenuItemResponse
{
    public int Id { get; set; }
    public int CategoryId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public string? ImageUrl { get; set; }
    public bool IsAvailable { get; set; }
    public bool IsVisible { get; set; }
    public int DisplayOrder { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public List<PriceOptionResponse>? PriceOptions { get; set; }
    // Additional fields
    public string? Labels { get; set; }
    public List<string>? DisplayOn { get; set; }
    public string? Size { get; set; }
    public string? Unit { get; set; }
    public string? PreparationTime { get; set; }
    public bool Featured { get; set; }
    public string? Recommended { get; set; }
    public bool MarkAsSoldOut { get; set; }
}

public class PriceOptionResponse
{
    public int Id { get; set; }
    public string OptionName { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int DisplayOrder { get; set; }
}

// Public menu response for customer-facing display
public class PublicMenuResponse
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public List<PublicCategoryResponse> Categories { get; set; } = new();
}

public class PublicCategoryResponse
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public List<PublicMenuItemResponse> Items { get; set; } = new();
}

public class PublicMenuItemResponse
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public string? ImageUrl { get; set; }
    public List<PriceOptionResponse>? PriceOptions { get; set; }
    // Additional fields for user menu display
    public string? Labels { get; set; }
    public List<string>? DisplayOn { get; set; }
    public string? Size { get; set; }
    public string? Unit { get; set; }
    public string? PreparationTime { get; set; }
    public bool Featured { get; set; }
    public string? Recommended { get; set; }
    public bool MarkAsSoldOut { get; set; }
    public bool IsAvailable { get; set; }
}

