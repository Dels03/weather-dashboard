import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { RefreshCw } from "lucide-react";
import { useWeather } from "../context/WeatherContext";
import ForecastList from "../components/ForecastList";
import PrecipitationChart from "../components/PrecipitationChart";
import WindStatus from "../components/WindStatus";
import UVIndex from "../components/UVIndex";
import AirQuality from "../components/AirQuality";
import OtherCities from "../components/OtherCities";
import { Humidity, Visibility } from "../components/WeatherDetails";
import FavoritesList from "../components/FavoritesList";
import WeatherMap from "../components/WeatherMap";
import { getWeather, getForecast, getAirQuality } from "../services/weatherApi";

/**
 * MAJOR_CITIES - Configuration for the "Other Cities" section
 * Each city object contains:
 * @property {string} name - City name for API calls
 * @property {string} country - Country code for API calls
 * @property {string} id - Unique identifier for loading states
 */
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
  // ============================================================================
  // CONTEXT & STATE
  // ============================================================================
  const {
    currentWeather,
    forecast,
    loading,
    error,
    setCurrentWeather,
    setForecast,
    setLoading,
    setError,
  } = useWeather();

  // UI State
  const [activeTab, setActiveTab] = useState("next7days");
  const [activeRightTab, setActiveRightTab] = useState("forecast");
  const [showFavorites, setShowFavorites] = useState(true);
  const [otherCities, setOtherCities] = useState([]);
  const [loadingCities, setLoadingCities] = useState({});
  const [lastUpdated, setLastUpdated] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [airQuality, setAirQuality] = useState(null);
  const [loadingAirQuality, setLoadingAirQuality] = useState(false);

  // ============================================================================
  // INITIALIZATION
  // ============================================================================
  useEffect(() => {
    fetchMajorCitiesWeather();

    // Load default city (Manila) if no weather is loaded
    if (!currentWeather) {
      handleCityClick({
        apiName: "Manila",
        apiCountry: "PH",
        city: "Manila",
        country: "PH",
      });
    }
  }, []);

  // Fetch air quality whenever current weather changes
  useEffect(() => {
    if (currentWeather?.city && currentWeather?.country) {
      fetchAirQuality(currentWeather.city, currentWeather.country);
    }
  }, [currentWeather]);

  // ============================================================================
  // DATA FETCHING FUNCTIONS
  // ============================================================================

  /**
   * Fetches air quality data for the current city
   * @param {string} city - City name
   * @param {string} country - Country code
   */
  const fetchAirQuality = async (city, country) => {
    setLoadingAirQuality(true);
    try {
      const response = await getAirQuality(city, country);
      if (response?.success) {
        setAirQuality(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch air quality:", error);
    } finally {
      setLoadingAirQuality(false);
    }
  };

  /**
   * Fetches weather data for all major cities
   * Updates the otherCities state with real-time data
   */
  const fetchMajorCitiesWeather = async () => {
    const citiesData = [];

    for (const city of MAJOR_CITIES) {
      setLoadingCities((prev) => ({ ...prev, [city.id]: true }));

      try {
        const response = await getWeather(city.name, city.country);
        if (response?.success) {
          const weatherData = response.data;

          citiesData.push({
            id: city.id,
            country: weatherData.apiResponse?.sys?.country || city.country,
            city: weatherData.apiResponse?.name || city.name,
            condition: weatherData.weather?.description || "Unknown",
            temperature: Math.round(weatherData.temperature),
            icon: weatherData.weather?.icon,
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

  /**
   * Handles city selection from search or Other Cities list
   * Fetches weather, forecast, and air quality data
   * @param {Object} city - City object with apiName and apiCountry
   */
  const handleCityClick = async (city) => {
    // Prevent reloading the same city
    if (
      currentWeather?.city === city.city &&
      currentWeather?.country === city.country
    ) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const weatherResponse = await getWeather(city.apiName, city.apiCountry);
      if (weatherResponse?.success) {
        // Transform data to ensure consistent structure
        const transformedData = {
          ...weatherResponse.data,
          city: weatherResponse.data?.apiResponse?.name || city.city,
          country:
            weatherResponse.data?.apiResponse?.sys?.country || city.country,
          timezone: weatherResponse.data?.timezone || 0,
        };

        setCurrentWeather(transformedData);

        const forecastResponse = await getForecast(
          city.apiName,
          city.apiCountry,
        );
        if (forecastResponse?.success) {
          setForecast(forecastResponse.data);
        }

        // Air Quality will be fetched by the useEffect when currentWeather updates
      }
    } catch (error) {
      console.error("Error loading city weather:", error);
      setError("Failed to load weather data");
    } finally {
      setLoading(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  /**
   * Manual refresh for Other Cities section and air quality
   */
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchMajorCitiesWeather();
    if (currentWeather) {
      await fetchAirQuality(currentWeather.city, currentWeather.country);
    }
    setRefreshing(false);
  };

  // ============================================================================
  // SEO HELPER FUNCTIONS
  // ============================================================================

  /**
   * Generate dynamic page title based on current weather
   * @returns {string} SEO-friendly title
   */
  const getPageTitle = () => {
    if (currentWeather) {
      return `${currentWeather.city}, ${currentWeather.country} Weather - ${Math.round(currentWeather.temperature)}°C, ${currentWeather.weather?.description} | Weather Dashboard`;
    }
    return "Weather Dashboard - Current Weather & 5-Day Forecast";
  };

  /**
   * Generate dynamic meta description based on current weather
   * @returns {string} SEO-friendly description
   */
  const getPageDescription = () => {
    if (currentWeather && forecast?.daily?.[0]) {
      const today = forecast.daily[0];
      const tomorrow = forecast.daily[1];
      return `Current weather in ${currentWeather.city}: ${Math.round(currentWeather.temperature)}°C, ${currentWeather.weather?.description}. Today's high: ${Math.round(today.tempHigh)}°C, low: ${Math.round(today.tempLow)}°C. ${tomorrow ? `Tomorrow: ${Math.round(tomorrow.tempHigh)}°C / ${Math.round(tomorrow.tempLow)}°C.` : ""} 5-day forecast, air quality, and interactive weather map.`;
    }
    return "Check current weather conditions, air quality, and 5-day forecast for cities worldwide. Accurate weather data with interactive maps and detailed metrics.";
  };

  // ============================================================================
  // RENDER
  // ============================================================================
  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] light:bg-white text-gray-900 dark:text-white light:text-gray-900 transition-colors duration-300">
      {/* SEO Meta Tags */}
      <Helmet>
        <title>{getPageTitle()}</title>
        <meta name="description" content={getPageDescription()} />
        <meta
          name="keywords"
          content="weather, forecast, temperature, rain, wind, air quality, weather dashboard, 5-day forecast, current weather, AQI"
        />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:title" content={getPageTitle()} />
        <meta property="og:description" content={getPageDescription()} />
        <meta
          property="og:image"
          content="https://yourdomain.com/weather-preview.jpg"
        />
        <meta property="og:site_name" content="Weather Dashboard" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={getPageTitle()} />
        <meta name="twitter:description" content={getPageDescription()} />
        <meta
          name="twitter:image"
          content="https://yourdomain.com/weather-preview.jpg"
        />

        {/* Additional SEO */}
        <meta name="robots" content="index, follow" />
        <meta name="language" content="English" />
        <link rel="canonical" href={window.location.href} />
      </Helmet>

      <main className="p-3 sm:p-4 md:p-6 max-w-7xl mx-auto">
        {/* ==========================================================================
            TABS SECTION
            ========================================================================== */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-2 sm:gap-4 md:gap-6 overflow-x-auto pb-1 scrollbar-hide">
            {["today", "tomorrow", "next7days"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-xs sm:text-sm whitespace-nowrap transition-all relative py-1 ${
                  activeTab === tab
                    ? "text-gray-900 dark:text-white light:text-gray-900 font-medium"
                    : "text-gray-500 dark:text-white/50 light:text-gray-500 hover:text-gray-700 dark:hover:text-white light:hover:text-gray-700"
                }`}
              >
                {tab === "next7days"
                  ? "Next 5 days"
                  : tab.charAt(0).toUpperCase() + tab.slice(1)}
                {activeTab === tab && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-[#4A90E2] to-[#5BA3F5] rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* Last updated timestamp - hidden on mobile */}
          {lastUpdated && (
            <div className="hidden sm:flex items-center gap-2 md:gap-3 flex-shrink-0">
              <span className="text-xs text-gray-400 dark:text-white/30 light:text-gray-400">
                {lastUpdated.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="p-2 bg-white/5 dark:bg-white/5 light:bg-black/5 hover:bg-white/10 dark:hover:bg-white/10 light:hover:bg-black/10 rounded-xl transition-all disabled:opacity-50 border border-white/10 dark:border-white/10 light:border-black/10"
                title="Refresh data"
              >
                <RefreshCw
                  className={`w-4 h-4 text-gray-500 dark:text-white/40 light:text-gray-500 ${refreshing ? "animate-spin" : ""}`}
                />
              </button>
            </div>
          )}
        </div>

        {/* ==========================================================================
            FAVORITES SECTION
            ========================================================================== */}
        {showFavorites && !loading && (
          <div className="mb-4 sm:mb-6 animate-fade-in-up">
            <FavoritesList />
          </div>
        )}

        {/* ==========================================================================
            ERROR & LOADING STATES
            ========================================================================== */}
        {error && (
          <div className="mb-4 sm:mb-6 bg-red-500/10 border border-red-500/20 text-red-400 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl flex items-center gap-2 sm:gap-3">
            <div className="w-1 h-6 sm:h-8 bg-red-500/50 rounded-full flex-shrink-0" />
            <p className="text-xs sm:text-sm">{error}</p>
          </div>
        )}

        {loading && (
          <div className="bg-white/5 dark:bg-white/5 light:bg-black/5 rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-center border border-white/10 dark:border-white/10 light:border-black/10 mb-4 sm:mb-6">
            <div className="relative w-12 h-12 sm:w-16 sm:h-16 mx-auto">
              <div className="absolute inset-0 border-4 border-[#4A90E2]/20 rounded-full" />
              <div className="absolute inset-0 border-4 border-t-[#4A90E2] rounded-full animate-spin" />
            </div>
            <p className="mt-4 text-gray-500 dark:text-white/60 light:text-gray-500 text-xs sm:text-sm">
              Loading weather...
            </p>
          </div>
        )}

        {/* ==========================================================================
            MAIN CONTENT GRID
            ========================================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 md:gap-6">
          {/* ==========================================================================
              LEFT SECTION - 8 columns on desktop
              ========================================================================== */}
          <div className="lg:col-span-8 space-y-3 sm:space-y-4 md:space-y-6">
            {/* 5-Day Forecast Cards */}
            {!loading && forecast?.daily?.length > 0 && (
              <div className="animate-fade-in-up">
                <ForecastList
                  forecast={forecast.daily}
                  timezone={currentWeather?.timezone}
                />
              </div>
            )}

            {/* Weather Details Grid */}
            {!loading && currentWeather && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 animate-fade-in-up">
                {/* Wind Status - Full width on mobile, spans 2 cols on tablet+ */}
                <div className="sm:col-span-2">
                  <WindStatus
                    windData={currentWeather?.wind}
                    hourlyForecast={forecast?.hourly}
                  />
                </div>

                {/* UV Index - Mock data with note */}
                <div className="sm:col-span-1">
                  <UVIndex uvIndex={5.5} />
                </div>

                {/* Humidity */}
                <div className="sm:col-span-1">
                  <Humidity humidity={currentWeather?.humidity || 84} />
                </div>

                {/* Visibility */}
                <div className="sm:col-span-1">
                  <Visibility
                    visibility={
                      currentWeather?.visibility
                        ? (currentWeather.visibility / 1000).toFixed(1)
                        : "0.4"
                    }
                  />
                </div>
              </div>
            )}

            {/* Global Map */}
            {!loading && (
              <div className="bg-white/5 dark:bg-white/5 light:bg-black/5 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 border border-white/10 dark:border-white/10 light:border-black/10 hover:border-white/20 dark:hover:border-white/20 light:hover:border-black/20 transition-all animate-fade-in-up">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white light:text-gray-900">
                    Global Map
                  </h3>
                  <button className="text-xs text-gray-400 dark:text-white/40 light:text-gray-400 hover:text-gray-600 dark:hover:text-white/60 light:hover:text-gray-600 transition-colors">
                    View wide →
                  </button>
                </div>
                <div className="rounded-lg sm:rounded-xl overflow-hidden">
                  <WeatherMap
                    height={
                      typeof window !== "undefined" && window.innerWidth < 640
                        ? "200px"
                        : window.innerWidth < 1024
                          ? "240px"
                          : "280px"
                    }
                  />
                </div>
              </div>
            )}
          </div>

          {/* ==========================================================================
              RIGHT SECTION - 4 columns on desktop
              ========================================================================== */}
          <div className="lg:col-span-4 space-y-3 sm:space-y-4 md:space-y-6">
            {/* Forecast/Air Quality Toggle */}
            <div className="flex items-center space-x-2 bg-white/5 dark:bg-white/5 light:bg-black/5 rounded-xl p-1 border border-white/10 dark:border-white/10 light:border-black/10">
              <button
                onClick={() => setActiveRightTab("forecast")}
                className={`flex-1 rounded-lg py-2 text-xs sm:text-sm font-medium transition-all ${
                  activeRightTab === "forecast"
                    ? "bg-gradient-to-r from-[#4A90E2] to-[#5BA3F5] text-white shadow-lg"
                    : "text-gray-500 dark:text-white/50 light:text-gray-500 hover:text-gray-700 dark:hover:text-white light:hover:text-gray-700"
                }`}
              >
                Forecast
              </button>
              <button
                onClick={() => setActiveRightTab("airquality")}
                className={`flex-1 rounded-lg py-2 text-xs sm:text-sm font-medium transition-all ${
                  activeRightTab === "airquality"
                    ? "bg-gradient-to-r from-[#4A90E2] to-[#5BA3F5] text-white shadow-lg"
                    : "text-gray-500 dark:text-white/50 light:text-gray-500 hover:text-gray-700 dark:hover:text-white light:hover:text-gray-700"
                }`}
              >
                Air Quality
              </button>
            </div>

            {/* Conditional Content */}
            {activeRightTab === "forecast" ? (
              // Precipitation Chart
              forecast?.hourly?.length > 0 ? (
                <div className="animate-fade-in-up">
                  <PrecipitationChart forecast={forecast.hourly} />
                </div>
              ) : (
                <div className="bg-white/5 dark:bg-white/5 light:bg-black/5 border border-white/10 dark:border-white/10 light:border-black/10 rounded-2xl p-6">
                  <p className="text-sm text-gray-500 dark:text-white/40 light:text-gray-500 text-center">
                    No precipitation data available
                  </p>
                </div>
              )
            ) : (
              // Air Quality
              <div className="animate-fade-in-up">
                {loadingAirQuality ? (
                  <div className="bg-white/5 dark:bg-white/5 light:bg-black/5 border border-white/10 dark:border-white/10 light:border-black/10 rounded-2xl p-8 text-center">
                    <div className="relative w-12 h-12 mx-auto mb-3">
                      <div className="absolute inset-0 border-4 border-[#4A90E2]/20 rounded-full" />
                      <div className="absolute inset-0 border-4 border-t-[#4A90E2] rounded-full animate-spin" />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-white/40 light:text-gray-500">
                      Loading air quality...
                    </p>
                  </div>
                ) : (
                  <AirQuality data={airQuality} />
                )}
              </div>
            )}

            {/* Other Cities */}
            <div className="animate-fade-in-up">
              <OtherCities cities={otherCities} onCityClick={handleCityClick} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
