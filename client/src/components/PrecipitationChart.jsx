import React, { useState } from "react";
import { Droplets, CloudRain, Info } from "lucide-react";

const PrecipitationChart = ({ forecast }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Mock data - replace with actual hourly precipitation data from your API
  const hours = ["12AM", "3AM", "6AM", "9AM", "12PM", "3PM", "6PM", "9PM"];
  const precipitation = [20, 45, 80, 60, 30, 70, 90, 40]; // Percentage

  // Get max value for scaling
  const maxValue = Math.max(...precipitation);

  // Get precipitation level label
  const getPrecipitationLevel = (value) => {
    if (value < 30) return "Low";
    if (value < 60) return "Moderate";
    if (value < 80) return "High";
    return "Very High";
  };

  // Get color based on value
  const getBarColor = (value) => {
    if (value < 30) return "from-blue-400/40 to-blue-500/40";
    if (value < 60) return "from-blue-500 to-blue-600";
    if (value < 80) return "from-indigo-500 to-purple-500";
    return "from-purple-500 to-pink-500";
  };

  return (
    <div className="glass-card p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-md"></div>
            <Droplets className="relative z-10 w-5 h-5 text-blue-400" />
          </div>
          <h4 className="text-sm font-medium text-white">
            Precipitation Forecast
          </h4>
          <span className="text-xs text-white/40 bg-white/5 px-2 py-1 rounded-full">
            Next 24h
          </span>
        </div>

        {/* Summary badge */}
        <div className="flex items-center gap-2 text-xs">
          <CloudRain className="w-4 h-4 text-blue-400/60" />
          <span className="text-white/60">
            Max: <span className="text-white font-medium">{maxValue}%</span>
          </span>
        </div>
      </div>

      {/* Chart Container */}
      <div className="relative">
        {/* Chart Area */}
        <div className="flex items-end justify-between h-40 gap-2 mb-2">
          {precipitation.map((value, index) => {
            const height = (value / 100) * 100; // Convert to percentage of container
            const isHovered = hoveredIndex === index;
            const barColor = getBarColor(value);

            return (
              <div
                key={index}
                className="flex-1 flex flex-col items-center group"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Tooltip */}
                {isHovered && (
                  <div className="absolute -top-12 bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg px-3 py-2 text-center transform -translate-x-1/2 left-1/2 pointer-events-none z-20">
                    <p className="text-xs text-white/90 font-medium">
                      {hours[index]}
                    </p>
                    <p className="text-sm text-white font-bold">{value}%</p>
                    <p className="text-[10px] text-white/60">
                      {getPrecipitationLevel(value)}
                    </p>
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white/10 backdrop-blur-xl border-r border-b border-white/20 rotate-45"></div>
                  </div>
                )}

                {/* Bar Container */}
                <div className="relative w-full flex items-end justify-center">
                  {/* Bar */}
                  <div
                    className={`w-full max-w-[32px] rounded-t-lg transition-all duration-300 cursor-pointer
                      ${isHovered ? "scale-110 shadow-lg shadow-blue-500/50" : ""}
                    `}
                    style={{
                      height: "120px",
                      background: `linear-gradient(to top, var(--tw-gradient-stops))`,
                    }}
                  >
                    <div
                      className={`w-full h-full rounded-t-lg bg-gradient-to-t ${barColor} transition-all duration-300
                        ${isHovered ? "opacity-100" : "opacity-80"}
                      `}
                      style={{
                        height: `${height}%`,
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                      }}
                    ></div>
                  </div>

                  {/* Percentage label on bar */}
                  <span
                    className={`absolute -top-5 text-[10px] font-medium transition-all duration-300
                    ${isHovered ? "text-white opacity-100" : "text-white/40 opacity-0 group-hover:opacity-60"}
                  `}
                  >
                    {value}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Time Labels */}
        <div className="flex justify-between text-xs text-white/40 mt-6">
          {hours.map((hour, index) => (
            <span
              key={index}
              className={`flex-1 text-center transition-colors duration-300
                ${hoveredIndex === index ? "text-blue-400" : ""}
              `}
            >
              {hour}
            </span>
          ))}
        </div>
      </div>

      {/* Legend and Stats */}
      <div className="mt-6 pt-4 border-t border-white/10">
        <div className="flex items-center justify-between">
          {/* Legend */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-400/40 to-blue-500/40"></div>
              <span className="text-xs text-white/50">Low (&lt;30%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-600"></div>
              <span className="text-xs text-white/50">Moderate (30-60%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"></div>
              <span className="text-xs text-white/50">High (60-80%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"></div>
              <span className="text-xs text-white/50">Very High (&gt;80%)</span>
            </div>
          </div>

          {/* Info icon with tooltip */}
          <div className="relative group">
            <Info className="w-4 h-4 text-white/30 hover:text-white/50 cursor-help transition-colors" />
            <div className="absolute bottom-full right-0 mb-2 w-48 bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg p-2 text-xs text-white/70 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-30">
              Precipitation probability for the next 24 hours
            </div>
          </div>
        </div>

        {/* Summary text */}
        <div className="mt-3 text-xs text-white/40">
          {maxValue > 80 ? (
            <span className="text-pink-400">
              ⚠️ High chance of precipitation in the next few hours
            </span>
          ) : maxValue > 60 ? (
            <span className="text-purple-400">
              🌧️ Moderate to high precipitation expected
            </span>
          ) : (
            <span className="text-blue-400">
              ☀️ Low precipitation chance throughout the day
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrecipitationChart;
