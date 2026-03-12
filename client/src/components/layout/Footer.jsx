import React from "react";

/**
 * Footer Component
 *
 * Displays app footer with copyright, attribution, and version info.
 * Shows:
 * - Copyright notice
 * - Data source attribution (OpenWeather)
 * - Update frequency
 * - App version
 *
 * @component
 */
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 dark:border-white/10 light:border-black/10 px-4 sm:px-6 py-4 mt-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500 dark:text-white/40 light:text-gray-500">
        <p>© {currentYear} Weather Dashboard. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <span>Powered by OpenWeather</span>
          <span className="text-gray-400 dark:text-white/20 light:text-gray-400">
            •
          </span>
          <span>Data updates every 10 min</span>
          <span className="text-gray-400 dark:text-white/20 light:text-gray-400">
            •
          </span>
          <span>v2.0.0</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
