import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext";
import { useWeather } from "../context/WeatherContext";
import { getWeather, getForecast } from "../services/weatherApi";
import { MapPin, Trash2, Loader2, Star } from "lucide-react";

const Favorites = () => {
  const { favorites, removeFavorite } = useFavorites();
  const {
    setCurrentWeather,
    setForecast,
    setLoading: setGlobalLoading,
  } = useWeather();
  const navigate = useNavigate();
  const [loadingCities, setLoadingCities] = useState({});
  const [weatherData, setWeatherData] = useState({});

  const loadCityWeather = async (city) => {
    const cityKey = `${city.cityName}-${city.countryCode}`;

    setLoadingCities((prev) => ({ ...prev, [cityKey]: true }));

    try {
      const [weatherRes, forecastRes] = await Promise.all([
        getWeather(city.cityName, city.countryCode),
        getForecast(city.cityName, city.countryCode),
      ]);

      setWeatherData((prev) => ({
        ...prev,
        [cityKey]: {
          current: weatherRes.data,
          forecast: forecastRes.data,
        },
      }));
    } catch (error) {
      console.error("Failed to load city weather:", error);
    } finally {
      setLoadingCities((prev) => ({ ...prev, [cityKey]: false }));
    }
  };

  const handleCityClick = (city) => {
    setGlobalLoading(true);
    loadCityWeather(city).then(() => {
      navigate("/dashboard");
    });
  };

  const handleViewAll = () => {
    // Load all cities when page loads
    favorites.forEach((city) => {
      const cityKey = `${city.cityName}-${city.countryCode}`;
      if (!weatherData[cityKey]) {
        loadCityWeather(city);
      }
    });
  };

  React.useEffect(() => {
    if (favorites.length > 0) {
      handleViewAll();
    }
  }, [favorites]);

  if (favorites.length === 0) {
    return (
      <div className="min-h-screen p-8">
        <div className="glass-card p-12 text-center">
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-yellow-500/20 rounded-full blur-xl animate-pulse"></div>
            <Star className="relative z-10 w-16 h-16 text-yellow-400" />
          </div>
          <h2 className="text-2xl font-bold mb-2">No Favorites Yet</h2>
          <p className="text-white/60 mb-6 max-w-md mx-auto">
            Start adding cities to your favorites by clicking the star icon on
            any city's weather card.
          </p>
          <button
            onClick={() => navigate("/dashboard")}
            className="btn-primary px-6 py-2"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Favorite Cities</h1>
            <p className="text-white/60">
              You have {favorites.length} saved{" "}
              {favorites.length === 1 ? "city" : "cities"}
            </p>
          </div>
          <button
            onClick={() => navigate("/dashboard")}
            className="text-white/60 hover:text-white transition-colors"
          >
            ← Back to Dashboard
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {favorites.map((city) => {
            const cityKey = `${city.cityName}-${city.countryCode}`;
            const isLoading = loadingCities[cityKey];
            const data = weatherData[cityKey];

            return (
              <div
                key={cityKey}
                className="glass-card p-4 hover:scale-[1.02] transition-all cursor-pointer group relative"
                onClick={() => !isLoading && handleCityClick(city)}
              >
                {/* Remove button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFavorite(city);
                  }}
                  className="absolute top-3 right-3 p-2 bg-red-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/20"
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>

                <div className="flex items-start gap-3">
                  {/* City icon */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-blue-500/20 rounded-lg blur-md"></div>
                    <div className="relative w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  {/* City info */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{city.cityName}</h3>
                    <p className="text-sm text-white/40">{city.countryCode}</p>

                    {/* Weather preview */}
                    {isLoading && (
                      <div className="flex items-center gap-2 mt-2">
                        <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
                        <span className="text-xs text-white/40">
                          Loading...
                        </span>
                      </div>
                    )}

                    {data && !isLoading && (
                      <div className="mt-2">
                        <div className="flex items-center gap-3">
                          <img
                            src={`https://openweathermap.org/img/wn/${data.current.icon}@2x.png`}
                            alt={data.current.condition}
                            className="w-10 h-10 -ml-2"
                          />
                          <div>
                            <span className="text-2xl font-light">
                              {Math.round(data.current.temperature)}°
                            </span>
                            <span className="text-sm text-white/40 ml-1">
                              {data.current.condition}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-4 mt-2 text-xs text-white/40">
                          <span>H: {Math.round(data.current.tempMax)}°</span>
                          <span>L: {Math.round(data.current.tempMin)}°</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Favorites;
