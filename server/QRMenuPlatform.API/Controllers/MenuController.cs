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
[Route("api/menu")]
[Authorize(Roles = "Owner")]
public class MenuController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<MenuController> _logger;
    private readonly IWebHostEnvironment _environment;

    public MenuController(
        ApplicationDbContext context,
        ILogger<MenuController> logger,
        IWebHostEnvironment environment)
    {
        _context = context;
        _logger = logger;
        _environment = environment;
    }

    // Helper method to get owner's restaurant
    private async Task<Restaurant?> GetOwnerRestaurantAsync(int userId)
    {
        var owner = await _context.RestaurantOwners
            .Include(ro => ro.Restaurant)
            .FirstOrDefaultAsync(ro => ro.UserId == userId);

        return owner?.Restaurant;
    }

    // Helper method to safely deserialize DisplayOn JSON
    private List<string> DeserializeDisplayOn(string? displayOnJson)
    {
        if (string.IsNullOrEmpty(displayOnJson))
        {
            return new List<string>();
        }

        try
        {
            var result = JsonSerializer.Deserialize<List<string>>(displayOnJson);
            return result ?? new List<string>();
        }
        catch
        {
            return new List<string>();
        }
    }

    // GET: api/menu
    [HttpGet]
    public async Task<IActionResult> GetMenus()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(new { message = "User not found" });
        }

        var restaurant = await GetOwnerRestaurantAsync(userId);
        if (restaurant == null)
        {
            return NotFound(new { message = "Restaurant not found" });
        }

        var menus = await _context.Menus
            .Where(m => m.RestaurantId == restaurant.Id)
            .OrderBy(m => m.CreatedAt)
            .Select(m => new MenuResponse
            {
                Id = m.Id,
                RestaurantId = m.RestaurantId,
                Name = m.Name,
                Description = m.Description,
                IsActive = m.IsActive,
                IsDefault = m.IsDefault,
                CreatedAt = m.CreatedAt,
                UpdatedAt = m.UpdatedAt
            })
            .ToListAsync();

        return Ok(menus);
    }

    // GET: api/menu/{menuId}
    [HttpGet("{menuId}")]
    public async Task<IActionResult> GetMenu(int menuId)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(new { message = "User not found" });
        }

        var restaurant = await GetOwnerRestaurantAsync(userId);
        if (restaurant == null)
        {
            return NotFound(new { message = "Restaurant not found" });
        }

        var menu = await _context.Menus
            .Include(m => m.Categories)
                .ThenInclude(c => c.MenuItems)
                    .ThenInclude(mi => mi.PriceOptions)
            .Where(m => m.Id == menuId && m.RestaurantId == restaurant.Id)
            .FirstOrDefaultAsync();

        if (menu == null)
        {
            return NotFound(new { message = "Menu not found" });
        }

        var response = new MenuResponse
        {
            Id = menu.Id,
            RestaurantId = menu.RestaurantId,
            Name = menu.Name,
            Description = menu.Description,
            IsActive = menu.IsActive,
            IsDefault = menu.IsDefault,
            CreatedAt = menu.CreatedAt,
            UpdatedAt = menu.UpdatedAt,
            Categories = menu.Categories
                .OrderBy(c => c.DisplayOrder)
                .ThenBy(c => c.CreatedAt)
                .Select(c => new CategoryResponse
                {
                    Id = c.Id,
                    MenuId = c.MenuId,
                    Name = c.Name,
                    Description = c.Description,
                    DisplayOrder = c.DisplayOrder,
                    IsVisible = c.IsVisible,
                    CreatedAt = c.CreatedAt,
                    UpdatedAt = c.UpdatedAt,
                    MenuItems = c.MenuItems
                        .OrderBy(mi => mi.DisplayOrder)
                        .ThenBy(mi => mi.CreatedAt)
                        .Select(mi => new MenuItemResponse
                        {
                            Id = mi.Id,
                            CategoryId = mi.CategoryId,
                            Name = mi.Name,
                            Description = mi.Description,
                            Price = mi.Price,
                            ImageUrl = mi.ImageUrl,
                            IsAvailable = mi.IsAvailable,
                            IsVisible = mi.IsVisible,
                            DisplayOrder = mi.DisplayOrder,
                            CreatedAt = mi.CreatedAt,
                            UpdatedAt = mi.UpdatedAt,
                            PriceOptions = mi.PriceOptions
                                .OrderBy(po => po.DisplayOrder)
                                .Select(po => new PriceOptionResponse
                                {
                                    Id = po.Id,
                                    OptionName = po.OptionName,
                                    Price = po.Price,
                                    DisplayOrder = po.DisplayOrder
                                })
                                .ToList()
                        })
                        .ToList()
                })
                .ToList()
        };

        return Ok(response);
    }

    // POST: api/menu
    [HttpPost]
    public async Task<IActionResult> CreateMenu([FromBody] MenuRequest request)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(new { message = "User not found" });
        }

        var restaurant = await GetOwnerRestaurantAsync(userId);
        if (restaurant == null)
        {
            return NotFound(new { message = "Restaurant not found" });
        }

        var menu = new Menu
        {
            RestaurantId = restaurant.Id,
            Name = request.Name,
            Description = request.Description,
            IsActive = request.IsActive,
            IsDefault = request.IsDefault,
            CreatedAt = DateTime.UtcNow
        };

        _context.Menus.Add(menu);
        await _context.SaveChangesAsync();

        var response = new MenuResponse
        {
            Id = menu.Id,
            RestaurantId = menu.RestaurantId,
            Name = menu.Name,
            Description = menu.Description,
            IsActive = menu.IsActive,
            IsDefault = menu.IsDefault,
            CreatedAt = menu.CreatedAt,
            UpdatedAt = menu.UpdatedAt
        };

        return CreatedAtAction(nameof(GetMenu), new { menuId = menu.Id }, response);
    }

    // PUT: api/menu/{menuId}
    [HttpPut("{menuId}")]
    public async Task<IActionResult> UpdateMenu(int menuId, [FromBody] MenuRequest request)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(new { message = "User not found" });
        }

        var restaurant = await GetOwnerRestaurantAsync(userId);
        if (restaurant == null)
        {
            return NotFound(new { message = "Restaurant not found" });
        }

        var menu = await _context.Menus
            .FirstOrDefaultAsync(m => m.Id == menuId && m.RestaurantId == restaurant.Id);

        if (menu == null)
        {
            return NotFound(new { message = "Menu not found" });
        }

        menu.Name = request.Name;
        menu.Description = request.Description;
        menu.IsActive = request.IsActive;
        menu.IsDefault = request.IsDefault;
        menu.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        var response = new MenuResponse
        {
            Id = menu.Id,
            RestaurantId = menu.RestaurantId,
            Name = menu.Name,
            Description = menu.Description,
            IsActive = menu.IsActive,
            IsDefault = menu.IsDefault,
            CreatedAt = menu.CreatedAt,
            UpdatedAt = menu.UpdatedAt
        };

        return Ok(response);
    }

    // DELETE: api/menu/{menuId}
    [HttpDelete("{menuId}")]
    public async Task<IActionResult> DeleteMenu(int menuId)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(new { message = "User not found" });
        }

        var restaurant = await GetOwnerRestaurantAsync(userId);
        if (restaurant == null)
        {
            return NotFound(new { message = "Restaurant not found" });
        }

        var menu = await _context.Menus
            .Include(m => m.Categories)
                .ThenInclude(c => c.MenuItems)
                    .ThenInclude(mi => mi.PriceOptions)
            .FirstOrDefaultAsync(m => m.Id == menuId && m.RestaurantId == restaurant.Id);

        if (menu == null)
        {
            return NotFound(new { message = "Menu not found" });
        }

        // Delete all related data (cascade delete should handle this, but being explicit)
        foreach (var category in menu.Categories)
        {
            foreach (var item in category.MenuItems)
            {
                _context.ItemPriceOptions.RemoveRange(item.PriceOptions);
            }
            _context.MenuItems.RemoveRange(category.MenuItems);
        }
        _context.Categories.RemoveRange(menu.Categories);
        _context.Menus.Remove(menu);

        await _context.SaveChangesAsync();

        return Ok(new { message = "Menu deleted successfully" });
    }

    // GET: api/menu/{menuId}/categories
    [HttpGet("{menuId}/categories")]
    public async Task<IActionResult> GetCategories(int menuId)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(new { message = "User not found" });
        }

        var restaurant = await GetOwnerRestaurantAsync(userId);
        if (restaurant == null)
        {
            return NotFound(new { message = "Restaurant not found" });
        }

        // Verify menu belongs to restaurant
        var menu = await _context.Menus
            .FirstOrDefaultAsync(m => m.Id == menuId && m.RestaurantId == restaurant.Id);

        if (menu == null)
        {
            return NotFound(new { message = "Menu not found" });
        }

        var categories = await _context.Categories
            .Where(c => c.MenuId == menuId)
            .OrderBy(c => c.DisplayOrder)
            .ThenBy(c => c.CreatedAt)
            .Select(c => new CategoryResponse
            {
                Id = c.Id,
                MenuId = c.MenuId,
                Name = c.Name,
                Description = c.Description,
                DisplayOrder = c.DisplayOrder,
                IsVisible = c.IsVisible,
                CreatedAt = c.CreatedAt,
                UpdatedAt = c.UpdatedAt
            })
            .ToListAsync();

        return Ok(categories);
    }

    // POST: api/menu/{menuId}/categories
    [HttpPost("{menuId}/categories")]
    public async Task<IActionResult> CreateCategory(int menuId, [FromBody] CategoryRequest request)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(new { message = "User not found" });
        }

        var restaurant = await GetOwnerRestaurantAsync(userId);
        if (restaurant == null)
        {
            return NotFound(new { message = "Restaurant not found" });
        }

        // Verify menu belongs to restaurant
        var menu = await _context.Menus
            .FirstOrDefaultAsync(m => m.Id == menuId && m.RestaurantId == restaurant.Id);

        if (menu == null)
        {
            return NotFound(new { message = "Menu not found" });
        }

        var category = new Category
        {
            MenuId = menuId,
            Name = request.Name,
            Description = request.Description,
            DisplayOrder = request.DisplayOrder,
            IsVisible = request.IsVisible,
            CreatedAt = DateTime.UtcNow
        };

        _context.Categories.Add(category);
        await _context.SaveChangesAsync();

        var response = new CategoryResponse
        {
            Id = category.Id,
            MenuId = category.MenuId,
            Name = category.Name,
            Description = category.Description,
            DisplayOrder = category.DisplayOrder,
            IsVisible = category.IsVisible,
            CreatedAt = category.CreatedAt,
            UpdatedAt = category.UpdatedAt
        };

        return CreatedAtAction(nameof(GetCategories), new { menuId = menuId }, response);
    }

    // PUT: api/menu/{menuId}/categories/{categoryId}
    [HttpPut("{menuId}/categories/{categoryId}")]
    public async Task<IActionResult> UpdateCategory(int menuId, int categoryId, [FromBody] CategoryRequest request)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(new { message = "User not found" });
        }

        var restaurant = await GetOwnerRestaurantAsync(userId);
        if (restaurant == null)
        {
            return NotFound(new { message = "Restaurant not found" });
        }

        // Verify menu belongs to restaurant
        var menu = await _context.Menus
            .FirstOrDefaultAsync(m => m.Id == menuId && m.RestaurantId == restaurant.Id);

        if (menu == null)
        {
            return NotFound(new { message = "Menu not found" });
        }

        var category = await _context.Categories
            .FirstOrDefaultAsync(c => c.Id == categoryId && c.MenuId == menuId);

        if (category == null)
        {
            return NotFound(new { message = "Category not found" });
        }

        category.Name = request.Name;
        category.Description = request.Description;
        category.DisplayOrder = request.DisplayOrder;
        category.IsVisible = request.IsVisible;
        category.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        var response = new CategoryResponse
        {
            Id = category.Id,
            MenuId = category.MenuId,
            Name = category.Name,
            Description = category.Description,
            DisplayOrder = category.DisplayOrder,
            IsVisible = category.IsVisible,
            CreatedAt = category.CreatedAt,
            UpdatedAt = category.UpdatedAt
        };

        return Ok(response);
    }

    // DELETE: api/menu/{menuId}/categories/{categoryId}
    [HttpDelete("{menuId}/categories/{categoryId}")]
    public async Task<IActionResult> DeleteCategory(int menuId, int categoryId)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(new { message = "User not found" });
        }

        var restaurant = await GetOwnerRestaurantAsync(userId);
        if (restaurant == null)
        {
            return NotFound(new { message = "Restaurant not found" });
        }

        // Verify menu belongs to restaurant
        var menu = await _context.Menus
            .FirstOrDefaultAsync(m => m.Id == menuId && m.RestaurantId == restaurant.Id);

        if (menu == null)
        {
            return NotFound(new { message = "Menu not found" });
        }

        var category = await _context.Categories
            .Include(c => c.MenuItems)
                .ThenInclude(mi => mi.PriceOptions)
            .FirstOrDefaultAsync(c => c.Id == categoryId && c.MenuId == menuId);

        if (category == null)
        {
            return NotFound(new { message = "Category not found" });
        }

        // Delete all items and price options
        foreach (var item in category.MenuItems)
        {
            _context.ItemPriceOptions.RemoveRange(item.PriceOptions);
        }
        _context.MenuItems.RemoveRange(category.MenuItems);
        _context.Categories.Remove(category);

        await _context.SaveChangesAsync();

        return Ok(new { message = "Category deleted successfully" });
    }

    // GET: api/menu/{menuId}/categories/{categoryId}/items
    [HttpGet("{menuId}/categories/{categoryId}/items")]
    public async Task<IActionResult> GetItems(int menuId, int categoryId)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(new { message = "User not found" });
        }

        var restaurant = await GetOwnerRestaurantAsync(userId);
        if (restaurant == null)
        {
            return NotFound(new { message = "Restaurant not found" });
        }

        // Verify menu and category belong to restaurant
        var menu = await _context.Menus
            .FirstOrDefaultAsync(m => m.Id == menuId && m.RestaurantId == restaurant.Id);

        if (menu == null)
        {
            return NotFound(new { message = "Menu not found" });
        }

        var category = await _context.Categories
            .FirstOrDefaultAsync(c => c.Id == categoryId && c.MenuId == menuId);

        if (category == null)
        {
            return NotFound(new { message = "Category not found" });
        }

        var items = await _context.MenuItems
            .Include(mi => mi.PriceOptions)
            .Where(mi => mi.CategoryId == categoryId)
            .OrderBy(mi => mi.DisplayOrder)
            .ThenBy(mi => mi.CreatedAt)
            .ToListAsync();

        var response = items.Select(mi => new MenuItemResponse
        {
            Id = mi.Id,
            CategoryId = mi.CategoryId,
            Name = mi.Name,
            Description = mi.Description,
            Price = mi.Price,
            ImageUrl = mi.ImageUrl,
            IsAvailable = mi.IsAvailable,
            IsVisible = mi.IsVisible,
            DisplayOrder = mi.DisplayOrder,
            CreatedAt = mi.CreatedAt,
            UpdatedAt = mi.UpdatedAt,
            PriceOptions = mi.PriceOptions
                .OrderBy(po => po.DisplayOrder)
                .Select(po => new PriceOptionResponse
                {
                    Id = po.Id,
                    OptionName = po.OptionName,
                    Price = po.Price,
                    DisplayOrder = po.DisplayOrder
                })
                .ToList(),
            Labels = mi.Labels,
            DisplayOn = DeserializeDisplayOn(mi.DisplayOn),
            Size = mi.Size,
            Unit = mi.Unit,
            PreparationTime = mi.PreparationTime,
            Featured = mi.Featured,
            Recommended = mi.Recommended,
            MarkAsSoldOut = mi.MarkAsSoldOut
        }).ToList();

        return Ok(response);
    }

    // POST: api/menu/{menuId}/categories/{categoryId}/items
    [HttpPost("{menuId}/categories/{categoryId}/items")]
    public async Task<IActionResult> CreateItem(int menuId, int categoryId, [FromBody] MenuItemRequest request)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(new { message = "User not found" });
        }

        var restaurant = await GetOwnerRestaurantAsync(userId);
        if (restaurant == null)
        {
            return NotFound(new { message = "Restaurant not found" });
        }

        // Verify menu and category belong to restaurant
        var menu = await _context.Menus
            .FirstOrDefaultAsync(m => m.Id == menuId && m.RestaurantId == restaurant.Id);

        if (menu == null)
        {
            return NotFound(new { message = "Menu not found" });
        }

        var category = await _context.Categories
            .FirstOrDefaultAsync(c => c.Id == categoryId && c.MenuId == menuId);

        if (category == null)
        {
            return NotFound(new { message = "Category not found" });
        }

        var item = new MenuItem
        {
            CategoryId = categoryId,
            Name = request.Name,
            Description = request.Description,
            Price = request.Price,
            ImageUrl = request.ImageUrl,
            IsAvailable = request.IsAvailable,
            IsVisible = request.IsVisible,
            DisplayOrder = request.DisplayOrder,
            CreatedAt = DateTime.UtcNow,
            Labels = request.Labels,
            DisplayOn = request.DisplayOn != null ? JsonSerializer.Serialize(request.DisplayOn) : null,
            Size = request.Size,
            Unit = request.Unit,
            PreparationTime = request.PreparationTime,
            Featured = request.Featured,
            Recommended = request.Recommended,
            MarkAsSoldOut = request.MarkAsSoldOut
        };

        _context.MenuItems.Add(item);
        await _context.SaveChangesAsync();

        // Add price options if provided
        if (request.PriceOptions != null && request.PriceOptions.Any())
        {
            foreach (var priceOptionRequest in request.PriceOptions)
            {
                var priceOption = new ItemPriceOption
                {
                    MenuItemId = item.Id,
                    OptionName = priceOptionRequest.OptionName,
                    Price = priceOptionRequest.Price,
                    DisplayOrder = priceOptionRequest.DisplayOrder
                };
                _context.ItemPriceOptions.Add(priceOption);
            }
            await _context.SaveChangesAsync();
        }

        // Reload item with price options
        var itemWithOptions = await _context.MenuItems
            .Include(mi => mi.PriceOptions)
            .FirstOrDefaultAsync(mi => mi.Id == item.Id);

        var response = new MenuItemResponse
        {
            Id = itemWithOptions!.Id,
            CategoryId = itemWithOptions.CategoryId,
            Name = itemWithOptions.Name,
            Description = itemWithOptions.Description,
            Price = itemWithOptions.Price,
            ImageUrl = itemWithOptions.ImageUrl,
            IsAvailable = itemWithOptions.IsAvailable,
            IsVisible = itemWithOptions.IsVisible,
            DisplayOrder = itemWithOptions.DisplayOrder,
            CreatedAt = itemWithOptions.CreatedAt,
            UpdatedAt = itemWithOptions.UpdatedAt,
            PriceOptions = itemWithOptions.PriceOptions
                .OrderBy(po => po.DisplayOrder)
                .Select(po => new PriceOptionResponse
                {
                    Id = po.Id,
                    OptionName = po.OptionName,
                    Price = po.Price,
                    DisplayOrder = po.DisplayOrder
                })
                .ToList(),
            Labels = itemWithOptions.Labels,
            DisplayOn = DeserializeDisplayOn(itemWithOptions.DisplayOn),
            Size = itemWithOptions.Size,
            Unit = itemWithOptions.Unit,
            PreparationTime = itemWithOptions.PreparationTime,
            Featured = itemWithOptions.Featured,
            Recommended = itemWithOptions.Recommended,
            MarkAsSoldOut = itemWithOptions.MarkAsSoldOut
        };

        return CreatedAtAction(nameof(GetItems), new { menuId = menuId, categoryId = categoryId }, response);
    }

    // PUT: api/menu/{menuId}/categories/{categoryId}/items/{itemId}
    [HttpPut("{menuId}/categories/{categoryId}/items/{itemId}")]
    public async Task<IActionResult> UpdateItem(int menuId, int categoryId, int itemId, [FromBody] MenuItemRequest request)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(new { message = "User not found" });
        }

        var restaurant = await GetOwnerRestaurantAsync(userId);
        if (restaurant == null)
        {
            return NotFound(new { message = "Restaurant not found" });
        }

        // Verify menu and category belong to restaurant
        var menu = await _context.Menus
            .FirstOrDefaultAsync(m => m.Id == menuId && m.RestaurantId == restaurant.Id);

        if (menu == null)
        {
            return NotFound(new { message = "Menu not found" });
        }

        var category = await _context.Categories
            .FirstOrDefaultAsync(c => c.Id == categoryId && c.MenuId == menuId);

        if (category == null)
        {
            return NotFound(new { message = "Category not found" });
        }

        var item = await _context.MenuItems
            .Include(mi => mi.PriceOptions)
            .FirstOrDefaultAsync(mi => mi.Id == itemId && mi.CategoryId == categoryId);

        if (item == null)
        {
            return NotFound(new { message = "Item not found" });
        }

        item.Name = request.Name;
        item.Description = request.Description;
        item.Price = request.Price;
        if (request.ImageUrl != null) item.ImageUrl = request.ImageUrl;
        item.IsAvailable = request.IsAvailable;
        item.IsVisible = request.IsVisible;
        item.DisplayOrder = request.DisplayOrder;
        item.UpdatedAt = DateTime.UtcNow;
        // Update additional fields
        item.Labels = request.Labels;
        item.DisplayOn = request.DisplayOn != null ? JsonSerializer.Serialize(request.DisplayOn) : null;
        item.Size = request.Size;
        item.Unit = request.Unit;
        item.PreparationTime = request.PreparationTime;
        item.Featured = request.Featured;
        item.Recommended = request.Recommended;
        item.MarkAsSoldOut = request.MarkAsSoldOut;

        // Update price options
        if (request.PriceOptions != null)
        {
            // Remove existing price options
            _context.ItemPriceOptions.RemoveRange(item.PriceOptions);

            // Add new price options
            foreach (var priceOptionRequest in request.PriceOptions)
            {
                var priceOption = new ItemPriceOption
                {
                    MenuItemId = item.Id,
                    OptionName = priceOptionRequest.OptionName,
                    Price = priceOptionRequest.Price,
                    DisplayOrder = priceOptionRequest.DisplayOrder
                };
                _context.ItemPriceOptions.Add(priceOption);
            }
        }

        await _context.SaveChangesAsync();

        // Reload item with price options
        var updatedItem = await _context.MenuItems
            .Include(mi => mi.PriceOptions)
            .FirstOrDefaultAsync(mi => mi.Id == item.Id);

        var response = new MenuItemResponse
        {
            Id = updatedItem!.Id,
            CategoryId = updatedItem.CategoryId,
            Name = updatedItem.Name,
            Description = updatedItem.Description,
            Price = updatedItem.Price,
            ImageUrl = updatedItem.ImageUrl,
            IsAvailable = updatedItem.IsAvailable,
            IsVisible = updatedItem.IsVisible,
            DisplayOrder = updatedItem.DisplayOrder,
            CreatedAt = updatedItem.CreatedAt,
            UpdatedAt = updatedItem.UpdatedAt,
            PriceOptions = updatedItem.PriceOptions
                .OrderBy(po => po.DisplayOrder)
                .Select(po => new PriceOptionResponse
                {
                    Id = po.Id,
                    OptionName = po.OptionName,
                    Price = po.Price,
                    DisplayOrder = po.DisplayOrder
                })
                .ToList(),
            Labels = updatedItem.Labels,
            DisplayOn = DeserializeDisplayOn(updatedItem.DisplayOn),
            Size = updatedItem.Size,
            Unit = updatedItem.Unit,
            PreparationTime = updatedItem.PreparationTime,
            Featured = updatedItem.Featured,
            Recommended = updatedItem.Recommended,
            MarkAsSoldOut = updatedItem.MarkAsSoldOut
        };

        return Ok(response);
    }

    // DELETE: api/menu/{menuId}/categories/{categoryId}/items/{itemId}
    [HttpDelete("{menuId}/categories/{categoryId}/items/{itemId}")]
    public async Task<IActionResult> DeleteItem(int menuId, int categoryId, int itemId)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(new { message = "User not found" });
        }

        var restaurant = await GetOwnerRestaurantAsync(userId);
        if (restaurant == null)
        {
            return NotFound(new { message = "Restaurant not found" });
        }

        // Verify menu and category belong to restaurant
        var menu = await _context.Menus
            .FirstOrDefaultAsync(m => m.Id == menuId && m.RestaurantId == restaurant.Id);

        if (menu == null)
        {
            return NotFound(new { message = "Menu not found" });
        }

        var category = await _context.Categories
            .FirstOrDefaultAsync(c => c.Id == categoryId && c.MenuId == menuId);

        if (category == null)
        {
            return NotFound(new { message = "Category not found" });
        }

        var item = await _context.MenuItems
            .Include(mi => mi.PriceOptions)
            .FirstOrDefaultAsync(mi => mi.Id == itemId && mi.CategoryId == categoryId);

        if (item == null)
        {
            return NotFound(new { message = "Item not found" });
        }

        _context.ItemPriceOptions.RemoveRange(item.PriceOptions);
        _context.MenuItems.Remove(item);

        await _context.SaveChangesAsync();

        return Ok(new { message = "Item deleted successfully" });
    }

    // GET: api/menu/public/{restaurantId}
    [HttpGet("public/{restaurantId}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetPublicMenu(int restaurantId)
    {
        var restaurant = await _context.Restaurants
            .FirstOrDefaultAsync(r => r.Id == restaurantId);

        if (restaurant == null)
        {
            return NotFound(new { message = "Restaurant not found" });
        }

        // Get base URL for images
        var baseUrl = $"{Request.Scheme}://{Request.Host}";

        var menus = await _context.Menus
            .Include(m => m.Categories)
                .ThenInclude(c => c.MenuItems)
                    .ThenInclude(mi => mi.PriceOptions)
            .Where(m => m.RestaurantId == restaurantId && m.IsActive)
            .OrderBy(m => m.IsDefault ? 0 : 1)
            .ThenBy(m => m.CreatedAt)
            .ToListAsync();

        var response = menus.Select(m => new PublicMenuResponse
        {
            Id = m.Id,
            Name = m.Name,
            Description = m.Description,
            Categories = m.Categories
                .Where(c => c.IsVisible)
                .OrderBy(c => c.DisplayOrder)
                .ThenBy(c => c.CreatedAt)
                .Select(c => new PublicCategoryResponse
                {
                    Id = c.Id,
                    Name = c.Name,
                    Description = c.Description,
                    Items = c.MenuItems
                        .Where(mi => mi.IsVisible && mi.IsAvailable)
                        .OrderBy(mi => mi.DisplayOrder)
                        .ThenBy(mi => mi.CreatedAt)
                        .ToList()
                        .Select(mi => new PublicMenuItemResponse
                        {
                            Id = mi.Id,
                            Name = mi.Name,
                            Description = mi.Description,
                            Price = mi.Price,
                            ImageUrl = mi.ImageUrl != null ? $"{baseUrl}{mi.ImageUrl}" : null,
                            PriceOptions = mi.PriceOptions
                                .OrderBy(po => po.DisplayOrder)
                                .Select(po => new PriceOptionResponse
                                {
                                    Id = po.Id,
                                    OptionName = po.OptionName,
                                    Price = po.Price,
                                    DisplayOrder = po.DisplayOrder
                                })
                                .ToList(),
                            Labels = mi.Labels,
                            DisplayOn = DeserializeDisplayOn(mi.DisplayOn),
                            Size = mi.Size,
                            Unit = mi.Unit,
                            PreparationTime = mi.PreparationTime,
                            Featured = mi.Featured,
                            Recommended = mi.Recommended,
                            MarkAsSoldOut = mi.MarkAsSoldOut,
                            IsAvailable = mi.IsAvailable
                        })
                        .ToList()
                })
                .Where(c => c.Items.Any()) // Only include categories with visible items
                .ToList()
        }).ToList();

        return Ok(response);
    }

    // POST: api/menu/{menuId}/categories/{categoryId}/items/{itemId}/upload-image
    [HttpPost("{menuId}/categories/{categoryId}/items/{itemId}/upload-image")]
    public async Task<IActionResult> UploadItemImage(int menuId, int categoryId, int itemId, IFormFile file)
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

        var restaurant = await GetOwnerRestaurantAsync(userId);
        if (restaurant == null)
        {
            return NotFound(new { message = "Restaurant not found" });
        }

        // Verify menu, category, and item belong to restaurant
        var menu = await _context.Menus
            .FirstOrDefaultAsync(m => m.Id == menuId && m.RestaurantId == restaurant.Id);

        if (menu == null)
        {
            return NotFound(new { message = "Menu not found" });
        }

        var category = await _context.Categories
            .FirstOrDefaultAsync(c => c.Id == categoryId && c.MenuId == menuId);

        if (category == null)
        {
            return NotFound(new { message = "Category not found" });
        }

        var item = await _context.MenuItems
            .FirstOrDefaultAsync(mi => mi.Id == itemId && mi.CategoryId == categoryId);

        if (item == null)
        {
            return NotFound(new { message = "Item not found" });
        }

        var restaurantId = restaurant.Id;
        var uploadsFolder = Path.Combine(_environment.WebRootPath ?? _environment.ContentRootPath, "uploads", "restaurants", restaurantId.ToString(), "menu-items");
        
        if (!Directory.Exists(uploadsFolder))
        {
            Directory.CreateDirectory(uploadsFolder);
        }

        // Delete old image if exists
        if (!string.IsNullOrEmpty(item.ImageUrl))
        {
            var oldImagePath = Path.Combine(_environment.WebRootPath ?? _environment.ContentRootPath, item.ImageUrl.TrimStart('/'));
            if (System.IO.File.Exists(oldImagePath))
            {
                try
                {
                    System.IO.File.Delete(oldImagePath);
                }
                catch
                {
                    // Ignore deletion errors
                }
            }
        }

        var fileName = $"item_{itemId}_{Guid.NewGuid()}{fileExtension}";
        var filePath = Path.Combine(uploadsFolder, fileName);
        var relativeUrl = $"/uploads/restaurants/{restaurantId}/menu-items/{fileName}";

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        // Update item image URL
        item.ImageUrl = relativeUrl;
        item.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return Ok(new ImageUploadResponse
        {
            ImageUrl = relativeUrl,
            Message = "Image uploaded successfully"
        });
    }
}

