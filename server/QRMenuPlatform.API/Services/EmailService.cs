using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using QRMenuPlatform.API.Models;

namespace QRMenuPlatform.API.Services;

public class EmailService : IEmailService
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<EmailService> _logger;

    public EmailService(IConfiguration configuration, ILogger<EmailService> logger)
    {
        _configuration = configuration;
        _logger = logger;
    }

    public async Task SendVerificationEmailAsync(string email, string token, string firstName)
    {
        try
        {
            var frontendUrl = _configuration["AppSettings:FrontendUrl"];
            var verificationLink = $"{frontendUrl}/verify-email?token={token}";

            var message = new MimeMessage();
            message.From.Add(new MailboxAddress(
                _configuration["EmailSettings:SenderName"],
                _configuration["EmailSettings:SenderEmail"]));
            message.To.Add(new MailboxAddress(firstName, email));
            message.Subject = "Verify Your Email - QR Menu Platform";

            var bodyBuilder = new BodyBuilder
            {
                HtmlBody = $@"
                    <h2>Welcome to QR Menu Platform!</h2>
                    <p>Hi {firstName},</p>
                    <p>Please verify your email address by clicking the link below:</p>
                    <p><a href='{verificationLink}'>Verify Email</a></p>
                    <p>Or copy this link: {verificationLink}</p>
                    <p>This link will expire in 24 hours.</p>
                    <p>If you didn't create this account, please ignore this email.</p>
                "
            };

            message.Body = bodyBuilder.ToMessageBody();

            using var client = new SmtpClient();
            await client.ConnectAsync(
                _configuration["EmailSettings:SmtpServer"],
                int.Parse(_configuration["EmailSettings:SmtpPort"]!),
                SecureSocketOptions.StartTls);

            await client.AuthenticateAsync(
                _configuration["EmailSettings:SenderEmail"],
                _configuration["EmailSettings:SenderPassword"]);

            await client.SendAsync(message);
            await client.DisconnectAsync(true);

            _logger.LogInformation("Verification email sent to {Email}", email);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send verification email to {Email}", email);
            throw;
        }
    }

    public async Task SendApprovalEmailAsync(string email, string firstName, string restaurantName)
    {
        try
        {
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress(
                _configuration["EmailSettings:SenderName"],
                _configuration["EmailSettings:SenderEmail"]));
            message.To.Add(new MailboxAddress(firstName, email));
            message.Subject = "Restaurant Approved - QR Menu Platform";

            var bodyBuilder = new BodyBuilder
            {
                HtmlBody = $@"
                    <h2>Congratulations!</h2>
                    <p>Hi {firstName},</p>
                    <p>Your restaurant <strong>{restaurantName}</strong> has been approved by our admin team.</p>
                    <p>You can now log in and start managing your menu and orders.</p>
                    <p>Welcome to QR Menu Platform!</p>
                "
            };

            message.Body = bodyBuilder.ToMessageBody();

            using var client = new SmtpClient();
            await client.ConnectAsync(
                _configuration["EmailSettings:SmtpServer"],
                int.Parse(_configuration["EmailSettings:SmtpPort"]!),
                SecureSocketOptions.StartTls);

            await client.AuthenticateAsync(
                _configuration["EmailSettings:SenderEmail"],
                _configuration["EmailSettings:SenderPassword"]);

            await client.SendAsync(message);
            await client.DisconnectAsync(true);

            _logger.LogInformation("Approval email sent to {Email}", email);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send approval email to {Email}", email);
            throw;
        }
    }

    public async Task SendOrderConfirmationEmailAsync(string email, string orderId, decimal total)
    {
        try
        {
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress(
                _configuration["EmailSettings:SenderName"],
                _configuration["EmailSettings:SenderEmail"]));
            message.To.Add(new MailboxAddress("", email));
            message.Subject = $"Order Confirmation - {orderId}";

            var bodyBuilder = new BodyBuilder
            {
                HtmlBody = $@"
                    <h2>Order Confirmed!</h2>
                    <p>Your order <strong>{orderId}</strong> has been confirmed.</p>
                    <p>Total: LKR {total:F2}</p>
                    <p>Thank you for your order!</p>
                "
            };

            message.Body = bodyBuilder.ToMessageBody();

            using var client = new SmtpClient();
            await client.ConnectAsync(
                _configuration["EmailSettings:SmtpServer"],
                int.Parse(_configuration["EmailSettings:SmtpPort"]!),
                SecureSocketOptions.StartTls);

            await client.AuthenticateAsync(
                _configuration["EmailSettings:SenderEmail"],
                _configuration["EmailSettings:SenderPassword"]);

            await client.SendAsync(message);
            await client.DisconnectAsync(true);

            _logger.LogInformation("Order confirmation email sent to {Email}", email);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send order confirmation email to {Email}", email);
            throw;
        }
    }
}

