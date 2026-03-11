import React from "react";
import WeatherIcon from "./WeatherIcon";
import { formatCityTimeOnly } from "../utils/dateFormatter";

const ForecastCard = ({ forecast, isToday = false }) => {
  const { date, tempHigh, tempLow, weather, timezone } = forecast;

  // Extract weather data
  const condition = weather?.main || "Clear";
  const description = weather?.description || "";
  const icon = weather?.icon || "01d";

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();

    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleDateString("en-US", { weekday: "long" });
    }

    return date.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase();
  };

  const getCurrentTime = () => {
    console.log(
      "⏰ ForecastCard - timezone:",
      timezone,
      "type:",
      typeof timezone,
    );

    if (timezone === undefined || timezone === null) {
      console.log("⚠️ No timezone, using local time");
      return new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    }

    const result = formatCityTimeOnly(Date.now(), timezone);
    console.log("✅ Calculated time:", result, "for timezone:", timezone);
    return result;
  };

  // ============================================
  // TODAY'S CARD - Blue to Orange Gradient
  // ============================================
  if (isToday) {
    return (
      <div className="flex-shrink-0 w-full sm:w-[220px] md:w-[240px]">
        <div className="bg-gradient-to-br from-[#4A90E2] via-[#5BA3F5] to-[#F5A623] rounded-2xl p-5 h-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
          {/* Header */}
          <div className="mb-4">
            <div className="text-white font-semibold text-base mb-1">
              {formatDate(date)}
            </div>
            <div className="text-white/80 text-xs">{getCurrentTime()}</div>
          </div>

          {/* Weather Icon - Centered */}
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-white/20 rounded-full blur-xl"></div>
              <WeatherIcon
                condition={condition}
                icon={icon}
                size={80}
                className="relative z-10"
              />
            </div>
          </div>

          {/* Temperature */}
          <div className="text-center mb-4">
            <div className="text-5xl sm:text-6xl font-light text-white leading-none">
              {Math.round(tempHigh)}°
            </div>
            <div className="text-white/70 text-sm mt-2 capitalize">
              {description}
            </div>
          </div>

          {/* Mini Stats - Only on today card */}
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
        </div>
      </div>
    );
  }

  // ============================================
  // OTHER DAYS - Dark Compact Cards
  // ============================================
  return (
    <div className="flex-shrink-0 w-[90px] sm:w-[100px] md:w-[110px]">
      <div className="bg-white/[0.03] backdrop-blur-sm border border-white/[0.08] rounded-2xl p-3 sm:p-4 text-center hover:bg-white/[0.06] hover:border-[#4A90E2]/30 transition-all duration-200 cursor-pointer group">
        {/* Day Name */}
        <div className="text-xs sm:text-sm font-medium mb-2 sm:mb-3 text-white/60 group-hover:text-[#4A90E2] transition-colors">
          {formatDate(date)}
        </div>

        {/* Weather Icon */}
        <div className="flex justify-center mb-2 sm:mb-3">
          <div className="transform transition-transform duration-300 group-hover:scale-110">
            <WeatherIcon
              condition={condition}
              icon={icon}
              size={48}
              className="opacity-90 group-hover:opacity-100 transition-opacity"
            />
          </div>
        </div>

        {/* Temperature High */}
        <div className="text-xl sm:text-2xl font-light text-white mb-1">
          {Math.round(tempHigh)}°
        </div>

        {/* Temperature Low */}
        {tempLow && (
          <div className="text-xs sm:text-sm text-white/40 group-hover:text-white/60 transition-colors">
            {Math.round(tempLow)}°
          </div>
        )}
      </div>
    </div>
  );
};

export default ForecastCard;
