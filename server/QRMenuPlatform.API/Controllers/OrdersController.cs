using Microsoft.AspNetCore.Authorization;
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
[Authorize]
public class OrdersController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IEmailService _emailService;
    private readonly ILogger<OrdersController> _logger;

    public OrdersController(
        ApplicationDbContext context,
        IEmailService emailService,
        ILogger<OrdersController> logger)
    {
        _context = context;
        _emailService = emailService;
        _logger = logger;
    }

    [HttpPost]
    public async Task<IActionResult> CreateOrder([FromBody] CreateOrderRequest request)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized();
        }

        var customer = await _context.Customers.FirstOrDefaultAsync(c => c.UserId == userId);
        if (customer == null)
        {
            return BadRequest(new { message = "Customer account not found" });
        }

        var restaurant = await _context.Restaurants.FindAsync(request.RestaurantId);
        if (restaurant == null)
        {
            return NotFound(new { message = "Restaurant not found" });
        }

        // Calculate subtotal
        decimal subtotal = 0;
        var orderItems = new List<OrderItem>();

        foreach (var itemRequest in request.Items)
        {
            var menuItem = await _context.MenuItems
                .Include(mi => mi.Category)
                .FirstOrDefaultAsync(mi => mi.Id == itemRequest.MenuItemId);

            if (menuItem == null)
            {
                return BadRequest(new { message = $"MenuItem {itemRequest.MenuItemId} not found" });
            }

            var itemTotal = menuItem.Price * itemRequest.Quantity;
            subtotal += itemTotal;

            orderItems.Add(new OrderItem
            {
                MenuItemId = menuItem.Id,
                ItemName = menuItem.Name,
                Quantity = itemRequest.Quantity,
                UnitPrice = menuItem.Price,
                TotalPrice = itemTotal,
                SpecialInstructions = itemRequest.SpecialInstructions
            });
        }

        var total = subtotal + request.TipAmount;

        // Generate order ID
        var orderId = $"INVOICE-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString().Substring(0, 8).ToUpper()}";

        var order = new Order
        {
            OrderId = orderId,
            RestaurantId = request.RestaurantId,
            CustomerId = customer.Id,
            PaymentMethod = request.PaymentMethod,
            DeliveryMethod = request.DeliveryMethod,
            Status = "pending",
            Subtotal = subtotal,
            TipAmount = request.TipAmount,
            Total = total,
            SpecialInstructions = request.SpecialInstructions,
            CreatedAt = DateTime.UtcNow
        };

        _context.Orders.Add(order);
        await _context.SaveChangesAsync();

        // Add order items
        foreach (var item in orderItems)
        {
            item.OrderId = order.Id;
            _context.OrderItems.Add(item);
        }

        await _context.SaveChangesAsync();

        // Send confirmation email if customer email exists
        var user = await _context.Users.FindAsync(userId);
        if (user != null && user.IsEmailVerified)
        {
            try
            {
                await _emailService.SendOrderConfirmationEmailAsync(user.Email, orderId, total);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send order confirmation email");
            }
        }

        // Load order with items for response
        var orderResponse = await _context.Orders
            .Include(o => o.OrderItems)
            .Include(o => o.Restaurant)
            .FirstOrDefaultAsync(o => o.Id == order.Id);

        var response = MapToOrderResponse(orderResponse!);

        return CreatedAtAction(nameof(GetOrder), new { id = order.Id }, response);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetOrder(int id)
    {
        var order = await _context.Orders
            .Include(o => o.OrderItems)
            .Include(o => o.Restaurant)
            .FirstOrDefaultAsync(o => o.Id == id);

        if (order == null)
        {
            return NotFound();
        }

        return Ok(MapToOrderResponse(order));
    }

    [HttpGet("restaurant/{restaurantId}")]
    [Authorize(Roles = "Owner")]
    public async Task<IActionResult> GetRestaurantOrders(int restaurantId)
    {
        var orders = await _context.Orders
            .Include(o => o.OrderItems)
            .Include(o => o.Customer)
            .ThenInclude(c => c!.User)
            .Where(o => o.RestaurantId == restaurantId)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();

        var response = orders.Select(MapToOrderResponse).ToList();
        return Ok(response);
    }

    [HttpPut("{id}/status")]
    [Authorize(Roles = "Owner")]
    public async Task<IActionResult> UpdateOrderStatus(int id, [FromBody] UpdateOrderStatusRequest request)
    {
        var order = await _context.Orders
            .Include(o => o.Customer)
            .ThenInclude(c => c!.User)
            .FirstOrDefaultAsync(o => o.Id == id);

        if (order == null)
        {
            return NotFound();
        }

        order.Status = request.Status;
        order.UpdatedAt = DateTime.UtcNow;

        if (request.Status == "confirmed")
        {
            order.ConfirmedAt = DateTime.UtcNow;
        }
        else if (request.Status == "completed")
        {
            order.CompletedAt = DateTime.UtcNow;
        }

        await _context.SaveChangesAsync();

        // Send email notification if customer email exists
        if (order.Customer?.User != null && order.Customer.User.IsEmailVerified)
        {
            try
            {
                await _emailService.SendOrderConfirmationEmailAsync(
                    order.Customer.User.Email,
                    order.OrderId,
                    order.Total);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send order status email");
            }
        }

        return Ok(MapToOrderResponse(order));
    }

    private OrderResponse MapToOrderResponse(Order order)
    {
        return new OrderResponse
        {
            Id = order.Id,
            OrderId = order.OrderId,
            RestaurantId = order.RestaurantId,
            RestaurantName = order.Restaurant?.Name ?? "",
            PaymentMethod = order.PaymentMethod,
            DeliveryMethod = order.DeliveryMethod,
            Status = order.Status,
            Subtotal = order.Subtotal,
            TipAmount = order.TipAmount,
            Total = order.Total,
            CreatedAt = order.CreatedAt,
            Items = order.OrderItems.Select(oi => new OrderItemResponse
            {
                Id = oi.Id,
                ItemName = oi.ItemName,
                Quantity = oi.Quantity,
                UnitPrice = oi.UnitPrice,
                TotalPrice = oi.TotalPrice,
                SpecialInstructions = oi.SpecialInstructions
            }).ToList()
        };
    }
}

