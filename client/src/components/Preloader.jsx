import React, { useState, useEffect } from "react";
import WeatherIcon from "./WeatherIcon";

/**
 * Preloader Component
 *
 * Displays a loading animation while the app initializes.
 * Automatically disappears after content loads or timeout.
 *
 * @param {Object} props
 * @param {boolean} props.isLoading - Controls preloader visibility
 */
const Preloader = ({ isLoading }) => {
  const [show, setShow] = useState(isLoading);

  useEffect(() => {
    if (!isLoading) {
      // Fade out animation
      const timer = setTimeout(() => setShow(false), 500);
      return () => clearTimeout(timer);
    } else {
      setShow(true);
    }
  }, [isLoading]);

  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center transition-opacity duration-500 ${
        isLoading ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      style={{
        backgroundColor: "var(--color-background-primary)",
      }}
    >
      <div className="text-center">
        {/* Animated Weather Icon */}
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-[#4A90E2]/20 rounded-full blur-2xl animate-pulse" />
          <div className="relative animate-float">
            <WeatherIcon
              condition="Clear"
              icon="01d"
              size={80}
              className="text-[#4A90E2]"
            />
          </div>
        </div>

        {/* App Name */}
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white light:text-gray-900 mb-2">
          Weather Dashboard
        </h1>

        {/* Loading Bar */}
        <div className="w-48 h-1 bg-white/10 dark:bg-white/10 light:bg-black/10 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#4A90E2] to-[#5BA3F5] rounded-full animate-loading-bar" />
        </div>

        {/* Loading Text */}
        <p className="text-sm text-gray-500 dark:text-white/40 light:text-gray-500 mt-3">
          Fetching latest weather data...
        </p>
      </div>
    </div>
  );
};

export default Preloader;
