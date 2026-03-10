import React, { useEffect, useState } from "react";
import { Sun, Moon, Sparkles } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();
  const [isAnimating, setIsAnimating] = useState(false);

  const handleToggle = () => {
    setIsAnimating(true);
    toggleTheme();

    // Add a little animation effect
    setTimeout(() => setIsAnimating(false), 500);
  };

  return (
    <button
      onClick={handleToggle}
      className="relative group"
      aria-label="Toggle theme"
    >
      {/* Glow effect */}
      <div
        className={`absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-300 ${isAnimating ? "animate-pulse" : ""}`}
      ></div>

      {/* Button background */}
      <div className="relative w-12 h-12 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all duration-300 flex items-center justify-center overflow-hidden">
        {/* Animated background particles (only during toggle) */}
        {isAnimating && (
          <>
            <Sparkles
              className="absolute w-4 h-4 text-yellow-400 animate-ping"
              style={{ top: "20%", left: "20%" }}
            />
            <Sparkles
              className="absolute w-3 h-3 text-purple-400 animate-ping"
              style={{ bottom: "20%", right: "20%", animationDelay: "0.2s" }}
            />
          </>
        )}

        {/* Icons container with rotation animation */}
        <div
          className={`transform transition-all duration-500 ${isAnimating ? "rotate-180 scale-0" : "rotate-0 scale-100"}`}
        >
          {isDark ? (
            <Sun className="w-5 h-5 text-yellow-400" />
          ) : (
            <Moon className="w-5 h-5 text-blue-400" />
          )}
        </div>

        {/* Secondary icon that appears during animation */}
        <div
          className={`absolute transform transition-all duration-500 ${isAnimating ? "rotate-0 scale-100" : "rotate-180 scale-0"}`}
        >
          {isDark ? (
            <Moon className="w-5 h-5 text-blue-400" />
          ) : (
            <Sun className="w-5 h-5 text-yellow-400" />
          )}
        </div>
      </div>

      {/* Tooltip */}
      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-xs text-white/60 whitespace-nowrap">
        {isDark ? "Switch to Light" : "Switch to Dark"}
      </div>
    </button>
  );
};

export default ThemeToggle;
