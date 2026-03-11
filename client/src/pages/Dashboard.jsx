import React, { useState, useEffect } from "react";
import { MapPin, RefreshCw } from "lucide-react";
import { useWeather } from "../context/WeatherContext";
import ForecastList from "../components/ForecastList";
import PrecipitationChart from "../components/PrecipitationChart";
import WindStatus from "../components/WindStatus";
import UVIndex from "../components/UVIndex";
import OtherCities from "../components/OtherCities";
import { Humidity, Visibility } from "../components/WeatherDetails";
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

  // Debug logs
  console.log("📊 forecast data:", forecast);
  console.log("🌤️ currentWeather data:", currentWeather);

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
            condition: weatherData.weather?.description || "Unknown",
            temperature: Math.round(weatherData.temperature),
            icon: getWeatherIconType(weatherData.weather?.icon),
            timezone: weatherData.timezone,
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

  // Helper to get icon type for OtherCities component
  const getWeatherIconType = (iconCode) => {
    if (!iconCode) return "sun";
    const code = iconCode.substring(0, 2);
    if (code === "01") return "sun";
    if (code === "02" || code === "03" || code === "04") return "cloud";
    if (code === "09" || code === "10") return "rain";
    if (code === "13") return "snow";
    return "cloud";
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
          timezone: weatherResponse.data?.timezone,
        };

        setCurrentWeather(transformedData);

        const forecastResponse = await getForecast(
          city.apiName,
          city.apiCountry,
        );
        if (forecastResponse.success) {
          // Add timezone from current weather to each forecast item
          const forecastWithTimezone = forecastResponse.data.map((item) => ({
            ...item,
            timezone: transformedData.timezone,
          }));
          setForecast(forecastWithTimezone);
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

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <main className="p-4 sm:p-6">
        {/* Tabs */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4 sm:space-x-6">
            {["today", "tomorrow", "next7days"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-xs sm:text-sm transition-all relative ${
                  activeTab === tab
                    ? "text-white font-medium"
                    : "text-white/50 hover:text-white"
                }`}
              >
                {tab === "next7days"
                  ? "Next 7 days"
                  : tab.charAt(0).toUpperCase() + tab.slice(1)}
                {activeTab === tab && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-[#4A90E2] to-[#5BA3F5] rounded-full"></span>
                )}
              </button>
            ))}
          </div>

          {lastUpdated && (
            <div className="hidden sm:flex items-center gap-3">
              <span className="text-xs text-white/30">
                {lastUpdated.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="p-2 bg-white/[0.03] hover:bg-white/[0.06] rounded-xl transition-all disabled:opacity-50 border border-white/[0.08]"
                title="Refresh"
              >
                <RefreshCw
                  className={`w-4 h-4 text-white/40 ${refreshing ? "animate-spin" : ""}`}
                />
              </button>
            </div>
          )}
        </div>

        {/* Favorites */}
        {showFavorites && !loading && (
          <div className="mb-6 animate-fade-in-up">
            <FavoritesList />
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl flex items-center gap-3">
            <div className="w-1 h-8 bg-red-500/50 rounded-full"></div>
            <p>{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="bg-white/[0.03] rounded-3xl p-12 text-center border border-white/[0.08] mb-6">
            <div className="relative w-16 h-16 mx-auto">
              <div className="absolute inset-0 border-4 border-[#4A90E2]/20 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-t-[#4A90E2] rounded-full animate-spin"></div>
            </div>
            <p className="mt-4 text-white/60 text-sm">Loading weather...</p>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-12 gap-4 sm:gap-6">
          {/* LEFT SECTION - 8 cols on desktop */}
          <div className="col-span-12 lg:col-span-8 space-y-4 sm:space-y-6">
            {/* Forecast Cards Row */}
            {!loading && forecast && forecast.length > 0 && (
              <div className="animate-fade-in-up">
                <ForecastList forecast={forecast} />
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && !currentWeather && !forecast?.length && (
              <EmptyState />
            )}

            {/* Bottom Grid - Wind, UV, Humidity, Visibility */}
            {!loading && currentWeather && (
              <div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in-up"
                style={{ animationDelay: "0.1s" }}
              >
                {/* Wind Status - Takes 2 cols on lg */}
                <div className="sm:col-span-2 lg:col-span-2">
                  {console.log("💨 Wind data:", currentWeather?.wind)}
                  <WindStatus windData={currentWeather?.wind} />
                </div>

                {/* UV Index */}
                <div>
                  {console.log("☀️ UV Index (mock):", 5.5)}
                  <UVIndex uvIndex={5.5} />
                </div>

                {/* Humidity */}
                <div>
                  {console.log("💧 Humidity:", currentWeather?.humidity)}
                  <Humidity humidity={currentWeather?.humidity || 84} />
                </div>

                {/* Visibility */}
                <div>
                  {console.log(
                    "👁️ Visibility raw:",
                    currentWeather?.visibility,
                  )}
                  <Visibility
                    visibility={
                      currentWeather?.visibility
                        ? (currentWeather.visibility / 1000).toFixed(1)
                        : 0.4
                    }
                  />
                </div>
              </div>
            )}

            {/* Global Map */}
            {!loading && (
              <div
                className="bg-white/[0.03] rounded-2xl p-5 border border-white/[0.08] hover:border-white/[0.12] transition-all animate-fade-in-up"
                style={{ animationDelay: "0.2s" }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-white">
                    Global Map
                  </h3>
                  <button className="text-xs text-white/40 hover:text-white/60 transition-colors">
                    View wide →
                  </button>
                </div>
                <div className="rounded-xl overflow-hidden">
                  <WeatherMap height="280px" />
                </div>
              </div>
            )}
          </div>

          {/* RIGHT SECTION - 4 cols on desktop */}
          <div className="col-span-12 lg:col-span-4 space-y-4 sm:space-y-6">
            {/* Forecast/Air Quality Toggle - Air Quality disabled */}
            <div className="flex items-center space-x-2 bg-white/[0.03] rounded-xl p-1 border border-white/[0.08]">
              <button className="flex-1 bg-gradient-to-r from-[#4A90E2] to-[#5BA3F5] text-white rounded-lg py-2 text-sm font-medium shadow-lg">
                Forecast
              </button>
              <button
                disabled
                className="flex-1 text-white/30 rounded-lg py-2 text-sm font-medium cursor-not-allowed relative group"
                title="Air quality data coming soon"
              >
                Air quality
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                  Coming soon
                </span>
              </button>
            </div>

            {/* Precipitation Chart */}
            {forecast && forecast.length > 0 && (
              <div
                className="animate-fade-in-up"
                style={{ animationDelay: "0.1s" }}
              >
                <PrecipitationChart forecast={forecast} />
              </div>
            )}

            {/* Other Cities */}
            <div
              className="animate-fade-in-up"
              style={{ animationDelay: "0.15s" }}
            >
              <OtherCities cities={otherCities} onCityClick={handleCityClick} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
