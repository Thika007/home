import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  RxArrowLeft,
  RxPlus,
  RxTrash,
  RxFileText,
  RxGrid,
} from "react-icons/rx";
import { HiCurrencyDollar } from "react-icons/hi2";

export function ItemFormPage() {
  const { menuId, categoryId, itemId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [menu, setMenu] = useState(null);
  const [category, setCategory] = useState(null);
  const [item, setItem] = useState(null);
  const [activeTab, setActiveTab] = useState("item-info");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    labels: "",
    displayOn: [],
    size: "",
    unit: "",
    preparationTime: "",
    ingredientWarnings: "",
    taxCategories: "",
    markAsSoldOut: false,
    availability: true,
    featured: false,
    recommended: "",
    images: [],
  });
  const [displayOnDropdownOpen, setDisplayOnDropdownOpen] = useState(false);
  const isEditMode = !!itemId;

  const displayOnOptions = [
    { id: "dine-in", label: "Dine in", icon: "🍽️" },
    { id: "takeaway", label: "Takeaway", icon: "🥡" },
  ];
  const [priceOptions, setPriceOptions] = useState([
    { id: 1, name: "", price: "" },
  ]);

  // Load menu, category, and item data from localStorage
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
      }
    }

    // If editing, load item data
    if (itemId) {
      const storedItems = localStorage.getItem(`items_${categoryId}`);
      if (storedItems) {
        const items = JSON.parse(storedItems);
        const foundItem = items.find((i) => i.id === Number(itemId));
        if (foundItem) {
          setItem(foundItem);
          setFormData({
            name: foundItem.name || "",
            description: foundItem.description || "",
            labels: foundItem.labels || "",
            displayOn: foundItem.displayOn || [],
            size: foundItem.size || "",
            unit: foundItem.unit || "",
            preparationTime: foundItem.preparationTime || "",
            ingredientWarnings: foundItem.ingredientWarnings || "",
            taxCategories: foundItem.taxCategories || "",
            markAsSoldOut: foundItem.markAsSoldOut || false,
            availability: foundItem.availability !== undefined ? foundItem.availability : true,
            featured: foundItem.featured || false,
            recommended: foundItem.recommended || "",
            images: foundItem.images || [],
          });
          // Load price options
          if (foundItem.priceOptions && foundItem.priceOptions.length > 0) {
            setPriceOptions(
              foundItem.priceOptions.map((opt, idx) => ({
                id: idx + 1,
                name: opt.name || "",
                price: opt.price?.toString() || "",
              }))
            );
          }
        }
      }
    }
  }, [menuId, categoryId, itemId]);

  const handleInputChange = (field) => (e) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleToggle = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleDisplayOnToggle = (option) => {
    setFormData((prev) => {
      const isSelected = prev.displayOn.includes(option);
      if (isSelected) {
        return {
          ...prev,
          displayOn: prev.displayOn.filter((item) => item !== option),
        };
      } else {
        return {
          ...prev,
          displayOn: [...prev.displayOn, option],
        };
      }
    });
  };

  const handleDisplayOnRemove = (option) => {
    setFormData((prev) => ({
      ...prev,
      displayOn: prev.displayOn.filter((item) => item !== option),
    }));
  };

  const handlePriceOptionChange = (id, field, value) => {
    setPriceOptions((prev) =>
      prev.map((option) =>
        option.id === id ? { ...option, [field]: value } : option
      )
    );
  };

  const handleAddPriceOption = () => {
    setPriceOptions((prev) => [
      ...prev,
      { id: Date.now(), name: "", price: "" },
    ]);
  };

  const handleRemovePriceOption = (id) => {
    if (priceOptions.length > 1) {
      setPriceOptions((prev) => prev.filter((option) => option.id !== id));
    }
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      alert("Please enter item name.");
      return;
    }

    if (!formData.description.trim()) {
      alert("Please enter item description.");
      return;
    }

    if (formData.displayOn.length === 0) {
      alert("Please select at least one 'Display on' option.");
      return;
    }

    // Validate at least one price option has a price
    const validPriceOptions = priceOptions.filter(
      (option) => option.price && option.price.trim() !== ""
    );
    if (validPriceOptions.length === 0) {
      alert("Please add at least one price option with a price.");
      return;
    }

    // Load existing items from localStorage
    const storedItems = localStorage.getItem(`items_${categoryId}`);
    const items = storedItems ? JSON.parse(storedItems) : [];

    if (isEditMode && item) {
      // Update existing item
      const updatedItems = items.map((it) =>
        it.id === Number(itemId)
          ? {
              ...it,
              ...formData,
              priceOptions: validPriceOptions.map((opt) => ({
                name: opt.name.trim() || "",
                price: parseFloat(opt.price) || 0,
              })),
              updatedAt: new Date().toISOString(),
            }
          : it
      );
      localStorage.setItem(`items_${categoryId}`, JSON.stringify(updatedItems));
    } else {
      // Create new item
      const newItem = {
        id: Date.now(),
        ...formData,
        priceOptions: validPriceOptions.map((opt) => ({
          name: opt.name.trim() || "",
          price: parseFloat(opt.price) || 0,
        })),
        categoryId: Number(categoryId),
        menuId: Number(menuId),
        visibility: "visible", // Default visibility
        createdAt: new Date().toISOString(),
      };

      // Add to items array
      const updatedItems = [...items, newItem];
      localStorage.setItem(`items_${categoryId}`, JSON.stringify(updatedItems));
    }

    // Navigate back to menu detail page
    const returnCategoryId = location.state?.returnCategoryId || categoryId;
    navigate(`/owner-dashboard/menus/${menuId}`, {
      state: { selectedCategoryId: Number(returnCategoryId) },
      replace: true,
    });
  };

  if (!menu || !category) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-sm text-slate-500">Loading...</p>
      </div>
    );
  }

  const tabs = [
    { id: "item-info", label: "Item Information", icon: RxFileText },
    { id: "price-options", label: "Price Options", icon: HiCurrencyDollar },
    { id: "modifier-options", label: "Modifier Options", icon: RxGrid, disabled: true },
    { id: "localize", label: "Localize", icon: null, disabled: true },
  ];

  return (
    <div className="space-y-6">
      {/* Header with back button and breadcrumb */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() =>
              navigate(`/owner-dashboard/menus/${menuId}`, {
                state: { selectedCategoryId: Number(category?.id ?? categoryId) },
              })
            }
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white p-2 text-slate-600 transition hover:border-emerald-500 hover:text-emerald-500"
          >
            <RxArrowLeft className="size-5" />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-400">categories</span>
            <span className="text-slate-300">/</span>
            <span className="text-sm font-semibold text-slate-900">
              {category.name}
              {isEditMode && item && (
                <>
                  <span className="text-slate-300 mx-1">/</span>
                  <span className="text-emerald-600">Edit Item</span>
                </>
              )}
            </span>
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

      {/* Form Section */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {/* Tabs */}
        <div className="flex items-center gap-6 border-b border-slate-200">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => !tab.disabled && setActiveTab(tab.id)}
                disabled={tab.disabled}
                className={[
                  "flex items-center gap-2 border-b-2 pb-3 text-sm font-semibold transition",
                  isActive
                    ? "border-emerald-500 text-emerald-600"
                    : tab.disabled
                    ? "cursor-not-allowed border-transparent text-slate-300"
                    : "border-transparent text-slate-500 hover:text-emerald-600",
                ].join(" ")}
              >
                {Icon && <Icon className="size-4" />}
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === "item-info" && (
            <div className="space-y-6">
              {/* Name Field */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700" htmlFor="item-name">
                  Name *
                </label>
                <input
                  id="item-name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange("name")}
                  placeholder="Enter item name"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                />
              </div>

              {/* Description Field */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700" htmlFor="item-description">
                  Description *
                </label>
                <textarea
                  id="item-description"
                  value={formData.description}
                  onChange={handleInputChange("description")}
                  placeholder="Enter item description"
                  rows={6}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                />
              </div>

              {/* Labels Field */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-semibold text-slate-700" htmlFor="item-labels">
                    Labels
                  </label>
                  <button
                    type="button"
                    className="text-slate-400 hover:text-slate-600"
                    title="Help"
                  >
                    <span className="text-xs">?</span>
                  </button>
                </div>
                <input
                  id="item-labels"
                  type="text"
                  value={formData.labels}
                  onChange={handleInputChange("labels")}
                  placeholder="Enter labels (comma separated)"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                />
              </div>

              {/* Display on */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">
                  Display on *
                </label>
                <div className="relative">
                  {/* Selected tags */}
                  {formData.displayOn.length > 0 && (
                    <div className="mb-2 flex flex-wrap gap-2">
                      {formData.displayOn.map((optionId) => {
                        const option = displayOnOptions.find((opt) => opt.id === optionId);
                        if (!option) return null;
                        return (
                          <span
                            key={optionId}
                            className="inline-flex items-center gap-2 rounded-full bg-blue-500 px-3 py-1.5 text-xs font-semibold text-white"
                          >
                            <span>{option.icon}</span>
                            <span>{option.label}</span>
                            <button
                              type="button"
                              onClick={() => handleDisplayOnRemove(optionId)}
                              className="ml-1 hover:text-blue-200"
                            >
                              ×
                            </button>
                          </span>
                        );
                      })}
                    </div>
                  )}

                  {/* Dropdown button */}
                  <button
                    type="button"
                    onClick={() => setDisplayOnDropdownOpen(!displayOnDropdownOpen)}
                    className={[
                      "w-full rounded-xl border px-4 py-3 text-left text-sm shadow-sm transition focus:outline-none focus:ring-2",
                      formData.displayOn.length === 0
                        ? "border-rose-300 bg-rose-50 text-slate-900 focus:border-rose-500 focus:ring-rose-200"
                        : "border-slate-200 bg-white text-slate-900 focus:border-emerald-500 focus:ring-emerald-200",
                    ].join(" ")}
                  >
                    {formData.displayOn.length === 0
                      ? "Select display options *"
                      : "Add more display options"}
                  </button>

                  {/* Dropdown menu */}
                  {displayOnDropdownOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setDisplayOnDropdownOpen(false)}
                      />
                      <div className="absolute z-20 mt-1 w-full rounded-xl border border-slate-200 bg-white shadow-lg">
                        <div className="p-2">
                          {displayOnOptions.map((option) => {
                            const isSelected = formData.displayOn.includes(option.id);
                            return (
                              <button
                                key={option.id}
                                type="button"
                                onClick={() => {
                                  handleDisplayOnToggle(option.id);
                                }}
                                className={[
                                  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition",
                                  isSelected
                                    ? "bg-emerald-50 text-emerald-700"
                                    : "text-slate-700 hover:bg-slate-50",
                                ].join(" ")}
                              >
                                <span className="text-lg">{option.icon}</span>
                                <span className="flex-1 font-medium">{option.label}</span>
                                {isSelected && (
                                  <span className="text-emerald-600">✓</span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                        <div className="border-t border-slate-200 p-2">
                          <button
                            type="button"
                            onClick={() => setDisplayOnDropdownOpen(false)}
                            className="w-full rounded-lg bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
                {formData.displayOn.length === 0 && (
                  <p className="text-xs text-rose-600">This field is required</p>
                )}
              </div>

              {/* Size and Unit */}
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700" htmlFor="item-size">
                    Size
                  </label>
                  <input
                    id="item-size"
                    type="text"
                    value={formData.size}
                    onChange={handleInputChange("size")}
                    placeholder="Enter size"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700" htmlFor="item-unit">
                    Unit
                  </label>
                  <input
                    id="item-unit"
                    type="text"
                    value={formData.unit}
                    onChange={handleInputChange("unit")}
                    placeholder="Enter unit"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  />
                </div>
              </div>

              {/* Preparation time */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700" htmlFor="item-prep-time">
                  Preparation time (minutes)
                </label>
                <input
                  id="item-prep-time"
                  type="number"
                  value={formData.preparationTime}
                  onChange={handleInputChange("preparationTime")}
                  placeholder="Enter preparation time"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                />
              </div>

              {/* Ingredient Warnings and Tax Categories */}
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700" htmlFor="item-warnings">
                    Ingredient Warnings
                  </label>
                  <div className="relative">
                    <input
                      id="item-warnings"
                      type="text"
                      value={formData.ingredientWarnings}
                      onChange={handleInputChange("ingredientWarnings")}
                      placeholder="Select ingredient warnings"
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 pr-10 text-sm text-slate-900 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">▼</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700" htmlFor="item-tax">
                    Tax Categories
                  </label>
                  <div className="relative">
                    <input
                      id="item-tax"
                      type="text"
                      value={formData.taxCategories}
                      onChange={handleInputChange("taxCategories")}
                      placeholder="Select tax category"
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 pr-10 text-sm text-slate-900 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">▼</span>
                  </div>
                </div>
              </div>

              {/* Toggles */}
              <div className="grid gap-6 sm:grid-cols-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-slate-700">Mark as sold out</label>
                  <button
                    type="button"
                    onClick={() => handleToggle("markAsSoldOut")}
                    className={[
                      "relative inline-flex h-6 w-11 items-center rounded-full transition",
                      formData.markAsSoldOut ? "bg-emerald-500" : "bg-slate-300",
                    ].join(" ")}
                  >
                    <span
                      className={[
                        "inline-block h-4 w-4 transform rounded-full bg-white transition",
                        formData.markAsSoldOut ? "translate-x-6" : "translate-x-1",
                      ].join(" ")}
                    />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-slate-700">Availability</label>
                  <button
                    type="button"
                    onClick={() => handleToggle("availability")}
                    className={[
                      "relative inline-flex h-6 w-11 items-center rounded-full transition",
                      formData.availability ? "bg-emerald-500" : "bg-slate-300",
                    ].join(" ")}
                  >
                    <span
                      className={[
                        "inline-block h-4 w-4 transform rounded-full bg-white transition",
                        formData.availability ? "translate-x-6" : "translate-x-1",
                      ].join(" ")}
                    />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-slate-700">Featured</label>
                  <button
                    type="button"
                    onClick={() => handleToggle("featured")}
                    className={[
                      "relative inline-flex h-6 w-11 items-center rounded-full transition",
                      formData.featured ? "bg-emerald-500" : "bg-slate-300",
                    ].join(" ")}
                  >
                    <span
                      className={[
                        "inline-block h-4 w-4 transform rounded-full bg-white transition",
                        formData.featured ? "translate-x-6" : "translate-x-1",
                      ].join(" ")}
                    />
                  </button>
                </div>
              </div>

              {/* Recommended */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700" htmlFor="item-recommended">
                  Recommended
                </label>
                <div className="relative">
                  <input
                    id="item-recommended"
                    type="text"
                    value={formData.recommended}
                    onChange={handleInputChange("recommended")}
                    placeholder="Select recommended"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 pr-10 text-sm text-slate-900 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">▼</span>
                </div>
              </div>

              {/* Images Upload */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Images</label>
                <div className="rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-12 text-center">
                  <div className="mx-auto max-w-md">
                    <div className="mb-4 inline-flex size-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                      <svg
                        className="size-8"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                    </div>
                    <p className="text-sm font-medium text-slate-700">
                      Preferred size is 400px * 300px
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Drag 'n' drop some files here, or click to select files
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "price-options" && (
            <div className="space-y-6">
              {/* Info Box */}
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                <div className="flex items-start gap-3">
                  <span className="text-lg text-emerald-600">?</span>
                  <p className="text-sm text-emerald-700">
                    Items can have price options according to their sizes, servings etc. If the item
                    has one price option, you can leave the name blank.
                  </p>
                </div>
              </div>

              {/* Price Options */}
              <div className="space-y-4">
                <label className="text-sm font-semibold text-slate-700">Price *</label>
                {priceOptions.map((option) => (
                  <div key={option.id} className="flex items-center gap-4">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={option.name}
                        onChange={(e) =>
                          handlePriceOptionChange(option.id, "name", e.target.value)
                        }
                        placeholder="Name (e.g., small, full)"
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                      />
                    </div>
                    <div className="flex-1">
                      <input
                        type="number"
                        step="0.01"
                        value={option.price}
                        onChange={(e) =>
                          handlePriceOptionChange(option.id, "price", e.target.value)
                        }
                        placeholder="Price"
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemovePriceOption(option.id)}
                      className="inline-flex items-center justify-center rounded-xl border border-rose-200 bg-rose-50 p-3 text-rose-600 transition hover:bg-rose-100"
                    >
                      <RxTrash className="size-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add New Price Option Button */}
              <button
                type="button"
                onClick={handleAddPriceOption}
                className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-600 transition hover:bg-emerald-100"
              >
                <RxPlus className="size-4" />
                ADD NEW
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

