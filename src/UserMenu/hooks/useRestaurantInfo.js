const FALLBACK_RESTAURANT = {
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
  contactEmail: "thibuddhi@gmail.com",
  hours: [
    { day: "Monday", time: "00:00 - 23:59" },
    { day: "Tuesday", time: "00:00 - 23:59" },
    { day: "Wednesday", time: "00:00 - 23:59" },
    { day: "Thursday", time: "00:00 - 23:59" },
    { day: "Friday", time: "00:00 - 23:59" },
    { day: "Saturday", time: "00:00 - 23:59" },
    { day: "Sunday", time: "00:00 - 23:59" },
  ],
};

export function useRestaurantInfo() {
  if (typeof window === "undefined") {
    return FALLBACK_RESTAURANT;
  }

  try {
    const stored = localStorage.getItem("restaurantInfo");
    if (!stored) {
      return FALLBACK_RESTAURANT;
    }
    const parsed = JSON.parse(stored);
    return {
      ...FALLBACK_RESTAURANT,
      ...parsed,
      hours: Array.isArray(parsed?.hours) && parsed.hours.length ? parsed.hours : FALLBACK_RESTAURANT.hours,
    };
  } catch (error) {
    console.warn("Failed to parse restaurant info from localStorage", error);
    return FALLBACK_RESTAURANT;
  }
}
