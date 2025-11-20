const API_BASE_URL = "http://localhost:5000/api";

/**
 * Makes an API request with proper error handling
 */
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions = {
    credentials: "include", // Include cookies for authentication
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  };

  const config = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    
    // Handle non-JSON responses
    const contentType = response.headers.get("content-type");
    const isJson = contentType && contentType.includes("application/json");
    
    let data;
    if (isJson) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      const error = new Error(data.message || `HTTP error! status: ${response.status}`);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (error) {
    if (error instanceof TypeError) {
      // Network error
      throw new Error("Network error. Please check your connection.");
    }
    throw error;
  }
}

/**
 * Auth API endpoints
 */
export const authAPI = {
  // Owner registration
  registerOwner: async (data) => {
    return apiRequest("/auth/register-owner", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // Customer registration
  registerCustomer: async (data) => {
    return apiRequest("/auth/register-customer", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // Login
  login: async (email, password) => {
    return apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  // Logout
  logout: async () => {
    return apiRequest("/auth/logout", {
      method: "POST",
    });
  },

  // Get current user
  getCurrentUser: async () => {
    return apiRequest("/auth/me", {
      method: "GET",
    });
  },

  // Get pending registrations (admin only)
  getPendingRegistrations: async () => {
    return apiRequest("/auth/pending-registrations", {
      method: "GET",
    });
  },

  // Get single pending registration (admin only)
  getPendingRegistration: async (id) => {
    return apiRequest(`/auth/pending-registrations/${id}`, {
      method: "GET",
    });
  },

  // Approve owner (admin only)
  approveOwner: async (id) => {
    return apiRequest(`/auth/approve-owner/${id}`, {
      method: "POST",
      body: JSON.stringify({}),
    });
  },

  // Reject owner (admin only)
  rejectOwner: async (id, rejectionReason = "") => {
    return apiRequest(`/auth/reject-owner/${id}`, {
      method: "POST",
      body: JSON.stringify({ rejectionReason }),
    });
  },

  // Get all owners (admin only)
  getOwners: async () => {
    return apiRequest("/auth/owners", {
      method: "GET",
    });
  },

  // Update user profile (owner only)
  updateUserProfile: async (data) => {
    return apiRequest("/auth/user/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  // Upload profile picture (owner only)
  uploadProfilePicture: async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const url = `${API_BASE_URL}/auth/upload-profile-picture`;
    const response = await fetch(url, {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "Upload failed" }));
      throw new Error(error.message || "Upload failed");
    }

    return response.json();
  },
};

/**
 * Restaurant API endpoints
 */
export const restaurantAPI = {
  // Get restaurant info with settings
  getRestaurant: async () => {
    return apiRequest("/restaurant", {
      method: "GET",
    });
  },

  // Update restaurant information
  updateRestaurant: async (data) => {
    return apiRequest("/restaurant", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  // Upload restaurant logo
  uploadLogo: async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const url = `${API_BASE_URL}/restaurant/upload-logo`;
    const response = await fetch(url, {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "Upload failed" }));
      throw new Error(error.message || "Upload failed");
    }

    return response.json();
  },

  // Upload cover/hero image
  uploadCoverImage: async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const url = `${API_BASE_URL}/restaurant/upload-cover`;
    const response = await fetch(url, {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "Upload failed" }));
      throw new Error(error.message || "Upload failed");
    }

    return response.json();
  },

  // Get restaurant settings
  getRestaurantSettings: async () => {
    return apiRequest("/restaurant/settings", {
      method: "GET",
    });
  },

  // Update restaurant settings
  updateRestaurantSettings: async (data) => {
    return apiRequest("/restaurant/settings", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  // Upload About image
  uploadAboutImage: async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const url = `${API_BASE_URL}/restaurant/upload-about-image`;
    const response = await fetch(url, {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "Upload failed" }));
      throw new Error(error.message || "Upload failed");
    }

    return response.json();
  },

  // Upload WhyChooseUs image
  uploadWhyChooseUsImage: async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const url = `${API_BASE_URL}/restaurant/upload-why-choose-us-image`;
    const response = await fetch(url, {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "Upload failed" }));
      throw new Error(error.message || "Upload failed");
    }

    return response.json();
  },

  // Get operating hours
  getOperatingHours: async () => {
    return apiRequest("/restaurant/operating-hours", {
      method: "GET",
    });
  },

  // Update operating hours
  updateOperatingHours: async (hours) => {
    return apiRequest("/restaurant/operating-hours", {
      method: "PUT",
      body: JSON.stringify(hours),
    });
  },

  // Get public restaurant info (no auth required)
  getPublicRestaurantInfo: async (restaurantId) => {
    const url = `${API_BASE_URL}/restaurant/public/${restaurantId}`;
    const response = await fetch(url, {
      method: "GET",
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "Failed to fetch restaurant info" }));
      throw new Error(error.message || "Failed to fetch restaurant info");
    }

    return response.json();
  },
};

/**
 * Menu API endpoints
 */
export const menuAPI = {
  // Get all menus for owner's restaurant
  getMenus: async () => {
    return apiRequest("/menu", {
      method: "GET",
    });
  },

  // Get single menu with categories and items
  getMenu: async (menuId) => {
    return apiRequest(`/menu/${menuId}`, {
      method: "GET",
    });
  },

  // Create new menu
  createMenu: async (data) => {
    return apiRequest("/menu", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // Update menu
  updateMenu: async (menuId, data) => {
    return apiRequest(`/menu/${menuId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  // Delete menu
  deleteMenu: async (menuId) => {
    return apiRequest(`/menu/${menuId}`, {
      method: "DELETE",
    });
  },

  // Get categories for menu
  getCategories: async (menuId) => {
    return apiRequest(`/menu/${menuId}/categories`, {
      method: "GET",
    });
  },

  // Create category
  createCategory: async (menuId, data) => {
    return apiRequest(`/menu/${menuId}/categories`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // Update category
  updateCategory: async (menuId, categoryId, data) => {
    return apiRequest(`/menu/${menuId}/categories/${categoryId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  // Delete category
  deleteCategory: async (menuId, categoryId) => {
    return apiRequest(`/menu/${menuId}/categories/${categoryId}`, {
      method: "DELETE",
    });
  },

  // Get items for category
  getItems: async (menuId, categoryId) => {
    return apiRequest(`/menu/${menuId}/categories/${categoryId}/items`, {
      method: "GET",
    });
  },

  // Create item
  createItem: async (menuId, categoryId, data) => {
    return apiRequest(`/menu/${menuId}/categories/${categoryId}/items`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // Update item
  updateItem: async (menuId, categoryId, itemId, data) => {
    return apiRequest(`/menu/${menuId}/categories/${categoryId}/items/${itemId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  // Delete item
  deleteItem: async (menuId, categoryId, itemId) => {
    return apiRequest(`/menu/${menuId}/categories/${categoryId}/items/${itemId}`, {
      method: "DELETE",
    });
  },

  // Upload menu item image
  uploadItemImage: async (menuId, categoryId, itemId, file) => {
    const formData = new FormData();
    formData.append("file", file);

    const url = `${API_BASE_URL}/menu/${menuId}/categories/${categoryId}/items/${itemId}/upload-image`;
    const response = await fetch(url, {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "Upload failed" }));
      throw new Error(error.message || "Upload failed");
    }

    return response.json();
  },

  // Get public menu (no auth required)
  getPublicMenu: async (restaurantId) => {
    const url = `${API_BASE_URL}/menu/public/${restaurantId}`;
    const response = await fetch(url, {
      method: "GET",
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "Failed to fetch menu" }));
      throw new Error(error.message || "Failed to fetch menu");
    }

    return response.json();
  },
};

/**
 * Notification API endpoints
 */
export const notificationAPI = {
  // Get user notifications
  getNotifications: async () => {
    return apiRequest("/notifications", {
      method: "GET",
    });
  },

  // Get unread count
  getUnreadCount: async () => {
    return apiRequest("/notifications/unread-count", {
      method: "GET",
    });
  },

  // Mark notification as read
  markAsRead: async (notificationId) => {
    return apiRequest(`/notifications/${notificationId}/read`, {
      method: "PUT",
    });
  },

  // Mark all notifications as read
  markAllAsRead: async () => {
    return apiRequest("/notifications/read-all", {
      method: "PUT",
    });
  },
};

/**
 * Order API endpoints
 */
export const orderAPI = {
  // Create order (can be guest or authenticated)
  createOrder: async (orderData) => {
    return apiRequest("/orders", {
      method: "POST",
      body: JSON.stringify(orderData),
    });
  },

  // Get user orders (authenticated only)
  getUserOrders: async () => {
    return apiRequest("/orders", {
      method: "GET",
    });
  },

  // Get single order (authenticated only)
  getOrder: async (orderId) => {
    return apiRequest(`/orders/${orderId}`, {
      method: "GET",
    });
  },

  // Get restaurant orders (owner only)
  getRestaurantOrders: async (restaurantId) => {
    return apiRequest(`/orders/restaurant/${restaurantId}`, {
      method: "GET",
    });
  },

  // Update order status (owner only)
  updateOrderStatus: async (orderId, status) => {
    return apiRequest(`/orders/${orderId}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    });
  },
};

export default apiRequest;

