import { useState, useEffect } from "react";
import { getWeather, getForecast } from "../services/weatherApi";

export const useCityWeather = (cityName) => {
  const [data, setData] = useState({
    current: null,
    daily: null,
    hourly: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!cityName) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [currentRes, forecastRes] = await Promise.all([
          getWeather(cityName),
          getForecast(cityName),
        ]);

        // Current weather data
        const currentData = currentRes.data;
        
        // Forecast data (comes in 3-hour intervals)
        const forecastData = forecastRes.data;
        
        // Format hourly data (first 8 entries = next 24 hours)
        const hourlyData = forecastData?.map(item => ({
          dt: item.dt,
          main: item.main,
          weather: item.weather,
          wind: item.wind,
          visibility: item.visibility,
          pop: item.pop,
        })) || [];

        // Format daily data (group by day)
        const dailyMap = new Map();
        forecastData?.forEach(item => {
          const date = new Date(item.dt * 1000).toDateString();
          if (!dailyMap.has(date)) {
            dailyMap.set(date, {
              dt: item.dt,
              temp: {
                min: item.main.temp_min,
                max: item.main.temp_max,
              },
              weather: item.weather[0],
              humidity: item.main.humidity,
              wind_speed: item.wind.speed,
            });
          }
        });
        
        const dailyData = Array.from(dailyMap.values()).slice(0, 5);

        setData({
          current: currentData,
          daily: dailyData,
          hourly: hourlyData.slice(0, 8), // Next 24 hours (8 * 3hrs)
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [cityName]);

  return { ...data, loading, error };
};
