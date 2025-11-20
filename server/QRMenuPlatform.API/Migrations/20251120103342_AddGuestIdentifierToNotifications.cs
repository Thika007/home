using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace QRMenuPlatform.API.Migrations
{
    /// <inheritdoc />
    public partial class AddGuestIdentifierToNotifications : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "GuestIdentifier",
                table: "Notifications",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "GuestIdentifier",
                table: "Notifications");
        }
    }
}
