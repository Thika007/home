using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace QRMenuPlatform.API.Migrations
{
    /// <inheritdoc />
    public partial class AddWhyChooseUsFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "WhyChooseUsBody",
                table: "Restaurants",
                type: "nvarchar(2000)",
                maxLength: 2000,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "WhyChooseUsImageUrl",
                table: "Restaurants",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "WhyChooseUsTitle",
                table: "Restaurants",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "WhyChooseUsBody",
                table: "Restaurants");

            migrationBuilder.DropColumn(
                name: "WhyChooseUsImageUrl",
                table: "Restaurants");

            migrationBuilder.DropColumn(
                name: "WhyChooseUsTitle",
                table: "Restaurants");
        }
    }
}
