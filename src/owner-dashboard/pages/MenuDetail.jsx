import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  RxArrowLeft,
  RxPlus,
  RxDotsVertical,
  RxPerson,
  RxLayers,
  RxPencil2,
  RxTrash,
} from "react-icons/rx";
import { HiMagnifyingGlass, HiEye } from "react-icons/hi2";

// Sample data - in a real app, this would come from an API
const SAMPLE_CATEGORIES = [
  { id: 1, name: "Drinks" },
  { id: 2, name: "Salads" },
  { id: 3, name: "Desserts" },
  { id: 4, name: "Today's Specials" },
];

const SAMPLE_MENU_ITEMS = {
  1: [
    {
      id: 1,
      name: "Beer",
      price: "10.00 INR",
      image: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
    },
    {
      id: 2,
      name: "Citrus Juice",
      price: "10.00 INR",
      image: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
    },
    {
      id: 3,
      name: "Red Wine",
      price: "10.00 INR",
      image: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
    },
    {
      id: 4,
      name: "Beer",
      price: "1000.00 INR",
      image: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
      isNew: true,
    },
  ],
  2: [],
  3: [],
  4: [],
};

export function MenuDetailPage() {
  const { menuId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [menuItems, setMenuItems] = useState({});
  const [menu, setMenu] = useState(null);
  const [openCategoryMenuId, setOpenCategoryMenuId] = useState(null);
  const [deleteConfirmCategory, setDeleteConfirmCategory] = useState(null);
  const [openItemMenuId, setOpenItemMenuId] = useState(null);
  const [deleteConfirmItem, setDeleteConfirmItem] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [showCopyModal, setShowCopyModal] = useState(false);
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [copyTargetCategory, setCopyTargetCategory] = useState(null);
  const [moveTargetCategory, setMoveTargetCategory] = useState(null);
  const [makeDuplicateCopy, setMakeDuplicateCopy] = useState(true);

  // Load menu data from localStorage
  useEffect(() => {
    const storedMenus = localStorage.getItem("menus");
    if (storedMenus) {
      const menus = JSON.parse(storedMenus);
      const foundMenu = menus.find((m) => m.id === Number(menuId));
      if (foundMenu) {
        setMenu(foundMenu);
      }
    }
  }, [menuId]);

  // Load categories from localStorage
  // This will run when component mounts and when location changes (e.g., navigating back)
  useEffect(() => {
    const storedCategories = localStorage.getItem(`categories_${menuId}`);
    if (storedCategories) {
      const loadedCategories = JSON.parse(storedCategories);
      setCategories(loadedCategories);
      // Select first category if available and none is selected or selected doesn't exist
      if (loadedCategories.length > 0) {
        setSelectedCategoryId((prev) => {
          if (prev === null || !loadedCategories.find(cat => cat.id === prev)) {
            return loadedCategories[0].id;
          }
          return prev;
        });
      } else {
        setSelectedCategoryId(null);
      }
    } else {
      // If no categories exist, start with empty array
      setCategories([]);
      setSelectedCategoryId(null);
    }
  }, [menuId, location.pathname]); // Reload when location changes

  // Load items for all categories when categories change
  useEffect(() => {
    const loadItems = () => {
      const itemsByCategory = {};
      categories.forEach((category) => {
        const storedItems = localStorage.getItem(`items_${category.id}`);
        if (storedItems) {
          itemsByCategory[category.id] = JSON.parse(storedItems);
        } else {
          itemsByCategory[category.id] = [];
        }
      });
      setMenuItems(itemsByCategory);
    };

    if (categories.length > 0) {
      loadItems();
    }
  }, [categories, location.pathname]);

  // Clear selected items when category changes
  useEffect(() => {
    setSelectedItems([]);
  }, [selectedCategoryId]);

  const selectedCategory = categories.find((cat) => cat.id === selectedCategoryId);
  const items = selectedCategoryId ? menuItems[selectedCategoryId] || [] : [];
  const filteredItems = items.filter((item) =>
    item.name && item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!menu) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-sm text-slate-500">Loading menu...</p>
      </div>
    );
  }

  const handleAddCategory = () => {
    navigate(`/owner-dashboard/menus/${menuId}/categories/new`);
  };

  const handleAddItem = () => {
    if (!selectedCategoryId) {
      return;
    }
    navigate(`/owner-dashboard/menus/${menuId}/categories/${selectedCategoryId}/items/new`);
  };

  const handleCategoryVisibility = (categoryId) => {
    setOpenCategoryMenuId(null);
    navigate(`/owner-dashboard/menus/${menuId}/categories/${categoryId}/visibility`);
  };

  const handleCategoryEdit = (categoryId) => {
    setOpenCategoryMenuId(null);
    navigate(`/owner-dashboard/menus/${menuId}/categories/${categoryId}/edit`);
  };

  const handleCategoryDelete = (category) => {
    setOpenCategoryMenuId(null);
    setDeleteConfirmCategory(category);
  };

  const confirmDeleteCategory = () => {
    if (!deleteConfirmCategory) return;

    // Remove category from localStorage
    const storedCategories = localStorage.getItem(`categories_${menuId}`);
    if (storedCategories) {
      const categories = JSON.parse(storedCategories);
      const updatedCategories = categories.filter(
        (cat) => cat.id !== deleteConfirmCategory.id
      );
      localStorage.setItem(`categories_${menuId}`, JSON.stringify(updatedCategories));
    }

    // Remove items for this category
    localStorage.removeItem(`items_${deleteConfirmCategory.id}`);

    // Reload categories
    const storedCategoriesAfter = localStorage.getItem(`categories_${menuId}`);
    if (storedCategoriesAfter) {
      const loadedCategories = JSON.parse(storedCategoriesAfter);
      setCategories(loadedCategories);
      if (loadedCategories.length > 0) {
        setSelectedCategoryId(loadedCategories[0].id);
      } else {
        setSelectedCategoryId(null);
      }
    } else {
      setCategories([]);
      setSelectedCategoryId(null);
    }

    setDeleteConfirmCategory(null);
  };

  const cancelDeleteCategory = () => {
    setDeleteConfirmCategory(null);
  };

  const handleItemVisibility = (itemId) => {
    if (!selectedCategoryId) return;
    setOpenItemMenuId(null);
    navigate(`/owner-dashboard/menus/${menuId}/categories/${selectedCategoryId}/items/${itemId}/visibility`);
  };

  const handleItemEdit = (itemId) => {
    if (!selectedCategoryId) return;
    setOpenItemMenuId(null);
    navigate(`/owner-dashboard/menus/${menuId}/categories/${selectedCategoryId}/items/${itemId}/edit`);
  };

  const handleItemDelete = (item) => {
    setOpenItemMenuId(null);
    setDeleteConfirmItem({ id: item.id, isMultiple: false });
  };

  const confirmDeleteItem = () => {
    if (!deleteConfirmItem || !selectedCategoryId) return;

    // Remove item from localStorage
    const storedItems = localStorage.getItem(`items_${selectedCategoryId}`);
    if (storedItems) {
      const items = JSON.parse(storedItems);
      const updatedItems = items.filter((item) => item.id !== deleteConfirmItem.id);
      localStorage.setItem(`items_${selectedCategoryId}`, JSON.stringify(updatedItems));

      // Reload items
      setMenuItems((prev) => ({
        ...prev,
        [selectedCategoryId]: updatedItems,
      }));
    }

    setDeleteConfirmItem(null);
  };

  const cancelDeleteItem = () => {
    setDeleteConfirmItem(null);
  };

  const handleItemCheckboxChange = (itemId, checked) => {
    if (checked) {
      setSelectedItems((prev) => [...prev, itemId]);
    } else {
      setSelectedItems((prev) => prev.filter((id) => id !== itemId));
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedItems(filteredItems.map((item) => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleCopyItems = () => {
    if (selectedItems.length === 0) return;
    setShowCopyModal(true);
  };

  const handleMoveItems = () => {
    if (selectedItems.length === 0) return;
    setShowMoveModal(true);
  };

  const handleDeleteSelectedItems = () => {
    if (selectedItems.length === 0) return;
    // Show confirmation modal
    setDeleteConfirmItem({ id: selectedItems, isMultiple: true });
  };

  const confirmCopyItems = () => {
    if (!copyTargetCategory || selectedItems.length === 0) return;

    // Load source items
    const sourceItems = localStorage.getItem(`items_${selectedCategoryId}`);
    const items = sourceItems ? JSON.parse(sourceItems) : [];

    // Get selected items data
    const itemsToCopy = items.filter((item) => selectedItems.includes(item.id));

    // Load target category items
    const targetItems = localStorage.getItem(`items_${copyTargetCategory}`);
    const existingTargetItems = targetItems ? JSON.parse(targetItems) : [];

    // Copy items to target category
    const copiedItems = itemsToCopy.map((item) => ({
      ...item,
      id: makeDuplicateCopy ? Date.now() + Math.random() : item.id,
      categoryId: copyTargetCategory,
      createdAt: new Date().toISOString(),
    }));

    const updatedTargetItems = [...existingTargetItems, ...copiedItems];
    localStorage.setItem(`items_${copyTargetCategory}`, JSON.stringify(updatedTargetItems));

    // Clear selections and close modal
    setSelectedItems([]);
    setShowCopyModal(false);
    setCopyTargetCategory(null);

    // Reload items for current category
    const storedItems = localStorage.getItem(`items_${selectedCategoryId}`);
    if (storedItems) {
      const loadedItems = JSON.parse(storedItems);
      setMenuItems((prev) => ({
        ...prev,
        [selectedCategoryId]: loadedItems,
      }));
    }
  };

  const confirmMoveItems = () => {
    if (!moveTargetCategory || selectedItems.length === 0 || moveTargetCategory === selectedCategoryId) return;

    // Load source items
    const sourceItems = localStorage.getItem(`items_${selectedCategoryId}`);
    const items = sourceItems ? JSON.parse(sourceItems) : [];

    // Get items to move
    const itemsToMove = items.filter((item) => selectedItems.includes(item.id));
    const remainingItems = items.filter((item) => !selectedItems.includes(item.id));

    // Load target category items
    const targetItems = localStorage.getItem(`items_${moveTargetCategory}`);
    const existingTargetItems = targetItems ? JSON.parse(targetItems) : [];

    // Move items to target category
    const movedItems = itemsToMove.map((item) => ({
      ...item,
      categoryId: moveTargetCategory,
      updatedAt: new Date().toISOString(),
    }));

    // Update source category (remove items)
    localStorage.setItem(`items_${selectedCategoryId}`, JSON.stringify(remainingItems));

    // Update target category (add items)
    const updatedTargetItems = [...existingTargetItems, ...movedItems];
    localStorage.setItem(`items_${moveTargetCategory}`, JSON.stringify(updatedTargetItems));

    // Clear selections and close modal
    setSelectedItems([]);
    setShowMoveModal(false);
    setMoveTargetCategory(null);

    // Reload items for current category
    setMenuItems((prev) => ({
      ...prev,
      [selectedCategoryId]: remainingItems,
    }));
  };

  const handleDeleteMultipleItems = () => {
    if (selectedItems.length === 0) return;

    // Load items from localStorage
    const storedItems = localStorage.getItem(`items_${selectedCategoryId}`);
    if (storedItems) {
      const items = JSON.parse(storedItems);
      const updatedItems = items.filter((item) => !selectedItems.includes(item.id));
      localStorage.setItem(`items_${selectedCategoryId}`, JSON.stringify(updatedItems));

      // Reload items
      setMenuItems((prev) => ({
        ...prev,
        [selectedCategoryId]: updatedItems,
      }));
    }

    // Clear selections
    setSelectedItems([]);
    setDeleteConfirmItem(null);
  };

  // Show empty state if no categories
  if (categories.length === 0) {
    return (
      <div className="space-y-6">
        {/* Header with back button and menu name */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/owner-dashboard/menus")}
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white p-2 text-slate-600 transition hover:border-emerald-500 hover:text-emerald-500"
          >
            <RxArrowLeft className="size-5" />
          </button>
          <h1 className="text-2xl font-semibold text-slate-900">{menu.name}</h1>
        </div>

        {/* Empty state */}
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <div className="mx-auto max-w-md">
            <p className="text-lg font-semibold text-slate-900">No categories yet</p>
            <p className="mt-2 text-sm text-slate-500">
              Get started by creating your first category for this menu.
            </p>
            <button
              type="button"
              onClick={handleAddCategory}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
            >
              <RxPlus className="size-5" />
              Add Category
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with back button and menu name */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate("/owner-dashboard/menus")}
          className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white p-2 text-slate-600 transition hover:border-emerald-500 hover:text-emerald-500"
        >
          <RxArrowLeft className="size-5" />
        </button>
        <h1 className="text-2xl font-semibold text-slate-900">{menu.name}</h1>
      </div>

      {/* Main content area with two panels */}
      <div className="flex gap-6">
        {/* Left Panel - Categories */}
        <div className="w-64 flex-shrink-0 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 p-4">
            <h2 className="text-sm font-semibold text-slate-900">Categories</h2>
            <button
              type="button"
              onClick={handleAddCategory}
              className="inline-flex items-center justify-center rounded-lg bg-emerald-500 p-1.5 text-white transition hover:bg-emerald-600"
            >
              <RxPlus className="size-4" />
            </button>
          </div>
          <div className="divide-y divide-slate-100">
            {categories.map((category) => {
              const isSelected = category.id === selectedCategoryId;
              return (
                <div
                  key={category.id}
                  className={[
                    "flex w-full items-center justify-between px-4 py-3 transition",
                    isSelected
                      ? "bg-emerald-50 text-emerald-600"
                      : "text-slate-600 hover:bg-slate-50",
                  ].join(" ")}
                >
                  <button
                    type="button"
                    onClick={() => setSelectedCategoryId(category.id)}
                    className="flex-1 text-left"
                  >
                    <span className="text-sm font-medium">{category.name}</span>
                  </button>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenCategoryMenuId(
                          openCategoryMenuId === category.id ? null : category.id
                        );
                      }}
                      className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                    >
                      <RxDotsVertical className="size-4" />
                    </button>

                    {openCategoryMenuId === category.id && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setOpenCategoryMenuId(null)}
                        />
                        <div className="absolute right-0 top-full z-20 mt-1 w-48 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg">
                          <button
                            type="button"
                            onClick={() => handleCategoryVisibility(category.id)}
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100"
                          >
                            <HiEye className="size-4" />
                            Visibility
                          </button>
                          <button
                            type="button"
                            onClick={() => handleCategoryEdit(category.id)}
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100"
                          >
                            <RxPencil2 className="size-4" />
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleCategoryDelete(category)}
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-rose-600 hover:bg-rose-50"
                          >
                            <RxTrash className="size-4" />
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Panel - Menu Items */}
        <div className="flex-1 rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* Breadcrumb and Actions */}
          <div className="flex items-center justify-between border-b border-slate-200 p-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-400">Categories</span>
              <span className="text-slate-300">/</span>
              <span className="text-sm font-semibold text-slate-900">
                {selectedCategory?.name || "Select a category"}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleAddItem}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600"
              >
                <RxPlus className="size-4" />
                Add New
              </button>
              {selectedItems.length > 0 && (
                <>
                  <button
                    type="button"
                    onClick={handleCopyItems}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-emerald-500 hover:text-emerald-500"
                  >
                    Copy
                  </button>
                  <button
                    type="button"
                    onClick={handleMoveItems}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-emerald-500 hover:text-emerald-500"
                  >
                    Move
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteSelectedItems}
                    className="inline-flex items-center gap-2 rounded-xl bg-rose-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-600"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Action Bar with Search */}
          <div className="border-b border-slate-200 p-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="relative">
                  <HiMagnifyingGlass className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  />
                </div>
              </div>
              {filteredItems.length > 0 && (
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selectedItems.length === filteredItems.length && filteredItems.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-emerald-500 focus:ring-emerald-200"
                  />
                  <span className="text-sm text-slate-600 whitespace-nowrap">
                    {selectedItems.length > 0
                      ? `${selectedItems.length} selected`
                      : "Select all"}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Menu Items List */}
          <div className="divide-y divide-slate-100">
            {filteredItems.length === 0 ? (
              <div className="p-8 text-center text-sm text-slate-500">
                {searchQuery ? "No items found" : "No items in this category"}
              </div>
            ) : (
              filteredItems.map((item) => {
                // Get the first price option or display price range
                const firstPrice = item.priceOptions && item.priceOptions.length > 0
                  ? item.priceOptions[0].price
                  : 0;
                const priceDisplay = item.priceOptions && item.priceOptions.length > 1
                  ? `${firstPrice.toFixed(2)} - ${item.priceOptions[item.priceOptions.length - 1].price.toFixed(2)} INR`
                  : `${firstPrice.toFixed(2)} INR`;

                // Display on icons
                const displayOnIcons = [];
                if (item.displayOn && item.displayOn.includes("dine-in")) {
                  displayOnIcons.push({ icon: "🍽️", label: "Dine in" });
                }
                if (item.displayOn && item.displayOn.includes("takeaway")) {
                  displayOnIcons.push({ icon: "🥡", label: "Takeaway" });
                }

                return (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-4 transition hover:bg-slate-50"
                  >
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={(e) => handleItemCheckboxChange(item.id, e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-emerald-500 focus:ring-emerald-200"
                    />
                    <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl bg-slate-100">
                      {item.images && item.images.length > 0 ? (
                        <img
                          src={item.images[0]}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="text-slate-400">
                          <RxLayers className="size-6" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-slate-900">{item.name}</h3>
                        {item.featured && (
                          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-600">
                            FEATURED
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {displayOnIcons.map((display, idx) => (
                        <span
                          key={idx}
                          className="text-lg"
                          title={display.label}
                        >
                          {display.icon}
                        </span>
                      ))}
                    </div>
                    <span className="text-sm font-semibold text-slate-900">{priceDisplay}</span>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() =>
                          setOpenItemMenuId(openItemMenuId === item.id ? null : item.id)
                        }
                        className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                      >
                        <RxDotsVertical className="size-4" />
                      </button>

                      {openItemMenuId === item.id && (
                        <>
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setOpenItemMenuId(null)}
                          />
                          <div className="absolute right-0 top-full z-20 mt-1 w-48 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg">
                            <button
                              type="button"
                              onClick={() => handleItemVisibility(item.id)}
                              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100"
                            >
                              <HiEye className="size-4" />
                              Visibility
                            </button>
                            <button
                              type="button"
                              onClick={() => handleItemEdit(item.id)}
                              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100"
                            >
                              <RxPencil2 className="size-4" />
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleItemDelete(item)}
                              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-rose-600 hover:bg-rose-50"
                            >
                              <RxTrash className="size-4" />
                              Delete
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Delete Category Confirmation Modal */}
      {deleteConfirmCategory && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-slate-900/40 px-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-semibold text-slate-900">Delete</h3>
            <p className="mt-2 text-sm text-slate-500">
              Are you sure you want to delete? You can't undo this action.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={cancelDeleteCategory}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-emerald-500 hover:text-emerald-500"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteCategory}
                className="inline-flex items-center gap-2 rounded-xl bg-rose-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Item Confirmation Modal */}
      {deleteConfirmItem && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-slate-900/40 px-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-semibold text-slate-900">Delete</h3>
            <p className="mt-2 text-sm text-slate-500">
              {deleteConfirmItem.isMultiple
                ? `Are you sure you want to delete ${selectedItems.length} item${selectedItems.length > 1 ? "s" : ""}? You can't undo this action.`
                : "Are you sure you want to delete? You can't undo this action."}
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={deleteConfirmItem.isMultiple ? () => setDeleteConfirmItem(null) : cancelDeleteItem}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-emerald-500 hover:text-emerald-500"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={deleteConfirmItem.isMultiple ? handleDeleteMultipleItems : confirmDeleteItem}
                className="inline-flex items-center gap-2 rounded-xl bg-rose-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Copy Items Modal */}
      {showCopyModal && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-slate-900/40 px-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-semibold text-slate-900">Copy foods to a category</h3>
            
            {/* Foods Selection */}
            <div className="mt-6 space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                Foods *
              </label>
              <div className="min-h-[48px] rounded-xl border border-slate-200 px-4 py-3">
                {selectedItems.length === 0 ? (
                  <span className="text-sm text-slate-400">No items selected</span>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {filteredItems
                      .filter((item) => selectedItems.includes(item.id))
                      .map((item) => (
                        <span
                          key={item.id}
                          className="inline-flex items-center gap-2 rounded-full bg-blue-500 px-3 py-1.5 text-xs font-semibold text-white"
                        >
                          {item.name}
                          <button
                            type="button"
                            onClick={() => handleItemCheckboxChange(item.id, false)}
                            className="hover:text-blue-200"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                  </div>
                )}
              </div>
            </div>

            {/* Category Selection */}
            <div className="mt-6 space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                Make duplicate copy to this category *
              </label>
              <div className="relative">
                <select
                  value={copyTargetCategory !== null ? copyTargetCategory : ""}
                  onChange={(e) => setCopyTargetCategory(e.target.value ? Number(e.target.value) : null)}
                  className="w-full appearance-none rounded-xl border border-slate-200 px-4 py-3 pr-10 text-sm text-slate-900 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                >
                  <option value="">Select category</option>
                  {categories
                    .filter((cat) => cat.id !== selectedCategoryId)
                    .map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">▼</span>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowCopyModal(false);
                  setCopyTargetCategory(null);
                }}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-emerald-500 hover:text-emerald-500"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmCopyItems}
                disabled={!copyTargetCategory || selectedItems.length === 0}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:bg-slate-300 disabled:cursor-not-allowed"
              >
                Copy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Move Items Modal */}
      {showMoveModal && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-slate-900/40 px-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-semibold text-slate-900">Move foods to a category</h3>
            
            <div className="mt-6 space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                Move to category *
              </label>
              <div className="relative">
                <select
                  value={moveTargetCategory !== null ? moveTargetCategory : ""}
                  onChange={(e) => setMoveTargetCategory(e.target.value ? Number(e.target.value) : null)}
                  className="w-full appearance-none rounded-xl border border-slate-200 px-4 py-3 pr-10 text-sm text-slate-900 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                >
                  <option value="">Select category</option>
                  {categories
                    .filter((cat) => cat.id !== selectedCategoryId)
                    .map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">▼</span>
              </div>
              <p className="text-xs text-slate-400">
                {selectedItems.length} item{selectedItems.length > 1 ? "s" : ""} will be moved
              </p>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowMoveModal(false);
                  setMoveTargetCategory(null);
                }}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-emerald-500 hover:text-emerald-500"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmMoveItems}
                disabled={!moveTargetCategory || selectedItems.length === 0}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:bg-slate-300 disabled:cursor-not-allowed"
              >
                Move
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

