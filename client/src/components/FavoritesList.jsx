import React from "react";
import { Star, X, Loader2 } from "lucide-react";
import { useFavorites } from "../context/FavoritesContext";
import { getWeather, getForecast } from "../services/weatherApi";

const FavoritesList = ({
  setCurrentWeather,
  setForecast,
  setLoading,
  setError,
}) => {
  const { favorites, removeFavorite } = useFavorites();
  const [loadingCity, setLoadingCity] = React.useState(null);

  if (!favorites || favorites.length === 0) {
    return null;
  }

  const handleFavoriteClick = async (city) => {
    setLoadingCity(city.cityName);
    setLoading(true);
    setError(null);

    try {
      const [weatherData, forecastData] = await Promise.all([
        getWeather(city.cityName, city.countryCode),
        getForecast(city.cityName, city.countryCode),
      ]);

      setCurrentWeather(weatherData.data);
      setForecast(forecastData.data);
    } catch (error) {
      console.error("Failed to load favorite city:", error);
      setError(
        `Failed to load weather for ${city.cityName}. Please try again.`,
      );
    } finally {
      setLoadingCity(null);
      setLoading(false);
    }
  };

  const handleRemoveFavorite = (e, city) => {
    e.stopPropagation(); // Prevent triggering the city click
    removeFavorite(city);
  };

  return (
    <div className="mb-6">
      <div className="flex items-center space-x-2 mb-3">
        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
        <h3 className="text-sm font-semibold text-white">Favorite Cities</h3>
      </div>

      <div className="flex flex-wrap gap-2">
        {favorites.map((city, index) => (
          <button
            key={index}
            onClick={() => handleFavoriteClick(city)}
            disabled={loadingCity === city.cityName}
            className="group relative flex items-center bg-white/5 hover:bg-white/10 rounded-xl px-3 py-2 border border-white/10 hover:border-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {/* Loading Spinner */}
            {loadingCity === city.cityName && (
              <Loader2 className="w-3 h-3 text-blue-400 animate-spin mr-2" />
            )}

            {/* City Name */}
            <span className="text-sm text-white/80 group-hover:text-white transition-colors">
              {city.cityName}, {city.countryCode}
            </span>

            {/* Remove Button */}
            <button
              onClick={(e) => handleRemoveFavorite(e, city)}
              className="ml-2 p-0.5 rounded-md hover:bg-red-500/20 transition-colors group/remove"
              aria-label={`Remove ${city.cityName} from favorites`}
            >
              <X className="w-3 h-3 text-white/40 group-hover/remove:text-red-400 transition-colors" />
            </button>
          </button>
        ))}
      </div>
    </div>
  );
};

export default FavoritesList;
