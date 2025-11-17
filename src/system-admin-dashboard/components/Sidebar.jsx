import React, { useEffect, useRef } from "react";
import {
  RxDashboard,
  RxPerson,
  RxClipboard,
  RxGear,
  RxFileText,
} from "react-icons/rx";
import { NavLink } from "react-router-dom";

const PRIMARY_LINKS = [
  { label: "Dashboard", icon: RxDashboard, to: "/system-admin-dashboard" },
  { label: "Owners", icon: RxPerson, to: "/system-admin-dashboard/owners" },
  { label: "Orders", icon: RxClipboard, to: "/system-admin-dashboard/orders" },
  { label: "Users", icon: RxPerson, to: "/system-admin-dashboard/users" },
];

const SYSTEM_LINKS = [
  { label: "Settings", icon: RxGear, to: "/system-admin-dashboard/settings" },
  { label: "Activity Logs", icon: RxFileText, to: "/system-admin-dashboard/logs" },
];

export function Sidebar() {
  const sidebarRef = useRef(null);
  const SCROLL_STORAGE_KEY = "systemAdminSidebarScrollTop";

  useEffect(() => {
    const sidebarElement = sidebarRef.current;
    if (!sidebarElement) return;

    // Restore saved scroll position if available
    const savedPosition = sessionStorage.getItem(SCROLL_STORAGE_KEY);
    if (savedPosition !== null) {
      sidebarElement.scrollTop = parseInt(savedPosition, 10);
    }

    const handleScroll = () => {
      sessionStorage.setItem(SCROLL_STORAGE_KEY, sidebarElement.scrollTop.toString());
    };

    sidebarElement.addEventListener("scroll", handleScroll);

    return () => {
      sidebarElement.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <aside
      ref={sidebarRef}
      className="hidden h-full w-72 flex-shrink-0 flex-col overflow-y-auto border-r border-slate-200 bg-white px-6 py-8 shadow-sm xl:flex"
    >
      <div className="mb-10 flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-lg bg-slate-900 text-white font-semibold">
          SA
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Menu Platform</p>
          <h1 className="text-xl font-bold text-slate-900">System Admin</h1>
        </div>
      </div>
      <nav className="flex flex-1 flex-col gap-6">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Manage</p>
          <ul className="space-y-1">
            {PRIMARY_LINKS.map(({ label, icon: Icon, to }) => (
              <li key={label}>
                <NavLink
                  to={to}
                  end={to === "/system-admin-dashboard"}
                  className={({ isActive }) =>
                    [
                      "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition",
                      isActive ? "bg-emerald-500 text-white shadow" : "text-slate-600 hover:bg-slate-100",
                    ].join(" ")
                  }
                >
                  <Icon className="size-5" />
                  <span>{label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-auto">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">System</p>
          <ul className="space-y-1">
            {SYSTEM_LINKS.map(({ label, icon: Icon, to }) => (
              <li key={label}>
                <NavLink
                  to={to}
                  className={({ isActive }) =>
                    [
                      "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition",
                      isActive ? "bg-emerald-500 text-white shadow" : "text-slate-600 hover:bg-slate-100",
                    ].join(" ")
                  }
                >
                  <Icon className="size-5" />
                  <span>{label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </nav>
      <div className="mt-auto rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
        System administration tools for managing the entire platform and all registered restaurants.
      </div>
    </aside>
  );
}

