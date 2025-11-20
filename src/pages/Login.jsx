import React, { useState } from "react";
import { Button } from "@relume_io/relume-ui";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { RxArrowLeft } from "react-icons/rx";
import { authAPI } from "../services/api";

export function LoginPage() {
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
      // Call backend API for login
      const data = await authAPI.login(email, password);

      // Check if user is SystemAdmin - redirect to system admin login page
      if (data.role === "SystemAdmin") {
        setError("Please use the System Admin Login page to access the admin dashboard.");
        setLoading(false);
        return;
      }

      // Check if owner is approved (backend already checks this, but we verify the response)
      if (data.role === "Owner" && !data.isApproved) {
        setError("Your account is pending admin approval. Please wait for approval before logging in.");
        setLoading(false);
        return;
      }

      // Store user info in localStorage for frontend state management
      localStorage.setItem("user", JSON.stringify(data));
      
      // Store restaurantId for owners (used for public menu display)
      if (data.role === "Owner" && data.restaurantId) {
        localStorage.setItem("restaurantId", data.restaurantId.toString());
      }
      
      // Navigate based on role
      if (data.role === "Owner") {
        navigate("/owner-dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      // Handle API errors
      const errorMessage = err.data?.message || err.message || "An error occurred during login";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/");
  };

  return (
    <section id="login" className="flex flex-1 flex-col overflow-hidden px-[5%] py-12 md:py-16 lg:py-20">
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
            <h1 className="mb-2 text-4xl font-bold md:text-5xl">Welcome back</h1>
            <p className="text-md text-foreground-secondary">
              Sign in to manage your restaurant dashboard and track real-time orders.
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
                placeholder="you@example.com"
                className="w-full rounded border border-border-primary bg-background-primary px-4 py-3 text-base outline-none transition focus:border-transparent focus:ring-2 focus:ring-foreground-primary/30"
              />
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-semibold">
                  Password
                </label>
                <a href="#" className="text-sm font-semibold underline-offset-4 hover:underline">
                  Forgot password?
                </a>
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
            <div className="flex items-center justify-between">
              <label className="inline-flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  className="size-4 rounded border border-border-primary text-foreground-primary focus:ring-foreground-primary/40"
                />
                Remember me
              </label>
              <span className="text-sm text-foreground-secondary">
                Need an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/owner-register")}
                  className="font-semibold underline-offset-4 hover:underline"
                >
                  Sign up
                </button>
              </span>
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
          <div className="mt-6 text-center">
            <p className="text-sm text-foreground-secondary">
              System Admin?{" "}
              <button
                type="button"
                onClick={() => navigate("/system-admin-login")}
                className="font-semibold underline-offset-4 hover:underline"
              >
                Login here
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

