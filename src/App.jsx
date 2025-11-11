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
import { OwnerDashboardApp } from "./owner-dashboard";
import { SystemAdminDashboardPage } from "./pages/SystemAdminDashboard";

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
  const hideNavbarRoutes = ["/login", "/owner-dashboard"];
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
            <Route path="/owner-dashboard/*" element={<OwnerDashboardApp />} />
            <Route path="/system-admin-dashboard" element={<SystemAdminDashboardPage />} />
          </Routes>
        </AnimatePresence>
      </div>
    </div>
  );
}
