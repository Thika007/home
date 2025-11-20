import React, { useState } from "react";
import { Button } from "@relume_io/relume-ui";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { RxArrowLeft } from "react-icons/rx";

export function SystemAdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Check if user is SystemAdmin
      if (data.role !== "SystemAdmin") {
        throw new Error("Access denied. System admin credentials required.");
      }

      // Store user info in localStorage
      localStorage.setItem("systemAdmin", JSON.stringify(data));
      
      // Navigate to system admin dashboard
      navigate("/system-admin-dashboard");
    } catch (err) {
      setError(err.message || "An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/");
  };

  return (
    <section id="system-admin-login" className="flex flex-1 flex-col overflow-hidden px-[5%] py-12 md:py-16 lg:py-20">
      <div className="container flex flex-1 flex-col overflow-hidden">
        <button
          type="button"
          onClick={handleBack}
          className="mb-8 inline-flex w-fit items-center gap-2 text-sm font-semibold transition hover:opacity-80 md:text-base"
        >
          <RxArrowLeft className="size-4" />
          Back to home
        </button>
        <motion.div
          initial={{ x: "100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "-100%", opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto w-full max-w-xl rounded border border-border-primary bg-background-secondary/60 p-6 shadow-lg backdrop-blur-sm md:p-10"
        >
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-4xl font-bold md:text-5xl">System Admin Login</h1>
            <p className="text-md text-foreground-secondary">
              Sign in to access the system administration dashboard.
            </p>
          </div>
          {error && (
            <div className="mb-6 rounded border border-red-300 bg-red-50 p-4 text-sm text-red-800">
              {error}
            </div>
          )}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-semibold">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full rounded border border-border-primary bg-background-primary px-4 py-3 text-base outline-none transition focus:border-transparent focus:ring-2 focus:ring-foreground-primary/30"
              />
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-semibold">
                  Password
                </label>
              </div>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full rounded border border-border-primary bg-background-primary px-4 py-3 text-base outline-none transition focus:border-transparent focus:ring-2 focus:ring-foreground-primary/30"
              />
            </div>
            <Button 
              title="Log in" 
              type="submit" 
              className="w-full justify-center"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Log in"}
            </Button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}




