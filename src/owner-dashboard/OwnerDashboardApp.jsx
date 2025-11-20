import React, { useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { Sidebar } from "./components/Sidebar";
import { Topbar } from "./components/Topbar";
import { DashboardPage } from "./pages/Dashboard";
import { MenusPage } from "./pages/Menus";
import { MenuDetailPage } from "./pages/MenuDetail";
import { CategoryFormPage } from "./pages/CategoryForm";
import { CategoryVisibilityPage } from "./pages/CategoryVisibility";
import { ItemFormPage } from "./pages/ItemForm";
import { ItemVisibilityPage } from "./pages/ItemVisibility";
import { OrdersPage } from "./pages/Orders";
import { IntegrationsPage } from "./pages/Integrations";
import { SettingsPage } from "./pages/Settings";
import { authAPI } from "../services/api";

export function OwnerDashboardApp() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Call API to verify authentication and get current user
        const user = await authAPI.getCurrentUser();
        
        // Check if user is Owner
        if (user.role !== "Owner") {
          localStorage.removeItem("user");
          navigate("/login");
          setIsLoading(false);
          return;
        }

        // Check if owner is approved
        if (!user.isApproved) {
          localStorage.removeItem("user");
          alert("Your account is not approved. Please wait for admin approval.");
          navigate("/login");
          setIsLoading(false);
          return;
        }

        // Update localStorage with current user data
        localStorage.setItem("user", JSON.stringify(user));
        
        // Store restaurantId for owners (used for public menu display)
        if (user.role === "Owner" && user.restaurantId) {
          localStorage.setItem("restaurantId", user.restaurantId.toString());
        }
        
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Auth check failed:", error);
        localStorage.removeItem("user");
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  const getTabFromQuery = () => {
    const params = new URLSearchParams(location.search);
    return params.get("tab");
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-100">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-emerald-500 border-r-transparent"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="flex h-screen flex-col bg-slate-100 text-slate-900">
      <Topbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto px-6 py-8">
          <Routes>
            <Route index element={<DashboardPage />} />
            <Route path="menus" element={<MenusPage />} />
            <Route path="menus/:menuId" element={<MenuDetailPage />} />
            <Route path="menus/:menuId/categories/new" element={<CategoryFormPage />} />
            <Route path="menus/:menuId/categories/:categoryId/edit" element={<CategoryFormPage />} />
            <Route path="menus/:menuId/categories/:categoryId/visibility" element={<CategoryVisibilityPage />} />
            <Route path="menus/:menuId/categories/:categoryId/items/new" element={<ItemFormPage />} />
            <Route path="menus/:menuId/categories/:categoryId/items/:itemId/edit" element={<ItemFormPage />} />
            <Route path="menus/:menuId/categories/:categoryId/items/:itemId/visibility" element={<ItemVisibilityPage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="integrations" element={<IntegrationsPage />} />
            <Route
              path="settings"
              element={<SettingsPage initialTab={getTabFromQuery()} />}
            />
            <Route path="*" element={<Navigate to="." replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}


