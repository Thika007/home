namespace QRMenuPlatform.API.Services;

public interface IEmailService
{
    Task SendVerificationEmailAsync(string email, string token, string firstName);
    Task SendApprovalEmailAsync(string email, string firstName, string restaurantName);
    Task SendOrderConfirmationEmailAsync(string email, string orderId, decimal total);
}

