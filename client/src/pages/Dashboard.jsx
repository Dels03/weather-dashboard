import { useState, useEffect } from "react";
import { useWeather } from "../context/WeatherContext";
import { useTheme } from "../context/ThemeContext";
import WeatherCard from "../components/WeatherCard";
import ForecastCard from "../components/ForecastCard";
import SearchBar from "../components/SearchBar";
import FavoritesList from "../components/FavoritesList";
import { MapPin, RefreshCw, AlertCircle } from "lucide-react";

const Dashboard = () => {
  const { 
    currentWeather, 
    forecast, 
    loading, 
    error, 
    refreshWeather,
    unit 
  } = useWeather();
  
  const { isDark } = useTheme();
  const [showFavorites, setShowFavorites] = useState(true);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/60">Loading weather data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card p-8 max-w-md text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
          <p className="text-white/60 mb-6">{error}</p>
          <button
            onClick={refreshWeather}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 mx-auto"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="relative h-[40vh] min-h-[300px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20"></div>
          <div className="absolute inset-0 backdrop-blur-3xl"></div>
        </div>

        <div className="relative z-10 text-center px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Weather Dashboard
          </h1>
          <p className="text-xl text-white/60 mb-8">
            Real-time weather updates for cities worldwide
          </p>
          
          <div className="max-w-2xl mx-auto">
            <SearchBar />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {showFavorites && (
            <div className="lg:w-80">
              <FavoritesList />
            </div>
          )}

          <div className="flex-1">
            {currentWeather && (
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-400" />
                  <span className="text-lg">
                    {currentWeather.city}, {currentWeather.country}
                  </span>
                </div>
                <button
                  onClick={refreshWeather}
                  className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
                  title="Refresh"
                >
                  <RefreshCw className="w-4 h-4 text-white/60" />
                </button>
              </div>
            )}

            {currentWeather && (
              <div className="mb-8">
                <WeatherCard weather={currentWeather} unit={unit} />
              </div>
            )}

            {forecast && forecast.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4">5-Day Forecast</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  {forecast.map((day, index) => (
                    <ForecastCard key={index} forecast={day} unit={unit} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
