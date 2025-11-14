import React from "react";
import { RxRocket } from "react-icons/rx";
import { HiEye } from "react-icons/hi2";
import { FaQrcode, FaPrint } from "react-icons/fa";

export function IntegrationsPage() {
  return (
    <div className="space-y-6">
      {/* Header with title, subtitle, and action buttons */}
      <header className="rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-semibold text-slate-900">Integrations</h2>
              <RxRocket className="size-5 text-emerald-500" />
            </div>
            <p className="text-sm text-slate-500">Connect your favorite tools and services</p>
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

      {/* Content will be added in next step */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-sm text-slate-500">Integration components will be added here</p>
        </div>
      </section>
    </div>
  );
}

