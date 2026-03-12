import React from "react";
import { Wind, Info, Activity, Circle } from "lucide-react";

/**
 * AirQuality Component
 *
 * Displays air quality index and pollutant levels for the current city.
 * Uses data from OpenWeather Air Pollution API.
 *
 * @param {Object} props
 * @param {Object} props.data - Air quality data from API with structure { coord, list }
 */
const AirQuality = ({ data }) => {
  // Check if we have valid data
  if (!data || !data.list || !data.list[0]) {
    return (
      <div className="bg-white/5 dark:bg-white/5 light:bg-black/5 border border-white/10 dark:border-white/10 light:border-black/10 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-5 h-5 text-[#4A90E2]" />
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white light:text-gray-900">
            Air Quality
          </h4>
        </div>
        <p className="text-sm text-gray-500 dark:text-white/40 light:text-gray-500 text-center py-8">
          No air quality data available
        </p>
      </div>
    );
  }

  // Extract AQI and components from the correct structure
  const aqi = data.list[0]?.main?.aqi || 1;
  const components = data.list[0]?.components || {};

  // Get AQI description and color
  const getAQIInfo = (aqiValue) => {
    const levels = {
      1: {
        label: "Good",
        color: "#10b981",
        textColor: "text-emerald-500",
        bgColor: "bg-emerald-500/20",
        icon: "😊",
      },
      2: {
        label: "Fair",
        color: "#4A90E2",
        textColor: "text-blue-500",
        bgColor: "bg-blue-500/20",
        icon: "🙂",
      },
      3: {
        label: "Moderate",
        color: "#f59e0b",
        textColor: "text-yellow-500",
        bgColor: "bg-yellow-500/20",
        icon: "😐",
      },
      4: {
        label: "Poor",
        color: "#ef4444",
        textColor: "text-orange-500",
        bgColor: "bg-orange-500/20",
        icon: "😷",
      },
      5: {
        label: "Very Poor",
        color: "#8b5cf6",
        textColor: "text-purple-500",
        bgColor: "bg-purple-500/20",
        icon: "🤢",
      },
    };
    return levels[aqiValue] || levels[3];
  };

  const aqiInfo = getAQIInfo(aqi);

  // Pollutant display configuration
  const pollutants = [
    {
      key: "pm2_5",
      label: "PM2.5",
      unit: "µg/m³",
      description: "Fine particles",
    },
    {
      key: "pm10",
      label: "PM10",
      unit: "µg/m³",
      description: "Coarse particles",
    },
    { key: "o3", label: "O₃", unit: "µg/m³", description: "Ozone" },
    {
      key: "no2",
      label: "NO₂",
      unit: "µg/m³",
      description: "Nitrogen dioxide",
    },
    { key: "so2", label: "SO₂", unit: "µg/m³", description: "Sulfur dioxide" },
    { key: "co", label: "CO", unit: "µg/m³", description: "Carbon monoxide" },
    { key: "nh3", label: "NH₃", unit: "µg/m³", description: "Ammonia" },
  ];

  return (
    <div className="bg-white/5 dark:bg-white/5 light:bg-black/5 border border-white/10 dark:border-white/10 light:border-black/10 rounded-2xl p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-[#4A90E2]" />
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white light:text-gray-900">
            Air Quality
          </h4>
        </div>

        {/* AQI Badge */}
        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${aqiInfo.bgColor}`}
        >
          <span className="text-lg">{aqiInfo.icon}</span>
          <span className={`text-xs font-medium ${aqiInfo.textColor}`}>
            {aqiInfo.label}
          </span>
        </div>
      </div>

      {/* Main AQI Display */}
      <div className="mb-6 text-center">
        <div className="text-5xl font-light text-gray-900 dark:text-white light:text-gray-900 mb-2">
          {aqi}
          <span className="text-sm text-gray-500 dark:text-white/50 light:text-gray-500 ml-2">
            /5
          </span>
        </div>
        <p className="text-xs text-gray-500 dark:text-white/40 light:text-gray-500">
          Air Quality Index
        </p>
      </div>

      {/* Pollutants Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {pollutants.map((pollutant) => {
          const value = components[pollutant.key];
          if (value === undefined) return null;

          return (
            <div
              key={pollutant.key}
              className="bg-white/10 dark:bg-white/10 light:bg-black/10 rounded-xl p-3"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-gray-500 dark:text-white/60 light:text-gray-600">
                  {pollutant.label}
                </span>
                <div className="relative group">
                  <Info className="w-3 h-3 text-gray-400 dark:text-white/30 light:text-gray-400 cursor-help" />
                  <div className="absolute bottom-full right-0 mb-2 w-32 bg-gray-900 dark:bg-black light:bg-gray-800 border border-white/10 rounded-lg p-1.5 text-[10px] text-white/80 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                    {pollutant.description}
                  </div>
                </div>
              </div>
              <div className="flex items-end justify-between">
                <span className="text-lg font-light text-gray-900 dark:text-white light:text-gray-900">
                  {typeof value === "number" ? Math.round(value) : value}
                </span>
                <span className="text-[10px] text-gray-400 dark:text-white/40 light:text-gray-500">
                  {pollutant.unit}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Health Recommendations */}
      <div className="mt-4 pt-4 border-t border-white/10 dark:border-white/10 light:border-black/10">
        <div className="flex items-start gap-3">
          <Wind className="w-4 h-4 text-[#4A90E2] mt-0.5 flex-shrink-0" />
          <div>
            <h5 className="text-xs font-medium text-gray-900 dark:text-white light:text-gray-900 mb-1">
              Health Recommendations
            </h5>
            <p className="text-xs text-gray-500 dark:text-white/40 light:text-gray-500">
              {aqi === 1 && "Air quality is good. Enjoy outdoor activities."}
              {aqi === 2 &&
                "Air quality is acceptable. Sensitive individuals should limit prolonged outdoor exertion."}
              {aqi === 3 &&
                "Moderate air quality. Unusually sensitive people should reduce outdoor activities."}
              {aqi === 4 &&
                "Poor air quality. Everyone should reduce outdoor activities."}
              {aqi === 5 && "Very poor air quality. Avoid outdoor activities."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AirQuality;
