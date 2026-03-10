import React from "react";
import {
  Droplets,
  Wind,
  Eye,
  Gauge,
  Sunrise,
  Sunset,
  Thermometer,
  Cloud,
} from "lucide-react";
import { formatCityTimeOnly } from "../../../utils/dateFormatter";

const DetailsGrid = ({ data }) => {
  if (!data) {
    return (
      <div className="glass-card p-4 mt-4">
        <h3 className="text-lg font-semibold mb-2">Weather Details</h3>
        <p className="text-white/60">No details available</p>
      </div>
    );
  }

  const formatTime = (timestamp) => {
    if (!timestamp || !data?.timezone) return "N/A";
    return formatCityTimeOnly(timestamp, data.timezone);
  };

  const details = [
    {
      icon: <Thermometer className="w-5 h-5 text-blue-400" />,
      label: "Feels Like",
      value: `${Math.round(data.feelsLike || 0)}°`,
    },
    {
      icon: <Droplets className="w-5 h-5 text-blue-400" />,
      label: "Humidity",
      value: `${data.humidity || 0}%`,
    },
    {
      icon: <Wind className="w-5 h-5 text-blue-400" />,
      label: "Wind Speed",
      value: `${Math.round(data.windSpeed || 0)} km/h`,
    },
    {
      icon: <Wind className="w-5 h-5 text-blue-400 rotate-45" />,
      label: "Wind Direction",
      value: data.windDirection ? `${data.windDirection}°` : "N/A",
    },
    {
      icon: <Gauge className="w-5 h-5 text-blue-400" />,
      label: "Pressure",
      value: data.pressure ? `${data.pressure} hPa` : "N/A",
    },
    {
      icon: <Eye className="w-5 h-5 text-blue-400" />,
      label: "Visibility",
      value: data.visibility
        ? `${(data.visibility / 1000).toFixed(1)} km`
        : "N/A",
    },
    {
      icon: <Cloud className="w-5 h-5 text-blue-400" />,
      label: "Cloud Cover",
      value: data.cloudiness ? `${data.cloudiness}%` : "N/A",
    },
    {
      icon: <Sunrise className="w-5 h-5 text-yellow-400" />,
      label: "Sunrise",
      value: formatTime(data.sunrise),
    },
    {
      icon: <Sunset className="w-5 h-5 text-orange-400" />,
      label: "Sunset",
      value: formatTime(data.sunset),
    },
  ];

  return (
    <div className="glass-card p-4 mt-4">
      <h3 className="text-lg font-semibold mb-4">Weather Details</h3>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {details.map((detail, index) => (
          <div
            key={index}
            className="bg-white/5 rounded-xl p-3 flex items-center gap-3 hover:bg-white/10 transition-colors"
          >
            <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
              {detail.icon}
            </div>
            <div>
              <p className="text-xs text-white/40">{detail.label}</p>
              <p className="text-sm font-medium text-white">{detail.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DetailsGrid;
