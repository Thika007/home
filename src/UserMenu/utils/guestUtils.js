/**
 * Get or create a guest identifier and store it in cookies
 * @returns {string} Guest identifier
 */
export function getOrCreateGuestId() {
  // Check if guest ID already exists in cookies
  const existingId = getCookie("guestId");
  if (existingId) {
    return existingId;
  }

  // Generate a new guest identifier
  const guestId = `guest_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  
  // Store in cookie (expires in 30 days)
  setCookie("guestId", guestId, 30);
  
  return guestId;
}

/**
 * Get a cookie value
 * @param {string} name - Cookie name
 * @returns {string|null} Cookie value or null
 */
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop().split(';').shift();
  }
  return null;
}

/**
 * Set a cookie
 * @param {string} name - Cookie name
 * @param {string} value - Cookie value
 * @param {number} days - Number of days until expiration
 */
function setCookie(name, value, days) {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
}

