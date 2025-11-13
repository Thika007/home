import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { RxArrowLeft } from "react-icons/rx";

export function CategoryFormPage() {
  const { menuId, categoryId } = useParams();
  const navigate = useNavigate();
  const [menu, setMenu] = useState(null);
  const [category, setCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const isEditMode = !!categoryId;

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

    // If editing, load category data
    if (categoryId) {
      const storedCategories = localStorage.getItem(`categories_${menuId}`);
      if (storedCategories) {
        const categories = JSON.parse(storedCategories);
        const foundCategory = categories.find((c) => c.id === Number(categoryId));
        if (foundCategory) {
          setCategory(foundCategory);
          setFormData({
            name: foundCategory.name || "",
            description: foundCategory.description || "",
          });
        }
      }
    }
  }, [menuId, categoryId]);

  const handleInputChange = (field) => (e) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      return;
    }

    // Load existing categories from localStorage
    const storedCategories = localStorage.getItem(`categories_${menuId}`);
    const categories = storedCategories ? JSON.parse(storedCategories) : [];

    if (isEditMode && category) {
      // Update existing category
      const updatedCategories = categories.map((cat) =>
        cat.id === Number(categoryId)
          ? {
              ...cat,
              name: formData.name.trim(),
              description: formData.description.trim(),
            }
          : cat
      );
      localStorage.setItem(`categories_${menuId}`, JSON.stringify(updatedCategories));
    } else {
      // Create new category
      const newCategory = {
        id: Date.now(),
        name: formData.name.trim(),
        description: formData.description.trim(),
        menuId: Number(menuId),
        visibility: "visible", // Default visibility
      };

      // Add to categories array
      const updatedCategories = [...categories, newCategory];
      localStorage.setItem(`categories_${menuId}`, JSON.stringify(updatedCategories));
    }

    // Navigate back to menu detail page
    navigate(`/owner-dashboard/menus/${menuId}`);
  };

  if (!menu) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-sm text-slate-500">Loading menu...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with back button and breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate(`/owner-dashboard/menus/${menuId}`)}
          className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white p-2 text-slate-600 transition hover:border-emerald-500 hover:text-emerald-500"
        >
          <RxArrowLeft className="size-5" />
        </button>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-400">Category</span>
            <span className="text-slate-300">/</span>
            <span className="text-sm font-semibold text-emerald-600">
              {isEditMode ? "Edit Category" : "Add New Category"}
            </span>
          </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-6 border-b border-slate-200">
        <button
          type="button"
          className="border-b-2 border-emerald-500 pb-3 text-sm font-semibold text-emerald-600"
        >
          Categories
        </button>
        <button
          type="button"
          disabled
          className="cursor-not-allowed pb-3 text-sm font-semibold text-slate-300"
        >
          Localize
        </button>
      </div>

      {/* Form Section */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <header className="space-y-1 border-b border-slate-200 pb-4">
          <h2 className="text-xl font-semibold text-slate-900">Category Details</h2>
          <p className="text-sm text-slate-500">
            {isEditMode
              ? "Update category information that will appear in your menu."
              : "Add category information that will appear in your menu."}
          </p>
        </header>

        <div className="mt-6 space-y-6">
          {/* Name Field */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700" htmlFor="category-name">
              Name *
            </label>
            <input
              id="category-name"
              type="text"
              value={formData.name}
              onChange={handleInputChange("name")}
              placeholder="Enter category name"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
          </div>

          {/* Description Field */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700" htmlFor="category-description">
              Description *
            </label>
            <textarea
              id="category-description"
              value={formData.description}
              onChange={handleInputChange("description")}
              placeholder="Enter category description"
              rows={4}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-6 flex justify-end border-t border-slate-200 pt-4">
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
          >
            Save
          </button>
        </div>
      </section>
    </div>
  );
}

