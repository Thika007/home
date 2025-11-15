import React from "react";
import { useNavigate } from "react-router-dom";
import { useRestaurantInfo } from "../hooks/useRestaurantInfo";
import { UserMenuNavbar } from "../components/UserMenuNavbar";

const WHY_CHOOSE_US = [
  {
    title: "Why choose us?",
    subtitle: "This is a grill for you!",
    description:
      "The Uptown Grill invites you into a modern-day American grill and bar featuring great inventive food and beverage using only the best possible ingredients. Our goal is to provide an affordable, high quality dining experience for our customers.",
    image:
      "https://images.unsplash.com/photo-1473093226795-af9932fe5856?auto=format&fit=crop&w=900&q=80",
  },
];

export function UserMenuWelcomePage() {
  const restaurant = useRestaurantInfo();
  const navigate = useNavigate();

  const handleMenuNavigate = () => navigate("/menu");

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <UserMenuNavbar />
      <section className="bg-slate-900 text-white">
        <div className="mx-auto max-w-6xl">
          <div
            className="relative isolate flex min-h-[420px] flex-col items-center justify-center px-6 py-16 text-center"
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
                onClick={handleMenuNavigate}
                className="mt-6 inline-flex rounded-md bg-black/80 px-6 py-3 text-sm font-semibold text-white transition hover:bg-black"
              >
                Our Menu
              </button>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-14">
        <section className="grid gap-10 lg:grid-cols-2 lg:items-center">
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
            <p className="text-sm italic text-slate-600">Serving some of the best American food around!</p>
            <p className="text-base text-slate-600">{restaurant.aboutBody}</p>
            <button
              type="button"
              onClick={handleMenuNavigate}
              className="rounded-md bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-black"
            >
              Our Menu
            </button>
          </div>
        </section>

        {WHY_CHOOSE_US.map((card) => (
          <section
            key={card.title}
            className="grid gap-10 lg:grid-cols-2 lg:items-center lg:[&>*:nth-child(even)]:order-last"
          >
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.4em] text-emerald-600">{card.title}</p>
              <h3 className="text-2xl font-semibold">{card.subtitle}</h3>
              <p className="text-base text-slate-600">{card.description}</p>
              <button
                type="button"
                onClick={handleMenuNavigate}
                className="rounded-md bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-black"
              >
                Our Menu
              </button>
            </div>
            <div className="overflow-hidden rounded-3xl shadow-lg">
              <img src={card.image} alt={card.subtitle} className="h-full w-full object-cover" />
            </div>
          </section>
        ))}
      </main>

      <footer className="bg-slate-100 px-6 py-10 text-sm text-slate-700">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1fr_auto]">
          <div>
            <p className="font-semibold">Contact us</p>
            <p className="mt-1">Email: {restaurant.contactEmail}</p>
          </div>
          <div>
            <p className="font-semibold">Opening hours</p>
            <ul className="mt-3 space-y-1">
              {restaurant.hours.map(({ day, time }) => (
                <li key={day} className="flex justify-between gap-6">
                  <span>{day}</span>
                  <span>{time}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="mt-8 text-center text-xs text-slate-500">
          © 2025 {restaurant.name}. All rights reserved
        </p>
      </footer>
    </div>
  );
}

