import React from "react";
import { Wind } from "lucide-react";

/**
 * WindStatus Component
 *
 * Displays current wind conditions and hourly wind forecast.
 * Shows:
 * - Current wind speed and direction
 * - Next 18 hours of wind speeds in bar chart format
 * - Color-coded bars (strong vs moderate)
 *
 * @param {Object} props
 * @param {Object} props.windData - Current wind data (speed, direction)
 * @param {Array} props.hourlyForecast - Hourly forecast data with wind speeds
 */
const WindStatus = ({ windData, hourlyForecast }) => {
  // Use real current wind speed or fallback
  const currentWind = windData?.speed || 25;

  /**
   * Get next 6 hours of wind data (18 hours in 3-hour intervals)
   * Falls back to mock data if no forecast available
   */
  const getHourlyWindData = () => {
    if (!hourlyForecast || hourlyForecast.length === 0) {
      // Fallback to mock data if no hourly forecast
      return {
        hours: ["7AM", "9AM", "11AM", "1PM", "3PM", "5PM"],
        speeds: [12, 18, 25, 30, 28, 22],
      };
    }

    // Take first 6 items from hourly forecast (next 18 hours in 3-hour intervals)
    const next6Hours = hourlyForecast.slice(0, 6);

    const hours = next6Hours.map((item) => {
      const date = new Date(item.dt * 1000);
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    });

    const speeds = next6Hours.map((item) => Math.round(item.wind?.speed || 0));

    return { hours, speeds };
  };

  const { hours, speeds } = getHourlyWindData();
  const maxWind = Math.max(...speeds, 1); // Avoid division by zero

  // Determine wind description based on speed
  const getWindDescription = (speed) => {
    if (speed > 25) return "Strong breeze";
    if (speed > 15) return "Moderate breeze";
    return "Light breeze";
  };

  return (
    <div className="bg-white/5 dark:bg-white/5 light:bg-black/5 backdrop-blur-sm border border-white/10 dark:border-white/10 light:border-black/10 rounded-2xl p-5 hover:bg-white/10 dark:hover:bg-white/10 light:hover:bg-black/10 transition-all duration-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="absolute inset-0 bg-[#4A90E2]/20 rounded-full blur-md" />
            <Wind className="relative z-10 w-5 h-5 text-[#4A90E2]" />
          </div>
          <h4 className="text-sm font-medium text-gray-900 dark:text-white light:text-gray-900">
            Wind Status
          </h4>
        </div>
        <span className="text-xs text-gray-500 dark:text-white/60 light:text-gray-500 bg-white/10 dark:bg-white/10 light:bg-black/10 px-2 py-1 rounded-full">
          Next 18 Hours
        </span>
      </div>

      {/* Current Wind Speed - Large Display */}
      <div className="mb-4">
        <div className="text-3xl sm:text-4xl font-light text-gray-900 dark:text-white light:text-gray-900">
          {currentWind}
          <span className="text-lg text-gray-500 dark:text-white/60 light:text-gray-500 ml-2">
            km/h
          </span>
        </div>
        <div className="text-xs text-gray-500 dark:text-white/60 light:text-gray-500 mt-1">
          {getWindDescription(currentWind)}
        </div>
        {windData?.direction && (
          <div className="text-xs text-gray-400 dark:text-white/40 light:text-gray-500 mt-1">
            Direction: {windData.direction}°
          </div>
        )}
      </div>

      {/* Wind Speed Bars - Hourly */}
      <div className="space-y-2 mb-3">
        {speeds.map((speed, index) => {
          const width = (speed / maxWind) * 100;
          const isHigh = speed > 20;

          return (
            <div key={`${hours[index]}-${index}`} className="group relative">
              <div className="flex items-center gap-3">
                {/* Time Label */}
                <span className="text-xs text-gray-500 dark:text-white/60 light:text-gray-500 w-12 sm:w-14 flex-shrink-0">
                  {hours[index]}
                </span>

                {/* Bar Container */}
                <div className="flex-1 relative">
                  <div className="h-6 bg-white/10 dark:bg-white/10 light:bg-black/10 rounded-md overflow-hidden">
                    {/* Colored Bar */}
                    <div
                      className={`h-full rounded-md ${
                        isHigh
                          ? "bg-gradient-to-r from-[#4A90E2] to-[#5BA3F5]"
                          : "bg-gradient-to-r from-[#4A90E2]/50 to-[#5BA3F5]/50"
                      }`}
                      style={{ width: `${width}%` }}
                    >
                      {/* Speed value inside bar */}
                      <span className="text-[10px] text-white/90 font-medium px-2 leading-6">
                        {speed}
                      </span>
                    </div>
                  </div>

                  {/* Tooltip on hover */}
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 dark:bg-black light:bg-gray-800 text-white text-xs px-2 py-1 rounded border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                    {hours[index]}: {speed} km/h
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between text-xs pt-3 border-t border-white/10 dark:border-white/10 light:border-black/10">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-gradient-to-r from-[#4A90E2] to-[#5BA3F5]" />
            <span className="text-gray-500 dark:text-white/60 light:text-gray-500">
              Strong (&gt;20 km/h)
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-gradient-to-r from-[#4A90E2]/50 to-[#5BA3F5]/50" />
            <span className="text-gray-500 dark:text-white/60 light:text-gray-500">
              Moderate
            </span>
          </div>
        </div>
        <span className="text-gray-400 dark:text-white/40 light:text-gray-500">
          km/h
        </span>
      </div>
    </div>
  );
};

export default WindStatus;
