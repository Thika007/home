using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace QRMenuPlatform.API.Migrations
{
    /// <inheritdoc />
    public partial class AddOwnerProfilePicture : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ProfilePictureUrl",
                table: "RestaurantOwners",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ProfilePictureUrl",
                table: "RestaurantOwners");
        }
    }
}
