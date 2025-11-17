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

    public AuthController(
        ApplicationDbContext context,
        IEmailService emailService,
        ILogger<AuthController> logger)
    {
        _context = context;
        _emailService = emailService;
        _logger = logger;
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

        return Ok(new { message = "Registration successful. Please check your email for verification." });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var user = await _context.Users
            .Include(u => u.RestaurantOwner)
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

        var response = new LoginResponse
        {
            UserId = user.Id,
            Email = user.Email,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Role = user.Role,
            IsEmailVerified = user.IsEmailVerified,
            IsApproved = user.RestaurantOwner?.IsApproved ?? false
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
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null)
        {
            return Unauthorized();
        }

        var response = new LoginResponse
        {
            UserId = user.Id,
            Email = user.Email,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Role = user.Role,
            IsEmailVerified = user.IsEmailVerified,
            IsApproved = user.RestaurantOwner?.IsApproved ?? false
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
}

