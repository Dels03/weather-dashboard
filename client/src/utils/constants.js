export const ROUTES = {
  HOME: "/",
  DASHBOARD: "/dashboard",
  CITY: "/city/:name",
  FAVORITES: "/favorites",
  SETTINGS: "/settings",
};

export const STORAGE_KEYS = {
  THEME: "theme",
  UNIT: "unit",
  FAVORITES: "favorites",
  RECENT_SEARCHES: "recentSearches",
};

export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || "http://localhost:5001/api",
  TIMEOUT: 10000,
  UNSPLASH_ACCESS_KEY: import.meta.env.VITE_UNSPLASH_ACCESS_KEY,
};
