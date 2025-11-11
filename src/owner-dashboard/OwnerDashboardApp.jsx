import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Sidebar } from "./components/Sidebar";
import { Topbar } from "./components/Topbar";
import { DashboardPage } from "./pages/Dashboard";
import { MenusPage } from "./pages/Menus";
import { OrdersPage } from "./pages/Orders";

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
            <Route path="orders" element={<OrdersPage />} />
            <Route path="*" element={<Navigate to="." replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}


