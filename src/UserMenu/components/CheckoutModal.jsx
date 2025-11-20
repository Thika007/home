import React, { useState } from "react";

export function CheckoutModal({ isOpen, onClose, onConfirm, cartTotal, subtotal, tipAmount }) {
  const [orderType, setOrderType] = useState("dine-in");
  const [tableNumber, setTableNumber] = useState("");
  const [numberOfPassengers, setNumberOfPassengers] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [checkoutAsGuest, setCheckoutAsGuest] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};

    if (orderType === "dine-in") {
      if (!tableNumber.trim()) {
        newErrors.tableNumber = "Table number is required for dine-in orders";
      }
      if (!numberOfPassengers || parseInt(numberOfPassengers) <= 0) {
        newErrors.numberOfPassengers = "Number of passengers is required for dine-in orders";
      }
    }

    // Guest name and email are optional - only validate email format if provided
    if (checkoutAsGuest && guestEmail.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestEmail)) {
      newErrors.guestEmail = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const orderData = {
      orderType,
      tableNumber: orderType === "dine-in" ? tableNumber : null,
      numberOfPassengers: orderType === "dine-in" ? parseInt(numberOfPassengers) : null,
      paymentMethod,
      checkoutAsGuest,
      guestName: checkoutAsGuest ? guestName : null,
      guestEmail: checkoutAsGuest ? guestEmail : null,
    };

    onConfirm(orderData);
  };

  const handleOrderTypeChange = (type) => {
    setOrderType(type);
    // Clear dine-in specific fields when switching to takeaway
    if (type === "takeaway") {
      setTableNumber("");
      setNumberOfPassengers("");
    }
    // Clear errors
    setErrors({});
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl rounded-2xl bg-white shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-slate-200"
          aria-label="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="p-6 lg:p-8">
          <h2 className="mb-6 text-2xl lg:text-3xl font-bold text-slate-900">Checkout</h2>

          <form onSubmit={handleSubmit} className="space-y-6 lg:space-y-8">
            {/* Order Type */}
            <div className="lg:bg-slate-50 lg:p-6 lg:rounded-xl">
              <label className="mb-3 block text-sm font-semibold text-slate-700">
                Order Type <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => handleOrderTypeChange("dine-in")}
                  className={`flex items-center justify-center gap-2 rounded-xl border-2 px-6 py-4 text-center font-semibold transition-all duration-200 ${
                    orderType === "dine-in"
                      ? "border-emerald-500 bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                      : "border-slate-300 bg-white text-slate-700 hover:border-emerald-300 hover:bg-emerald-50"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  Dine In
                </button>
                <button
                  type="button"
                  onClick={() => handleOrderTypeChange("takeaway")}
                  className={`flex items-center justify-center gap-2 rounded-xl border-2 px-6 py-4 text-center font-semibold transition-all duration-200 ${
                    orderType === "takeaway"
                      ? "border-emerald-500 bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                      : "border-slate-300 bg-white text-slate-700 hover:border-emerald-300 hover:bg-emerald-50"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                  Takeaway
                </button>
              </div>
            </div>

            {/* Dine In Fields */}
            {orderType === "dine-in" && (
              <div className="lg:bg-slate-50 lg:p-6 lg:rounded-xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Table Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={tableNumber}
                      onChange={(e) => {
                        setTableNumber(e.target.value);
                        if (errors.tableNumber) {
                          setErrors({ ...errors, tableNumber: null });
                        }
                      }}
                      placeholder="e.g., T-12"
                      className={`w-full rounded-xl border px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 transition ${
                        errors.tableNumber
                          ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                          : "border-slate-300 focus:border-emerald-500 focus:ring-emerald-200"
                      }`}
                    />
                    {errors.tableNumber && (
                      <p className="mt-1 text-sm text-red-500">{errors.tableNumber}</p>
                    )}
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Number of Passengers <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={numberOfPassengers}
                      onChange={(e) => {
                        setNumberOfPassengers(e.target.value);
                        if (errors.numberOfPassengers) {
                          setErrors({ ...errors, numberOfPassengers: null });
                        }
                      }}
                      placeholder="e.g., 2"
                      min="1"
                      className={`w-full rounded-xl border px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 transition ${
                        errors.numberOfPassengers
                          ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                          : "border-slate-300 focus:border-emerald-500 focus:ring-emerald-200"
                      }`}
                    />
                    {errors.numberOfPassengers && (
                      <p className="mt-1 text-sm text-red-500">{errors.numberOfPassengers}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Payment Method */}
            <div className="lg:bg-slate-50 lg:p-6 lg:rounded-xl">
              <label className="mb-3 block text-sm font-semibold text-slate-700">
                Payment Method <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("cash")}
                  className={`flex items-center justify-center gap-2 rounded-xl border-2 px-6 py-4 text-center font-semibold transition-all duration-200 ${
                    paymentMethod === "cash"
                      ? "border-emerald-500 bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                      : "border-slate-300 bg-white text-slate-700 hover:border-emerald-300 hover:bg-emerald-50"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  Cash
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("card")}
                  className={`flex items-center justify-center gap-2 rounded-xl border-2 px-6 py-4 text-center font-semibold transition-all duration-200 ${
                    paymentMethod === "card"
                      ? "border-emerald-500 bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                      : "border-slate-300 bg-white text-slate-700 hover:border-emerald-300 hover:bg-emerald-50"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                  Card
                </button>
              </div>
            </div>

            {/* Guest Checkout Option */}
            <div className="lg:bg-slate-50 lg:p-6 lg:rounded-xl">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checkoutAsGuest}
                  onChange={(e) => {
                    setCheckoutAsGuest(e.target.checked);
                    if (!e.target.checked) {
                      setGuestName("");
                      setGuestEmail("");
                      setErrors({ ...errors, guestName: null, guestEmail: null });
                    }
                  }}
                  className="h-5 w-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 focus:ring-2"
                />
                <span className="text-sm font-semibold text-slate-700">
                  Checkout as guest
                </span>
              </label>

              {/* Guest Fields - Optional */}
              {checkoutAsGuest && (
                <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Name (Optional)
                    </label>
                    <input
                      type="text"
                      value={guestName}
                      onChange={(e) => {
                        setGuestName(e.target.value);
                        if (errors.guestName) {
                          setErrors({ ...errors, guestName: null });
                        }
                      }}
                      placeholder="Your name (optional)"
                      className={`w-full rounded-xl border px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 transition ${
                        errors.guestName
                          ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                          : "border-slate-300 focus:border-emerald-500 focus:ring-emerald-200"
                      }`}
                    />
                    {errors.guestName && (
                      <p className="mt-1 text-sm text-red-500">{errors.guestName}</p>
                    )}
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Email (Optional)
                    </label>
                    <input
                      type="email"
                      value={guestEmail}
                      onChange={(e) => {
                        setGuestEmail(e.target.value);
                        if (errors.guestEmail) {
                          setErrors({ ...errors, guestEmail: null });
                        }
                      }}
                      placeholder="your.email@example.com (optional)"
                      className={`w-full rounded-xl border px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 transition ${
                        errors.guestEmail
                          ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                          : "border-slate-300 focus:border-emerald-500 focus:ring-emerald-200"
                      }`}
                    />
                    {errors.guestEmail && (
                      <p className="mt-1 text-sm text-red-500">{errors.guestEmail}</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="rounded-xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-6 lg:p-8 shadow-lg">
              <h3 className="mb-4 text-xl font-bold text-slate-900 flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-emerald-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Order Summary
              </h3>
              <div className="space-y-3 text-sm lg:text-base">
                <div className="flex justify-between items-center py-2">
                  <span className="text-slate-600">Subtotal:</span>
                  <span className="font-semibold text-slate-900 text-lg">LKR {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-slate-600">Tip:</span>
                  <span className="font-semibold text-slate-900 text-lg">LKR {tipAmount.toFixed(2)}</span>
                </div>
                <div className="border-t-2 border-emerald-200 pt-3 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-slate-900">Total:</span>
                    <span className="text-2xl font-bold text-emerald-600">
                      LKR {cartTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-xl border-2 border-slate-300 bg-white px-6 py-4 font-semibold text-slate-700 transition-all duration-200 hover:bg-slate-50 hover:border-slate-400 hover:shadow-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 px-6 py-4 font-semibold text-white transition-all duration-200 hover:from-emerald-700 hover:to-emerald-600 hover:shadow-lg hover:shadow-emerald-500/30 transform hover:-translate-y-0.5"
              >
                Confirm Order
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

