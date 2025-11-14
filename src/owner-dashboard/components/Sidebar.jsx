import React, { useEffect, useRef } from "react";
import {
  RxDashboard,
  RxClipboard,
  RxTimer,
  RxStack,
  RxRocket,
  RxBarChart,
  RxQuestionMarkCircled,
  RxComponentInstance,
  RxLayers,
  RxGear,
} from "react-icons/rx";
import { NavLink } from "react-router-dom";

const PRIMARY_LINKS = [
  { label: "Dashboard", icon: RxDashboard, to: "/owner-dashboard" },
  { label: "Menus", icon: RxClipboard, to: "/owner-dashboard/menus" },
  { label: "Orders", icon: RxTimer, to: "/owner-dashboard/orders" },
];

const SECONDARY_LINKS = [
  { label: "Stores", icon: RxStack },
  { label: "Marketing", icon: RxRocket },
  { label: "Reports", icon: RxBarChart },
  { label: "Accounting", icon: RxComponentInstance },
  { label: "FAQ", icon: RxQuestionMarkCircled },
];

export function Sidebar() {
  const sidebarRef = useRef(null);
  const SCROLL_STORAGE_KEY = "ownerSidebarScrollTop";

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
        <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-500 text-white font-semibold">
          QT
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Menu Platform</p>
          <h1 className="text-xl font-bold text-slate-900">Owner Console</h1>
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
                  end={to === "/owner-dashboard"}
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
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Coming soon</p>
          <ul className="space-y-1">
            {SECONDARY_LINKS.map(({ label, icon: Icon }) => (
              <li key={label}>
                <span className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-400/80 transition">
                  <Icon className="size-5" />
                  <span>{label}</span>
                  <span className="ml-auto rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-600">
                    Beta
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-auto">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">System</p>
          <ul className="space-y-1">
            <li>
              <NavLink
                to="/owner-dashboard/integrations"
                className={({ isActive }) =>
                  [
                    "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition",
                    isActive ? "bg-emerald-500 text-white shadow" : "text-slate-600 hover:bg-slate-100",
                  ].join(" ")
                }
              >
                <RxLayers className="size-5" />
                <span>Integrations</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/owner-dashboard/settings"
                className={({ isActive }) =>
                  [
                    "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition",
                    isActive ? "bg-emerald-500 text-white shadow" : "text-slate-600 hover:bg-slate-100",
                  ].join(" ")
                }
              >
                <RxGear className="size-5" />
                <span>Settings</span>
              </NavLink>
            </li>
          </ul>
        </div>
      </nav>
      <div className="mt-auto rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
        Invite team members to collaborate on menus, track orders, and monitor performance in real time.
      </div>
    </aside>
  );
}


