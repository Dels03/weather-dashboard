import React from "react";
import {
  Droplets,
  Wind,
  Sunrise,
  Sunset,
  Eye,
  Gauge,
  MapPin,
} from "lucide-react";
import WeatherIcon from "./WeatherIcon";
import { getCurrentCityTime, formatCityTimeOnly } from "../utils/dateFormatter";

const WeatherCard = ({ weather }) => {
  if (!weather) return null;

  const {
    city,
    country,
    temperature,
    weather: weatherData, // This is the nested object
    feelsLike,
    tempMin,
    tempMax,
    humidity,
    wind,
    pressure,
    visibility,
    sunrise,
    sunset,
    timezone,
  } = weather;

  // Extract nested weather data with fallbacks
  const condition = weatherData?.main || "Unknown";
  const description = weatherData?.description || "";
  const icon = weatherData?.icon || "01d";
  const windSpeed = wind?.speed || 0;
  const windDirection = wind?.direction || 0;

  const formatTime = (timestamp) => {
    if (!timestamp) return "N/A";
    return formatCityTimeOnly(timestamp, timezone);
  };

  const getCurrentTime = () => {
    if (!timezone)
      return new Date().toLocaleTimeString([], {
        weekday: "long",
        hour: "2-digit",
        minute: "2-digit",
      });
    return getCurrentCityTime(timezone);
  };

  const getWindDirection = (degrees) => {
    const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
  };

  return (
    <div className="relative group">
      {/* Today's special card - light blue gradient from inspiration */}
      <div className="relative bg-gradient-to-br from-[#b3d9f2] via-[#a8cfe8] to-[#9ec5de] rounded-3xl p-8 shadow-2xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:scale-[1.02]">
        {/* Decorative clouds pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20%" cy="30%" r="40" fill="white" />
            <circle cx="80%" cy="60%" r="60" fill="white" />
            <circle cx="50%" cy="80%" r="30" fill="white" />
            <circle cx="30%" cy="70%" r="20" fill="white" />
            <circle cx="70%" cy="20%" r="50" fill="white" />
          </svg>
        </div>

        {/* Subtle animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent animate-pulse-slow"></div>

        {/* Content */}
        <div className="relative z-10">
          {/* Header - Location & Live Indicator */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-5 h-5 text-gray-800/60" />
                <h2 className="text-2xl font-bold text-gray-800">
                  {city}, {country}
                </h2>
              </div>
              <p className="text-gray-700/70">{getCurrentTime()}</p>
            </div>

            {/* Live indicator */}
            <div className="flex items-center gap-2 bg-black/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-xs font-medium text-gray-800">LIVE</span>
            </div>
          </div>

          {/* Main Weather Display - Centered */}
          <div className="flex flex-col items-center mb-8">
            {/* Weather Icon with animation */}
            <div className="relative mb-4">
              <div className="absolute inset-0 bg-white/30 rounded-full blur-2xl"></div>
              <div className="relative transform transition-transform duration-500 hover:scale-110">
                <WeatherIcon
                  condition={condition}
                  icon={icon}
                  size={140}
                  className="drop-shadow-2xl"
                />
              </div>
            </div>

            {/* Temperature */}
            <div className="text-center">
              <div className="relative">
                <span className="text-[120px] font-light leading-none text-gray-800">
                  {Math.round(temperature)}°
                </span>
              </div>
              <p className="text-xl text-gray-700/80 mt-2">
                Feels like {Math.round(feelsLike)}°
              </p>
              <p className="text-lg text-gray-800/70 mt-1 capitalize">
                {description}
              </p>
            </div>
          </div>

          {/* Weather Stats Grid - Dark overlays on light background */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {/* Wind */}
            <div className="bg-black/10 backdrop-blur-sm rounded-xl p-3 border border-white/20 hover:bg-black/20 transition-all duration-300">
              <div className="flex items-center gap-2 mb-1">
                <Wind className="w-4 h-4 text-gray-800" />
                <span className="text-xs text-gray-700 uppercase tracking-wide">
                  Wind
                </span>
              </div>
              <p className="text-xl font-semibold text-gray-800">
                {Math.round(windSpeed)}
              </p>
              <p className="text-xs text-gray-700/70 mt-1">
                km/h {getWindDirection(windDirection)}
              </p>
            </div>

            {/* Humidity */}
            <div className="bg-black/10 backdrop-blur-sm rounded-xl p-3 border border-white/20 hover:bg-black/20 transition-all duration-300">
              <div className="flex items-center gap-2 mb-1">
                <Droplets className="w-4 h-4 text-gray-800" />
                <span className="text-xs text-gray-700 uppercase tracking-wide">
                  Humidity
                </span>
              </div>
              <p className="text-xl font-semibold text-gray-800">{humidity}%</p>
              <p className="text-xs text-gray-700/70 mt-1">
                {humidity > 70 ? "High" : humidity > 40 ? "Normal" : "Low"}
              </p>
            </div>

            {/* Pressure */}
            {pressure && (
              <div className="bg-black/10 backdrop-blur-sm rounded-xl p-3 border border-white/20 hover:bg-black/20 transition-all duration-300">
                <div className="flex items-center gap-2 mb-1">
                  <Gauge className="w-4 h-4 text-gray-800" />
                  <span className="text-xs text-gray-700 uppercase tracking-wide">
                    Pressure
                  </span>
                </div>
                <p className="text-xl font-semibold text-gray-800">
                  {pressure}
                </p>
                <p className="text-xs text-gray-700/70 mt-1">hPa</p>
              </div>
            )}

            {/* Visibility */}
            {visibility && (
              <div className="bg-black/10 backdrop-blur-sm rounded-xl p-3 border border-white/20 hover:bg-black/20 transition-all duration-300">
                <div className="flex items-center gap-2 mb-1">
                  <Eye className="w-4 h-4 text-gray-800" />
                  <span className="text-xs text-gray-700 uppercase tracking-wide">
                    Visibility
                  </span>
                </div>
                <p className="text-xl font-semibold text-gray-800">
                  {(visibility / 1000).toFixed(1)}
                </p>
                <p className="text-xs text-gray-700/70 mt-1">km</p>
              </div>
            )}
          </div>

          {/* Temperature Range Bar */}
          <div className="bg-black/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-700">Temperature Range</span>
              <span className="text-sm font-medium text-gray-800">
                {Math.round(tempMin)}° / {Math.round(tempMax)}°
              </span>
            </div>
            <div className="relative h-2 bg-white/30 rounded-full overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"
                style={{
                  width: `${((temperature - tempMin) / (tempMax - tempMin)) * 100}%`,
                }}
              ></div>
            </div>
          </div>

          {/* Sun Times */}
          {(sunrise || sunset) && (
            <div className="grid grid-cols-2 gap-3">
              {sunrise && (
                <div className="flex items-center gap-3 bg-black/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                  <div className="bg-orange-500/30 rounded-lg p-2">
                    <Sunrise className="w-5 h-5 text-orange-700" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-700 uppercase tracking-wide">
                      Sunrise
                    </p>
                    <p className="text-lg font-semibold text-gray-800">
                      {formatTime(sunrise)}
                    </p>
                  </div>
                </div>
              )}
              {sunset && (
                <div className="flex items-center gap-3 bg-black/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                  <div className="bg-orange-500/30 rounded-lg p-2">
                    <Sunset className="w-5 h-5 text-orange-700" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-700 uppercase tracking-wide">
                      Sunset
                    </p>
                    <p className="text-lg font-semibold text-gray-800">
                      {formatTime(sunset)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;
