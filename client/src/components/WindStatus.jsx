import React from "react";
import { Wind } from "lucide-react";

const WindStatus = ({ windData }) => {
  // Mock data - replace with actual hourly wind data from your API
  const hours = ["7AM", "9AM", "11AM", "1PM", "3PM", "5PM", "7PM", "9PM"];
  const windSpeed = [12, 18, 25, 30, 28, 22, 15, 10]; // km/h

  const maxWind = Math.max(...windSpeed);
  const currentWind = windData?.speed || 25; // Default or from props

  return (
    <div className="bg-white/[0.03] backdrop-blur-sm border border-white/[0.08] rounded-2xl p-5 hover:bg-white/[0.05] transition-all duration-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="absolute inset-0 bg-[#4A90E2]/20 rounded-full blur-md"></div>
            <Wind className="relative z-10 w-5 h-5 text-[#4A90E2]" />
          </div>
          <h4 className="text-sm font-medium text-white">Wind Status</h4>
        </div>
        <span className="text-xs text-white/40 bg-white/5 px-2 py-1 rounded-full">
          Today
        </span>
      </div>

      {/* Current Wind Speed - Large Display */}
      <div className="mb-4">
        <div className="text-3xl sm:text-4xl font-light text-white">
          {currentWind}
          <span className="text-lg text-white/50 ml-2">km/h</span>
        </div>
        <div className="text-xs text-white/40 mt-1">
          {currentWind > 25
            ? "Strong breeze"
            : currentWind > 15
              ? "Moderate breeze"
              : "Light breeze"}
        </div>
      </div>

      {/* Wind Speed Bars - Hourly */}
      <div className="space-y-2 mb-3">
        {windSpeed.slice(0, 6).map((speed, index) => {
          const width = (speed / maxWind) * 100;
          const isHigh = speed > 20;

          return (
            <div key={index} className="group">
              <div className="flex items-center gap-3">
                {/* Time Label */}
                <span className="text-xs text-white/40 w-10 flex-shrink-0">
                  {hours[index]}
                </span>

                {/* Bar */}
                <div className="flex-1 relative">
                  <div className="h-6 bg-white/5 rounded-md overflow-hidden">
                    <div
                      className={`h-full rounded-md transition-all duration-500 ${
                        isHigh
                          ? "bg-gradient-to-r from-[#4A90E2] to-[#5BA3F5]"
                          : "bg-gradient-to-r from-[#4A90E2]/50 to-[#5BA3F5]/50"
                      } group-hover:brightness-110`}
                      style={{ width: `${width}%` }}
                    >
                      {/* Speed value inside bar */}
                      <span className="text-[10px] text-white/80 font-medium px-2 leading-6">
                        {speed}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between text-xs pt-3 border-t border-white/5">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-gradient-to-r from-[#4A90E2] to-[#5BA3F5]"></div>
            <span className="text-white/50">Strong (&gt;20)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-gradient-to-r from-[#4A90E2]/50 to-[#5BA3F5]/50"></div>
            <span className="text-white/50">Moderate</span>
          </div>
        </div>
        <span className="text-white/30">km/h</span>
      </div>
    </div>
  );
};

export default WindStatus;
