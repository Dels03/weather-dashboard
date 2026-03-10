import React from "react";

const Footer = () => {
  return (
    <footer className="border-t border-white/5 px-6 py-4 mt-6">
      <div className="flex items-center justify-between text-xs text-white/30">
        <p>© 2026 Weather Dashboard. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <span>Powered by OpenWeather</span>
          <span>•</span>
          <span>Data updates every 10 min</span>
          <span>•</span>
          <span>v2.0.0</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
