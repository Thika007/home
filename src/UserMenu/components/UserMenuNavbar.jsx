import React from "react";
import { useNavigate } from "react-router-dom";
import { useRestaurantInfo } from "../hooks/useRestaurantInfo";

export function UserMenuNavbar() {
  const navigate = useNavigate();
  const restaurant = useRestaurantInfo();

  return (
    <header className="flex w-full items-center justify-center bg-slate-950 px-6 py-4 text-white">
      <div className="flex w-full max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <img src={restaurant.logo} alt="Logo" className="h-10 w-auto" />
        </div>
        <nav className="flex flex-wrap items-center gap-4 text-sm font-semibold sm:gap-6">
          <button
            type="button"
            onClick={() => navigate("/menu")}
            className="transition hover:text-emerald-300"
          >
            MENU
          </button>
          <button
            type="button"
            onClick={() => navigate("/menu-feedback")}
            className="transition hover:text-emerald-300"
          >
            FEEDBACK
          </button>
          <button
            type="button"
            className="flex items-center gap-1 transition hover:text-emerald-300"
            aria-label="Change language"
          >
            <span role="img" aria-label="language">
              🌐
            </span>
          </button>
          <button
            type="button"
            onClick={() => navigate("/menu-login")}
            className="text-amber-300 transition hover:text-amber-200"
          >
            Login
          </button>
        </nav>
      </div>
    </header>
  );
}

