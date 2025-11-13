import React from "react";
import { useNavigate } from "react-router-dom";

export function UserMenuRegisterPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4 py-10">
      <div className="relative w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-2xl">
        <button
          type="button"
          onClick={() => navigate("/menu-preview")}
          className="absolute left-4 top-4 text-sm font-semibold text-slate-500 transition hover:text-slate-900"
        >
          ← Back
        </button>
        <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
          <span className="text-2xl">📝</span>
        </div>
        <h1 className="mt-4 text-2xl font-semibold text-slate-900">Create an Account</h1>
        <p className="mt-1 text-sm text-slate-500">Please enter your details</p>

        <form className="mt-8 space-y-4 text-left">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-800">Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-800">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-800">Phone number</label>
            <input
              type="tel"
              placeholder="+94 71 000 0000"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-800">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-800">Confirm password</label>
            <input
              type="password"
              placeholder="Confirm your password"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input type="checkbox" className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
            By signing up I agree to the terms and conditions
          </label>
          <button
            type="button"
            className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-black"
          >
            Sign up
          </button>
        </form>
        <p className="mt-6 text-sm text-slate-500">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/menu-login")}
            className="font-semibold text-emerald-600 transition hover:text-emerald-700"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
}

