import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export function UserMenuLoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect");
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Connect with authentication API
    // For now, simulate login
    const userData = {
      id: Date.now().toString(),
      email: email,
      name: email.split("@")[0],
    };
    login(userData);

    // Redirect based on query param
    if (redirect === "checkout") {
      navigate("/menu-cart");
    } else {
      navigate("/menu");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4 py-10">
      <div className="relative w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-2xl">
        <button
          type="button"
          onClick={() => navigate("/menu-preview")}
          className="absolute left-4 top-4 text-sm font-semibold text-slate-500 transition hover:text-slate-900"
        >
          ← Back
        </button>
        <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
          <span className="text-2xl">👤</span>
        </div>
        <h1 className="mt-4 text-2xl font-semibold text-slate-900">Login</h1>
        <p className="mt-1 text-sm text-slate-500">Sign in to your account</p>

        <form className="mt-8 space-y-4 text-left" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-800">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ex: john.smith@email.com"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-800">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
          </div>
          <div className="flex items-center justify-between text-sm text-slate-600">
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
              Remember me
            </label>
            <button type="button" className="font-semibold text-emerald-600 transition hover:text-emerald-700">
              Reset password
            </button>
          </div>
          <button
            type="submit"
            className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-black"
          >
            Login
          </button>
        </form>
        <p className="mt-6 text-sm text-slate-500">
          Don’t have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/menu-register")}
            className="font-semibold text-emerald-600 transition hover:text-emerald-700"
          >
            Sign up here
          </button>
        </p>
      </div>
    </div>
  );
}

