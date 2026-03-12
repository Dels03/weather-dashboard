import React from "react";
import WeatherIcon from "./WeatherIcon";
import { formatCityTimeOnly } from "../utils/dateFormatter";

/**
 * ForecastCard Component
 *
 * Displays a single day's weather forecast.
 * Supports two display modes:
 * - Today's card: Larger with gradient background, shows current time
 * - Other days: Compact dark card with day name and temps
 *
 * @param {Object} props
 * @param {Object} props.forecast - Forecast data for a single day
 * @param {boolean} props.isToday - Whether this is today's forecast
 * @param {number} props.timezone - Timezone offset for accurate local time
 */
const ForecastCard = ({ forecast, isToday = false, timezone }) => {
  // Early return if no forecast data
  if (!forecast) {
    return null;
  }

  // Destructure forecast data with fallbacks
  const {
    date,
    tempHigh,
    tempLow,
    weather,
    pop = 0, // Probability of precipitation
  } = forecast;

  // Validate required data
  if (!date || !tempHigh || !weather) {
    console.warn("⚠️ ForecastCard: Missing required data", {
      date,
      tempHigh,
      weather,
    });
    return null;
  }

  // Extract weather details with fallbacks
  const condition = weather?.main || "Clear";
  const description = weather?.description || "";
  const icon = weather?.icon || "01d";

  /**
   * Format date for display
   * @param {string|Date} dateString - Date to format
   * @returns {string} Formatted date (Today, Tomorrow, or weekday)
   */
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    }
    if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    }
    return date.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase();
  };

  /**
   * Get current time in city's timezone
   * @returns {string} Formatted time (e.g., "3:45 PM")
   */
  const getCurrentTime = () => {
    if (!timezone) {
      return new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    }
    return formatCityTimeOnly(Date.now(), timezone);
  };

  // ============================================
  // TODAY'S CARD - Blue to Orange Gradient
  // ============================================
  if (isToday) {
    return (
      <div className="flex-shrink-0 w-full sm:w-[220px] md:w-[240px]">
        <div className="bg-gradient-to-br from-[#4A90E2] via-[#5BA3F5] to-[#F5A623] rounded-2xl p-5 h-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
          {/* Header with date and current time */}
          <div className="mb-4">
            <div className="text-white font-semibold text-base mb-1">
              {formatDate(date)}
            </div>
            <div className="text-white/80 text-xs">{getCurrentTime()}</div>
          </div>

          {/* Weather Icon with glow effect */}
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-white/20 rounded-full blur-xl" />
              <WeatherIcon
                condition={condition}
                icon={icon}
                size={80}
                className="relative z-10"
              />
            </div>
          </div>

          {/* Temperature and condition */}
          <div className="text-center mb-4">
            <div className="text-5xl sm:text-6xl font-light text-white leading-none">
              {Math.round(tempHigh)}°
            </div>
            <div className="text-white/70 text-sm mt-2 capitalize">
              {description || condition}
            </div>
          </div>

          {/* Mini stats grid */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-black/10 backdrop-blur-sm rounded-lg p-2 text-center">
              <div className="text-white/60">Real Feel</div>
              <div className="text-white font-semibold">
                {Math.round(tempHigh + 2)}°
              </div>
            </div>
            <div className="bg-black/10 backdrop-blur-sm rounded-lg p-2 text-center">
              <div className="text-white/60">Low</div>
              <div className="text-white font-semibold">
                {Math.round(tempLow)}°
              </div>
            </div>
          </div>

          {/* Precipitation chance (if > 0%) */}
          {pop > 0 && (
            <div className="mt-3 text-xs text-white/70 bg-black/10 backdrop-blur-sm rounded-lg p-2 text-center">
              🌧️ {Math.round(pop * 100)}% chance of rain
            </div>
          )}
        </div>
      </div>
    );
  }

  // ============================================
  // OTHER DAYS - Dark Compact Cards
  // ============================================
  return (
    <div className="flex-shrink-0 w-[90px] sm:w-[100px] md:w-[110px]">
      <div className="bg-white/5 dark:bg-white/5 light:bg-black/5 backdrop-blur-sm border border-white/10 dark:border-white/10 light:border-black/10 rounded-2xl p-3 sm:p-4 text-center hover:bg-white/10 dark:hover:bg-white/10 light:hover:bg-black/10 hover:border-[#4A90E2]/30 transition-all duration-200 cursor-pointer group">
        {/* Day name */}
        <div className="text-xs sm:text-sm font-medium mb-2 sm:mb-3 text-gray-500 dark:text-white/60 light:text-gray-500 group-hover:text-[#4A90E2] transition-colors">
          {formatDate(date)}
        </div>

        {/* Weather icon */}
        <div className="flex justify-center mb-2 sm:mb-3">
          <div className="transform transition-transform duration-300 group-hover:scale-110">
            <WeatherIcon
              condition={condition}
              icon={icon}
              size={48}
              className="opacity-80 group-hover:opacity-100 transition-opacity"
            />
          </div>
        </div>

        {/* High temperature */}
        <div className="text-xl sm:text-2xl font-light text-gray-900 dark:text-white light:text-gray-900 mb-1">
          {Math.round(tempHigh)}°
        </div>

        {/* Low temperature */}
        {tempLow && (
          <div className="text-xs sm:text-sm text-gray-400 dark:text-white/40 light:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-white/60 light:group-hover:text-gray-600 transition-colors">
            {Math.round(tempLow)}°
          </div>
        )}

        {/* Precipitation chance indicator (if > 10%) */}
        {pop > 0.1 && (
          <div className="mt-1 text-[10px] text-blue-400">
            {Math.round(pop * 100)}%
          </div>
        )}
      </div>
    </div>
  );
};

export default ForecastCard;
