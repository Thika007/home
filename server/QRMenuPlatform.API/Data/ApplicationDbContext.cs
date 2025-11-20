using Microsoft.EntityFrameworkCore;
using QRMenuPlatform.API.Models;

namespace QRMenuPlatform.API.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<RestaurantOwner> RestaurantOwners { get; set; }
    public DbSet<Customer> Customers { get; set; }
    public DbSet<SystemAdmin> SystemAdmins { get; set; }
    public DbSet<Restaurant> Restaurants { get; set; }
    public DbSet<RestaurantSettings> RestaurantSettings { get; set; }
    public DbSet<OperatingHour> OperatingHours { get; set; }
    public DbSet<Menu> Menus { get; set; }
    public DbSet<Category> Categories { get; set; }
    public DbSet<MenuItem> MenuItems { get; set; }
    public DbSet<ItemPriceOption> ItemPriceOptions { get; set; }
    public DbSet<Order> Orders { get; set; }
    public DbSet<OrderItem> OrderItems { get; set; }
    public DbSet<Notification> Notifications { get; set; }
    public DbSet<EmailVerification> EmailVerifications { get; set; }
    public DbSet<ActivityLog> ActivityLogs { get; set; }
    public DbSet<SystemSetting> SystemSettings { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // User relationships
        modelBuilder.Entity<RestaurantOwner>()
            .HasOne(ro => ro.User)
            .WithOne(u => u.RestaurantOwner)
            .HasForeignKey<RestaurantOwner>(ro => ro.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Customer>()
            .HasOne(c => c.User)
            .WithOne(u => u.Customer)
            .HasForeignKey<Customer>(c => c.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<SystemAdmin>()
            .HasOne(sa => sa.User)
            .WithOne(u => u.SystemAdmin)
            .HasForeignKey<SystemAdmin>(sa => sa.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        // Restaurant relationships
        modelBuilder.Entity<Restaurant>()
            .HasOne(r => r.Owner)
            .WithOne(ro => ro.Restaurant)
            .HasForeignKey<Restaurant>(r => r.OwnerId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<RestaurantSettings>()
            .HasOne(rs => rs.Restaurant)
            .WithOne(r => r.Settings)
            .HasForeignKey<RestaurantSettings>(rs => rs.RestaurantId)
            .OnDelete(DeleteBehavior.Cascade);

        // Order relationships - use NoAction to avoid cascade path issues
        modelBuilder.Entity<Order>()
            .HasOne(o => o.Customer)
            .WithMany(c => c.Orders)
            .HasForeignKey(o => o.CustomerId)
            .OnDelete(DeleteBehavior.NoAction);

        modelBuilder.Entity<OrderItem>()
            .HasOne(oi => oi.Order)
            .WithMany(o => o.OrderItems)
            .HasForeignKey(oi => oi.OrderId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<OrderItem>()
            .HasOne(oi => oi.MenuItem)
            .WithMany(mi => mi.OrderItems)
            .HasForeignKey(oi => oi.MenuItemId)
            .OnDelete(DeleteBehavior.NoAction);

        // Notification relationships
        modelBuilder.Entity<Notification>()
            .HasOne(n => n.User)
            .WithMany()
            .HasForeignKey(n => n.UserId)
            .OnDelete(DeleteBehavior.NoAction);

        modelBuilder.Entity<Notification>()
            .HasOne(n => n.Restaurant)
            .WithMany()
            .HasForeignKey(n => n.RestaurantId)
            .OnDelete(DeleteBehavior.NoAction);

        modelBuilder.Entity<Notification>()
            .HasOne(n => n.Order)
            .WithMany()
            .HasForeignKey(n => n.OrderId)
            .OnDelete(DeleteBehavior.NoAction);

        // Indexes
        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();

        modelBuilder.Entity<Order>()
            .HasIndex(o => o.OrderId)
            .IsUnique();

        modelBuilder.Entity<Notification>()
            .HasIndex(n => n.UserId);

        modelBuilder.Entity<Notification>()
            .HasIndex(n => n.RestaurantId);

        modelBuilder.Entity<Notification>()
            .HasIndex(n => n.IsRead);
    }
}

