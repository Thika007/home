import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Navbar6 } from "./components/Navbar6";
import { Header80 } from "./components/Header80";
import { Layout408 } from "./components/Layout408";
import { Layout353 } from "./components/Layout353";
import { Testimonial33 } from "./components/Testimonial33";
import { Cta57 } from "./components/Cta57";
import { Footer4 } from "./components/Footer4";
import { LoginPage } from "./pages/Login";
import { OwnerRegisterPage } from "./pages/OwnerRegister";
import { OwnerDashboardApp } from "./owner-dashboard";
import { SystemAdminDashboardApp } from "./system-admin-dashboard/SystemAdminDashboardApp";
import { UserMenuWelcomePage } from "./UserMenu/pages/UserMenuWelcome";
import { UserMenuLoginPage } from "./UserMenu/pages/UserMenuLogin";
import { UserMenuRegisterPage } from "./UserMenu/pages/UserMenuRegister";
import { UserMenuFeedbackPage } from "./UserMenu/pages/UserMenuFeedback";
import { UserMenuMenuPage } from "./UserMenu/pages/UserMenuMenu";
import { UserMenuCartPage } from "./UserMenu/pages/UserMenuCart";
import { CartProvider } from "./UserMenu/hooks/useCart";
import { AuthProvider } from "./UserMenu/hooks/useAuth";

function HomePage() {
  return (
    <>
      <main className="flex-1">
        <Header80 />
        <Layout408 />
        <Layout353 />
        <Testimonial33 />
        <Cta57 />
      </main>
      <Footer4 />
    </>
  );
}

export default function App() {
  const location = useLocation();
  const hideNavbarRoutes = [
    "/login",
    "/owner-register",
    "/owner-dashboard",
    "/system-admin-dashboard",
    "/menu-preview",
    "/menu-login",
    "/menu-register",
    "/menu-feedback",
    "/menu",
    "/menu-cart",
  ];
  const shouldHideNavbar = hideNavbarRoutes.some((route) => location.pathname.startsWith(route));

  return (
    <div className="flex min-h-screen flex-col bg-background-primary text-foreground-primary">
      <AnimatePresence initial={false}>
        {!shouldHideNavbar && (
          <motion.div
            key="navbar"
            initial={{ y: -120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -120, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <Navbar6 />
          </motion.div>
        )}
      </AnimatePresence>
      <div className="flex flex-1 flex-col">
        <AnimatePresence mode="wait" initial={false}>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/owner-register" element={<OwnerRegisterPage />} />
            <Route path="/owner-dashboard/*" element={<OwnerDashboardApp />} />
            <Route path="/system-admin-dashboard/*" element={<SystemAdminDashboardApp />} />
            <Route
              path="/menu-preview"
              element={
                <AuthProvider>
                  <CartProvider>
                    <UserMenuWelcomePage />
                  </CartProvider>
                </AuthProvider>
              }
            />
            <Route
              path="/menu-login"
              element={
                <AuthProvider>
                  <UserMenuLoginPage />
                </AuthProvider>
              }
            />
            <Route path="/menu-register" element={<UserMenuRegisterPage />} />
            <Route path="/menu-feedback" element={<UserMenuFeedbackPage />} />
            <Route
              path="/menu"
              element={
                <AuthProvider>
                  <CartProvider>
                    <UserMenuMenuPage />
                  </CartProvider>
                </AuthProvider>
              }
            />
            <Route
              path="/menu-cart"
              element={
                <AuthProvider>
                  <CartProvider>
                    <UserMenuCartPage />
                  </CartProvider>
                </AuthProvider>
              }
            />
          </Routes>
        </AnimatePresence>
      </div>
    </div>
  );
}
