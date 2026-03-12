import React from "react";
import { Sun } from "lucide-react";

/**
 * UVIndex Component
 *
 * Displays UV Index with a circular gauge and color-coded levels.
 * Note: Real-time UV data requires OpenWeather One Call API (paid plan).
 * Currently using realistic mock data based on city location.
 *
 * @param {Object} props
 * @param {number} props.uvIndex - UV Index value (0-11+)
 */
const UVIndex = ({ uvIndex = 5.5 }) => {
  // UV Index levels based on WHO scale
  const getUVLevel = (uv) => {
    if (uv < 3)
      return {
        level: "Low",
        color: "#10b981",
        bgColor: "rgba(16, 185, 129, 0.1)",
        textColor: "text-emerald-500",
        description: "No protection needed",
      };
    if (uv < 6)
      return {
        level: "Moderate",
        color: "#f59e0b",
        bgColor: "rgba(245, 158, 11, 0.1)",
        textColor: "text-yellow-500",
        description: "Wear sunscreen",
      };
    if (uv < 8)
      return {
        level: "High",
        color: "#f97316",
        bgColor: "rgba(249, 115, 22, 0.1)",
        textColor: "text-orange-500",
        description: "Protection needed",
      };
    if (uv < 11)
      return {
        level: "Very High",
        color: "#ef4444",
        bgColor: "rgba(239, 68, 68, 0.1)",
        textColor: "text-red-500",
        description: "Extra protection",
      };
    return {
      level: "Extreme",
      color: "#dc2626",
      bgColor: "rgba(220, 38, 38, 0.1)",
      textColor: "text-red-700",
      description: "Avoid sun exposure",
    };
  };

  const uvData = getUVLevel(uvIndex);
  const percentage = Math.min((uvIndex / 11) * 100, 100);

  // Circle parameters for gauge
  const size = 140;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  // Get recommendation based on UV level
  const getRecommendation = () => {
    if (uvIndex < 3) return "Enjoy outdoor activities safely";
    if (uvIndex < 6) return "Wear sunscreen and sunglasses";
    if (uvIndex < 8) return "Seek shade during midday hours";
    if (uvIndex < 11) return "Avoid being outside during peak hours";
    return "Stay indoors if possible";
  };

  return (
    <div className="bg-white/5 dark:bg-white/5 light:bg-black/5 backdrop-blur-sm border border-white/10 dark:border-white/10 light:border-black/10 rounded-2xl p-5 hover:bg-white/10 dark:hover:bg-white/10 light:hover:bg-black/10 transition-all duration-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="absolute inset-0 bg-[#4A90E2]/20 rounded-full blur-md" />
            <Sun className="relative z-10 w-5 h-5 text-[#4A90E2]" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-900 dark:text-white light:text-gray-900">
              UV Index
            </h4>
            {/* Note about data source */}
            <p className="text-[10px] text-gray-500 dark:text-white/40 light:text-gray-500">
              *Real-time UV requires paid plan
            </p>
          </div>
        </div>
        <span
          className="text-xs px-2 py-1 rounded-full font-medium"
          style={{
            backgroundColor: uvData.bgColor,
            color: uvData.color,
          }}
        >
          {uvData.level}
        </span>
      </div>

      {/* Circular Gauge */}
      <div className="flex flex-col items-center justify-center py-4">
        <div className="relative" style={{ width: size, height: size }}>
          {/* Background Circle */}
          <svg className="transform -rotate-90" width={size} height={size}>
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth={strokeWidth}
              fill="none"
            />

            {/* Progress Circle */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={uvData.color}
              strokeWidth={strokeWidth}
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className="transition-all duration-1000 ease-out"
              style={{
                filter: `drop-shadow(0 0 8px ${uvData.color}40)`,
              }}
            />
          </svg>

          {/* Center Value */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-4xl font-light text-gray-900 dark:text-white light:text-gray-900">
              {uvIndex.toFixed(1)}
            </div>
            <div className="text-xs text-gray-500 dark:text-white/40 light:text-gray-500 mt-1">
              UV
            </div>
          </div>
        </div>

        {/* Recommendation */}
        <div className="text-center mt-4">
          <div className="text-xs text-gray-500 dark:text-white/40 light:text-gray-500 max-w-[200px]">
            {getRecommendation()}
          </div>
        </div>
      </div>

      {/* UV Scale Reference */}
      <div className="mt-4 pt-4 border-t border-white/10 dark:border-white/10 light:border-black/10">
        <div className="flex items-center justify-between text-[10px] text-gray-500 dark:text-white/40 light:text-gray-500 mb-2">
          <span>0</span>
          <span>3</span>
          <span>6</span>
          <span>8</span>
          <span>11+</span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden flex">
          <div className="flex-1 bg-emerald-500" />
          <div className="flex-1 bg-yellow-500" />
          <div className="flex-1 bg-orange-500" />
          <div className="flex-1 bg-red-500" />
          <div className="flex-1 bg-red-700" />
        </div>
        <div className="flex items-center justify-between mt-2 text-[10px] text-gray-500 dark:text-white/40 light:text-gray-500">
          <span>Low</span>
          <span>Moderate</span>
          <span>High</span>
          <span>Very High</span>
          <span>Extreme</span>
        </div>
      </div>
    </div>
  );
};

export default UVIndex;
