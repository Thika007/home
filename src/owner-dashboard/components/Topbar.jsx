import React from "react";
import {
  RxSun,
  RxGlobe,
  RxBell,
  RxRocket,
  RxLayers,
  RxDoubleArrowLeft,
  RxPerson,
  RxDividerHorizontal,
} from "react-icons/rx";

export function Topbar() {
  return (
    <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-slate-200 bg-white/95 px-6 backdrop-blur">
      <img
        src="https://d22po4pjz3o32e.cloudfront.net/logo-image.svg"
        alt="QR Menu Platform logo"
        className="h-10 w-auto"
      />
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="rounded-full border border-slate-200 bg-white p-2 text-slate-500 transition hover:border-emerald-500 hover:text-emerald-500"
        >
          <RxSun className="size-5" />
        </button>
        <button
          type="button"
          className="rounded-full border border-slate-200 bg-white p-2 text-slate-500 transition hover:border-emerald-500 hover:text-emerald-500"
        >
          <RxGlobe className="size-5" />
        </button>
        <button
          type="button"
          className="relative rounded-full border border-slate-200 bg-white p-2 text-slate-500 transition hover:border-emerald-500 hover:text-emerald-500"
        >
          <RxBell className="size-5" />
          <span className="absolute -right-0.5 -top-0.5 size-4 rounded-full bg-rose-500 text-[10px] font-semibold leading-none text-white">
            2
          </span>
        </button>
        <button
          type="button"
          className="rounded-full border border-slate-200 bg-white p-2 text-slate-500 transition hover:border-emerald-500 hover:text-emerald-500"
        >
          <RxRocket className="size-5" />
        </button>
        <button
          type="button"
          className="rounded-full border border-slate-200 bg-white p-2 text-slate-500 transition hover:border-emerald-500 hover:text-emerald-500"
        >
          <RxLayers className="size-5" />
        </button>
        <button
          type="button"
          className="rounded-full border border-slate-200 bg-white p-2 text-slate-500 transition hover:border-emerald-500 hover:text-emerald-500"
        >
          <RxDoubleArrowLeft className="size-5" />
        </button>
        <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-3 py-2">
          <div className="flex size-9 items-center justify-center rounded-full bg-emerald-500 text-base font-semibold text-white">
            BT
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">Buddhi Thikshana</p>
            <p className="text-xs text-slate-500">Owner</p>
          </div>
          <RxDividerHorizontal className="size-5 text-slate-300" />
          <button
            type="button"
            className="rounded-full border border-slate-200 bg-white p-2 text-slate-500 transition hover:border-emerald-500 hover:text-emerald-500"
          >
            <RxPerson className="size-4" />
          </button>
        </div>
      </div>
    </header>
  );
}


