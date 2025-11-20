using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QRMenuPlatform.API.Data;
using QRMenuPlatform.API.DTOs;
using QRMenuPlatform.API.Models;
using QRMenuPlatform.API.Services;
using System.Security.Claims;

namespace QRMenuPlatform.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IEmailService _emailService;
    private readonly ILogger<AuthController> _logger;
    private readonly IWebHostEnvironment _environment;

    public AuthController(
        ApplicationDbContext context,
        IEmailService emailService,
        ILogger<AuthController> logger,
        IWebHostEnvironment environment)
    {
        _context = context;
        _emailService = emailService;
        _logger = logger;
        _environment = environment;
    }

    [HttpPost("register-owner")]
    public async Task<IActionResult> RegisterOwner([FromBody] RegisterOwnerRequest request)
    {
        // Check if email exists
        if (await _context.Users.AnyAsync(u => u.Email == request.Email))
        {
            return BadRequest(new { message = "Email already registered" });
        }

        // Create user
        var user = new User
        {
            Email = request.Email,
            PasswordHash = PasswordHasher.HashPassword(request.Password),
            FirstName = request.FirstName,
            LastName = request.LastName,
            Phone = request.Phone,
            Role = "Owner",
            IsEmailVerified = false,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        // Create restaurant owner
        var restaurantOwner = new RestaurantOwner
        {
            UserId = user.Id,
            IsApproved = false,
            CreatedAt = DateTime.UtcNow
        };

        _context.RestaurantOwners.Add(restaurantOwner);
        await _context.SaveChangesAsync();

        // Create restaurant
        var restaurant = new Restaurant
        {
            OwnerId = restaurantOwner.Id,
            Name = request.RestaurantName,
            Tagline = request.Tagline,
            Description = request.Description,
            Address = request.Address,
            ContactEmail = request.ContactEmail,
            ContactPhone = request.ContactPhone,
            CreatedAt = DateTime.UtcNow
        };

        _context.Restaurants.Add(restaurant);
        await _context.SaveChangesAsync();

        // Create default settings
        var settings = new RestaurantSettings
        {
            RestaurantId = restaurant.Id,
            Currency = "LKR",
            DefaultLanguage = "English",
            Languages = "[\"English\"]",
            DefaultFoodImage = true,
            OrderSettings = "{\"enableTip\":true,\"enableCancelOrder\":false,\"invoicePrefix\":\"INVOICE\",\"enableInvoiceNotes\":true,\"enableScheduledOrders\":false}",
            CreatedAt = DateTime.UtcNow
        };

        _context.RestaurantSettings.Add(settings);

        // Create default operating hours
        var days = new[] { "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday" };
        foreach (var day in days)
        {
            _context.OperatingHours.Add(new OperatingHour
            {
                RestaurantId = restaurant.Id,
                Day = day,
                Time = "00:00 - 23:59",
                IsOpen = true
            });
        }

        // Generate email verification token
        var token = Guid.NewGuid().ToString();
        var emailVerification = new EmailVerification
        {
            UserId = user.Id,
            Token = token,
            ExpiresAt = DateTime.UtcNow.AddDays(1),
            IsUsed = false
        };

        _context.EmailVerifications.Add(emailVerification);
        await _context.SaveChangesAsync();

        // Send verification email
        try
        {
            await _emailService.SendVerificationEmailAsync(user.Email, token, user.FirstName);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send verification email");
            // Continue even if email fails
        }

        return Ok(new { message = "Registration submitted successfully! Your registration is pending admin approval. You will be notified once approved." });
    }

    [HttpPost("register-customer")]
    public async Task<IActionResult> RegisterCustomer([FromBody] RegisterCustomerRequest request)
    {
        // Check if email exists
        if (await _context.Users.AnyAsync(u => u.Email == request.Email))
        {
            return BadRequest(new { message = "Email already registered" });
        }

        // Create user
        var user = new User
        {
            Email = request.Email,
            PasswordHash = PasswordHasher.HashPassword(request.Password),
            FirstName = request.FirstName,
            LastName = request.LastName,
            Phone = request.Phone,
            Role = "Customer",
            IsEmailVerified = false,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        // Create customer
        var customer = new Customer
        {
            UserId = user.Id,
            CreatedAt = DateTime.UtcNow
        };

        _context.Customers.Add(customer);
        await _context.SaveChangesAsync();

        // Generate email verification token
        var token = Guid.NewGuid().ToString();
        var emailVerification = new EmailVerification
        {
            UserId = user.Id,
            Token = token,
            ExpiresAt = DateTime.UtcNow.AddDays(1),
            IsUsed = false
        };

        _context.EmailVerifications.Add(emailVerification);
        await _context.SaveChangesAsync();

        // Send verification email
        try
        {
            await _emailService.SendVerificationEmailAsync(user.Email, token, user.FirstName);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send verification email");
            // Continue even if email fails
        }

        // Automatically log in the user after registration
        // Create claims
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Name, $"{user.FirstName} {user.LastName}"),
            new Claim(ClaimTypes.Role, user.Role)
        };

        var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
        var authProperties = new AuthenticationProperties
        {
            IsPersistent = true,
            ExpiresUtc = DateTimeOffset.UtcNow.AddDays(7)
        };

        await HttpContext.SignInAsync(
            CookieAuthenticationDefaults.AuthenticationScheme,
            new ClaimsPrincipal(claimsIdentity),
            authProperties);

        // Return LoginResponse for frontend
        var response = new LoginResponse
        {
            UserId = user.Id,
            Email = user.Email,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Role = user.Role,
            IsEmailVerified = user.IsEmailVerified,
            IsApproved = false, // Customers don't need approval
            RestaurantId = null // Customers don't have restaurants
        };

        return Ok(response);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var user = await _context.Users
            .Include(u => u.RestaurantOwner)
                .ThenInclude(ro => ro.Restaurant)
            .FirstOrDefaultAsync(u => u.Email == request.Email);

        if (user == null || !PasswordHasher.VerifyPassword(request.Password, user.PasswordHash))
        {
            return Unauthorized(new { message = "Invalid email or password" });
        }

        if (!user.IsActive)
        {
            return Unauthorized(new { message = "Account is deactivated" });
        }

        if (user.Role == "Owner" && user.RestaurantOwner != null && !user.RestaurantOwner.IsApproved)
        {
            return Unauthorized(new { message = "Your account is pending admin approval" });
        }

        // Create claims
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Name, $"{user.FirstName} {user.LastName}"),
            new Claim(ClaimTypes.Role, user.Role)
        };

        var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
        var authProperties = new AuthenticationProperties
        {
            IsPersistent = true,
            ExpiresUtc = DateTimeOffset.UtcNow.AddDays(7)
        };

        await HttpContext.SignInAsync(
            CookieAuthenticationDefaults.AuthenticationScheme,
            new ClaimsPrincipal(claimsIdentity),
            authProperties);

        // Get restaurant ID for owners
        int? restaurantId = null;
        if (user.Role == "Owner" && user.RestaurantOwner?.Restaurant != null)
        {
            restaurantId = user.RestaurantOwner.Restaurant.Id;
        }

        var response = new LoginResponse
        {
            UserId = user.Id,
            Email = user.Email,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Role = user.Role,
            IsEmailVerified = user.IsEmailVerified,
            IsApproved = user.RestaurantOwner?.IsApproved ?? false,
            RestaurantId = restaurantId
        };

        return Ok(response);
    }

    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        return Ok(new { message = "Logged out successfully" });
    }

    [HttpGet("me")]
    public async Task<IActionResult> GetCurrentUser()
    {
        if (!User.Identity?.IsAuthenticated ?? true)
        {
            return Unauthorized();
        }

        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized();
        }

        var user = await _context.Users
            .Include(u => u.RestaurantOwner)
                .ThenInclude(ro => ro.Restaurant)
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null)
        {
            return Unauthorized();
        }

        // Get restaurant ID for owners
        int? restaurantId = null;
        if (user.Role == "Owner" && user.RestaurantOwner?.Restaurant != null)
        {
            restaurantId = user.RestaurantOwner.Restaurant.Id;
        }

        var response = new LoginResponse
        {
            UserId = user.Id,
            Email = user.Email,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Role = user.Role,
            IsEmailVerified = user.IsEmailVerified,
            IsApproved = user.RestaurantOwner?.IsApproved ?? false,
            ProfilePictureUrl = user.RestaurantOwner?.ProfilePictureUrl,
            RestaurantId = restaurantId
        };

        return Ok(response);
    }

    [HttpPost("verify-email")]
    public async Task<IActionResult> VerifyEmail([FromBody] VerifyEmailRequest request)
    {
        var verification = await _context.EmailVerifications
            .FirstOrDefaultAsync(v => v.Token == request.Token && !v.IsUsed && v.ExpiresAt > DateTime.UtcNow);

        if (verification == null)
        {
            return BadRequest(new { message = "Invalid or expired token" });
        }

        var user = await _context.Users.FindAsync(verification.UserId);
        if (user == null)
        {
            return BadRequest(new { message = "User not found" });
        }

        user.IsEmailVerified = true;
        verification.IsUsed = true;
        await _context.SaveChangesAsync();

        return Ok(new { message = "Email verified successfully" });
    }

    [HttpGet("pending-registrations")]
    [Microsoft.AspNetCore.Authorization.Authorize(Roles = "SystemAdmin")]
    public async Task<IActionResult> GetPendingRegistrations()
    {
        var pendingOwners = await _context.RestaurantOwners
            .Include(ro => ro.User)
            .Include(ro => ro.Restaurant)
            .Where(ro => !ro.IsApproved)
            .OrderByDescending(ro => ro.CreatedAt)
            .Select(ro => new PendingOwnerRegistrationResponse
            {
                Id = ro.Id,
                UserId = ro.UserId,
                FirstName = ro.User.FirstName,
                LastName = ro.User.LastName,
                Email = ro.User.Email,
                Phone = ro.User.Phone,
                RestaurantName = ro.Restaurant != null ? ro.Restaurant.Name : string.Empty,
                Tagline = ro.Restaurant != null ? ro.Restaurant.Tagline : null,
                Description = ro.Restaurant != null ? ro.Restaurant.Description : null,
                Address = ro.Restaurant != null ? ro.Restaurant.Address : string.Empty,
                ContactEmail = ro.Restaurant != null ? ro.Restaurant.ContactEmail : string.Empty,
                ContactPhone = ro.Restaurant != null ? ro.Restaurant.ContactPhone : null,
                IsApproved = ro.IsApproved,
                ApprovedAt = ro.ApprovedAt,
                ApprovedBy = ro.ApprovedBy,
                CreatedAt = ro.CreatedAt
            })
            .ToListAsync();

        return Ok(pendingOwners);
    }

    [HttpGet("pending-registrations/{id}")]
    [Microsoft.AspNetCore.Authorization.Authorize(Roles = "SystemAdmin")]
    public async Task<IActionResult> GetPendingRegistration(int id)
    {
        var owner = await _context.RestaurantOwners
            .Include(ro => ro.User)
            .Include(ro => ro.Restaurant)
            .FirstOrDefaultAsync(ro => ro.Id == id && !ro.IsApproved);

        if (owner == null)
        {
            return NotFound(new { message = "Pending registration not found" });
        }

        var response = new PendingOwnerRegistrationResponse
        {
            Id = owner.Id,
            UserId = owner.UserId,
            FirstName = owner.User.FirstName,
            LastName = owner.User.LastName,
            Email = owner.User.Email,
            Phone = owner.User.Phone,
            RestaurantName = owner.Restaurant != null ? owner.Restaurant.Name : string.Empty,
            Tagline = owner.Restaurant != null ? owner.Restaurant.Tagline : null,
            Description = owner.Restaurant != null ? owner.Restaurant.Description : null,
            Address = owner.Restaurant != null ? owner.Restaurant.Address : string.Empty,
            ContactEmail = owner.Restaurant != null ? owner.Restaurant.ContactEmail : string.Empty,
            ContactPhone = owner.Restaurant != null ? owner.Restaurant.ContactPhone : null,
            IsApproved = owner.IsApproved,
            ApprovedAt = owner.ApprovedAt,
            ApprovedBy = owner.ApprovedBy,
            CreatedAt = owner.CreatedAt
        };

        return Ok(response);
    }

    [HttpPost("approve-owner/{id}")]
    [Microsoft.AspNetCore.Authorization.Authorize(Roles = "SystemAdmin")]
    public async Task<IActionResult> ApproveOwner(int id, [FromBody] ApproveOwnerRequest request)
    {
        var owner = await _context.RestaurantOwners
            .Include(ro => ro.User)
            .FirstOrDefaultAsync(ro => ro.Id == id && !ro.IsApproved);

        if (owner == null)
        {
            return NotFound(new { message = "Pending registration not found" });
        }

        // Get current admin user ID
        var adminUserIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(adminUserIdClaim) || !int.TryParse(adminUserIdClaim, out var adminUserId))
        {
            return Unauthorized(new { message = "Admin user not found" });
        }

        // Approve the owner
        owner.IsApproved = true;
        owner.ApprovedAt = DateTime.UtcNow;
        owner.ApprovedBy = adminUserId;

        await _context.SaveChangesAsync();

        // Log activity
        var activityLog = new ActivityLog
        {
            UserId = adminUserId.ToString(),
            Action = "Owner Registration Approved",
            Description = $"Approved: {owner.User.FirstName} {owner.User.LastName} - {owner.User.Email}",
            EntityType = "RestaurantOwner",
            EntityId = owner.Id,
            CreatedAt = DateTime.UtcNow
        };

        _context.ActivityLogs.Add(activityLog);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Owner approved successfully" });
    }

    [HttpPost("reject-owner/{id}")]
    [Microsoft.AspNetCore.Authorization.Authorize(Roles = "SystemAdmin")]
    public async Task<IActionResult> RejectOwner(int id, [FromBody] RejectOwnerRequest request)
    {
        var owner = await _context.RestaurantOwners
            .Include(ro => ro.User)
            .FirstOrDefaultAsync(ro => ro.Id == id && !ro.IsApproved);

        if (owner == null)
        {
            return NotFound(new { message = "Pending registration not found" });
        }

        // Get current admin user ID
        var adminUserIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(adminUserIdClaim) || !int.TryParse(adminUserIdClaim, out var adminUserId))
        {
            return Unauthorized(new { message = "Admin user not found" });
        }

        // Deactivate the user account instead of deleting
        owner.User.IsActive = false;
        owner.User.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        // Log activity
        var rejectionReason = string.IsNullOrEmpty(request.RejectionReason) 
            ? "No reason provided" 
            : request.RejectionReason;

        var activityLog = new ActivityLog
        {
            UserId = adminUserId.ToString(),
            Action = "Owner Registration Rejected",
            Description = $"Rejected: {owner.User.FirstName} {owner.User.LastName} - {owner.User.Email} (Reason: {rejectionReason})",
            EntityType = "RestaurantOwner",
            EntityId = owner.Id,
            CreatedAt = DateTime.UtcNow
        };

        _context.ActivityLogs.Add(activityLog);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Owner registration rejected" });
    }

    [HttpGet("owners")]
    [Microsoft.AspNetCore.Authorization.Authorize(Roles = "SystemAdmin")]
    public async Task<IActionResult> GetOwners()
    {
        var owners = await _context.RestaurantOwners
            .Include(ro => ro.User)
            .Include(ro => ro.Restaurant)
            .OrderByDescending(ro => ro.CreatedAt)
            .Select(ro => new OwnerResponse
            {
                Id = ro.Id,
                UserId = ro.UserId,
                FirstName = ro.User.FirstName,
                LastName = ro.User.LastName,
                Email = ro.User.Email,
                Phone = ro.User.Phone,
                RestaurantName = ro.Restaurant != null ? ro.Restaurant.Name : string.Empty,
                IsApproved = ro.IsApproved,
                ApprovedAt = ro.ApprovedAt,
                CreatedAt = ro.CreatedAt
            })
            .ToListAsync();

        return Ok(owners);
    }

    [HttpPut("user/profile")]
    [Microsoft.AspNetCore.Authorization.Authorize(Roles = "Owner")]
    public async Task<IActionResult> UpdateUserProfile([FromBody] UpdateUserProfileRequest request)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(new { message = "User not found" });
        }

        var user = await _context.Users.FindAsync(userId);
        if (user == null)
        {
            return NotFound(new { message = "User not found" });
        }

        // Update user profile
        user.FirstName = request.FirstName;
        user.LastName = request.LastName;
        user.Phone = request.Phone;
        user.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return Ok(new { message = "Profile updated successfully" });
    }

    [HttpPost("upload-profile-picture")]
    [Microsoft.AspNetCore.Authorization.Authorize(Roles = "Owner")]
    public async Task<IActionResult> UploadProfilePicture(IFormFile file)
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
            .FirstOrDefaultAsync(ro => ro.UserId == userId);

        if (owner == null)
        {
            return NotFound(new { message = "Owner not found" });
        }

        // Create uploads folder for owner profile pictures
        var uploadsFolder = Path.Combine(_environment.WebRootPath ?? _environment.ContentRootPath, "uploads", "owners", userId.ToString());
        
        if (!Directory.Exists(uploadsFolder))
        {
            Directory.CreateDirectory(uploadsFolder);
        }

        var fileName = $"profile_{Guid.NewGuid()}{fileExtension}";
        var filePath = Path.Combine(uploadsFolder, fileName);
        var relativeUrl = $"/uploads/owners/{userId}/{fileName}";

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        // Update owner profile picture URL
        owner.ProfilePictureUrl = relativeUrl;
        await _context.SaveChangesAsync();

        return Ok(new ImageUploadResponse
        {
            ImageUrl = relativeUrl,
            Message = "Profile picture uploaded successfully"
        });
    }
}

