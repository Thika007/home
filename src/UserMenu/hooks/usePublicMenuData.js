import React from "react";

const currencyFormatter = new Intl.NumberFormat("en-LK", {
  style: "currency",
  currency: "LKR",
  minimumFractionDigits: 2,
});

const FALLBACK_MENU_TEMPLATE = {
  menuName: "Sample Menu",
  categories: [
    {
      id: "fallback-desserts",
      name: "Desserts",
      description: "Sweet treats baked fresh daily.",
      items: [
        {
          id: "fallback-desserts-1",
          name: "Red Velvet Cake",
          description: "Double layered red velvet topped with dark chocolate.",
          priceDisplay: currencyFormatter.format(1200),
        },
        {
          id: "fallback-desserts-2",
          name: "Blueberry Cheesecake",
          description: "Blueberry cheesecake with buttery graham crust.",
          priceDisplay: currencyFormatter.format(1450),
        },
      ],
    },
    {
      id: "fallback-salads",
      name: "Salads",
      description: "Light and refreshing plates.",
      items: [
        {
          id: "fallback-salads-1",
          name: "Veggie Lemon Salad",
          description: "Fresh greens tossed with citrus dressing.",
          priceDisplay: currencyFormatter.format(890),
        },
        {
          id: "fallback-salads-2",
          name: "Greek Salad",
          description: "Tomato, cucumber, red onion, and feta cheese.",
          priceDisplay: currencyFormatter.format(950),
        },
      ],
    },
    {
      id: "fallback-drinks",
      name: "Drinks",
      description: "Signature beverages to pair with your meal.",
      items: [
        {
          id: "fallback-drinks-1",
          name: "Citrus Juice",
          description: "Fresh citrus fruits served with ice and mint.",
          priceDisplay: currencyFormatter.format(650),
        },
        {
          id: "fallback-drinks-2",
          name: "Cold Brew Coffee",
          description: "Slow steeped Arabica blend served over ice.",
          priceDisplay: currencyFormatter.format(720),
        },
      ],
    },
  ],
};

function buildFallbackMenu(overrides = {}) {
  return {
    menuName: overrides.menuName ?? FALLBACK_MENU_TEMPLATE.menuName,
    categories: FALLBACK_MENU_TEMPLATE.categories.map((category) => ({
      ...category,
      items: category.items.map((item) => ({ ...item })),
    })),
    hasLiveData: false,
  };
}

function formatPriceDisplay(item) {
  const priceOptions = Array.isArray(item?.priceOptions) ? item.priceOptions : [];
  const numericPrices = priceOptions
    .map((option) => Number(option.price))
    .filter((price) => Number.isFinite(price) && price >= 0)
    .sort((a, b) => a - b);

  if (numericPrices.length > 0) {
    if (numericPrices.length === 1) {
      return currencyFormatter.format(numericPrices[0]);
    }
    return `${currencyFormatter.format(numericPrices[0])} - ${currencyFormatter.format(
      numericPrices[numericPrices.length - 1],
    )}`;
  }

  if (item?.price) {
    const numeric = Number(String(item.price).replace(/[^\d.]/g, ""));
    if (Number.isFinite(numeric) && numeric > 0) {
      return currencyFormatter.format(numeric);
    }
    if (typeof item.price === "string") {
      return item.price;
    }
  }

  return "Price on request";
}

function loadMenuFromStorage() {
  if (typeof window === "undefined") {
    return buildFallbackMenu();
  }

  try {
    const menusRaw = localStorage.getItem("menus");
    if (!menusRaw) {
      return buildFallbackMenu();
    }

    const menus = JSON.parse(menusRaw);
    if (!Array.isArray(menus) || menus.length === 0) {
      return buildFallbackMenu();
    }

    const selectedMenu =
      menus.find((menu) => menu.isPublished || menu.isPublic) ??
      menus.find((menu) => menu.status === "published") ??
      menus[0];

    if (!selectedMenu) {
      return buildFallbackMenu();
    }

    const categoriesRaw = localStorage.getItem(`categories_${selectedMenu.id}`);
    const categories = categoriesRaw ? JSON.parse(categoriesRaw) : [];

    const hydratedCategories = categories.map((category) => {
      const itemsRaw = localStorage.getItem(`items_${category.id}`);
      const items = itemsRaw ? JSON.parse(itemsRaw) : [];

      const visibleItems = items.filter((item) => item.visibility !== "hidden");

      return {
        id: category.id,
        name: category.name || "Untitled category",
        description: category.description || "",
        items: visibleItems.map((item) => ({
          id: item.id,
          name: item.name || "Untitled item",
          description: item.description || "No description provided yet.",
          priceDisplay: formatPriceDisplay(item),
        })),
      };
    });

    const nonEmptyCategories = hydratedCategories.filter((category) => category.items.length > 0);

    if (nonEmptyCategories.length === 0) {
      return buildFallbackMenu({ menuName: selectedMenu.name || FALLBACK_MENU_TEMPLATE.menuName });
    }

    return {
      menuName: selectedMenu.name || FALLBACK_MENU_TEMPLATE.menuName,
      categories: nonEmptyCategories,
      hasLiveData: true,
    };
  } catch (error) {
    console.warn("Failed to load menu data", error);
    return buildFallbackMenu();
  }
}

export function usePublicMenuData() {
  const [menuData, setMenuData] = React.useState(() => loadMenuFromStorage());

  React.useEffect(() => {
    const handleStorage = (event) => {
      if (!event.key || event.key === "menus" || event.key.startsWith("categories_") || event.key.startsWith("items_")) {
        setMenuData(loadMenuFromStorage());
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return menuData;
}

