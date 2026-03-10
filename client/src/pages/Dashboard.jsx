import React, { useState, useEffect } from "react";
import { MapPin, RefreshCw } from "lucide-react";
import { useWeather } from "../context/WeatherContext";
import ForecastList from "../components/ForecastList";
import PrecipitationChart from "../components/PrecipitationChart";
import FavoritesList from "../components/FavoritesList";
import EmptyState from "../components/EmptyState";
import WeatherMap from "../components/WeatherMap";
import { getWeather, getForecast } from "../services/weatherApi";

// Major world cities to display
const MAJOR_CITIES = [
  { name: "New York", country: "US", id: "new-york" },
  { name: "London", country: "GB", id: "london" },
  { name: "Tokyo", country: "JP", id: "tokyo" },
  { name: "Paris", country: "FR", id: "paris" },
  { name: "Sydney", country: "AU", id: "sydney" },
  { name: "Dubai", country: "AE", id: "dubai" },
  { name: "Singapore", country: "SG", id: "singapore" },
  { name: "Moscow", country: "RU", id: "moscow" },
];

const Dashboard = () => {
  const {
    currentWeather,
    forecast,
    loading,
    error,
    setCurrentWeather,
    setForecast,
    setLoading,
  } = useWeather();
  const [activeTab, setActiveTab] = useState("next7days");
  const [showFavorites, setShowFavorites] = useState(true);
  const [otherCities, setOtherCities] = useState([]);
  const [loadingCities, setLoadingCities] = useState({});
  const [lastUpdated, setLastUpdated] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch major cities weather on mount
  useEffect(() => {
    fetchMajorCitiesWeather();
  }, []);

  const fetchMajorCitiesWeather = async () => {
    const citiesData = [];

    for (const city of MAJOR_CITIES) {
      setLoadingCities((prev) => ({ ...prev, [city.id]: true }));

      try {
        const response = await getWeather(city.name, city.country);
        if (response.success) {
          const weatherData = response.data;

          citiesData.push({
            id: city.id,
            country: weatherData.apiResponse?.sys?.country || city.country,
            city: weatherData.apiResponse?.name || city.name,
            condition: weatherData.weather?.main || "Unknown",
            description: weatherData.weather?.description || "",
            temperature: weatherData.temperature,
            feelsLike: weatherData.feelsLike,
            humidity: weatherData.humidity,
            windSpeed: weatherData.wind?.speed || 0,
            windDirection: weatherData.wind?.direction || 0,
            icon: getWeatherIcon(weatherData.weather?.icon),
            iconCode: weatherData.weather?.icon,
            coordinates: weatherData.coordinates,
            sunrise: weatherData.sunrise,
            sunset: weatherData.sunset,
            pressure: weatherData.pressure,
            visibility: weatherData.visibility,
            timezone: weatherData.timezone,
            tempMin: weatherData.tempMin,
            tempMax: weatherData.tempMax,
            apiName: city.name,
            apiCountry: city.country,
          });
        }
      } catch (error) {
        console.error(`Failed to fetch ${city.name}:`, error);
      } finally {
        setLoadingCities((prev) => ({ ...prev, [city.id]: false }));
      }
    }

    setOtherCities(citiesData);
    setLastUpdated(new Date());
  };

  // Helper to get emoji icon based on weather code
  const getWeatherIcon = (iconCode) => {
    if (!iconCode) return "â˜€ï¸";
    const code = iconCode.substring(0, 2);
    if (code === "01") return "â˜€ï¸";
    if (code === "02") return "â›…";
    if (code === "03") return "â˜ï¸";
    if (code === "04") return "â˜ï¸";
    if (code === "09") return "í¼§ï¸";
    if (code === "10") return "í¼¦ï¸";
    if (code === "11") return "â›ˆï¸";
    if (code === "13") return "â„ï¸";
    if (code === "50") return "í¼«ï¸";
    return "â˜€ï¸";
  };

  // Handle click on a major city
  const handleCityClick = async (city) => {
    if (
      currentWeather?.city === city.city &&
      currentWeather?.country === city.country
    ) {
      return;
    }

    setLoading(true);
    try {
      const weatherResponse = await getWeather(city.apiName, city.apiCountry);
      if (weatherResponse.success) {
        const transformedData = {
          ...weatherResponse.data,
          city: weatherResponse.data?.apiResponse?.name,
          country: weatherResponse.data?.apiResponse?.sys?.country,
        };
        
        setCurrentWeather(transformedData);

        const forecastResponse = await getForecast(
          city.apiName,
          city.apiCountry,
        );
        if (forecastResponse.success) {
          setForecast(forecastResponse.data);
        }
      }
    } catch (error) {
      console.error("Error loading city weather:", error);
    } finally {
      setLoading(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchMajorCitiesWeather();
    setRefreshing(false);
  };

  // Loading skeleton for city cards
  const CitySkeleton = () => (
    <div className="bg-white/5 rounded-2xl p-4 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-white/10 rounded w-16"></div>
          <div className="h-6 bg-white/10 rounded w-24"></div>
          <div className="h-3 bg-white/10 rounded w-20"></div>
        </div>
        <div className="w-12 h-12 bg-white/10 rounded-full"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <main className="p-6">
        {/* Tabs and refresh */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-6">
            {["today", "tomorrow", "next7days"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-sm transition-all relative ${
                  activeTab === tab
                    ? "text-white"
                    : "text-white/50 hover:text-white"
                }`}
              >
                {tab === "next7days"
                  ? "Next 7 days"
                  : tab.charAt(0).toUpperCase() + tab.slice(1)}
                {activeTab === tab && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></span>
                )}
              </button>
            ))}
          </div>

          {lastUpdated && (
            <div className="flex items-center gap-4">
              <span className="text-xs text-white/30">
                Updated {lastUpdated.toLocaleTimeString()}
              </span>
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-all disabled:opacity-50"
                title="Refresh cities"
              >
                <RefreshCw
                  className={`w-4 h-4 text-white/40 ${refreshing ? "animate-spin" : ""}`}
                />
              </button>
            </div>
          )}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left Section - Main Content */}
          <div className="col-span-12 lg:col-span-8 space-y-6">
            {showFavorites && (
              <div className="animate-slide-down">
                <FavoritesList />
              </div>
            )}

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl flex items-center gap-3">
                <div className="w-1 h-8 bg-red-500/50 rounded-full"></div>
                <p>{error}</p>
              </div>
            )}

            {loading && (
              <div className="bg-white/5 rounded-3xl p-12 text-center border border-white/10">
                <div className="relative w-20 h-20 mx-auto">
                  <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-t-blue-500 rounded-full animate-spin"></div>
                </div>
                <p className="mt-4 text-white/60">Loading weather data...</p>
              </div>
            )}

            {/* Main Forecast Display - Now using ForecastList only */}
            {!loading && forecast && forecast.length > 0 && (
              <div className="animate-fade-in-up">
                <ForecastList forecast={forecast} />
              </div>
            )}

            {!loading && !error && !currentWeather && <EmptyState />}

            {/* Global Map */}
            <div className="bg-white/5 rounded-3xl p-6 border border-white/10 hover:border-white/20 transition-all group">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
                  <h3 className="text-lg font-semibold">Global Map</h3>
                </div>
                <button
                  onClick={() => {
                    // Map reset handled internally
                  }}
                  className="text-sm text-white/40 hover:text-white/60 transition-colors flex items-center gap-1"
                >
                  Reset view <span className="text-lg">â†º</span>
                </button>
              </div>
              <WeatherMap height="320px" />
            </div>
          </div>

          {/* Right Section - Sidebar */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            {/* Quick Actions */}
            <div className="flex items-center space-x-2 bg-white/5 rounded-xl p-1 border border-white/10">
              <button className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg py-2 text-sm font-medium shadow-lg">
                Forecast
              </button>
              <button className="flex-1 text-white/60 hover:text-white rounded-lg py-2 text-sm font-medium transition-colors">
                Air quality
              </button>
            </div>

            {/* Precipitation Chart */}
            {forecast && forecast.length > 0 && (
              <PrecipitationChart forecast={forecast} />
            )}

            {/* Major Cities */}
            <div className="bg-white/5 rounded-3xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-6 bg-gradient-to-b from-yellow-400 to-orange-500 rounded-full"></div>
                  <h3 className="text-sm font-semibold">Major Cities</h3>
                  <span className="text-[10px] text-white/30 bg-white/5 px-2 py-0.5 rounded-full">
                    Live
                  </span>
                </div>
                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="text-xs text-white/40 hover:text-white/60 transition-colors flex items-center gap-1"
                >
                  <RefreshCw
                    className={`w-3 h-3 ${refreshing ? "animate-spin" : ""}`}
                  />
                  Refresh
                </button>
              </div>

              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1 custom-scrollbar">
                {loadingCities &&
                Object.values(loadingCities).some(Boolean) &&
                otherCities.length === 0
                  ? Array(5)
                      .fill(0)
                      .map((_, i) => <CitySkeleton key={i} />)
                  : otherCities.map((city) => (
                      <div
                        key={city.id}
                        onClick={() => handleCityClick(city)}
                        className="group relative bg-white/5 hover:bg-white/10 rounded-2xl p-4 transition-all cursor-pointer border border-white/10 hover:border-white/20"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-blue-500/5 group-hover:via-purple-500/5 group-hover:to-pink-500/5 rounded-2xl transition-all"></div>

                        <div className="relative z-10">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-white/30" />
                              <span className="text-xs text-white/40">
                                {city.country}
                              </span>
                            </div>
                            <div className="text-xs text-white/30">Now</div>
                          </div>

                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <div className="font-medium group-hover:text-blue-400 transition-colors text-lg">
                                {city.city}
                              </div>
                              <div className="text-xs text-white/40 mt-0.5">
                                {city.condition || "..."}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="text-3xl filter drop-shadow-lg">
                                {city.icon}
                              </div>
                              <div className="text-2xl font-light text-white">
                                {city.temperature}Â°
                              </div>
                            </div>
                          </div>

                          {/* Weather details */}
                          <div className="flex items-center gap-4 mt-3 pt-2 border-t border-white/5">
                            <div className="flex items-center gap-1">
                              <span className="text-xs text-white/30">í²§</span>
                              <span className="text-xs text-white/60">
                                {city.humidity}%
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-xs text-white/30">í²¨</span>
                              <span className="text-xs text-white/60">
                                {city.windSpeed} km/h
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
              </div>

              <button className="w-full mt-4 py-2 text-xs text-white/30 hover:text-white/50 transition-colors border-t border-white/5">
                View all cities â†’
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
