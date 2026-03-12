import React from "react";
import { Clock } from "lucide-react";
import WeatherIcon from "./WeatherIcon";

/**
 * OtherCities Component
 *
 * Displays a list of major cities with their current weather.
 * Each city shows:
 * - Country code and local time
 * - City name
 * - Weather condition description
 * - Weather icon
 * - Current temperature
 *
 * @param {Object[]} cities - Array of city weather data
 * @param {Function} onCityClick - Callback when a city is clicked
 */
const OtherCities = ({ cities, onCityClick }) => {
  const cityData = cities || [];

  /**
   * Get current time in a specific timezone
   * Uses UTC offset from the weather API
   *
   * @param {number} timezone - Timezone offset in seconds
   * @returns {string} Formatted time (e.g., "3:45 PM")
   */
  const getCityTime = (timezone) => {
    if (!timezone) return "--:--";

    // Calculate city's local time using UTC offset
    const now = new Date();
    const utcTime = now.getTime() + now.getTimezoneOffset() * 60000;
    const cityTimeMs = utcTime + timezone * 1000;
    const cityDate = new Date(cityTimeMs);

    // Format: "3:45 PM"
    const hours = cityDate.getUTCHours();
    const minutes = cityDate.getUTCMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    const displayHours = (hours % 12 || 12).toString().padStart(2, "0");

    return `${displayHours}:${minutes} ${ampm}`;
  };

  const handleCityClick = (city) => {
    if (onCityClick) {
      onCityClick(city);
    }
  };

  // Empty state
  if (!cityData || cityData.length === 0) {
    return (
      <div className="bg-white/5 dark:bg-white/5 light:bg-black/5 backdrop-blur-sm border border-white/10 dark:border-white/10 light:border-black/10 rounded-2xl p-5">
        <h4 className="text-sm font-medium text-gray-900 dark:text-white light:text-gray-900 mb-4">
          Other Cities
        </h4>
        <p className="text-sm text-gray-500 dark:text-white/60 light:text-gray-500 text-center py-4">
          No city data available
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white/5 dark:bg-white/5 light:bg-black/5 backdrop-blur-sm border border-white/10 dark:border-white/10 light:border-black/10 rounded-2xl p-5 hover:bg-white/10 dark:hover:bg-white/10 light:hover:bg-black/10 transition-all duration-200">
      {/* Header with "See All" action */}
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-medium text-gray-900 dark:text-white light:text-gray-900">
          Other Cities
        </h4>
        <button
          className="text-xs text-[#4A90E2] hover:text-[#5BA3F5] transition-colors"
          aria-label="View all cities"
        >
          See All →
        </button>
      </div>

      {/* Cities List */}
      <div className="space-y-3">
        {cityData.map((city, index) => {
          const cityTime = getCityTime(city.timezone);

          return (
            <div
              key={`${city.city}-${index}`}
              onClick={() => handleCityClick(city)}
              className="flex items-center justify-between p-3 bg-white/5 dark:bg-white/5 light:bg-black/5 hover:bg-white/10 dark:hover:bg-white/10 light:hover:bg-black/10 rounded-xl transition-all duration-200 cursor-pointer group border border-transparent hover:border-white/20 dark:hover:border-white/20 light:hover:border-black/20"
              role="button"
              tabIndex={0}
              onKeyPress={(e) => e.key === "Enter" && handleCityClick(city)}
            >
              {/* Left side: City info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {/* Country code */}
                  <span className="text-xs text-gray-500 dark:text-white/60 light:text-gray-500">
                    {city.country}
                  </span>
                  {/* Local time with clock icon */}
                  <span className="text-[10px] text-gray-400 dark:text-white/40 light:text-gray-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {cityTime}
                  </span>
                </div>

                {/* City name - truncates on small screens */}
                <div className="text-sm font-medium text-gray-900 dark:text-white light:text-gray-900 group-hover:text-[#4A90E2] transition-colors truncate pr-2">
                  {city.city}
                </div>

                {/* Weather condition description */}
                <div className="text-xs text-gray-500 dark:text-white/60 light:text-gray-500 mt-0.5 truncate">
                  {city.condition}
                </div>
              </div>

              {/* Right side: Weather icon and temperature */}
              <div className="flex items-center gap-3 flex-shrink-0">
                {/* Weather icon with hover glow effect */}
                <div className="relative">
                  <div className="absolute inset-0 bg-white/20 dark:bg-white/20 light:bg-black/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                  <WeatherIcon
                    condition={city.condition}
                    icon={city.icon}
                    size={32}
                    className="relative z-10 opacity-80 group-hover:opacity-100 transition-opacity"
                  />
                </div>

                {/* Temperature - fixed width for alignment */}
                <div className="text-xl font-light text-gray-900 dark:text-white light:text-gray-900 min-w-[3rem] text-right">
                  {city.temp}°
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* "Add City" action - can be removed if not needed */}
      <button
        className="w-full mt-4 py-2.5 border border-white/20 dark:border-white/20 light:border-black/20 hover:border-[#4A90E2]/30 hover:bg-white/10 dark:hover:bg-white/10 light:hover:bg-black/10 rounded-xl text-xs text-gray-500 dark:text-white/60 light:text-gray-500 hover:text-gray-700 dark:hover:text-white/80 light:hover:text-gray-700 transition-all duration-200"
        aria-label="Add a new city"
      >
        + Add City
      </button>
    </div>
  );
};

export default OtherCities;
