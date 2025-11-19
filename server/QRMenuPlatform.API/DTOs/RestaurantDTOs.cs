namespace QRMenuPlatform.API.DTOs;

public class RestaurantResponse
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Tagline { get; set; }
    public string? Description { get; set; }
    public string Address { get; set; } = string.Empty;
    public string ContactEmail { get; set; } = string.Empty;
    public string? ContactPhone { get; set; }
    public string? LogoUrl { get; set; }
    public string? HeroImageUrl { get; set; }
    public string? AboutImageUrl { get; set; }
    public string? AboutTitle { get; set; }
    public string? AboutBody { get; set; }
    public string? WhyChooseUsTitle { get; set; }
    public string? WhyChooseUsBody { get; set; }
    public string? WhyChooseUsImageUrl { get; set; }
    public RestaurantSettingsResponse? Settings { get; set; }
    public List<OperatingHourResponse> OperatingHours { get; set; } = new();
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

public class RestaurantSettingsResponse
{
    public int Id { get; set; }
    public string Currency { get; set; } = string.Empty;
    public string DefaultLanguage { get; set; } = string.Empty;
    public List<string> Languages { get; set; } = new();
    public bool DefaultFoodImage { get; set; }
    public OrderSettingsResponse OrderSettings { get; set; } = new();
}

public class OrderSettingsResponse
{
    public bool EnableTip { get; set; }
    public bool EnableCancelOrder { get; set; }
    public string InvoicePrefix { get; set; } = string.Empty;
    public bool EnableInvoiceNotes { get; set; }
    public bool EnableScheduledOrders { get; set; }
}

public class UpdateRestaurantRequest
{
    public string Name { get; set; } = string.Empty;
    public string? Tagline { get; set; }
    public string? Description { get; set; }
    public string Address { get; set; } = string.Empty;
    public string ContactEmail { get; set; } = string.Empty;
    public string? ContactPhone { get; set; }
    public string? AboutTitle { get; set; }
    public string? AboutBody { get; set; }
    public string? WhyChooseUsTitle { get; set; }
    public string? WhyChooseUsBody { get; set; }
    public string? WhyChooseUsImageUrl { get; set; }
}

public class UpdateRestaurantSettingsRequest
{
    public string Currency { get; set; } = string.Empty;
    public string DefaultLanguage { get; set; } = string.Empty;
    public List<string> Languages { get; set; } = new();
    public bool DefaultFoodImage { get; set; }
    public OrderSettingsRequest OrderSettings { get; set; } = new();
}

public class OrderSettingsRequest
{
    public bool EnableTip { get; set; }
    public bool EnableCancelOrder { get; set; }
    public string InvoicePrefix { get; set; } = string.Empty;
    public bool EnableInvoiceNotes { get; set; }
    public bool EnableScheduledOrders { get; set; }
}

public class UpdateUserProfileRequest
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string? Phone { get; set; }
}

public class ImageUploadResponse
{
    public string ImageUrl { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
}

public class PublicRestaurantResponse
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Tagline { get; set; }
    public string? Description { get; set; }
    public string? LogoUrl { get; set; }
    public string? HeroImageUrl { get; set; }
    public string? AboutImageUrl { get; set; }
    public string? AboutTitle { get; set; }
    public string? AboutBody { get; set; }
    public string? WhyChooseUsTitle { get; set; }
    public string? WhyChooseUsBody { get; set; }
    public string? WhyChooseUsImageUrl { get; set; }
    public string ContactEmail { get; set; } = string.Empty;
    public string? ContactPhone { get; set; }
    public List<OperatingHourResponse> OperatingHours { get; set; } = new();
}

public class OperatingHourResponse
{
    public string Day { get; set; } = string.Empty;
    public string Time { get; set; } = string.Empty;
    public bool IsOpen { get; set; }
}

public class OperatingHourRequest
{
    public string Day { get; set; } = string.Empty;
    public string Time { get; set; } = string.Empty;
    public bool IsOpen { get; set; }
}

