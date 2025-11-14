import React, { useState } from "react";
import { RxRocket, RxClipboard, RxHome, RxChevronDown } from "react-icons/rx";
import { HiEye, HiCurrencyDollar, HiArrowUp } from "react-icons/hi2";
import { FaTruck, FaQrcode, FaPrint } from "react-icons/fa";

export function OrdersPage() {
  const [invoiceId, setInvoiceId] = useState("");
  const [storeFilter, setStoreFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [deliveryFilter, setDeliveryFilter] = useState("all");

  const handleResetFilter = () => {
    setInvoiceId("");
    setStoreFilter("all");
    setPaymentFilter("all");
    setDeliveryFilter("all");
  };

  // Empty state - no orders yet
  const hasOrders = false;

  return (
    <div className="space-y-6">
      {/* Header with title, subtitle, and action buttons */}
      <header className="rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-semibold text-slate-900">Food orders</h2>
              <RxRocket className="size-5 text-emerald-500" />
            </div>
            <p className="text-sm text-slate-500">Order Monitoring and History</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white p-3 text-slate-600 transition hover:border-emerald-500 hover:text-emerald-500"
              title="QR Code"
            >
              <FaQrcode className="size-5" />
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white p-3 text-slate-600 transition hover:border-emerald-500 hover:text-emerald-500"
              title="Print"
            >
              <FaPrint className="size-5" />
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
            >
              <HiEye className="size-5" />
              OPEN APP
            </button>
          </div>
        </div>
      </header>

      {/* Filter Section */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
          {/* Invoice ID Input */}
          <div className="relative flex-1 min-w-[200px]">
            <RxClipboard className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Invoice ID"
              value={invoiceId}
              onChange={(e) => setInvoiceId(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-3 text-sm text-slate-900 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
          </div>

          {/* Store Filter */}
          <div className="relative">
            <RxHome className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
            <select
              value={storeFilter}
              onChange={(e) => setStoreFilter(e.target.value)}
              className="w-full appearance-none rounded-xl border border-slate-200 bg-white pl-10 pr-10 py-3 text-sm font-semibold text-slate-600 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 min-w-[150px]"
            >
              <option value="all">All</option>
              <option value="store1">Store 1</option>
              <option value="store2">Store 2</option>
            </select>
            <RxChevronDown className="absolute right-3 top-1/2 size-5 -translate-y-1/2 pointer-events-none text-slate-400" />
          </div>

          {/* Payment Method Filter */}
          <div className="relative">
            <HiCurrencyDollar className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="w-full appearance-none rounded-xl border border-slate-200 bg-white pl-10 pr-10 py-3 text-sm font-semibold text-slate-600 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 min-w-[150px]"
            >
              <option value="all">All</option>
              <option value="cash">Cash</option>
              <option value="card">Card</option>
              <option value="online">Online</option>
            </select>
            <RxChevronDown className="absolute right-3 top-1/2 size-5 -translate-y-1/2 pointer-events-none text-slate-400" />
          </div>

          {/* Delivery Method Filter */}
          <div className="relative">
            <FaTruck className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <select
              value={deliveryFilter}
              onChange={(e) => setDeliveryFilter(e.target.value)}
              className="w-full appearance-none rounded-xl border border-emerald-500 bg-white pl-10 pr-10 py-3 text-sm font-semibold text-slate-600 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 min-w-[150px]"
            >
              <option value="all">All</option>
              <option value="pickup">Pickup</option>
              <option value="delivery">Delivery</option>
              <option value="dine-in">Dine-in</option>
            </select>
            <RxChevronDown className="absolute right-3 top-1/2 size-5 -translate-y-1/2 pointer-events-none text-slate-400" />
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2 ml-auto">
            <button
              type="button"
              className="rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600 whitespace-nowrap"
            >
              Apply Filter
            </button>
            <button
              type="button"
              onClick={handleResetFilter}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-emerald-600 transition hover:border-emerald-500 hover:bg-emerald-50 whitespace-nowrap"
            >
              Reset Filter
            </button>
          </div>
        </div>
      </section>

      {/* Orders Table */}
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Invoice ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                  <div className="flex items-center gap-1.5">
                    Payment method
                    <HiArrowUp className="size-3.5 text-slate-400" />
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Time
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Delivery method
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Paid status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Order status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {hasOrders ? (
                // Orders will be rendered here when data is available
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-sm text-slate-500">
                    No orders found
                  </td>
                </tr>
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-0">
                    <div className="flex flex-col items-center justify-center px-6 py-20">
                      {/* Food Cloche Icon with Question Mark */}
                      <div className="relative mb-6 flex size-32 items-center justify-center">
                        <svg
                          className="size-24 text-slate-300"
                          viewBox="0 0 120 120"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          {/* Plate/Base */}
                          <ellipse cx="60" cy="100" rx="40" ry="10" fill="currentColor" opacity="0.25" />
                          {/* Cloche dome - outer */}
                          <path
                            d="M 25 60 Q 60 15, 95 60 L 95 90 Q 60 105, 25 90 Z"
                            fill="currentColor"
                            opacity="0.15"
                          />
                          {/* Cloche dome - inner outline */}
                          <path
                            d="M 25 60 Q 60 15, 95 60"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            fill="none"
                            opacity="0.4"
                          />
                          {/* Cloche sides */}
                          <line x1="25" y1="60" x2="25" y2="90" stroke="currentColor" strokeWidth="2" opacity="0.3" />
                          <line x1="95" y1="60" x2="95" y2="90" stroke="currentColor" strokeWidth="2" opacity="0.3" />
                          {/* Question mark in center */}
                          <circle cx="60" cy="50" r="18" fill="currentColor" opacity="0.1" />
                          <text
                            x="60"
                            y="58"
                            fontSize="28"
                            fill="currentColor"
                            opacity="0.6"
                            textAnchor="middle"
                            fontWeight="bold"
                            fontFamily="Arial, sans-serif"
                          >
                            ?
                          </text>
                          {/* Radiating lines from top */}
                          <line x1="60" y1="15" x2="60" y2="5" stroke="currentColor" strokeWidth="2" opacity="0.25" />
                          <line x1="85" y1="25" x2="95" y2="18" stroke="currentColor" strokeWidth="2" opacity="0.25" />
                          <line x1="35" y1="25" x2="25" y2="18" stroke="currentColor" strokeWidth="2" opacity="0.25" />
                          <line x1="100" y1="50" x2="110" y2="50" stroke="currentColor" strokeWidth="2" opacity="0.25" />
                          <line x1="20" y1="50" x2="10" y2="50" stroke="currentColor" strokeWidth="2" opacity="0.25" />
                        </svg>
                      </div>
                      <p className="text-sm font-medium text-slate-600">No records availble</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}


