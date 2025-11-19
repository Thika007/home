import React, { useEffect, useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { Sidebar } from "./components/Sidebar";
import { Topbar } from "./components/Topbar";
import { DashboardPage } from "./pages/Dashboard";
import { PendingRegistrationsPage } from "./pages/PendingRegistrations";
import { OwnersPage } from "./pages/Owners";
import { OrdersPage } from "./pages/Orders";
import { UsersPage } from "./pages/Users";
import { SettingsPage } from "./pages/Settings";
import { ActivityLogsPage } from "./pages/ActivityLogs";

export function SystemAdminDashboardApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check localStorage first
        const storedAdmin = localStorage.getItem("systemAdmin");
        if (storedAdmin) {
          const admin = JSON.parse(storedAdmin);
          if (admin.role === "SystemAdmin") {
            setIsAuthenticated(true);
            setIsLoading(false);
            return;
          }
        }

        // Verify with backend
        const response = await fetch("http://localhost:5000/api/auth/me", {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const user = await response.json();
          if (user.role === "SystemAdmin") {
            localStorage.setItem("systemAdmin", JSON.stringify(user));
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem("systemAdmin");
            navigate("/system-admin-login");
          }
        } else {
          localStorage.removeItem("systemAdmin");
          navigate("/system-admin-login");
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        localStorage.removeItem("systemAdmin");
        navigate("/system-admin-login");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

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
            <Route path="pending-registrations" element={<PendingRegistrationsPage />} />
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

