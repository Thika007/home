import React from "react";
import { useNavigate } from "react-router-dom";
import { useRestaurantInfo } from "../hooks/useRestaurantInfo";
import { usePublicMenuData } from "../hooks/usePublicMenuData";
import { UserMenuNavbar } from "../components/UserMenuNavbar";

const CategoryButton = ({ label, isActive, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={[
      "min-w-[120px] rounded-full border px-4 py-2 text-sm font-semibold transition",
      isActive ? "border-black bg-black text-white" : "border-slate-300 bg-white text-slate-800 hover:border-black",
    ].join(" ")}
  >
    {label}
  </button>
);

export function UserMenuMenuPage() {
  const restaurant = useRestaurantInfo();
  const menuData = usePublicMenuData();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = React.useState(null);
  const sectionRefs = React.useRef({});

  React.useEffect(() => {
    if (!menuData.categories.length) {
      setActiveCategory(null);
      return;
    }
    setActiveCategory((prev) => {
      if (prev && menuData.categories.some((category) => category.id === prev)) {
        return prev;
      }
      return menuData.categories[0].id;
    });
  }, [menuData.categories]);

  const handleCategoryClick = (categoryId) => {
    setActiveCategory(categoryId);
    const el = sectionRefs.current[categoryId];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f6f6] text-slate-900">
      <UserMenuNavbar />
      <section className="bg-slate-900 text-white">
        <div className="mx-auto max-w-6xl px-6 py-10 text-center">
          <p className="text-2xl font-semibold sm:text-3xl">{restaurant.tagline}</p>
          <p className="mt-2 text-sm text-slate-200">{restaurant.description}</p>
        </div>
      </section>

      <main className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10">
        <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow">
          <span className="text-lg">🔍</span>
          <input
            type="search"
            placeholder="Search your favorite food"
            className="w-full border-none text-sm outline-none"
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm font-semibold">
            <span>{menuData.menuName} categories</span>
            <span
              className="cursor-pointer text-slate-500 hover:text-slate-800"
              onClick={() => navigate("/menu-preview")}
            >
              Home →
            </span>
          </div>
          {menuData.categories.length > 0 ? (
            <div className="flex snap-x gap-3 overflow-x-auto pb-2">
              {menuData.categories.map((category) => (
                <CategoryButton
                  key={category.id}
                  label={category.name}
                  isActive={activeCategory === category.id}
                  onClick={() => handleCategoryClick(category.id)}
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">No categories available yet. Please visit later.</p>
          )}
        </div>

        {menuData.categories.map((category) => (
          <section key={category.id} ref={(el) => (sectionRefs.current[category.id] = el)}>
            <header className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">{category.name}</h2>
              <div className="ml-4 h-px flex-1 bg-slate-200" />
            </header>
            {category.description && (
              <p className="mb-4 text-sm text-slate-500">{category.description}</p>
            )}
            {category.items.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {category.items.map((item) => (
                  <article
                    key={item.id || item.name}
                    className="flex flex-col gap-3 rounded-3xl bg-white p-4 shadow transition hover:-translate-y-1"
                  >
                    <div className="flex h-40 items-center justify-center rounded-2xl bg-slate-100 text-4xl">
                      🍽️
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">{item.name}</h3>
                      <p className="mt-1 line-clamp-2 text-sm text-slate-600">
                        {item.description || "No description provided yet."}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-base font-semibold text-slate-900">{item.priceDisplay}</span>
                      <button
                        type="button"
                        className="flex size-9 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-xl font-semibold text-slate-900 transition hover:bg-slate-900 hover:text-white"
                      >
                        +
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-white/50 p-6 text-center text-sm text-slate-500">
                Items for this category will appear here once added by the restaurant.
              </div>
            )}
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

