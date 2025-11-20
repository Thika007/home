import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRestaurantInfo } from "../hooks/useRestaurantInfo";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";
import { NotificationDropdown } from "./NotificationDropdown";

export function UserMenuNavbar() {
  const navigate = useNavigate();
  const restaurant = useRestaurantInfo();
  const { cartItemsCount } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  // Close user menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/menu");
    setUserMenuOpen(false);
  };

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
          {/* Notification Icon */}
          <NotificationDropdown />
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
          {/* User Menu or Login Button */}
          {isAuthenticated && user ? (
            <div className="relative" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 text-amber-300 transition hover:text-amber-200"
              >
                <span className="hidden sm:inline">Welcome, {user.firstName || user.name?.split(" ")[0] || "User"}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 top-full z-50 mt-2 w-48 rounded-lg bg-white shadow-2xl border border-slate-200">
                  <div className="p-3 border-b border-slate-200">
                    <p className="text-sm font-semibold text-slate-900">{user.name || user.email}</p>
                    <p className="text-xs text-slate-500">{user.email}</p>
                  </div>
                  <div className="p-1">
                    <button
                      type="button"
                      onClick={() => {
                        navigate("/menu-order-history");
                        setUserMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded transition"
                    >
                      Order History
                    </button>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded transition"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => navigate("/menu-login")}
              className="text-amber-300 transition hover:text-amber-200"
            >
              Login
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}

