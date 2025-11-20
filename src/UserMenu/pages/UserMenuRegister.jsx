import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../../services/api";
import { useAuth } from "../hooks/useAuth";

export function UserMenuRegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms and conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setLoading(true);
    try {
      // Register customer - this will automatically log in the user
      const response = await authAPI.registerCustomer({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone || null,
        password: formData.password,
      });

      // User is automatically logged in, store user data
      login({
        id: response.userId,
        email: response.email,
        firstName: response.firstName,
        lastName: response.lastName,
        name: `${response.firstName} ${response.lastName}`,
        role: response.role,
        isEmailVerified: response.isEmailVerified,
      });

      // Navigate to menu page
      navigate("/menu");
    } catch (error) {
      console.error("Registration failed:", error);
      const errorMessage = error.data?.message || error.message || "Registration failed. Please try again.";
      
      // Check if email already exists
      if (errorMessage.toLowerCase().includes("email already")) {
        setErrors({ email: "This email is already registered. Please use a different email or login." });
      } else {
        alert(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

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

        <form onSubmit={handleSubmit} className="mt-8 space-y-4 text-left">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-800">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First name"
                className={`w-full rounded-xl border px-4 py-3 text-sm shadow-sm transition focus:outline-none focus:ring-2 ${
                  errors.firstName
                    ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                    : "border-slate-200 focus:border-emerald-500 focus:ring-emerald-200"
                }`}
              />
              {errors.firstName && (
                <p className="text-xs text-red-500">{errors.firstName}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-800">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last name"
                className={`w-full rounded-xl border px-4 py-3 text-sm shadow-sm transition focus:outline-none focus:ring-2 ${
                  errors.lastName
                    ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                    : "border-slate-200 focus:border-emerald-500 focus:ring-emerald-200"
                }`}
              />
              {errors.lastName && (
                <p className="text-xs text-red-500">{errors.lastName}</p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-800">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className={`w-full rounded-xl border px-4 py-3 text-sm shadow-sm transition focus:outline-none focus:ring-2 ${
                errors.email
                  ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                  : "border-slate-200 focus:border-emerald-500 focus:ring-emerald-200"
              }`}
            />
            {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-800">Phone number (optional)</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+94 71 000 0000"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-800">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className={`w-full rounded-xl border px-4 py-3 text-sm shadow-sm transition focus:outline-none focus:ring-2 ${
                errors.password
                  ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                  : "border-slate-200 focus:border-emerald-500 focus:ring-emerald-200"
              }`}
            />
            {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-800">Confirm password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              className={`w-full rounded-xl border px-4 py-3 text-sm shadow-sm transition focus:outline-none focus:ring-2 ${
                errors.confirmPassword
                  ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                  : "border-slate-200 focus:border-emerald-500 focus:ring-emerald-200"
              }`}
            />
            {errors.confirmPassword && (
              <p className="text-xs text-red-500">{errors.confirmPassword}</p>
            )}
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={agreeToTerms}
                onChange={(e) => {
                  setAgreeToTerms(e.target.checked);
                  if (errors.agreeToTerms) {
                    setErrors((prev) => ({
                      ...prev,
                      agreeToTerms: "",
                    }));
                  }
                }}
                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              By signing up I agree to the terms and conditions
            </label>
            {errors.agreeToTerms && (
              <p className="mt-1 text-xs text-red-500">{errors.agreeToTerms}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing up..." : "Sign up"}
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
