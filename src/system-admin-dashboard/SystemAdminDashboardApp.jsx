import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Sidebar } from "./components/Sidebar";
import { Topbar } from "./components/Topbar";
import { DashboardPage } from "./pages/Dashboard";
import { OwnersPage } from "./pages/Owners";
import { OrdersPage } from "./pages/Orders";
import { UsersPage } from "./pages/Users";
import { SettingsPage } from "./pages/Settings";
import { ActivityLogsPage } from "./pages/ActivityLogs";

export function SystemAdminDashboardApp() {
  return (
    <div className="flex h-screen flex-col bg-slate-100 text-slate-900">
      <Topbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto px-6 py-8">
          <Routes>
            <Route index element={<DashboardPage />} />
            <Route path="owners" element={<OwnersPage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="logs" element={<ActivityLogsPage />} />
            <Route path="*" element={<Navigate to="." replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

