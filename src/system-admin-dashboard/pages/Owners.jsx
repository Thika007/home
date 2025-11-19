import React from "react";
import { RxPerson, RxMagnifyingGlass, RxCheck, RxCross2 } from "react-icons/rx";
import { authAPI } from "../../services/api";

export function OwnersPage() {
  const [owners, setOwners] = React.useState([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");

  React.useEffect(() => {
    const loadOwners = async () => {
      try {
        const data = await authAPI.getOwners();
        setOwners(data);
      } catch (error) {
        console.error("Failed to load owners:", error);
        setOwners([]);
      }
    };

    loadOwners();
    const interval = setInterval(loadOwners, 5000); // Refresh every 5 seconds
    return () => {
      clearInterval(interval);
    };
  }, []);

  const filteredOwners = owners.filter((owner) => {
    const matchesSearch =
      owner.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      owner.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      owner.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      owner.restaurantName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = 
      statusFilter === "all" || 
      (statusFilter === "approved" && owner.isApproved) ||
      (statusFilter === "pending" && !owner.isApproved);
    return matchesSearch && matchesStatus;
  });

  const getInitials = (firstName, lastName) => {
    const first = firstName?.[0] || "";
    const last = lastName?.[0] || "";
    return (first + last).toUpperCase() || "NA";
  };

  const getStatusBadge = (isApproved) => {
    if (isApproved) {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-800">
          <RxCheck className="size-3" />
          Approved
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-800">
        Pending
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Owners Management</h1>
            <p className="mt-2 text-sm text-slate-500">View and manage all approved restaurant owners.</p>
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <RxMagnifyingGlass className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, email or restaurant..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
          >
            <option value="all">All Status</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Owners Table */}
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Owner
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Restaurant
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Phone
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Registered
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {filteredOwners.length > 0 ? (
                filteredOwners.map((owner) => (
                  <tr key={owner.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                          {getInitials(owner.firstName, owner.lastName)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            {owner.firstName} {owner.lastName}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{owner.restaurantName || "—"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{owner.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{owner.phone || "—"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {owner.createdAt ? new Date(owner.createdAt).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(owner.isApproved)}
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
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <RxPerson className="mb-4 size-12 text-slate-300" />
                      <p className="text-sm font-medium text-slate-600">No owners found</p>
                      <p className="mt-1 text-xs text-slate-500">
                        {searchTerm ? "Try adjusting your search filters" : "No owners have registered yet"}
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

