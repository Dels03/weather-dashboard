import React from "react";
import { Cloud, CloudRain, Sun, CloudSnow, Clock } from "lucide-react";

const OtherCities = ({ cities, onCityClick }) => {
  const cityData = cities || [];

  const getWeatherIcon = (iconType) => {
    const iconMap = {
      sun: Sun,
      cloud: Cloud,
      rain: CloudRain,
      snow: CloudSnow,
    };
    return iconMap[iconType] || Cloud;
  };

  // Function to get current time in a specific timezone
  const getCityTime = (timezone, cityName) => {
    if (!timezone) return "--:--";

    // Get current UTC time
    const now = new Date();
    const utcTime = now.getTime() + now.getTimezoneOffset() * 60000;

    // Add the city's timezone offset
    const cityTimeMs = utcTime + timezone * 1000;
    const cityDate = new Date(cityTimeMs);

    // Format using UTC methods
    const hours = cityDate.getUTCHours();
    const minutes = cityDate.getUTCMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    const displayHours = (hours % 12 || 12).toString().padStart(2, "0");

    return `${displayHours}:${minutes} ${ampm}`;
  };

  const handleCityClick = (city) => {
    if (onCityClick) {
      onCityClick(city);
    }
  };

  if (!cityData || cityData.length === 0) {
    return (
      <div className="bg-white/[0.03] backdrop-blur-sm border border-white/[0.08] rounded-2xl p-5">
        <h4 className="text-sm font-medium text-white mb-4">Other Cities</h4>
        <p className="text-sm text-white/40 text-center py-4">
          No city data available
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white/[0.03] backdrop-blur-sm border border-white/[0.08] rounded-2xl p-5 hover:bg-white/[0.05] transition-all duration-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-medium text-white">Other Cities</h4>
        <button className="text-xs text-[#4A90E2] hover:text-[#5BA3F5] transition-colors">
          See All →
        </button>
      </div>

      {/* Cities List */}
      <div className="space-y-3">
        {cityData.map((city, index) => {
          const Icon = getWeatherIcon(city.icon);
          const cityTime = getCityTime(city.timezone, city.city);

          return (
            <div
              key={index}
              onClick={() => handleCityClick(city)}
              className="flex items-center justify-between p-3 bg-white/[0.02] hover:bg-white/[0.05] rounded-xl transition-all duration-200 cursor-pointer group border border-transparent hover:border-white/10"
            >
              {/* City Info */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-white/40">{city.country}</span>
                  <span className="text-[10px] text-white/30 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {cityTime}
                  </span>
                </div>
                <div className="text-sm font-medium text-white group-hover:text-[#4A90E2] transition-colors">
                  {city.city}
                </div>
                <div className="text-xs text-white/50 mt-0.5">
                  {city.condition}
                </div>
              </div>

              {/* Weather Icon & Temp */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-white/10 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <Icon className="relative z-10 w-8 h-8 text-white/60 group-hover:text-white transition-colors" />
                </div>
                <div className="text-xl font-light text-white min-w-[3rem] text-right">
                  {city.temp}°
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add City Button (Optional) */}
      <button className="w-full mt-4 py-2.5 border border-white/10 hover:border-[#4A90E2]/30 hover:bg-white/[0.02] rounded-xl text-xs text-white/50 hover:text-white/70 transition-all duration-200">
        + Add City
      </button>
    </div>
  );
};

export default OtherCities;
