import React from "react";
import {
  RxSun,
  RxGlobe,
  RxBell,
  RxDoubleArrowLeft,
  RxPerson,
  RxChevronDown,
} from "react-icons/rx";
import { useNavigate } from "react-router-dom";

export function Topbar() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const menuRef = React.useRef(null);

  // Get admin info from localStorage
  const adminAccount = React.useMemo(() => {
    try {
      const saved = localStorage.getItem("systemAdminAccount");
      return saved ? JSON.parse(saved) : { name: "System Admin", email: "admin@system.com" };
    } catch {
      return { name: "System Admin", email: "admin@system.com" };
    }
  }, []);

  const getInitials = (name) => {
    if (!name) return "SA";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const handleNavigateToSettings = () => {
    setIsMenuOpen(false);
    navigate("/system-admin-dashboard/settings");
  };

  const handleLogout = () => {
    setIsMenuOpen(false);
    localStorage.removeItem("systemAdminAccount");
    navigate("/login");
  };

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-slate-200 bg-white/95 px-6 backdrop-blur">
      <img
        src="https://d22po4pjz3o32e.cloudfront.net/logo-image.svg"
        alt="QR Menu Platform logo"
        className="h-10 w-auto"
      />
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="rounded-full border border-slate-200 bg-white p-2 text-slate-500 transition hover:border-emerald-500 hover:text-emerald-500"
        >
          <RxSun className="size-5" />
        </button>
        <button
          type="button"
          className="rounded-full border border-slate-200 bg-white p-2 text-slate-500 transition hover:border-emerald-500 hover:text-emerald-500"
        >
          <RxGlobe className="size-5" />
        </button>
        <button
          type="button"
          className="relative rounded-full border border-slate-200 bg-white p-2 text-slate-500 transition hover:border-emerald-500 hover:text-emerald-500"
        >
          <RxBell className="size-5" />
          <span className="absolute -right-0.5 -top-0.5 size-4 rounded-full bg-rose-500 text-[10px] font-semibold leading-none text-white">
            0
          </span>
        </button>
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="flex items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 transition hover:border-emerald-500"
          >
            <div className="flex size-9 items-center justify-center rounded-full bg-slate-900 text-base font-semibold text-white">
              {getInitials(adminAccount.name)}
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-slate-800">{adminAccount.name}</p>
              <p className="text-xs text-slate-500">System Admin</p>
            </div>
            <RxChevronDown
              className={[
                "size-4 text-slate-400 transition",
                isMenuOpen ? "rotate-180 text-emerald-500" : "",
              ].join(" ")}
            />
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-lg">
              <button
                type="button"
                onClick={handleNavigateToSettings}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                <RxPerson className="size-4 text-slate-400" />
                Settings
              </button>
              <div className="my-1 h-px bg-slate-100" />
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-50"
              >
                <RxDoubleArrowLeft className="size-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

