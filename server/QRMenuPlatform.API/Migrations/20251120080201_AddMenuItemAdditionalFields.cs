using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace QRMenuPlatform.API.Migrations
{
    /// <inheritdoc />
    public partial class AddMenuItemAdditionalFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "DisplayOn",
                table: "MenuItems",
                type: "nvarchar(1000)",
                maxLength: 1000,
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "Featured",
                table: "MenuItems",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "IngredientWarnings",
                table: "MenuItems",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Labels",
                table: "MenuItems",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "MarkAsSoldOut",
                table: "MenuItems",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "PreparationTime",
                table: "MenuItems",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Recommended",
                table: "MenuItems",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Size",
                table: "MenuItems",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TaxCategories",
                table: "MenuItems",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Unit",
                table: "MenuItems",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DisplayOn",
                table: "MenuItems");

            migrationBuilder.DropColumn(
                name: "Featured",
                table: "MenuItems");

            migrationBuilder.DropColumn(
                name: "IngredientWarnings",
                table: "MenuItems");

            migrationBuilder.DropColumn(
                name: "Labels",
                table: "MenuItems");

            migrationBuilder.DropColumn(
                name: "MarkAsSoldOut",
                table: "MenuItems");

            migrationBuilder.DropColumn(
                name: "PreparationTime",
                table: "MenuItems");

            migrationBuilder.DropColumn(
                name: "Recommended",
                table: "MenuItems");

            migrationBuilder.DropColumn(
                name: "Size",
                table: "MenuItems");

            migrationBuilder.DropColumn(
                name: "TaxCategories",
                table: "MenuItems");

            migrationBuilder.DropColumn(
                name: "Unit",
                table: "MenuItems");
        }
    }
}
