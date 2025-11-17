import React from "react";
import { useNavigate } from "react-router-dom";
import { RxBarChart, RxPerson, RxClipboard, RxRocket, RxStack } from "react-icons/rx";

export function DashboardPage() {
  const navigate = useNavigate();
  // Load data from localStorage
  const [stats, setStats] = React.useState({
    totalOwners: 0,
    activeRestaurants: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalUsers: 0,
    totalMenus: 0,
  });

  React.useEffect(() => {
    // Calculate statistics from localStorage
    const owners = JSON.parse(localStorage.getItem("ownerAccounts") || "[]");
    const orders = JSON.parse(localStorage.getItem("orders") || "[]");
    // menuUser is a single object, not an array
    const userData = localStorage.getItem("menuUser");
    const users = userData ? [JSON.parse(userData)] : [];
    const menus = JSON.parse(localStorage.getItem("menus") || "[]");

    const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);

    setStats({
      totalOwners: owners.length,
      activeRestaurants: owners.length, // Assuming all registered owners have active restaurants
      totalOrders: orders.length,
      totalRevenue: totalRevenue,
      totalUsers: users.length,
      totalMenus: menus.length,
    });
  }, []);

  const METRICS = [
    { label: "Total Owners", value: stats.totalOwners.toString(), icon: RxPerson, accent: "bg-slate-900 text-white" },
    { label: "Active Restaurants", value: stats.activeRestaurants.toString(), icon: RxStack, accent: "bg-emerald-500 text-white" },
    { label: "Total Orders", value: stats.totalOrders.toString(), icon: RxClipboard, accent: "bg-slate-800 text-white" },
    { label: "Total Revenue", value: `LKR ${stats.totalRevenue.toFixed(2)}`, icon: RxRocket, accent: "bg-blue-500 text-white" },
    { label: "Total Users", value: stats.totalUsers.toString(), icon: RxPerson, accent: "bg-purple-500 text-white" },
    { label: "Total Menus", value: stats.totalMenus.toString(), icon: RxBarChart, accent: "bg-amber-500 text-white" },
  ];

  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">System Dashboard</h1>
            <p className="mt-2 text-sm text-slate-500">
              Overview of platform-wide statistics and performance metrics.
            </p>
          </div>
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {METRICS.map(({ label, value, icon: Icon, accent }) => (
          <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className={`mb-4 inline-flex size-12 items-center justify-center rounded-xl ${accent}`}>
              <Icon className="size-6" />
            </div>
            <p className="text-sm font-medium text-slate-500">{label}</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Recent Activity</h3>
              <p className="text-sm text-slate-500">Latest system events and updates.</p>
            </div>
          </div>
          <div className="mt-6 flex h-64 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 text-sm text-slate-400">
            Activity feed coming soon.
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Quick Actions</h3>
          <p className="mt-2 text-sm text-slate-500">
            Common administrative tasks and shortcuts.
          </p>
          <div className="mt-6 space-y-3">
            <button
              type="button"
              onClick={() => navigate("/system-admin-dashboard/owners")}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-semibold text-slate-700 transition hover:border-emerald-500 hover:bg-emerald-50"
            >
              View All Owners
            </button>
            <button
              type="button"
              onClick={() => navigate("/system-admin-dashboard/orders")}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-semibold text-slate-700 transition hover:border-emerald-500 hover:bg-emerald-50"
            >
              View All Orders
            </button>
            <button
              type="button"
              onClick={() => navigate("/system-admin-dashboard/settings")}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-semibold text-slate-700 transition hover:border-emerald-500 hover:bg-emerald-50"
            >
              System Settings
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

