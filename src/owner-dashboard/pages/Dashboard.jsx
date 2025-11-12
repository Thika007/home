import React from "react";
import { RxBarChart, RxPerson, RxChatBubble, RxRocket } from "react-icons/rx";

const METRICS = [
  { label: "Total Orders", value: "0", icon: RxBarChart, accent: "bg-slate-900 text-white" },
  { label: "Revenue", value: "Rs.0.00", icon: RxRocket, accent: "bg-emerald-500 text-white" },
  { label: "Customers", value: "0", icon: RxPerson, accent: "bg-slate-800 text-white" },
  { label: "Feedback", value: "0", icon: RxChatBubble, accent: "bg-amber-100 text-amber-700" },
];

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-900">Dashboard</h1>
        <p className="mt-2 text-sm text-slate-500">
          Hi Buddhi Thikshana, welcome back! Track your restaurant performance at a glance.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {METRICS.map(({ label, value, icon: Icon, accent }) => (
          <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className={`mb-4 inline-flex size-12 items-center justify-center rounded-xl ${accent}`}>
              <Icon className="size-6" />
            </div>
            <p className="text-sm font-medium text-slate-500">{label}</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{value}</p>
            <p className="mt-1 text-xs text-slate-400">Live data will appear once integrations are connected.</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[2fr,1fr]">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Total Orders</h3>
              <p className="text-sm text-slate-500">Daily, weekly, and monthly performance snapshots.</p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-emerald-500 hover:text-emerald-500"
              >
                Today
              </button>
              <button
                type="button"
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-emerald-500 hover:text-emerald-500"
              >
                Week
              </button>
              <button
                type="button"
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-emerald-500 hover:text-emerald-500"
              >
                Month
              </button>
            </div>
          </div>
          <div className="mt-6 flex h-64 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 text-sm text-slate-400">
            Analytics chart coming soon.
          </div>
        </section>

        <section className="grid gap-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">QR Scan Count</h3>
            <p className="mt-2 text-sm text-slate-500">
              Track how many guests scan your restaurant QR codes throughout the day.
            </p>
            <div className="mt-6 flex h-40 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 text-sm text-slate-400">
              No records available yet.
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Need Help?</h3>
            <p className="mt-2 text-sm text-slate-500">
              Chat with our support team for onboarding, analytics tips, and hardware setup guidance.
            </p>
            <button
              type="button"
              className="mt-4 w-full rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
            >
              Start Live Chat
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}


