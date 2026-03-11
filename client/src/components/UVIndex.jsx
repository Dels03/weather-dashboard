import React from "react";
import { Sun } from "lucide-react";

const UVIndex = ({ uvIndex = 5.5 }) => {
  // UV Index levels
  const getUVLevel = (uv) => {
    if (uv < 3)
      return {
        level: "Low",
        color: "#10b981",
        bgColor: "rgba(16, 185, 129, 0.1)",
      };
    if (uv < 6)
      return {
        level: "Moderate",
        color: "#f59e0b",
        bgColor: "rgba(245, 158, 11, 0.1)",
      };
    if (uv < 8)
      return {
        level: "High",
        color: "#f97316",
        bgColor: "rgba(249, 115, 22, 0.1)",
      };
    if (uv < 11)
      return {
        level: "Very High",
        color: "#ef4444",
        bgColor: "rgba(239, 68, 68, 0.1)",
      };
    return {
      level: "Extreme",
      color: "#dc2626",
      bgColor: "rgba(220, 38, 38, 0.1)",
    };
  };

  const uvData = getUVLevel(uvIndex);
  const percentage = Math.min((uvIndex / 11) * 100, 100);

  // Circle parameters
  const size = 140;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="bg-white/[0.03] backdrop-blur-sm border border-white/[0.08] rounded-2xl p-5 hover:bg-white/[0.05] transition-all duration-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="absolute inset-0 bg-[#4A90E2]/20 rounded-full blur-md"></div>
            <Sun className="relative z-10 w-5 h-5 text-[#4A90E2]" />
          </div>
          <h4 className="text-sm font-medium text-white">UV Index</h4>
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
              stroke="rgba(255, 255, 255, 0.05)"
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
            <div className="text-4xl font-light text-white">
              {uvIndex.toFixed(1)}
            </div>
            <div className="text-xs text-white/40 mt-1">UV</div>
          </div>
        </div>

        {/* Time Info */}
        <div className="text-center mt-4">
          <div className="text-xs text-white/40">Peak at</div>
          <div className="text-sm text-white/70 font-medium">12:00 PM</div>
        </div>
      </div>

      {/* UV Scale Reference */}
      <div className="mt-4 pt-4 border-t border-white/5">
        <div className="flex items-center justify-between text-[10px] text-white/30 mb-2">
          <span>0</span>
          <span>3</span>
          <span>6</span>
          <span>8</span>
          <span>11+</span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden flex">
          <div className="flex-1 bg-green-500"></div>
          <div className="flex-1 bg-yellow-500"></div>
          <div className="flex-1 bg-orange-500"></div>
          <div className="flex-1 bg-red-500"></div>
          <div className="flex-1 bg-red-700"></div>
        </div>
      </div>
    </div>
  );
};

export default UVIndex;
