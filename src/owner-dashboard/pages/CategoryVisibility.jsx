import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { RxArrowLeft, RxInfoCircled } from "react-icons/rx";

const VISIBILITY_OPTIONS = [
  {
    id: "visible",
    label: "Visible (Default)",
    description: "Category is visible in the menu",
  },
  {
    id: "hidden",
    label: "Hidden from menu",
    description: "Category is hidden from customers but still exists in the system",
  },
  {
    id: "hide-until",
    label: "Hide until",
    description: "Hide category until a specific date/time",
  },
  {
    id: "show-only",
    label: "Show only within",
    description: "Show category only during specific time periods",
  },
];

export function CategoryVisibilityPage() {
  const { menuId, categoryId } = useParams();
  const navigate = useNavigate();
  const [menu, setMenu] = useState(null);
  const [category, setCategory] = useState(null);
  const [selectedVisibility, setSelectedVisibility] = useState("visible");

  // Load menu and category data from localStorage
  useEffect(() => {
    const storedMenus = localStorage.getItem("menus");
    if (storedMenus) {
      const menus = JSON.parse(storedMenus);
      const foundMenu = menus.find((m) => m.id === Number(menuId));
      if (foundMenu) {
        setMenu(foundMenu);
      }
    }

    const storedCategories = localStorage.getItem(`categories_${menuId}`);
    if (storedCategories) {
      const categories = JSON.parse(storedCategories);
      const foundCategory = categories.find((c) => c.id === Number(categoryId));
      if (foundCategory) {
        setCategory(foundCategory);
        // Load saved visibility setting or default to "visible"
        setSelectedVisibility(foundCategory.visibility || "visible");
      }
    }
  }, [menuId, categoryId]);

  const handleSave = () => {
    if (!category) return;

    // Update category visibility in localStorage
    const storedCategories = localStorage.getItem(`categories_${menuId}`);
    if (storedCategories) {
      const categories = JSON.parse(storedCategories);
      const updatedCategories = categories.map((cat) =>
        cat.id === Number(categoryId)
          ? { ...cat, visibility: selectedVisibility }
          : cat
      );
      localStorage.setItem(`categories_${menuId}`, JSON.stringify(updatedCategories));
    }

    // Navigate back to menu detail page
    navigate(`/owner-dashboard/menus/${menuId}`);
  };

  if (!menu || !category) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-sm text-slate-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with back button and breadcrumb */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(`/owner-dashboard/menus/${menuId}`)}
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white p-2 text-slate-600 transition hover:border-emerald-500 hover:text-emerald-500"
          >
            <RxArrowLeft className="size-5" />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-400">{category.name}</span>
            <span className="text-slate-300">/</span>
            <span className="text-sm font-semibold text-emerald-600">Visibility settings</span>
          </div>
        </div>
        <button
          type="button"
          onClick={handleSave}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
        >
          Save
        </button>
      </div>

      {/* Visibility Settings Section */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-4">
          <h2 className="text-xl font-semibold text-slate-900">Visibility settings</h2>
          <button
            type="button"
            className="inline-flex size-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-600"
            title="Information about visibility settings"
          >
            <RxInfoCircled className="size-4" />
          </button>
        </div>

        <div className="mt-6 space-y-3">
          {VISIBILITY_OPTIONS.map((option) => {
            const isSelected = selectedVisibility === option.id;
            return (
              <label
                key={option.id}
                className={[
                  "flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition",
                  isSelected
                    ? "border-emerald-500 bg-emerald-50"
                    : "border-slate-200 bg-white hover:border-slate-300",
                ].join(" ")}
              >
                <input
                  type="radio"
                  name="visibility"
                  value={option.id}
                  checked={isSelected}
                  onChange={(e) => setSelectedVisibility(e.target.value)}
                  className="mt-1 size-4 text-emerald-500 focus:ring-emerald-200"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-900">{option.label}</span>
                    {option.id !== "visible" && (
                      <button
                        type="button"
                        className="inline-flex size-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-600"
                        title={option.description}
                      >
                        <RxInfoCircled className="size-4" />
                      </button>
                    )}
                  </div>
                </div>
              </label>
            );
          })}
        </div>
      </section>
    </div>
  );
}


