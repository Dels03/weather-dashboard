import {
  Search,
  Settings,
  Moon,
  Sun,
  MapPin,
  Bell,
  Grid,
  Menu,
  X,
} from "lucide-react";
import SearchBar from "../SearchBar";
import WeatherIcon from "../WeatherIcon"; // Import for dynamic weather avatar
import { useWeather } from "../../context/WeatherContext";
import { useTheme } from "../../context/ThemeContext";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

/**
 * Header Component
 *
 * Responsive header with:
 * - Mobile hamburger menu
 * - Weather-based notifications
 * - Dynamic location display
 * - Theme toggle
 * - Weather icon avatar
 *
 * @component
 */
const Header = () => {
  const { currentWeather } = useWeather();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  // UI State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Check if current route is dashboard (shows search bar)
  const isDashboard =
    location.pathname === "/" || location.pathname === "/dashboard";

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  /**
   * Generate weather-based notifications when currentWeather changes
   * Creates contextual alerts based on conditions:
   * - Rain alert
   * - Heat wave alert (>30°C)
   * - Cold alert (<10°C)
   */
  useEffect(() => {
    if (currentWeather) {
      const newNotifications = [];

      // Rain notification
      if (currentWeather.weather?.main?.toLowerCase().includes("rain")) {
        newNotifications.push({
          id: "rain",
          title: "Rain Expected",
          message: `Don't forget your umbrella in ${currentWeather.city}!`,
          time: "Just now",
          icon: "☔",
        });
      }

      // High temperature notification
      if (currentWeather.temperature > 30) {
        newNotifications.push({
          id: "heat",
          title: "High Temperature",
          message: `It's ${Math.round(currentWeather.temperature)}°C. Stay hydrated!`,
          time: "Just now",
          icon: "🥵",
        });
      }

      // Low temperature notification
      if (currentWeather.temperature < 10) {
        newNotifications.push({
          id: "cold",
          title: "Cold Weather",
          message: `Bundle up! It's ${Math.round(currentWeather.temperature)}°C.`,
          time: "Just now",
          icon: "🥶",
        });
      }

      setNotifications(newNotifications);
      setUnreadCount(newNotifications.length);
    }
  }, [currentWeather]);

  /**
   * Mark all notifications as read
   */
  const markAllAsRead = () => {
    setUnreadCount(0);
  };

  return (
    <header className="border-b border-white/20 dark:border-white/20 light:border-black/20 sticky top-0 bg-[#0a0a0a]/95 dark:bg-[#0a0a0a]/95 light:bg-white/95 backdrop-blur-xl z-50 transition-colors duration-300">
      {/* Main Header Row */}
      <div className="px-4 lg:px-6 py-3">
        <div className="flex items-center justify-between gap-3">
          {/* ============================================
              LEFT SECTION - Icons & Location
              ============================================ */}
          <div className="flex items-center gap-2">
            {/* Mobile Menu Button - Only visible on mobile (< 1024px) */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden w-10 h-10 bg-white/10 dark:bg-white/10 light:bg-black/10 hover:bg-white/20 dark:hover:bg-white/20 light:hover:bg-black/20 rounded-full flex items-center justify-center transition-all"
              aria-label="Toggle menu"
              title="Menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-white/80 dark:text-white/80 light:text-black/80" />
              ) : (
                <Menu className="w-5 h-5 text-white/80 dark:text-white/80 light:text-black/80" />
              )}
            </button>

            {/* Dashboard Icon - Hidden on mobile, visible on desktop */}
            <button
              onClick={() => navigate("/dashboard")}
              className="hidden lg:flex w-10 h-10 bg-white/10 dark:bg-white/10 light:bg-black/10 hover:bg-white/20 dark:hover:bg-white/20 light:hover:bg-black/20 rounded-full items-center justify-center transition-all"
              aria-label="Go to dashboard"
              title="Dashboard"
            >
              <Grid className="w-5 h-5 text-white/80 dark:text-white/80 light:text-black/80" />
            </button>

            {/* ============================================
                NOTIFICATIONS SYSTEM
                ============================================ */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="w-10 h-10 bg-white/10 dark:bg-white/10 light:bg-black/10 hover:bg-white/20 dark:hover:bg-white/20 light:hover:bg-black/20 rounded-full flex items-center justify-center transition-all relative"
                aria-label="Toggle notifications"
                title="Notifications"
              >
                <Bell className="w-4 h-4 text-white/80 dark:text-white/80 light:text-black/80" />
                {/* Unread count badge */}
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] bg-red-500 rounded-full text-[9px] flex items-center justify-center text-white font-medium px-1">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown - Responsive positioning */}
              {showNotifications && (
                <div className="absolute top-12 left-0 sm:left-auto sm:right-0 w-80 max-w-[calc(100vw-2rem)] bg-[#1a1a1a] dark:bg-[#1a1a1a] light:bg-white border border-white/20 dark:border-white/20 light:border-black/20 rounded-xl p-4 shadow-xl z-50">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-white dark:text-white light:text-gray-900 text-sm">
                      Notifications
                    </h3>
                    {notifications.length > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-xs text-white/60 dark:text-white/60 light:text-gray-600 hover:text-white dark:hover:text-white light:hover:text-gray-900 transition-colors"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  {/* Notification list or empty state */}
                  {notifications.length === 0 ? (
                    <p className="text-sm text-white/60 dark:text-white/60 light:text-gray-600 text-center py-6">
                      No new notifications
                    </p>
                  ) : (
                    <div className="space-y-2 max-h-96 overflow-y-auto custom-scrollbar">
                      {notifications.map((notif) => (
                        <div
                          key={notif.id}
                          className="flex gap-3 p-3 bg-white/10 dark:bg-white/10 light:bg-black/10 hover:bg-white/20 dark:hover:bg-white/20 light:hover:bg-black/20 rounded-xl transition-colors"
                        >
                          <div className="text-xl">{notif.icon}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <h4 className="font-medium text-sm text-white dark:text-white light:text-gray-900 truncate">
                                {notif.title}
                              </h4>
                              <span className="text-[10px] text-white/40 dark:text-white/40 light:text-gray-500 whitespace-nowrap">
                                {notif.time}
                              </span>
                            </div>
                            <p className="text-xs text-white/70 dark:text-white/70 light:text-gray-700 line-clamp-2">
                              {notif.message}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Location Display - Hidden on mobile, visible on tablet/desktop */}
            {currentWeather && (
              <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-white/10 dark:bg-white/10 light:bg-black/10 rounded-full border border-white/20 dark:border-white/20 light:border-black/20">
                <MapPin className="w-4 h-4 text-blue-400 dark:text-blue-400 light:text-blue-600 flex-shrink-0" />
                <span className="text-sm text-white/90 dark:text-white/90 light:text-gray-800 truncate max-w-[150px]">
                  {currentWeather.city}, {currentWeather.country}
                </span>
              </div>
            )}
          </div>

          {/* ============================================
              CENTER SECTION - Search Bar (Dashboard only)
              ============================================ */}
          {isDashboard && (
            <div className="flex-1 max-w-xl mx-4 hidden md:block">
              <SearchBar />
            </div>
          )}

          {/* ============================================
              RIGHT SECTION - Settings, Theme, Avatar
              ============================================ */}
          <div className="flex items-center gap-2">
            {/* Settings Button */}
            <button
              onClick={() => navigate("/settings")}
              className="w-10 h-10 bg-white/10 dark:bg-white/10 light:bg-black/10 hover:bg-white/20 dark:hover:bg-white/20 light:hover:bg-black/20 rounded-full flex items-center justify-center transition-all"
              aria-label="Go to settings"
              title="Settings"
            >
              <Settings className="w-4 h-4 text-white/80 dark:text-white/80 light:text-black/80" />
            </button>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="w-10 h-10 bg-white/10 dark:bg-white/10 light:bg-black/10 hover:bg-white/20 dark:hover:bg-white/20 light:hover:bg-black/20 rounded-full flex items-center justify-center transition-all"
              aria-label={
                isDark ? "Switch to light mode" : "Switch to dark mode"
              }
              title={isDark ? "Light Mode" : "Dark Mode"}
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-white/80 dark:text-white/80 light:text-black/80" />
              ) : (
                <Moon className="w-4 h-4 text-white/80 dark:text-white/80 light:text-black/80" />
              )}
            </button>

            {/* ============================================
                WEATHER ICON AVATAR
                - Dynamic - changes with current weather
                - Uses same WeatherIcon component as forecast cards
                - Gradient background for visual pop
                ============================================ */}
            <div
              onClick={() => navigate("/dashboard")}
              className="w-10 h-10 bg-gradient-to-br from-[#4A90E2] to-[#5BA3F5] rounded-full flex items-center justify-center cursor-pointer hover:scale-105 transition-transform shadow-lg"
              aria-label="Go to dashboard"
              title="Dashboard"
            >
              <WeatherIcon
                condition={currentWeather?.weather?.main || "Clear"}
                icon={currentWeather?.weather?.icon || "01d"}
                size={20}
                className="text-white"
              />
            </div>
          </div>
        </div>

        {/* ============================================
            MOBILE MENU - Slides down when hamburger clicked
            ============================================ */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-3 pt-3 border-t border-white/20 dark:border-white/20 light:border-black/20 animate-slide-down">
            <div className="flex flex-col space-y-2">
              <button
                onClick={() => navigate("/dashboard")}
                className="flex items-center gap-3 p-3 bg-white/10 dark:bg-white/10 light:bg-black/10 hover:bg-white/20 dark:hover:bg-white/20 light:hover:bg-black/20 rounded-xl transition-all w-full text-left"
              >
                <Grid className="w-5 h-5 text-white/80 dark:text-white/80 light:text-black/80" />
                <span className="text-sm font-medium text-white/90 dark:text-white/90 light:text-gray-800">
                  Dashboard
                </span>
              </button>
            </div>
          </div>
        )}

        {/* ============================================
            MOBILE SEARCH BAR - Only on dashboard, below header
            ============================================ */}
        {isDashboard && (
          <div className="md:hidden mt-3">
            <SearchBar />
          </div>
        )}

        {/* ============================================
            MOBILE LOCATION - Shows below header on mobile/tablet
            ============================================ */}
        {currentWeather && (
          <div className="md:hidden mt-3 flex items-center gap-2 px-3 py-2 bg-white/10 dark:bg-white/10 light:bg-black/10 rounded-xl border border-white/20 dark:border-white/20 light:border-black/20">
            <MapPin className="w-4 h-4 text-blue-400 dark:text-blue-400 light:text-blue-600 flex-shrink-0" />
            <span className="text-sm text-white/90 dark:text-white/90 light:text-gray-800 truncate">
              {currentWeather.city}, {currentWeather.country}
            </span>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
