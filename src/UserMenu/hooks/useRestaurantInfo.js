import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { restaurantAPI } from "../../services/api";

const FALLBACK_RESTAURANT = {
  id: 1,
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
  whyChooseUsImage:
    "https://images.unsplash.com/photo-1473093226795-af9932fe5856?auto=format&fit=crop&w=900&q=80",
  whyChooseUsTitle: "This is a grill for you!",
  whyChooseUsBody:
    "The Uptown Grill invites you into a modern-day American grill and bar featuring great inventive food and beverage using only the best possible ingredients. Our goal is to provide an affordable, high quality dining experience for our customers.",
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
  const [restaurant, setRestaurant] = useState(FALLBACK_RESTAURANT);
  const [loading, setLoading] = useState(true);
  const params = useParams();

  useEffect(() => {
    const fetchRestaurantInfo = async () => {
      if (typeof window === "undefined") {
        setLoading(false);
        return;
      }

      try {
        // Get restaurant ID from URL params, logged-in user, or localStorage
        let restaurantId = params?.restaurantId;
        if (!restaurantId) {
          // Try to get from logged-in owner's user data first
          try {
            const userStr = localStorage.getItem("user");
            if (userStr) {
              const user = JSON.parse(userStr);
              if (user.role === "Owner" && user.restaurantId) {
                restaurantId = parseInt(user.restaurantId, 10);
              }
            }
          } catch (error) {
            console.warn("Failed to parse user data:", error);
          }
          
          // Fallback to localStorage
          if (!restaurantId) {
            const stored = localStorage.getItem("restaurantId");
            restaurantId = stored ? parseInt(stored, 10) : 1;
          }
        }

        // Fetch from API
        const apiData = await restaurantAPI.getPublicRestaurantInfo(restaurantId);

        // Map API response to expected format
        const mappedData = {
          id: apiData.id || restaurantId || 1, // Include restaurant ID
          name: apiData.name || FALLBACK_RESTAURANT.name,
          tagline: apiData.tagline || FALLBACK_RESTAURANT.tagline,
          description: apiData.description || FALLBACK_RESTAURANT.description,
          aboutTitle: apiData.aboutTitle || FALLBACK_RESTAURANT.aboutTitle,
          aboutBody: apiData.aboutBody || FALLBACK_RESTAURANT.aboutBody,
          whyChooseUsTitle: apiData.whyChooseUsTitle || FALLBACK_RESTAURANT.whyChooseUsTitle,
          whyChooseUsBody: apiData.whyChooseUsBody || FALLBACK_RESTAURANT.whyChooseUsBody,
          heroImage: apiData.heroImageUrl || FALLBACK_RESTAURANT.heroImage,
          aboutImage: apiData.aboutImageUrl || FALLBACK_RESTAURANT.aboutImage,
          whyChooseUsImage: apiData.whyChooseUsImageUrl || FALLBACK_RESTAURANT.whyChooseUsImage,
          logo: apiData.logoUrl || FALLBACK_RESTAURANT.logo,
          contactEmail: apiData.contactEmail || FALLBACK_RESTAURANT.contactEmail,
          hours: apiData.operatingHours?.length
            ? apiData.operatingHours.map((oh) => ({
                day: oh.day,
                time: oh.time,
              }))
            : FALLBACK_RESTAURANT.hours,
        };

        setRestaurant(mappedData);
      } catch (error) {
        console.warn("Failed to fetch restaurant info from API:", error);
        
        // Fallback to localStorage if API fails
        try {
          const stored = localStorage.getItem("restaurantInfo");
          if (stored) {
            const parsed = JSON.parse(stored);
            setRestaurant({
              ...FALLBACK_RESTAURANT,
              id: restaurantId || parsed.id || 1, // Ensure ID is set
              ...parsed,
              hours: Array.isArray(parsed?.hours) && parsed.hours.length ? parsed.hours : FALLBACK_RESTAURANT.hours,
            });
          } else {
            // Use fallback with restaurant ID
            setRestaurant({
              ...FALLBACK_RESTAURANT,
              id: restaurantId || 1,
            });
          }
        } catch (localError) {
          console.warn("Failed to parse restaurant info from localStorage", localError);
          // Use fallback with restaurant ID
          setRestaurant({
            ...FALLBACK_RESTAURANT,
            id: restaurantId || 1,
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantInfo();
  }, [params?.restaurantId]);

  return restaurant;
}
