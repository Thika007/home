import React from "react";
import { RxClock, RxCheck, RxCross2, RxMagnifyingGlass, RxInfoCircled } from "react-icons/rx";
import { authAPI } from "../../services/api";

export function PendingRegistrationsPage() {
  const [registrations, setRegistrations] = React.useState([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("pending");
  const [selectedRegistration, setSelectedRegistration] = React.useState(null);
  const [showModal, setShowModal] = React.useState(false);

  React.useEffect(() => {
    const loadRegistrations = async () => {
      try {
        const data = await authAPI.getPendingRegistrations();
        setRegistrations(data);
      } catch (error) {
        console.error("Failed to load pending registrations:", error);
        setRegistrations([]);
      }
    };

    loadRegistrations();
    const interval = setInterval(loadRegistrations, 5000); // Refresh every 5 seconds
    return () => {
      clearInterval(interval);
    };
  }, []);

  const filteredRegistrations = registrations.filter((reg) => {
    const matchesSearch =
      reg.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.restaurantName?.toLowerCase().includes(searchTerm.toLowerCase());
    // All registrations from API are pending (IsApproved = false)
    const matchesStatus = statusFilter === "all" || statusFilter === "pending";
    return matchesSearch && matchesStatus;
  });

  const handleApprove = async (registration) => {
    if (!window.confirm(`Approve registration for ${registration.firstName} ${registration.lastName} (${registration.restaurantName})?`)) {
      return;
    }

    try {
      await authAPI.approveOwner(registration.id);
      
      // Remove from list (it's now approved, so won't show in pending)
      setRegistrations(prev => prev.filter(reg => reg.id !== registration.id));
      setShowModal(false);
      
      alert("Owner approved successfully!");
    } catch (error) {
      console.error("Failed to approve owner:", error);
      alert(`Failed to approve owner: ${error.message || "Please try again."}`);
    }
  };

  const handleReject = async (registration) => {
    const reason = window.prompt(`Reject registration for ${registration.firstName} ${registration.lastName}?\nEnter rejection reason (optional):`);
    if (reason === null) return; // User cancelled

    try {
      await authAPI.rejectOwner(registration.id, reason || "");
      
      // Remove from list (rejected owners are deactivated)
      setRegistrations(prev => prev.filter(reg => reg.id !== registration.id));
      setShowModal(false);
      
      alert("Owner registration rejected.");
    } catch (error) {
      console.error("Failed to reject owner:", error);
      alert(`Failed to reject owner: ${error.message || "Please try again."}`);
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleString();
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
        <RxClock className="size-3" />
        Pending
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Pending Registrations</h1>
            <p className="mt-2 text-sm text-slate-500">Review and approve or reject owner registration requests.</p>
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
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Registrations Table */}
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
                  Submitted
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
              {filteredRegistrations.length > 0 ? (
                filteredRegistrations.map((reg) => (
                  <tr key={reg.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                          {reg.firstName?.[0] || ""}{reg.lastName?.[0] || ""}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            {reg.firstName} {reg.lastName}
                          </p>
                          <p className="text-xs text-slate-500">{reg.phone || "No phone"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{reg.restaurantName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{reg.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {formatDateTime(reg.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(reg.isApproved)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedRegistration(reg);
                            setShowModal(true);
                          }}
                          className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                          <RxInfoCircled className="size-3" />
                          View
                        </button>
                        {!reg.isApproved && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleApprove(reg)}
                              className="flex items-center gap-1 rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-600"
                            >
                              <RxCheck className="size-3" />
                              Approve
                            </button>
                            <button
                              type="button"
                              onClick={() => handleReject(reg)}
                              className="flex items-center gap-1 rounded-lg bg-red-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-red-600"
                            >
                              <RxCross2 className="size-3" />
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <RxClock className="mb-4 size-12 text-slate-300" />
                      <p className="text-sm font-medium text-slate-600">No registrations found</p>
                      <p className="mt-1 text-xs text-slate-500">
                        {searchTerm ? "Try adjusting your search filters" : "No pending registrations"}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* View Details Modal */}
      {showModal && selectedRegistration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white shadow-xl">
            <div className="border-b border-slate-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-900">Registration Details</h2>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                >
                  <RxCross2 className="size-5" />
                </button>
              </div>
            </div>
            <div className="max-h-[60vh] overflow-y-auto px-6 py-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-slate-700">Owner Information</h3>
                  <div className="mt-2 grid grid-cols-2 gap-4 rounded-lg bg-slate-50 p-4">
                    <div>
                      <p className="text-xs text-slate-500">Name</p>
                      <p className="text-sm font-medium text-slate-900">
                        {selectedRegistration.firstName} {selectedRegistration.lastName}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Email</p>
                      <p className="text-sm font-medium text-slate-900">{selectedRegistration.email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Phone</p>
                      <p className="text-sm font-medium text-slate-900">{selectedRegistration.phone || "—"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Submitted</p>
                      <p className="text-sm font-medium text-slate-900">{formatDateTime(selectedRegistration.createdAt)}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-700">Restaurant Information</h3>
                  <div className="mt-2 grid grid-cols-2 gap-4 rounded-lg bg-slate-50 p-4">
                    <div>
                      <p className="text-xs text-slate-500">Restaurant Name</p>
                      <p className="text-sm font-medium text-slate-900">{selectedRegistration.restaurantName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Tagline</p>
                      <p className="text-sm font-medium text-slate-900">{selectedRegistration.tagline || "—"}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-xs text-slate-500">Description</p>
                      <p className="text-sm font-medium text-slate-900">{selectedRegistration.description || "—"}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-xs text-slate-500">Address</p>
                      <p className="text-sm font-medium text-slate-900">{selectedRegistration.address}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Contact Email</p>
                      <p className="text-sm font-medium text-slate-900">{selectedRegistration.contactEmail}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Contact Phone</p>
                      <p className="text-sm font-medium text-slate-900">{selectedRegistration.contactPhone || "—"}</p>
                    </div>
                  </div>
                </div>
                {selectedRegistration.approvedAt && (
                  <div>
                    <h3 className="text-sm font-semibold text-slate-700">Review Information</h3>
                    <div className="mt-2 grid grid-cols-2 gap-4 rounded-lg bg-slate-50 p-4">
                      <div>
                        <p className="text-xs text-slate-500">Approved At</p>
                        <p className="text-sm font-medium text-slate-900">{formatDateTime(selectedRegistration.approvedAt)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Approved By</p>
                        <p className="text-sm font-medium text-slate-900">{selectedRegistration.approvedBy ? `Admin ID: ${selectedRegistration.approvedBy}` : "—"}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="border-t border-slate-200 px-6 py-4">
              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Close
                </button>
                {!selectedRegistration.isApproved && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleReject(selectedRegistration)}
                      className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
                    >
                      Reject
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApprove(selectedRegistration)}
                      className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600"
                    >
                      Approve
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

