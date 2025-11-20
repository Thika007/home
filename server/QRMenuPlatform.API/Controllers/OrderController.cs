using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QRMenuPlatform.API.Data;
using QRMenuPlatform.API.DTOs;
using QRMenuPlatform.API.Models;
using System.Security.Claims;

namespace QRMenuPlatform.API.Controllers;

[ApiController]
[Route("api/orders")]
public class OrderController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<OrderController> _logger;

    public OrderController(
        ApplicationDbContext context,
        ILogger<OrderController> logger)
    {
        _context = context;
        _logger = logger;
    }

    private int? GetCurrentUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (int.TryParse(userIdClaim, out var userId))
        {
            return userId;
        }
        return null;
    }

    private string GenerateOrderId()
    {
        return $"ORD-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString().Substring(0, 8).ToUpper()}";
    }

    [HttpPost]
    public async Task<IActionResult> CreateOrder([FromBody] CreateOrderRequest request)
    {
        // Validate restaurant exists
        var restaurant = await _context.Restaurants
            .FirstOrDefaultAsync(r => r.Id == request.RestaurantId);

        if (restaurant == null)
        {
            return BadRequest(new { message = "Restaurant not found" });
        }

        // Get customer ID if authenticated
        int? customerId = null;
        if (User.Identity?.IsAuthenticated == true)
        {
            var userId = GetCurrentUserId();
            if (userId.HasValue)
            {
                var customer = await _context.Customers
                    .FirstOrDefaultAsync(c => c.UserId == userId.Value);
                customerId = customer?.Id;
            }
        }

        // Guest checkout fields are optional - no validation needed
        // Guest name and email can be null/empty for guest checkout

        // Validate dine-in fields
        if (request.DeliveryMethod == "dine-in")
        {
            if (string.IsNullOrWhiteSpace(request.TableNumber))
            {
                return BadRequest(new { message = "Table number is required for dine-in orders" });
            }
            if (!request.NumberOfPassengers.HasValue || request.NumberOfPassengers.Value <= 0)
            {
                return BadRequest(new { message = "Number of passengers is required for dine-in orders" });
            }
        }

        // Create order
        var order = new Order
        {
            OrderId = GenerateOrderId(),
            RestaurantId = request.RestaurantId,
            CustomerId = customerId,
            PaymentMethod = request.PaymentMethod,
            DeliveryMethod = request.DeliveryMethod,
            Status = "pending",
            Subtotal = request.Subtotal,
            TipAmount = request.TipAmount,
            Total = request.Total,
            SpecialInstructions = request.SpecialInstructions,
            TableNumber = request.TableNumber,
            NumberOfPassengers = request.NumberOfPassengers,
            GuestName = request.CheckoutAsGuest ? request.GuestName : null,
            GuestEmail = request.CheckoutAsGuest ? request.GuestEmail : null,
            CreatedAt = DateTime.UtcNow
        };

        _context.Orders.Add(order);
        await _context.SaveChangesAsync();

        // Create order items
        foreach (var itemRequest in request.Items)
        {
            var orderItem = new OrderItem
            {
                OrderId = order.Id,
                MenuItemId = itemRequest.MenuItemId,
                ItemName = itemRequest.ItemName,
                Quantity = itemRequest.Quantity,
                UnitPrice = itemRequest.UnitPrice,
                TotalPrice = itemRequest.TotalPrice,
                SpecialInstructions = itemRequest.SpecialInstructions,
                PriceOptionId = itemRequest.PriceOptionId,
                PriceOptionName = itemRequest.PriceOptionName
            };

            _context.OrderItems.Add(orderItem);
        }

        await _context.SaveChangesAsync();

        // Create notification for owner
        var ownerNotification = new Notification
        {
            RestaurantId = request.RestaurantId,
            OrderId = order.Id,
            Type = "order_pending",
            Title = "New Order Received",
            Message = $"New order {order.OrderId} has been placed.",
            IsRead = false,
            CreatedAt = DateTime.UtcNow
        };
        _context.Notifications.Add(ownerNotification);

        // Create notification for customer if authenticated
        if (customerId.HasValue)
        {
            var customer = await _context.Customers
                .Include(c => c.User)
                .FirstOrDefaultAsync(c => c.Id == customerId.Value);

            if (customer?.User != null)
            {
                var customerNotification = new Notification
                {
                    UserId = customer.User.Id,
                    RestaurantId = request.RestaurantId,
                    OrderId = order.Id,
                    Type = "order_pending",
                    Title = "Order Placed",
                    Message = $"Your order {order.OrderId} has been placed and is pending confirmation.",
                    IsRead = false,
                    CreatedAt = DateTime.UtcNow
                };
                _context.Notifications.Add(customerNotification);
            }
        }
        // Create notification for guest user if guest checkout
        else if (request.CheckoutAsGuest)
        {
            // Get guest identifier from cookie
            var guestIdentifier = Request.Cookies["guestId"];
            if (!string.IsNullOrEmpty(guestIdentifier))
            {
                var guestNotification = new Notification
                {
                    GuestIdentifier = guestIdentifier,
                    RestaurantId = request.RestaurantId,
                    OrderId = order.Id,
                    Type = "order_pending",
                    Title = "Order Placed",
                    Message = $"Your order {order.OrderId} has been placed and is pending confirmation.",
                    IsRead = false,
                    CreatedAt = DateTime.UtcNow
                };
                _context.Notifications.Add(guestNotification);
            }
        }

        await _context.SaveChangesAsync();

        // Load order with related data for response
        var orderResponse = await _context.Orders
            .Include(o => o.Restaurant)
            .Include(o => o.Customer)
                .ThenInclude(c => c.User)
            .Include(o => o.OrderItems)
            .FirstOrDefaultAsync(o => o.Id == order.Id);

        return Ok(MapToOrderResponse(orderResponse!));
    }

    [HttpGet]
    [Authorize]
    public async Task<IActionResult> GetUserOrders()
    {
        var userId = GetCurrentUserId();
        if (!userId.HasValue)
        {
            return Unauthorized(new { message = "User not authenticated" });
        }

        var customer = await _context.Customers
            .FirstOrDefaultAsync(c => c.UserId == userId.Value);

        if (customer == null)
        {
            return Ok(new List<OrderResponse>());
        }

        var orders = await _context.Orders
            .Include(o => o.Restaurant)
            .Include(o => o.Customer)
                .ThenInclude(c => c.User)
            .Include(o => o.OrderItems)
            .Where(o => o.CustomerId == customer.Id)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();

        var orderResponses = orders.Select(MapToOrderResponse).ToList();

        return Ok(orderResponses);
    }

    [HttpGet("{id}")]
    [Authorize]
    public async Task<IActionResult> GetOrder(int id)
    {
        var userId = GetCurrentUserId();
        if (!userId.HasValue)
        {
            return Unauthorized(new { message = "User not authenticated" });
        }

        var customer = await _context.Customers
            .FirstOrDefaultAsync(c => c.UserId == userId.Value);

        var order = await _context.Orders
            .Include(o => o.Restaurant)
            .Include(o => o.Customer)
                .ThenInclude(c => c.User)
            .Include(o => o.OrderItems)
            .FirstOrDefaultAsync(o => o.Id == id);

        if (order == null)
        {
            return NotFound(new { message = "Order not found" });
        }

        // Check if user has access to this order
        if (customer != null && order.CustomerId == customer.Id)
        {
            return Ok(MapToOrderResponse(order));
        }

        // Check if user is owner of the restaurant
        var owner = await _context.RestaurantOwners
            .Include(ro => ro.Restaurant)
            .FirstOrDefaultAsync(ro => ro.UserId == userId.Value && ro.Restaurant.Id == order.RestaurantId);

        if (owner != null)
        {
            return Ok(MapToOrderResponse(order));
        }

        return Forbid();
    }

    [HttpGet("restaurant/{restaurantId}")]
    [Authorize(Roles = "Owner")]
    public async Task<IActionResult> GetRestaurantOrders(int restaurantId)
    {
        var userId = GetCurrentUserId();
        if (!userId.HasValue)
        {
            return Unauthorized(new { message = "User not authenticated" });
        }

        // Verify owner owns this restaurant
        var owner = await _context.RestaurantOwners
            .Include(ro => ro.Restaurant)
            .FirstOrDefaultAsync(ro => ro.UserId == userId.Value && ro.Restaurant.Id == restaurantId);

        if (owner == null)
        {
            return Forbid();
        }

        var orders = await _context.Orders
            .Include(o => o.Restaurant)
            .Include(o => o.Customer)
                .ThenInclude(c => c.User)
            .Include(o => o.OrderItems)
            .Where(o => o.RestaurantId == restaurantId)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();

        var orderResponses = orders.Select(MapToOrderResponse).ToList();

        return Ok(orderResponses);
    }

    [HttpPut("{id}/status")]
    [Authorize(Roles = "Owner")]
    public async Task<IActionResult> UpdateOrderStatus(int id, [FromBody] UpdateOrderStatusRequest request)
    {
        var userId = GetCurrentUserId();
        if (!userId.HasValue)
        {
            return Unauthorized(new { message = "User not authenticated" });
        }

        var order = await _context.Orders
            .Include(o => o.Restaurant)
            .Include(o => o.Customer)
                .ThenInclude(c => c.User)
            .FirstOrDefaultAsync(o => o.Id == id);

        if (order == null)
        {
            return NotFound(new { message = "Order not found" });
        }

        // Verify owner owns this restaurant
        var owner = await _context.RestaurantOwners
            .Include(ro => ro.Restaurant)
            .FirstOrDefaultAsync(ro => ro.UserId == userId.Value && ro.Restaurant.Id == order.RestaurantId);

        if (owner == null)
        {
            return Forbid();
        }

        var oldStatus = order.Status;
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

        // Create notification for customer if exists
        if (order.CustomerId.HasValue && order.Customer?.User != null)
        {
            string notificationType = request.Status switch
            {
                "confirmed" => "order_confirmed",
                "cancelled" => "order_cancelled",
                "completed" => "order_completed",
                _ => "order_updated"
            };

            string notificationTitle = request.Status switch
            {
                "confirmed" => "Order Confirmed",
                "cancelled" => "Order Cancelled",
                "completed" => "Order Completed",
                _ => "Order Updated"
            };

            string notificationMessage = request.Status switch
            {
                "confirmed" => $"Your order {order.OrderId} has been confirmed.",
                "cancelled" => $"Your order {order.OrderId} has been cancelled.",
                "completed" => $"Your order {order.OrderId} has been completed.",
                _ => $"Your order {order.OrderId} status has been updated to {request.Status}."
            };

            var notification = new Notification
            {
                UserId = order.Customer.User.Id,
                RestaurantId = order.RestaurantId,
                OrderId = order.Id,
                Type = notificationType,
                Title = notificationTitle,
                Message = notificationMessage,
                IsRead = false,
                CreatedAt = DateTime.UtcNow
            };

            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync();
        }
        // Create notification for guest user if guest order
        else if (!order.CustomerId.HasValue && !string.IsNullOrEmpty(order.GuestEmail))
        {
            // Find guest identifier from previous notifications for this order
            var previousNotification = await _context.Notifications
                .Where(n => n.OrderId == order.Id && n.GuestIdentifier != null)
                .OrderByDescending(n => n.CreatedAt)
                .FirstOrDefaultAsync();

            if (previousNotification != null && !string.IsNullOrEmpty(previousNotification.GuestIdentifier))
            {
                string notificationType = request.Status switch
                {
                    "confirmed" => "order_confirmed",
                    "cancelled" => "order_cancelled",
                    "completed" => "order_completed",
                    _ => "order_updated"
                };

                string notificationTitle = request.Status switch
                {
                    "confirmed" => "Order Confirmed",
                    "cancelled" => "Order Cancelled",
                    "completed" => "Order Completed",
                    _ => "Order Updated"
                };

                string notificationMessage = request.Status switch
                {
                    "confirmed" => $"Your order {order.OrderId} has been confirmed.",
                    "cancelled" => $"Your order {order.OrderId} has been cancelled.",
                    "completed" => $"Your order {order.OrderId} has been completed.",
                    _ => $"Your order {order.OrderId} status has been updated to {request.Status}."
                };

                var guestNotification = new Notification
                {
                    GuestIdentifier = previousNotification.GuestIdentifier,
                    RestaurantId = order.RestaurantId,
                    OrderId = order.Id,
                    Type = notificationType,
                    Title = notificationTitle,
                    Message = notificationMessage,
                    IsRead = false,
                    CreatedAt = DateTime.UtcNow
                };

                _context.Notifications.Add(guestNotification);
                await _context.SaveChangesAsync();
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
            RestaurantName = order.Restaurant.Name,
            CustomerId = order.CustomerId,
            CustomerName = order.Customer?.User != null 
                ? $"{order.Customer.User.FirstName} {order.Customer.User.LastName}" 
                : order.GuestName,
            CustomerEmail = order.Customer?.User?.Email ?? order.GuestEmail,
            PaymentMethod = order.PaymentMethod,
            DeliveryMethod = order.DeliveryMethod,
            Status = order.Status,
            Subtotal = order.Subtotal,
            TipAmount = order.TipAmount,
            Total = order.Total,
            SpecialInstructions = order.SpecialInstructions,
            TableNumber = order.TableNumber,
            NumberOfPassengers = order.NumberOfPassengers,
            GuestName = order.GuestName,
            GuestEmail = order.GuestEmail,
            CreatedAt = order.CreatedAt,
            UpdatedAt = order.UpdatedAt,
            ConfirmedAt = order.ConfirmedAt,
            CompletedAt = order.CompletedAt,
            Items = order.OrderItems.Select(oi => new OrderItemResponse
            {
                Id = oi.Id,
                MenuItemId = oi.MenuItemId,
                ItemName = oi.ItemName,
                Quantity = oi.Quantity,
                UnitPrice = oi.UnitPrice,
                TotalPrice = oi.TotalPrice,
                SpecialInstructions = oi.SpecialInstructions,
                PriceOptionId = oi.PriceOptionId,
                PriceOptionName = oi.PriceOptionName
            }).ToList()
        };
    }
}

