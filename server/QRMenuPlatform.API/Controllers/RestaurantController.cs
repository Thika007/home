using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QRMenuPlatform.API.Data;
using QRMenuPlatform.API.DTOs;
using QRMenuPlatform.API.Models;
using System.Security.Claims;
using System.Text.Json;

namespace QRMenuPlatform.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Owner")]
public class RestaurantController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IWebHostEnvironment _environment;
    private readonly ILogger<RestaurantController> _logger;

    public RestaurantController(
        ApplicationDbContext context,
        IWebHostEnvironment environment,
        ILogger<RestaurantController> logger)
    {
        _context = context;
        _environment = environment;
        _logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> GetRestaurant()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(new { message = "User not found" });
        }

        var owner = await _context.RestaurantOwners
            .Include(ro => ro.User)
            .Include(ro => ro.Restaurant)
                .ThenInclude(r => r!.Settings)
            .Include(ro => ro.Restaurant)
                .ThenInclude(r => r!.OperatingHours)
            .FirstOrDefaultAsync(ro => ro.UserId == userId);

        if (owner == null || owner.Restaurant == null)
        {
            return NotFound(new { message = "Restaurant not found" });
        }

        var restaurant = owner.Restaurant;
        var settings = restaurant.Settings;

        // Parse OrderSettings JSON
        OrderSettingsResponse? orderSettings = null;
        if (!string.IsNullOrEmpty(settings?.OrderSettings))
        {
            try
            {
                var orderSettingsObj = JsonSerializer.Deserialize<OrderSettingsResponse>(settings.OrderSettings);
                orderSettings = orderSettingsObj;
            }
            catch
            {
                orderSettings = new OrderSettingsResponse();
            }
        }

        // Parse Languages JSON
        var languages = new List<string>();
        if (!string.IsNullOrEmpty(settings?.Languages))
        {
            try
            {
                languages = JsonSerializer.Deserialize<List<string>>(settings.Languages) ?? new List<string>();
            }
            catch
            {
                languages = new List<string> { settings?.DefaultLanguage ?? "English" };
            }
        }

        var operatingHours = restaurant.OperatingHours.Select(oh => new OperatingHourResponse
        {
            Day = oh.Day,
            Time = oh.Time,
            IsOpen = oh.IsOpen
        }).ToList();

        var response = new RestaurantResponse
        {
            Id = restaurant.Id,
            Name = restaurant.Name,
            Tagline = restaurant.Tagline,
            Description = restaurant.Description,
            Address = restaurant.Address,
            ContactEmail = restaurant.ContactEmail,
            ContactPhone = restaurant.ContactPhone,
            LogoUrl = restaurant.LogoUrl,
            HeroImageUrl = restaurant.HeroImageUrl,
            AboutImageUrl = restaurant.AboutImageUrl,
            AboutTitle = restaurant.AboutTitle,
            AboutBody = restaurant.AboutBody,
            WhyChooseUsTitle = restaurant.WhyChooseUsTitle,
            WhyChooseUsBody = restaurant.WhyChooseUsBody,
            WhyChooseUsImageUrl = restaurant.WhyChooseUsImageUrl,
            CreatedAt = restaurant.CreatedAt,
            UpdatedAt = restaurant.UpdatedAt,
            OperatingHours = operatingHours,
            Settings = settings != null ? new RestaurantSettingsResponse
            {
                Id = settings.Id,
                Currency = settings.Currency,
                DefaultLanguage = settings.DefaultLanguage,
                Languages = languages,
                DefaultFoodImage = settings.DefaultFoodImage,
                OrderSettings = orderSettings ?? new OrderSettingsResponse()
            } : null
        };

        return Ok(response);
    }

    [HttpPut]
    public async Task<IActionResult> UpdateRestaurant([FromBody] UpdateRestaurantRequest request)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(new { message = "User not found" });
        }

        var owner = await _context.RestaurantOwners
            .Include(ro => ro.Restaurant)
            .FirstOrDefaultAsync(ro => ro.UserId == userId);

        if (owner == null || owner.Restaurant == null)
        {
            return NotFound(new { message = "Restaurant not found" });
        }

        var restaurant = owner.Restaurant;

        restaurant.Name = request.Name;
        restaurant.Tagline = request.Tagline;
        restaurant.Description = request.Description;
        restaurant.Address = request.Address;
        restaurant.ContactEmail = request.ContactEmail;
        restaurant.ContactPhone = request.ContactPhone;
        restaurant.AboutTitle = request.AboutTitle;
        restaurant.AboutBody = request.AboutBody;
        restaurant.WhyChooseUsTitle = request.WhyChooseUsTitle;
        restaurant.WhyChooseUsBody = request.WhyChooseUsBody;
        restaurant.WhyChooseUsImageUrl = request.WhyChooseUsImageUrl;
        restaurant.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return Ok(new { message = "Restaurant updated successfully" });
    }

    [HttpPost("upload-logo")]
    public async Task<IActionResult> UploadLogo(IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            return BadRequest(new { message = "No file uploaded" });
        }

        // Validate file type
        var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
        var fileExtension = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!allowedExtensions.Contains(fileExtension))
        {
            return BadRequest(new { message = "Invalid file type. Only images are allowed." });
        }

        // Validate file size (max 5MB)
        if (file.Length > 5 * 1024 * 1024)
        {
            return BadRequest(new { message = "File size exceeds 5MB limit" });
        }

        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(new { message = "User not found" });
        }

        var owner = await _context.RestaurantOwners
            .Include(ro => ro.Restaurant)
            .FirstOrDefaultAsync(ro => ro.UserId == userId);

        if (owner == null || owner.Restaurant == null)
        {
            return NotFound(new { message = "Restaurant not found" });
        }

        var restaurantId = owner.Restaurant.Id;
        var uploadsFolder = Path.Combine(_environment.WebRootPath ?? _environment.ContentRootPath, "uploads", "restaurants", restaurantId.ToString());
        
        if (!Directory.Exists(uploadsFolder))
        {
            Directory.CreateDirectory(uploadsFolder);
        }

        var fileName = $"logo_{Guid.NewGuid()}{fileExtension}";
        var filePath = Path.Combine(uploadsFolder, fileName);
        var relativeUrl = $"/uploads/restaurants/{restaurantId}/{fileName}";

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        // Update restaurant logo URL
        owner.Restaurant.LogoUrl = relativeUrl;
        owner.Restaurant.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return Ok(new ImageUploadResponse
        {
            ImageUrl = relativeUrl,
            Message = "Logo uploaded successfully"
        });
    }

    [HttpPost("upload-cover")]
    public async Task<IActionResult> UploadCover(IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            return BadRequest(new { message = "No file uploaded" });
        }

        // Validate file type
        var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
        var fileExtension = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!allowedExtensions.Contains(fileExtension))
        {
            return BadRequest(new { message = "Invalid file type. Only images are allowed." });
        }

        // Validate file size (max 5MB)
        if (file.Length > 5 * 1024 * 1024)
        {
            return BadRequest(new { message = "File size exceeds 5MB limit" });
        }

        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(new { message = "User not found" });
        }

        var owner = await _context.RestaurantOwners
            .Include(ro => ro.Restaurant)
            .FirstOrDefaultAsync(ro => ro.UserId == userId);

        if (owner == null || owner.Restaurant == null)
        {
            return NotFound(new { message = "Restaurant not found" });
        }

        var restaurantId = owner.Restaurant.Id;
        var uploadsFolder = Path.Combine(_environment.WebRootPath ?? _environment.ContentRootPath, "uploads", "restaurants", restaurantId.ToString());
        
        if (!Directory.Exists(uploadsFolder))
        {
            Directory.CreateDirectory(uploadsFolder);
        }

        var fileName = $"cover_{Guid.NewGuid()}{fileExtension}";
        var filePath = Path.Combine(uploadsFolder, fileName);
        var relativeUrl = $"/uploads/restaurants/{restaurantId}/{fileName}";

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        // Update restaurant hero image URL
        owner.Restaurant.HeroImageUrl = relativeUrl;
        owner.Restaurant.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return Ok(new ImageUploadResponse
        {
            ImageUrl = relativeUrl,
            Message = "Cover image uploaded successfully"
        });
    }

    [HttpGet("settings")]
    public async Task<IActionResult> GetRestaurantSettings()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(new { message = "User not found" });
        }

        var owner = await _context.RestaurantOwners
            .Include(ro => ro.Restaurant)
                .ThenInclude(r => r!.Settings)
            .FirstOrDefaultAsync(ro => ro.UserId == userId);

        if (owner == null || owner.Restaurant == null || owner.Restaurant.Settings == null)
        {
            return NotFound(new { message = "Restaurant settings not found" });
        }

        var settings = owner.Restaurant.Settings;

        // Parse OrderSettings JSON
        OrderSettingsResponse? orderSettings = null;
        if (!string.IsNullOrEmpty(settings.OrderSettings))
        {
            try
            {
                orderSettings = JsonSerializer.Deserialize<OrderSettingsResponse>(settings.OrderSettings);
            }
            catch
            {
                orderSettings = new OrderSettingsResponse();
            }
        }

        // Parse Languages JSON
        var languages = new List<string>();
        if (!string.IsNullOrEmpty(settings.Languages))
        {
            try
            {
                languages = JsonSerializer.Deserialize<List<string>>(settings.Languages) ?? new List<string>();
            }
            catch
            {
                languages = new List<string> { settings.DefaultLanguage };
            }
        }

        var response = new RestaurantSettingsResponse
        {
            Id = settings.Id,
            Currency = settings.Currency,
            DefaultLanguage = settings.DefaultLanguage,
            Languages = languages,
            DefaultFoodImage = settings.DefaultFoodImage,
            OrderSettings = orderSettings ?? new OrderSettingsResponse()
        };

        return Ok(response);
    }

    [HttpPut("settings")]
    public async Task<IActionResult> UpdateRestaurantSettings([FromBody] UpdateRestaurantSettingsRequest request)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(new { message = "User not found" });
        }

        var owner = await _context.RestaurantOwners
            .Include(ro => ro.Restaurant)
                .ThenInclude(r => r!.Settings)
            .FirstOrDefaultAsync(ro => ro.UserId == userId);

        if (owner == null || owner.Restaurant == null || owner.Restaurant.Settings == null)
        {
            return NotFound(new { message = "Restaurant settings not found" });
        }

        var settings = owner.Restaurant.Settings;

        settings.Currency = request.Currency;
        settings.DefaultLanguage = request.DefaultLanguage;
        settings.Languages = JsonSerializer.Serialize(request.Languages);
        settings.DefaultFoodImage = request.DefaultFoodImage;
        settings.OrderSettings = JsonSerializer.Serialize(request.OrderSettings);
        settings.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return Ok(new { message = "Restaurant settings updated successfully" });
    }

    [HttpPost("upload-about-image")]
    public async Task<IActionResult> UploadAboutImage(IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            return BadRequest(new { message = "No file uploaded" });
        }

        // Validate file type
        var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
        var fileExtension = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!allowedExtensions.Contains(fileExtension))
        {
            return BadRequest(new { message = "Invalid file type. Only images are allowed." });
        }

        // Validate file size (max 5MB)
        if (file.Length > 5 * 1024 * 1024)
        {
            return BadRequest(new { message = "File size exceeds 5MB limit" });
        }

        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(new { message = "User not found" });
        }

        var owner = await _context.RestaurantOwners
            .Include(ro => ro.Restaurant)
            .FirstOrDefaultAsync(ro => ro.UserId == userId);

        if (owner == null || owner.Restaurant == null)
        {
            return NotFound(new { message = "Restaurant not found" });
        }

        var restaurantId = owner.Restaurant.Id;
        var uploadsFolder = Path.Combine(_environment.WebRootPath ?? _environment.ContentRootPath, "uploads", "restaurants", restaurantId.ToString());
        
        if (!Directory.Exists(uploadsFolder))
        {
            Directory.CreateDirectory(uploadsFolder);
        }

        var fileName = $"about_{Guid.NewGuid()}{fileExtension}";
        var filePath = Path.Combine(uploadsFolder, fileName);
        var relativeUrl = $"/uploads/restaurants/{restaurantId}/{fileName}";

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        // Update restaurant about image URL
        owner.Restaurant.AboutImageUrl = relativeUrl;
        owner.Restaurant.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return Ok(new ImageUploadResponse
        {
            ImageUrl = relativeUrl,
            Message = "About image uploaded successfully"
        });
    }

    [HttpPost("upload-why-choose-us-image")]
    public async Task<IActionResult> UploadWhyChooseUsImage(IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            return BadRequest(new { message = "No file uploaded" });
        }

        // Validate file type
        var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
        var fileExtension = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!allowedExtensions.Contains(fileExtension))
        {
            return BadRequest(new { message = "Invalid file type. Only images are allowed." });
        }

        // Validate file size (max 5MB)
        if (file.Length > 5 * 1024 * 1024)
        {
            return BadRequest(new { message = "File size exceeds 5MB limit" });
        }

        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(new { message = "User not found" });
        }

        var owner = await _context.RestaurantOwners
            .Include(ro => ro.Restaurant)
            .FirstOrDefaultAsync(ro => ro.UserId == userId);

        if (owner == null || owner.Restaurant == null)
        {
            return NotFound(new { message = "Restaurant not found" });
        }

        var restaurantId = owner.Restaurant.Id;
        var uploadsFolder = Path.Combine(_environment.WebRootPath ?? _environment.ContentRootPath, "uploads", "restaurants", restaurantId.ToString());
        
        if (!Directory.Exists(uploadsFolder))
        {
            Directory.CreateDirectory(uploadsFolder);
        }

        var fileName = $"why-choose-us_{Guid.NewGuid()}{fileExtension}";
        var filePath = Path.Combine(uploadsFolder, fileName);
        var relativeUrl = $"/uploads/restaurants/{restaurantId}/{fileName}";

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        // Update restaurant WhyChooseUs image URL
        owner.Restaurant.WhyChooseUsImageUrl = relativeUrl;
        owner.Restaurant.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return Ok(new ImageUploadResponse
        {
            ImageUrl = relativeUrl,
            Message = "Why Choose Us image uploaded successfully"
        });
    }

    [HttpGet("operating-hours")]
    public async Task<IActionResult> GetOperatingHours()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(new { message = "User not found" });
        }

        var owner = await _context.RestaurantOwners
            .Include(ro => ro.Restaurant)
                .ThenInclude(r => r!.OperatingHours)
            .FirstOrDefaultAsync(ro => ro.UserId == userId);

        if (owner == null || owner.Restaurant == null)
        {
            return NotFound(new { message = "Restaurant not found" });
        }

        var operatingHours = owner.Restaurant.OperatingHours.Select(oh => new OperatingHourResponse
        {
            Day = oh.Day,
            Time = oh.Time,
            IsOpen = oh.IsOpen
        }).ToList();

        return Ok(operatingHours);
    }

    [HttpPut("operating-hours")]
    public async Task<IActionResult> UpdateOperatingHours([FromBody] List<OperatingHourRequest> requests)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(new { message = "User not found" });
        }

        var owner = await _context.RestaurantOwners
            .Include(ro => ro.Restaurant)
                .ThenInclude(r => r!.OperatingHours)
            .FirstOrDefaultAsync(ro => ro.UserId == userId);

        if (owner == null || owner.Restaurant == null)
        {
            return NotFound(new { message = "Restaurant not found" });
        }

        // Remove existing operating hours
        _context.OperatingHours.RemoveRange(owner.Restaurant.OperatingHours);

        // Add new operating hours
        foreach (var request in requests)
        {
            var operatingHour = new OperatingHour
            {
                RestaurantId = owner.Restaurant.Id,
                Day = request.Day,
                Time = request.Time,
                IsOpen = request.IsOpen
            };
            _context.OperatingHours.Add(operatingHour);
        }

        owner.Restaurant.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return Ok(new { message = "Operating hours updated successfully" });
    }

    [HttpGet("public/{restaurantId}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetPublicRestaurantInfo(int restaurantId)
    {
        var restaurant = await _context.Restaurants
            .Include(r => r.OperatingHours)
            .FirstOrDefaultAsync(r => r.Id == restaurantId);

        if (restaurant == null)
        {
            return NotFound(new { message = "Restaurant not found" });
        }

        // Get base URL for images
        var baseUrl = $"{Request.Scheme}://{Request.Host}";

        var operatingHours = restaurant.OperatingHours.Select(oh => new OperatingHourResponse
        {
            Day = oh.Day,
            Time = oh.Time,
            IsOpen = oh.IsOpen
        }).ToList();

        var response = new PublicRestaurantResponse
        {
            Id = restaurant.Id,
            Name = restaurant.Name,
            Tagline = restaurant.Tagline,
            Description = restaurant.Description,
            LogoUrl = restaurant.LogoUrl != null ? $"{baseUrl}{restaurant.LogoUrl}" : null,
            HeroImageUrl = restaurant.HeroImageUrl != null ? $"{baseUrl}{restaurant.HeroImageUrl}" : null,
            AboutImageUrl = restaurant.AboutImageUrl != null ? $"{baseUrl}{restaurant.AboutImageUrl}" : null,
            AboutTitle = restaurant.AboutTitle,
            AboutBody = restaurant.AboutBody,
            WhyChooseUsTitle = restaurant.WhyChooseUsTitle,
            WhyChooseUsBody = restaurant.WhyChooseUsBody,
            WhyChooseUsImageUrl = restaurant.WhyChooseUsImageUrl != null ? $"{baseUrl}{restaurant.WhyChooseUsImageUrl}" : null,
            ContactEmail = restaurant.ContactEmail,
            ContactPhone = restaurant.ContactPhone,
            OperatingHours = operatingHours
        };

        return Ok(response);
    }
}

