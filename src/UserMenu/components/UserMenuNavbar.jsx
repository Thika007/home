import React from "react";
import { useNavigate } from "react-router-dom";
import { useRestaurantInfo } from "../hooks/useRestaurantInfo";
import { useCart } from "../hooks/useCart";

export function UserMenuNavbar() {
  const navigate = useNavigate();
  const restaurant = useRestaurantInfo();
  const { cartItemsCount } = useCart();

  return (
    <header className="flex w-full items-center justify-center bg-slate-950 px-6 py-4 text-white">
      <div className="flex w-full max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <img
            src={restaurant.logo || "https://d22po4pjz3o32e.cloudfront.net/logo-image.svg"}
            alt="Logo"
            className="h-10 w-auto"
            onError={(e) => {
              e.target.src = "https://d22po4pjz3o32e.cloudfront.net/logo-image.svg";
            }}
          />
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
          {/* Cart Icon */}
          <button
            type="button"
            onClick={() => navigate("/menu-cart")}
            className="relative flex items-center gap-1 transition hover:text-emerald-300"
            aria-label="Shopping cart"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            {cartItemsCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                {cartItemsCount}
              </span>
            )}
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

