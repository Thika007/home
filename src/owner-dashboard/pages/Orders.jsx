import React from "react";
import { RxCounterClockwiseClock } from "react-icons/rx";

export function OrdersPage() {
  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Orders</h2>
          <p className="text-sm text-slate-500">Monitor live orders, fulfillment status, and customer pickup details.</p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:border-emerald-500 hover:text-emerald-500"
        >
          <RxCounterClockwiseClock className="size-5" />
          Refresh
        </button>
      </header>

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600"
            >
              Live
            </button>
            <button
              type="button"
              className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-emerald-500 hover:text-emerald-500"
            >
              Completed
            </button>
            <button
              type="button"
              className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-emerald-500 hover:text-emerald-500"
            >
              Cancelled
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Showing</span>
            <select className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600 focus:border-emerald-500 focus:outline-none">
              <option>Today</option>
              <option>This week</option>
              <option>This month</option>
            </select>
          </div>
        </div>
        <div className="flex h-64 items-center justify-center px-6 py-10 text-sm text-slate-400">
          Live order feed will appear here once orders start coming in.
        </div>
      </section>
    </div>
  );
}


