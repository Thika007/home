import React, { useState } from "react";
import {
  RxPlusCircled,
  RxDownload,
  RxShare2,
  RxExternalLink,
  RxDashboard,
  RxLockClosed,
  RxDotsVertical,
  RxPlus,
} from "react-icons/rx";

const TABS = [
  { id: "menus", label: "Menus" },
  { id: "modifiers", label: "Modifiers" },
  { id: "archive", label: "Archive" },
];

const SAMPLE_MENUS = [
  { id: 1, name: "Sample Menu", status: "Connected" },
  { id: 2, name: "Sample menu name2", status: "Connected" },
  { id: 3, name: "Food", status: "Draft" },
];

export function MenusPage() {
  const [activeTab, setActiveTab] = useState("menus");

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Menu</h1>
            <p className="text-sm text-slate-500">Craft your digital menu.</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white p-3 text-slate-500 transition hover:border-emerald-500 hover:text-emerald-500"
            >
              <RxDownload className="size-5" />
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white p-3 text-slate-500 transition hover:border-emerald-500 hover:text-emerald-500"
            >
              <RxShare2 className="size-5" />
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
            >
              <RxExternalLink className="size-5" />
              Open App
            </button>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-2 border-b border-slate-200">
          {TABS.map(({ id, label }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setActiveTab(id)}
                className={[
                  "relative rounded-t-xl px-4 py-2.5 text-sm font-semibold transition",
                  isActive
                    ? "bg-white text-emerald-600 shadow-[0_-1px_0_0_rgba(22,163,74,1)]"
                    : "text-slate-500 hover:text-emerald-600",
                ].join(" ")}
              >
                {label}
              </button>
            );
          })}
        </div>

        {activeTab === "menus" && (
          <div className="mt-6 space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
              >
                <RxPlusCircled className="size-5" />
                Add New
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 transition hover:border-emerald-500 hover:text-emerald-500"
              >
                <RxDashboard className="size-5" />
                Go to store settings to connect your menu
              </button>
            </div>

            <div className="grid gap-4 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2">
              {SAMPLE_MENUS.map(({ id, name, status }) => (
                <article
                  key={id}
                  className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50/80 p-6 text-left shadow-sm transition hover:border-emerald-200 hover:bg-white"
                >
                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="rounded-full border border-transparent p-2 text-slate-400 transition hover:border-slate-200 hover:text-slate-600"
                    >
                      <RxDotsVertical className="size-5" />
                    </button>
                  </div>
                  <div className="mt-2 flex flex-1 flex-col items-start">
                    <div className="flex size-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                      <RxLockClosed className="size-7" />
                    </div>
                    <h3 className="mt-6 text-lg font-semibold text-slate-900">{name}</h3>
                    <span
                      className={[
                        "mt-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold",
                        status === "Connected"
                          ? "bg-emerald-100 text-emerald-600"
                          : "bg-slate-200 text-slate-600",
                      ].join(" ")}
                    >
                      <span className="size-2 rounded-full bg-current" />
                      {status}
                    </span>
                  </div>
                </article>
              ))}

              <button
                type="button"
                className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-sm font-semibold text-slate-500 transition hover:border-emerald-400 hover:text-emerald-500"
              >
                <span className="inline-flex size-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <RxPlus className="size-7" />
                </span>
                <span className="mt-4">Add menu</span>
              </button>
            </div>
          </div>
        )}

        {activeTab === "modifiers" && (
          <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 p-10 text-center text-sm text-slate-500">
            Modifiers management will be available soon. Configure add-ons, toppings, and customization groups here.
          </div>
        )}

        {activeTab === "archive" && (
          <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 p-10 text-center text-sm text-slate-500">
            Archived menus will appear here for record keeping. Restore or permanently delete menus from this section.
          </div>
        )}
      </section>
    </div>
  );
}


