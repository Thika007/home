import React from "react";
import { useRestaurantInfo } from "../hooks/useRestaurantInfo";
import { UserMenuNavbar } from "../components/UserMenuNavbar";

export function UserMenuWelcomePage() {
  const restaurant = useRestaurantInfo();

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <UserMenuNavbar />
      <section className="bg-slate-900 text-white">
        <div className="mx-auto max-w-6xl">
          <div
            className="relative isolate flex min-h-[420px] items-center justify-center px-6 py-16 text-center"
            style={{
              backgroundImage: `linear-gradient(180deg,rgba(8,15,30,0.7),rgba(8,15,30,0.7)),url(${restaurant.heroImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="mx-auto max-w-3xl text-white">
              <p className="text-3xl font-semibold sm:text-4xl">Welcome to {restaurant.name}</p>
              <p className="mt-4 text-xl text-slate-100">{restaurant.tagline}</p>
              <p className="mt-2 text-sm text-slate-200">{restaurant.description}</p>
              <button
                type="button"
                className="mt-6 inline-flex rounded-md bg-black/80 px-6 py-3 text-sm font-semibold text-white transition hover:bg-black"
              >
                Our Menu
              </button>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto grid max-w-5xl gap-10 px-6 py-14 lg:grid-cols-2 lg:items-center">
        <div className="overflow-hidden rounded-3xl shadow-lg">
          <img
            src={restaurant.aboutImage}
            alt="Restaurant dishes"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.4em] text-emerald-600">
            About {restaurant.name}
          </p>
          <h2 className="text-3xl font-semibold">{restaurant.aboutTitle}</h2>
          <p className="text-sm italic text-slate-600">
            Serving some of the best American food around!
          </p>
          <p className="text-base text-slate-600">{restaurant.aboutBody}</p>
          <button
            type="button"
            className="rounded-md bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-black"
          >
            Our Menu
          </button>
        </div>
      </main>
    </div>
  );
}

