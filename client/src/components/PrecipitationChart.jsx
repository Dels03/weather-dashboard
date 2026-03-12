import React, { useState, useMemo } from "react";
import { Droplets, CloudRain, Info } from "lucide-react";

/**
 * PrecipitationChart Component
 *
 * Displays a 24-hour precipitation forecast with 3-hour intervals.
 * Uses real data from the API (hourly pop values).
 *
 * @param {Object} props
 * @param {Array} props.forecast - Hourly forecast data array with pop values (40 items, 3-hour intervals)
 */
const PrecipitationChart = ({ forecast }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Get next 24 hours of precipitation data (8 items, 3-hour intervals)
  const hourlyData = useMemo(() => {
    if (!forecast || forecast.length === 0) {
      return { times: [], values: [] };
    }

    // Take first 8 items for 24-hour forecast (3-hour intervals)
    const next24Hours = forecast.slice(0, 8);

    const times = next24Hours.map((item) => {
      const date = new Date(item.date || item.dt * 1000);
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        hour12: true,
      });
    });

    const values = next24Hours.map((item) => {
      // Probability of precipitation (pop) - convert to percentage
      return item.pop ? Math.round(item.pop * 100) : 0;
    });

    return { times, values };
  }, [forecast]);

  const { times, values } = hourlyData;
  const maxValue = values.length > 0 ? Math.max(...values) : 0;

  // Get color based on value
  const getBarColor = (value) => {
    if (value < 30) return "bg-emerald-500";
    if (value < 60) return "bg-yellow-500";
    if (value < 80) return "bg-orange-500";
    return "bg-red-500";
  };

  if (values.length === 0) {
    return (
      <div className="bg-white/5 dark:bg-white/5 light:bg-black/5 border border-white/10 dark:border-white/10 light:border-black/10 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Droplets className="w-5 h-5 text-blue-400" />
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white light:text-gray-900">
            Precipitation Forecast
          </h4>
        </div>
        <p className="text-sm text-gray-500 dark:text-white/40 light:text-gray-500 text-center py-8">
          No precipitation data available
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white/5 dark:bg-white/5 light:bg-black/5 border border-white/10 dark:border-white/10 light:border-black/10 rounded-2xl p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Droplets className="w-5 h-5 text-blue-400 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white light:text-gray-900">
              Precipitation Forecast
            </h4>
            <p className="text-xs text-gray-500 dark:text-white/40 light:text-gray-500">
              Next 24 Hours • 3-Hour Intervals
            </p>
          </div>
        </div>

        {/* Peak badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 dark:bg-white/10 light:bg-black/10 border border-white/20 dark:border-white/20 light:border-black/20 rounded-lg">
          <CloudRain className="w-4 h-4 text-blue-400/60" />
          <span className="text-xs text-gray-600 dark:text-white/60 light:text-gray-600">
            Peak:{" "}
            <span className="text-gray-900 dark:text-white light:text-gray-900 font-semibold">
              {maxValue}%
            </span>
          </span>
        </div>
      </div>

      {/* Chart */}
      <div className="pt-4">
        {/* Bars */}
        <div className="flex items-end justify-between h-32 gap-1 sm:gap-2 mb-2">
          {values.map((value, index) => {
            const isHovered = hoveredIndex === index;
            const barColor = getBarColor(value);

            return (
              <div
                key={`${times[index]}-${index}`}
                className="flex-1 flex flex-col items-center relative"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Tooltip - fixed position, no animation */}
                {isHovered && (
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 dark:bg-black light:bg-gray-800 text-white text-xs px-2 py-1 rounded border border-white/10 whitespace-nowrap z-10">
                    {times[index]}: {value}% chance
                  </div>
                )}

                {/* Bar - no hover effects */}
                <div
                  className={`w-full max-w-[32px] rounded-t-lg ${barColor}`}
                  style={{
                    height: `${Math.max(value, 4)}px`,
                    minHeight: "4px",
                  }}
                />

                {/* Time label */}
                <span className="mt-2 text-[10px] text-gray-500 dark:text-white/40 light:text-gray-500 text-center">
                  {times[index]}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-white/10 dark:border-white/10 light:border-black/10">
        <div className="flex items-center justify-between flex-wrap gap-4">
          {/* Color legend */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-xs text-gray-500 dark:text-white/40 light:text-gray-500">
                Low (&lt;30%)
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <span className="text-xs text-gray-500 dark:text-white/40 light:text-gray-500">
                Moderate (30-60%)
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-orange-500" />
              <span className="text-xs text-gray-500 dark:text-white/40 light:text-gray-500">
                High (60-80%)
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-xs text-gray-500 dark:text-white/40 light:text-gray-500">
                Very High (&gt;80%)
              </span>
            </div>
          </div>

          {/* Info icon with tooltip */}
          <div className="relative group">
            <Info className="w-4 h-4 text-gray-400 dark:text-white/30 light:text-gray-400 cursor-help" />
            <div className="absolute bottom-full right-0 mb-2 w-48 bg-gray-900 dark:bg-black light:bg-gray-800 border border-white/10 rounded-lg p-2 text-xs text-white/80 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              Hourly precipitation probability for the next 24 hours
            </div>
          </div>
        </div>

        {/* Summary text */}
        <div className="mt-3 text-xs">
          {maxValue > 80 ? (
            <span className="text-red-500 dark:text-red-400 light:text-red-600">
              ⚠️ Very high chance of precipitation
            </span>
          ) : maxValue > 60 ? (
            <span className="text-orange-500 dark:text-orange-400 light:text-orange-600">
              🌧️ High chance of precipitation
            </span>
          ) : maxValue > 30 ? (
            <span className="text-yellow-500 dark:text-yellow-400 light:text-yellow-600">
              ⛅ Moderate chance of precipitation
            </span>
          ) : (
            <span className="text-emerald-500 dark:text-emerald-400 light:text-emerald-600">
              ☀️ Low precipitation chance
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrecipitationChart;
