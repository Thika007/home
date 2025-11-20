import React from "react";
import { menuAPI } from "../../services/api";

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

// Helper to get restaurant ID from logged-in user, URL params, or localStorage
function getRestaurantId() {
  if (typeof window === "undefined") {
    return null;
  }

  // Priority 1: Get from logged-in owner's user data
  try {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user.role === "Owner" && user.restaurantId) {
        return parseInt(user.restaurantId, 10);
      }
    }
  } catch (error) {
    console.warn("Failed to parse user data:", error);
  }

  // Priority 2: Try to get from URL params
  const urlParams = new URLSearchParams(window.location.search);
  const restaurantIdParam = urlParams.get("restaurantId");
  if (restaurantIdParam) {
    return parseInt(restaurantIdParam, 10);
  }

  // Priority 3: Try localStorage (for backward compatibility)
  const stored = localStorage.getItem("restaurantId");
  if (stored) {
    return parseInt(stored, 10);
  }

  // No restaurant ID found - return null instead of defaulting to 1
  // This will show fallback menu instead of wrong restaurant's menu
  return null;
}

export function usePublicMenuData(menuId = null) {
  const [menuData, setMenuData] = React.useState(() => buildFallbackMenu());
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const loadMenuData = async () => {
      try {
        setLoading(true);
        
        // Get restaurant ID from URL params or localStorage
        const restaurantId = getRestaurantId();

        if (!restaurantId) {
          setMenuData(buildFallbackMenu());
          setLoading(false);
          return;
        }

        // Fetch public menus from API
        const publicMenus = await menuAPI.getPublicMenu(restaurantId);

        if (!publicMenus || publicMenus.length === 0) {
          setMenuData(buildFallbackMenu());
          setLoading(false);
          return;
        }

        // Select menu based on menuId or use first active menu
        let selectedMenu;
        if (menuId) {
          selectedMenu = publicMenus.find((menu) => menu.id === Number(menuId));
        } else {
          // Use first menu (they're already ordered by IsDefault)
          selectedMenu = publicMenus[0];
        }

        if (!selectedMenu) {
          setMenuData(buildFallbackMenu());
          setLoading(false);
          return;
        }

        // Transform API response to expected format
        const transformedCategories = selectedMenu.categories.map((category) => ({
          id: category.id,
          name: category.name || "Untitled category",
          description: category.description || "",
          items: category.items.map((item) => ({
            id: item.id,
            name: item.name || "Untitled item",
            description: item.description || "No description provided yet.",
            priceDisplay: formatPriceDisplay(item),
            price: item.price,
            priceOptions: item.priceOptions,
            imageUrl: item.imageUrl,
            image: item.imageUrl, // For backward compatibility
            labels: item.labels,
            displayOn: item.displayOn || [],
            size: item.size,
            unit: item.unit,
            preparationTime: item.preparationTime,
            featured: item.featured || false,
            recommended: item.recommended,
            markAsSoldOut: item.markAsSoldOut || false,
            isAvailable: item.isAvailable !== false,
          })),
        }));

        const nonEmptyCategories = transformedCategories.filter((category) => category.items.length > 0);

        if (nonEmptyCategories.length === 0) {
          setMenuData(buildFallbackMenu({ menuName: selectedMenu.name || FALLBACK_MENU_TEMPLATE.menuName }));
        } else {
          setMenuData({
            menuId: selectedMenu.id,
            menuName: selectedMenu.name || FALLBACK_MENU_TEMPLATE.menuName,
            categories: nonEmptyCategories,
            hasLiveData: true,
          });
        }
      } catch (error) {
        console.warn("Failed to load menu data from API:", error);
        setMenuData(buildFallbackMenu());
      } finally {
        setLoading(false);
      }
    };

    loadMenuData();
  }, [menuId]);

  return menuData;
}

export function useAllMenus() {
  const [menus, setMenus] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const loadMenus = async () => {
      try {
        setLoading(true);
        
        // Get restaurant ID from URL params or localStorage
        const restaurantId = getRestaurantId();

        if (!restaurantId) {
          setMenus([]);
          setLoading(false);
          return;
        }

        // Fetch public menus from API
        const publicMenus = await menuAPI.getPublicMenu(restaurantId);

        // Transform to expected format
        const transformedMenus = (publicMenus || []).map((menu) => ({
          id: menu.id,
          name: menu.name,
          description: menu.description || "",
          isActive: true,
          isPublished: true,
          isPublic: true,
          status: "published",
        }));

        setMenus(transformedMenus);
      } catch (error) {
        console.warn("Failed to load menus from API:", error);
        setMenus([]);
      } finally {
        setLoading(false);
      }
    };

    loadMenus();
  }, []);

  return menus;
}

