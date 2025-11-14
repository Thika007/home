import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
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

export function OwnerDashboardApp() {
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
            <Route path="settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="." replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}


