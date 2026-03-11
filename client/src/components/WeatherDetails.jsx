import React from "react";
import { Droplets, Eye } from "lucide-react";

// Humidity Card Component
export const Humidity = ({ humidity = 84 }) => {
  const getHumidityLevel = (value) => {
    if (value > 70) return { level: "High", color: "#4A90E2" };
    if (value > 40) return { level: "Normal", color: "#10b981" };
    return { level: "Low", color: "#f59e0b" };
  };

  const humidityData = getHumidityLevel(humidity);

  return (
    <div className="bg-white/[0.03] backdrop-blur-sm border border-white/[0.08] rounded-2xl p-5 hover:bg-white/[0.05] transition-all duration-200">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="relative">
          <div className="absolute inset-0 bg-[#4A90E2]/20 rounded-full blur-md"></div>
          <Droplets className="relative z-10 w-5 h-5 text-[#4A90E2]" />
        </div>
        <h4 className="text-sm font-medium text-white">Humidity</h4>
      </div>

      {/* Humidity Value */}
      <div className="mb-3">
        <div className="text-4xl font-light text-white">
          {humidity}
          <span className="text-xl text-white/50 ml-1">%</span>
        </div>
        <div className="text-xs text-white/40 mt-1">{humidityData.level}</div>
      </div>

      {/* Visual Bar */}
      <div className="relative h-2 bg-white/5 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${humidity}%`,
            background: `linear-gradient(to right, ${humidityData.color}, ${humidityData.color}dd)`,
          }}
        ></div>
      </div>

      {/* Additional Info */}
      <div className="mt-3 text-xs text-white/40">
        The dew point is 20°C right now
      </div>
    </div>
  );
};

// Visibility Card Component
export const Visibility = ({ visibility = 0.4 }) => {
  const getVisibilityLevel = (value) => {
    if (value >= 10) return { level: "Excellent", color: "#10b981" };
    if (value >= 5) return { level: "Good", color: "#4A90E2" };
    if (value >= 2) return { level: "Moderate", color: "#f59e0b" };
    return { level: "Poor", color: "#ef4444" };
  };

  const visData = getVisibilityLevel(visibility);

  return (
    <div className="bg-white/[0.03] backdrop-blur-sm border border-white/[0.08] rounded-2xl p-5 hover:bg-white/[0.05] transition-all duration-200">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="relative">
          <div className="absolute inset-0 bg-[#4A90E2]/20 rounded-full blur-md"></div>
          <Eye className="relative z-10 w-5 h-5 text-[#4A90E2]" />
        </div>
        <h4 className="text-sm font-medium text-white">Visibility</h4>
      </div>

      {/* Visibility Value */}
      <div className="mb-3">
        <div className="text-4xl font-light text-white">
          {typeof visibility === "string" ? parseFloat(visibility) : visibility}
          <span className="text-xl text-white/50 ml-1">km</span>
        </div>
        <div className="text-xs text-white/40 mt-1">{visData.level}</div>
      </div>

      {/* Visual Indicator */}
      <div className="flex items-center gap-1 mb-3">
        {[1, 2, 3, 4, 5].map((level) => {
          const visValue =
            typeof visibility === "string"
              ? parseFloat(visibility)
              : visibility;
          return (
            <div
              key={level}
              className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${
                level <= visValue / 2 ? "bg-[#4A90E2]" : "bg-white/10"
              }`}
            ></div>
          );
        })}
      </div>

      {/* Additional Info */}
      <div className="text-xs text-white/40">
        {visibility < 1
          ? "Haze is affecting visibility"
          : "Clear viewing conditions"}
      </div>
    </div>
  );
};
