import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  RxPlusCircled,
  RxDownload,
  RxShare2,
  RxExternalLink,
  RxDashboard,
  RxLockClosed,
  RxDotsVertical,
  RxPlus,
  RxArrowLeft,
  RxArrowRight,
  RxQuestionMarkCircled,
  RxPencil2,
  RxTrash,
  RxCopy,
  RxRocket,
} from "react-icons/rx";
import { HiEye } from "react-icons/hi2";
import { FaQrcode, FaPrint } from "react-icons/fa";

const MENU_PREVIEW_URL = "/menu-preview";

const TABS = [
  { id: "menus", label: "Menus" },
  { id: "modifiers", label: "Modifiers" },
  { id: "archive", label: "Archive" },
];

// No default menus - start with empty array

const INITIAL_MENU_FORM = {
  name: "",
  description: "",
  category: "",
  availability: "always",
};

// Helper function to load menus from localStorage synchronously
const loadMenusFromStorage = () => {
  try {
    const storedMenus = localStorage.getItem("menus");
    if (storedMenus) {
      const parsedMenus = JSON.parse(storedMenus);
      if (Array.isArray(parsedMenus)) {
        return parsedMenus;
      }
    }
  } catch (error) {
    console.error("Error loading menus from localStorage:", error);
  }
  return [];
};

export function MenusPage() {
  const navigate = useNavigate();
  const handleOpenApp = () => {
    window.open(MENU_PREVIEW_URL, "_blank", "noopener,noreferrer");
  };

  const [activeTab, setActiveTab] = useState("menus");
  // Initialize menus directly from localStorage to avoid race condition
  const [menus, setMenus] = useState(() => loadMenusFromStorage());
  const [menuView, setMenuView] = useState("list");
  const [menuForm, setMenuForm] = useState(INITIAL_MENU_FORM);
  const [editingMenuId, setEditingMenuId] = useState(null);
  const [openCardMenuId, setOpenCardMenuId] = useState(null);
  const [duplicateTarget, setDuplicateTarget] = useState(null);

  // Store menus in localStorage whenever they change
  React.useEffect(() => {
    // Save to localStorage whenever menus change
    localStorage.setItem("menus", JSON.stringify(menus));
  }, [menus]);

  const isMenuListVisible = activeTab === "menus" && menuView === "list";
  const isCreateOptionsVisible =
    activeTab === "menus" && menuView === "createOptions";
  const isScratchFormVisible =
    activeTab === "menus" && menuView === "startFromScratch";
  const isImportVisible = activeTab === "menus" && menuView === "import";
  const isEditVisible = activeTab === "menus" && menuView === "editMenu";

  const handleInputChange = (field) => (event) => {
    setMenuForm((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const resetForm = () => {
    setMenuForm(INITIAL_MENU_FORM);
    setEditingMenuId(null);
  };

  const handleSaveDraft = () => {
    if (!menuForm.name.trim()) {
      return;
    }

    setMenus((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: menuForm.name.trim(),
        status: "Draft",
        description: menuForm.description.trim(),
        category: menuForm.category,
        availability: menuForm.availability,
      },
    ]);

    resetForm();
    setOpenCardMenuId(null);
    setMenuView("list");
  };

  const handleCreateMenu = () => {
    if (!menuForm.name.trim()) {
      return;
    }

    const newMenu = {
      id: Date.now(),
      name: menuForm.name.trim(),
      status: "Connected",
      description: menuForm.description.trim(),
    };

    const updatedMenus = [...menus, newMenu];
    setMenus(updatedMenus);
    
    // Immediately save to localStorage
    localStorage.setItem("menus", JSON.stringify(updatedMenus));

    resetForm();
    setOpenCardMenuId(null);
    setMenuView("list");
  };

  const handleUpdateMenu = () => {
    if (!menuForm.name.trim() || editingMenuId === null) {
      return;
    }

    const updatedMenus = menus.map((menu) =>
      menu.id === editingMenuId
        ? {
            ...menu,
            name: menuForm.name.trim(),
            description: menuForm.description.trim(),
          }
        : menu
    );
    
    setMenus(updatedMenus);
    
    // Immediately save to localStorage
    localStorage.setItem("menus", JSON.stringify(updatedMenus));

    resetForm();
    setOpenCardMenuId(null);
    setMenuView("list");
  };

  const handleDeleteMenu = (menuId) => {
    const updatedMenus = menus.filter((menu) => menu.id !== menuId);
    setMenus(updatedMenus);
    
    // Immediately save to localStorage
    localStorage.setItem("menus", JSON.stringify(updatedMenus));
    
    setOpenCardMenuId(null);
  };

  const handleDuplicateMenu = (menu) => {
    setDuplicateTarget(menu);
    setOpenCardMenuId(null);
  };

  const confirmDuplicateMenu = () => {
    if (!duplicateTarget) return;

    const index = menus.findIndex((menu) => menu.id === duplicateTarget.id);
    const duplicateMenu = {
      ...duplicateTarget,
      id: Date.now(),
    };

    let updatedMenus;
    if (index === -1) {
      updatedMenus = [...menus, duplicateMenu];
    } else {
      updatedMenus = [...menus];
      updatedMenus.splice(index + 1, 0, duplicateMenu);
    }

    setMenus(updatedMenus);
    
    // Immediately save to localStorage
    localStorage.setItem("menus", JSON.stringify(updatedMenus));

    setDuplicateTarget(null);
  };

  const cancelDuplicateMenu = () => {
    setDuplicateTarget(null);
  };

  const startCreateOptions = () => {
    setMenuView("createOptions");
    setOpenCardMenuId(null);
    resetForm();
  };

  const startCreateFromScratch = (categoryId) => {
    if (categoryId) {
      navigate(`${categoryId}/items/new`, { state: { returnCategoryId: categoryId } });
      return;
    }
    setMenuView("startFromScratch");
    setOpenCardMenuId(null);
    resetForm();
  };

  const startEditMenu = (menu) => {
    setMenuForm({
      name: menu.name ?? "",
      description: menu.description ?? "",
      category: "",
      availability: "always",
    });
    setEditingMenuId(menu.id);
    setOpenCardMenuId(null);
    setMenuView("editMenu");
  };

  const renderMenuDetailsFields = ({ includeTip = true } = {}) => (
    <div className="mt-6 space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700" htmlFor="menu-name">
            Menu name
          </label>
          <input
            id="menu-name"
            type="text"
            value={menuForm.name}
            onChange={handleInputChange("name")}
            placeholder="e.g. Main Dining Menu"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
          />
          <p className="text-xs text-slate-400">The name customers will see in the QR app.</p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700" htmlFor="menu-category">
            Default category
          </label>
          <select
            id="menu-category"
            value={menuForm.category}
            onChange={handleInputChange("category")}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
          >
            <option value="">Select category</option>
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
            <option value="beverages">Beverages</option>
          </select>
          <p className="text-xs text-slate-400">
            Choose a default category; you can customize items later.
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700" htmlFor="menu-description">
          Description
        </label>
        <textarea
          id="menu-description"
          value={menuForm.description}
          onChange={handleInputChange("description")}
          placeholder="Describe what’s featured on this menu..."
          rows={4}
          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
        />
        <p className="text-xs text-slate-400">
          Help staff and guests understand what’s included here.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700" htmlFor="menu-availability">
            Availability
          </label>
          <select
            id="menu-availability"
            value={menuForm.availability}
            onChange={handleInputChange("availability")}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
          >
            <option value="always">Available anytime</option>
            <option value="scheduled">Specific schedule</option>
          </select>
          <p className="text-xs text-slate-400">
            Set schedule rules later if you pick a custom availability.
          </p>
        </div>

        {includeTip && (
          <div className="space-y-2 rounded-xl border border-dashed border-emerald-200 bg-emerald-50/50 p-4 text-sm text-emerald-700">
            <strong className="font-semibold">Tip:</strong> You can duplicate existing menus to speed up setup once you add your first menu.
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-semibold text-slate-900">Menu</h1>
              <RxRocket className="size-5 text-emerald-500" />
            </div>
            <p className="text-sm text-slate-500">Craft your digital menu.</p>
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
              onClick={handleOpenApp}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
            >
              <HiEye className="size-5" />
              OPEN APP
            </button>
          </div>
        </div>
      </header>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mt-6 flex flex-wrap items-center gap-2 border-b border-slate-200">
          {TABS.map(({ id, label }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => {
                  setActiveTab(id);
                  setMenuView("list");
                  setOpenCardMenuId(null);
                  resetForm();
                }}
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

        {isMenuListVisible && (
          <div className="mt-6 space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={startCreateOptions}
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

            {menus.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
                <div className="mx-auto max-w-md">
                  <div className="mb-4 inline-flex size-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                    <RxLockClosed className="size-7" />
                  </div>
                  <p className="text-lg font-semibold text-slate-900">No menus yet</p>
                  <p className="mt-2 text-sm text-slate-500">
                    Get started by creating your first menu for your restaurant.
                  </p>
                  <button
                    type="button"
                    onClick={startCreateOptions}
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
                  >
                    <RxPlusCircled className="size-5" />
                    Create Your First Menu
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid gap-4 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2">
                {menus.map((menu) => {
                const { id, name, status } = menu;
                const isMenuActionsOpen = openCardMenuId === id;

                return (
                  <article
                    key={id}
                    className="relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50/80 p-6 text-left shadow-sm transition hover:border-emerald-200 hover:bg-white cursor-pointer"
                    onClick={() => navigate(`/owner-dashboard/menus/${id}`)}
                  >
                    <div className="flex justify-end">
                      <button
                        type="button"
                        aria-label="Open menu actions"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenCardMenuId((current) => (current === id ? null : id));
                        }}
                        className="rounded-full border border-transparent p-2 text-slate-400 transition hover:border-slate-200 hover:text-slate-600"
                      >
                        <RxDotsVertical className="size-5" />
                      </button>

                      {isMenuActionsOpen && (
                        <div
                          className="absolute right-4 top-14 z-20 w-44 rounded-xl border border-slate-200 bg-white p-1.5 text-sm text-slate-600 shadow-lg"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              startEditMenu(menu);
                            }}
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left hover:bg-slate-100"
                          >
                            <span className="inline-flex size-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                              <RxPencil2 className="size-4" />
                            </span>
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteMenu(id);
                            }}
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-rose-600 hover:bg-rose-50"
                          >
                            <span className="inline-flex size-6 items-center justify-center rounded-full bg-rose-100 text-rose-600">
                              <RxTrash className="size-4" />
                            </span>
                            Delete
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDuplicateMenu(menu);
                            }}
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left hover:bg-slate-100"
                          >
                            <span className="inline-flex size-6 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                              <RxCopy className="size-4" />
                            </span>
                            Duplicate
                          </button>
                        </div>
                      )}
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
                );
              })}

                <button
                  type="button"
                  onClick={startCreateOptions}
                  className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-sm font-semibold text-slate-500 transition hover:border-emerald-400 hover:text-emerald-500"
                >
                  <span className="inline-flex size-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    <RxPlus className="size-7" />
                  </span>
                  <span className="mt-4">Add menu</span>
                </button>
              </div>
            )}
          </div>
        )}

        {openCardMenuId && isMenuListVisible && (
          <button
            type="button"
            aria-label="Close menu actions"
            onClick={() => setOpenCardMenuId(null)}
            className="fixed inset-0 z-10 cursor-default bg-transparent"
          />
        )}

        {isCreateOptionsVisible && (
          <div className="mt-6 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setMenuView("list")}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 transition hover:border-emerald-500 hover:text-emerald-500"
              >
                <RxArrowLeft className="size-5" />
                Back to menus
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-600 transition hover:border-emerald-400 hover:bg-emerald-100"
              >
                <RxQuestionMarkCircled className="size-5" />
                Learn how to setup your digital menu
              </button>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <article className="relative flex h-full flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:border-emerald-200 hover:shadow-md">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-semibold text-slate-900">Import Menu</h3>
                  </div>
                  <p className="text-sm text-slate-500">
                    Download our spreadsheet template, add your items, then upload to create menus quickly.
                  </p>
                </div>
                <div className="mt-6 flex">
                  <button
                    type="button"
                    onClick={() => setMenuView("import")}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-emerald-600 transition hover:border-emerald-400 hover:text-emerald-700"
                  >
                    Download template
                    <RxArrowRight className="size-5" />
                  </button>
                </div>
              </article>

              <article className="relative flex h-full flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:border-emerald-200 hover:shadow-md">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-slate-900 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                      New
                    </span>
                    <h3 className="text-xl font-semibold text-slate-900">Start from scratch</h3>
                  </div>
                  <p className="text-sm text-slate-500">Build a fresh menu by entering details manually.</p>
                </div>
                <div className="mt-6 flex">
                  <button
                    type="button"
                    onClick={startCreateFromScratch}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
                  >
                    Setup Menu
                    <RxArrowRight className="size-5" />
                  </button>
                </div>
              </article>
            </div>
          </div>
        )}

        {isScratchFormVisible && (
          <div className="mt-6 space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setMenuView("createOptions");
                }}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 transition hover:border-emerald-500 hover:text-emerald-500"
              >
                <RxArrowLeft className="size-5" />
                Menus / Add new menu
              </button>
            </div>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700" htmlFor="menu-name">
                    Name *
                  </label>
                  <input
                    id="menu-name"
                    type="text"
                    value={menuForm.name}
                    onChange={handleInputChange("name")}
                    placeholder="Enter menu name"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700" htmlFor="menu-description">
                    Description *
                  </label>
                  <textarea
                    id="menu-description"
                    value={menuForm.description}
                    onChange={handleInputChange("description")}
                    placeholder="Enter menu description"
                    rows={4}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={handleCreateMenu}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
                >
                  Save
                </button>
              </div>
            </section>
          </div>
        )}

        {isEditVisible && (
          <div className="mt-6 space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setMenuView("list");
                  resetForm();
                }}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 transition hover:border-emerald-500 hover:text-emerald-500"
              >
                <RxArrowLeft className="size-5" />
                Menus / Edit existing menu
              </button>
            </div>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700" htmlFor="edit-menu-name">
                    Name *
                  </label>
                  <input
                    id="edit-menu-name"
                    type="text"
                    value={menuForm.name}
                    onChange={handleInputChange("name")}
                    placeholder="Enter menu name"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700" htmlFor="edit-menu-description">
                    Description *
                  </label>
                  <textarea
                    id="edit-menu-description"
                    value={menuForm.description}
                    onChange={handleInputChange("description")}
                    placeholder="Enter menu description"
                    rows={4}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={handleUpdateMenu}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
                >
                  Save
                </button>
              </div>
            </section>
          </div>
        )}

        {isImportVisible && (
          <div className="mt-6 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setMenuView("createOptions")}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 transition hover:border-emerald-500 hover:text-emerald-500"
              >
                <RxArrowLeft className="size-5" />
                Back to methods
              </button>
            </div>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <header className="space-y-1 border-b border-slate-200 pb-4">
                <h2 className="text-xl font-semibold text-slate-900">Import menu</h2>
                <p className="text-sm text-slate-500">
                  Download the template, fill in your items, then upload to create menus in bulk.
                </p>
              </header>

              <div className="mt-6 space-y-4">
                <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/60 p-6 text-sm text-slate-600">
                  <p className="font-semibold text-slate-800">Step 1</p>
                  <p>Download the spreadsheet template to see the required fields and sample entries.</p>
                  <button className="mt-3 inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600">
                    Download template
                  </button>
                </div>
                <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/60 p-6 text-sm text-slate-600">
                  <p className="font-semibold text-slate-800">Step 2</p>
                  <p>Upload your completed file to import menu items automatically.</p>
                  <button className="mt-3 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 transition hover:border-emerald-500 hover:text-emerald-500">
                    Upload file
                  </button>
                </div>
              </div>
            </section>
          </div>
        )}

        {duplicateTarget && (
          <div className="fixed inset-0 z-30 flex items-center justify-center bg-slate-900/40 px-4">
            <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
              <h3 className="text-lg font-semibold text-slate-900">Duplicate menu?</h3>
              <p className="mt-2 text-sm text-slate-500">
                Are you sure you would like to make a duplicate copy of this menu?
              </p>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={cancelDuplicateMenu}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-emerald-500 hover:text-emerald-500"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDuplicateMenu}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-600"
                >
                  Duplicate
                </button>
              </div>
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


