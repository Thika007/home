import React from "react";

const RESTAURANT_STORAGE_KEY = "restaurantSettings";

const DEFAULT_RESTAURANT = {
  name: "RB Theekshana",
  tagline: "Passionate about good food and service",
  description:
    "At our restaurant, we're all about classic and inspired seasonal cooking, amazing steaks.",
  aboutTitle: "About RB Theekshana",
  aboutBody:
    "Since opening our doors in 1997, Uptown Grill has been a favorite place for locals and visitors to enjoy an authentic steakhouse experience. Now, with Chef Thomas Keller leading the way, we look forward to welcoming you with innovative ideas.",
  heroImage:
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1500&q=80",
  aboutImage:
    "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=900&q=80",
  logo: "https://d22po4pjz3o32e.cloudfront.net/logo-image.svg",
};

export function useRestaurantInfo() {
  const [info, setInfo] = React.useState(DEFAULT_RESTAURANT);

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem(RESTAURANT_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setInfo((current) => ({
          ...current,
          ...parsed,
        }));
      }
    } catch (error) {
      console.warn("Unable to load restaurant settings from storage:", error);
    }
  }, []);

  return info;
}

