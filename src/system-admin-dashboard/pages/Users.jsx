import React from "react";
import { RxPerson, RxMagnifyingGlass } from "react-icons/rx";

export function UsersPage() {
  const [users, setUsers] = React.useState([]);
  const [searchTerm, setSearchTerm] = React.useState("");

  React.useEffect(() => {
    // Load users from localStorage
    // Note: menuUser stores a single user object, not an array
    // In a real system, this would be an array of users
    const loadUsers = () => {
      try {
        const userData = localStorage.getItem("menuUser");
        const usersList = userData ? [JSON.parse(userData)] : [];
        setUsers(usersList);
      } catch {
        setUsers([]);
      }
    };

    loadUsers();
    // Listen for storage changes
    window.addEventListener("storage", loadUsers);
    const interval = setInterval(loadUsers, 2000);
    return () => {
      window.removeEventListener("storage", loadUsers);
      clearInterval(interval);
    };
  }, []);

  // Get order statistics for each user
  const getUserStats = (userEmail) => {
    const orders = JSON.parse(localStorage.getItem("orders") || "[]");
    const userOrders = orders.filter((order) => order.userEmail === userEmail);
    const totalSpent = userOrders.reduce((sum, order) => sum + (order.total || 0), 0);
    return {
      totalOrders: userOrders.length,
      totalSpent: totalSpent,
    };
  };

  const filteredUsers = users.filter((user) => {
    const name = (user.name || user.email || "").toLowerCase();
    const email = (user.email || "").toLowerCase();
    return name.includes(searchTerm.toLowerCase()) || email.includes(searchTerm.toLowerCase());
  });

  const getInitials = (name, email) => {
    if (name) {
      const parts = name.split(" ");
      if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
      }
      return name.substring(0, 2).toUpperCase();
    }
    if (email) {
      return email.substring(0, 2).toUpperCase();
    }
    return "U";
  };

  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Users Management</h1>
            <p className="mt-2 text-sm text-slate-500">View and manage all customer users.</p>
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="relative flex-1 min-w-[200px]">
          <RxMagnifyingGlass className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
          />
        </div>
      </div>

      {/* Users Table */}
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                  User
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Total Orders
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Total Spent
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user, index) => {
                  const stats = getUserStats(user.email);
                  return (
                    <tr key={user.id || index} className="hover:bg-slate-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="flex size-10 items-center justify-center rounded-full bg-purple-500 text-sm font-semibold text-white">
                            {getInitials(user.name, user.email)}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-900">{user.name || "Guest User"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{stats.totalOrders}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-900">
                        LKR {stats.totalSpent.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          type="button"
                          className="font-semibold text-emerald-600 transition hover:text-emerald-700"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <RxPerson className="mb-4 size-12 text-slate-300" />
                      <p className="text-sm font-medium text-slate-600">No users found</p>
                      <p className="mt-1 text-xs text-slate-500">
                        {searchTerm ? "Try adjusting your search filters" : "No users have registered yet"}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

