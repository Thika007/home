import React from "react";
import { Button } from "@relume_io/relume-ui";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { RxArrowLeft } from "react-icons/rx";

export function LoginPage() {
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    // TODO: connect with authentication API once available.
  };

  const handleBack = () => {
    navigate("/");
  };

  const handleOwnerDashboardDemo = () => {
    navigate("/owner-dashboard");
  };

  const handleSystemAdminDashboardDemo = () => {
    navigate("/system-admin-dashboard");
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
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-semibold">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
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
            <Button title="Log in" type="submit" className="w-full justify-center">
              Log in
            </Button>
          </form>
          <div className="mt-10 space-y-4">
            <h2 className="text-lg font-semibold md:text-xl">Preview upcoming dashboards</h2>
            <div className="flex flex-col gap-3 md:flex-row">
              <Button
                type="button"
                title="Demo Owner Dashboard"
                onClick={handleOwnerDashboardDemo}
                className="flex-1 justify-center"
              >
                Demo Owner Dashboard
              </Button>
              <Button
                type="button"
                title="Demo System Admin Dashboard"
                onClick={handleSystemAdminDashboardDemo}
                className="flex-1 justify-center"
              >
                Demo System Admin Dashboard
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

