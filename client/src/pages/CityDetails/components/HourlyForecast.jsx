import React from "react";
import { Droplets, Wind } from "lucide-react";

const HourlyForecast = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="glass-card p-4 mt-4">
        <h3 className="text-lg font-semibold mb-2">Hourly Forecast</h3>
        <p className="text-white/60">No hourly data available</p>
      </div>
    );
  }

  return (
    <div className="glass-card p-4 mt-4">
      <h3 className="text-lg font-semibold mb-4">Hourly Forecast</h3>

      <div className="overflow-x-auto pb-2 scrollbar-hide">
        <div className="flex space-x-4 min-w-max">
          {data.map((hour, index) => {
            const time = new Date(hour.dt * 1000).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <div
                key={index}
                className="flex flex-col items-center bg-white/5 rounded-xl p-3 min-w-[100px]"
              >
                <span className="text-sm text-white/60 mb-2">{time}</span>
                <img
                  src={`https://openweathermap.org/img/wn/${hour.weather[0].icon}@2x.png`}
                  alt={hour.weather[0].description}
                  className="w-12 h-12"
                />
                <span className="text-lg font-semibold mt-1">
                  {Math.round(hour.main.temp)}°
                </span>
                <div className="flex items-center gap-2 mt-2 text-xs text-white/40">
                  <span className="flex items-center gap-1">
                    <Droplets className="w-3 h-3" /> {hour.main.humidity}%
                  </span>
                  <span className="flex items-center gap-1">
                    <Wind className="w-3 h-3" /> {Math.round(hour.wind.speed)}{" "}
                    km/h
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HourlyForecast;
