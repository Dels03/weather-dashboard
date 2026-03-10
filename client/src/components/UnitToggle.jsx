import React from "react";
import { Thermometer } from "lucide-react";
import { useSettings } from "../context/SettingsContext";

const UnitToggle = () => {
  const { unit, toggleUnit } = useSettings();

  return (
    <button
      onClick={toggleUnit}
      className="relative group flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all duration-300"
      aria-label="Toggle temperature unit"
    >
      {/* Glow effect on hover */}
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>

      {/* Icon */}
      <Thermometer className="w-5 h-5 text-blue-400 relative z-10" />

      {/* Unit display with dot indicator */}
      <div className="relative z-10 flex items-center gap-1">
        <span
          className={`text-sm font-medium transition-colors duration-300 ${
            unit === "celsius" ? "text-white" : "text-white/40"
          }`}
        >
          °C
        </span>

        {/* Dot separator */}
        <span className="text-white/20 text-xs">•</span>

        <span
          className={`text-sm font-medium transition-colors duration-300 ${
            unit === "fahrenheit" ? "text-white" : "text-white/40"
          }`}
        >
          °F
        </span>
      </div>

      {/* Active indicator line */}
      <div
        className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 rounded-full ${
          unit === "celsius" ? "w-1/2" : "w-1/2 left-1/2"
        }`}
        style={{ width: "40%", left: unit === "celsius" ? "10%" : "50%" }}
      ></div>

      {/* Tooltip */}
      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-xs text-white/60 whitespace-nowrap">
        {unit === "celsius" ? "Switch to °F" : "Switch to °C"}
      </div>
    </button>
  );
};

export default UnitToggle;
