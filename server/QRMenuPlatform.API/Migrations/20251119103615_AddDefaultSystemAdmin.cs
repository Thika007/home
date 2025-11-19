using System.Security.Cryptography;
using System.Text;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace QRMenuPlatform.API.Migrations
{
    /// <inheritdoc />
    public partial class AddDefaultSystemAdmin : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Compute password hash for "Admin1234"
            var password = "Admin1234";
            using var sha256 = SHA256.Create();
            var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            var passwordHash = Convert.ToBase64String(hashedBytes);

            // Insert default SystemAdmin user
            migrationBuilder.Sql($@"
                IF NOT EXISTS (SELECT 1 FROM Users WHERE Email = 'Admin@gmil.com')
                BEGIN
                    DECLARE @UserId INT;
                    
                    INSERT INTO Users (Email, PasswordHash, FirstName, LastName, Role, IsEmailVerified, IsActive, CreatedAt)
                    VALUES ('Admin@gmil.com', '{passwordHash}', 'Admin', 'User', 'SystemAdmin', 1, 1, GETUTCDATE());
                    
                    SET @UserId = SCOPE_IDENTITY();
                    
                    INSERT INTO SystemAdmins (UserId, CreatedAt)
                    VALUES (@UserId, GETUTCDATE());
                END
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
                DELETE FROM SystemAdmins WHERE UserId IN (SELECT Id FROM Users WHERE Email = 'Admin@gmil.com');
                DELETE FROM Users WHERE Email = 'Admin@gmil.com';
            ");
        }
    }
}
