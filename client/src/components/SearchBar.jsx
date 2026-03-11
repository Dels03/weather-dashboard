import React, { useState, useCallback, useRef, useEffect } from "react";
import { Search, MapPin, X, Loader2, History } from "lucide-react";
import { searchCities, getWeather, getForecast } from "../services/weatherApi";
import debounce from "lodash/debounce";
import { useWeather } from "../context/WeatherContext";

const SearchBar = () => {
  const { setCurrentWeather, setForecast, setLoading, setError } = useWeather();
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);

  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("recentSearches");
    if (saved) {
      setRecentSearches(JSON.parse(saved).slice(0, 5));
    }
  }, []);

  // Save recent search
  const saveRecentSearch = (city) => {
    const updated = [
      { name: city.cityName, country: city.countryCode, timestamp: Date.now() },
      ...recentSearches.filter((s) => s.name !== city.cityName),
    ].slice(0, 5);

    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  };

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const debouncedSearch = useCallback(
    debounce(async (query) => {
      if (query.length < 2) {
        setSuggestions([]);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      try {
        const results = await searchCities(query);
        setSuggestions(results.data || []);
      } catch (error) {
        console.error("Search error:", error);
        setSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    }, 300),
    [],
  );

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setShowSuggestions(true);

    if (query.length >= 2) {
      setIsSearching(true);
      debouncedSearch(query);
    } else {
      setSuggestions([]);
      setIsSearching(false);
    }
  };

  const handleSelectCity = async (city) => {
    setSearchQuery(city.cityName);
    setShowSuggestions(false);
    setSuggestions([]);
    saveRecentSearch(city);

    setLoading(true);
    setError(null);

    try {
      const [weatherData, forecastData] = await Promise.all([
        getWeather(city.cityName, city.countryCode),
        getForecast(city.cityName, city.countryCode),
      ]);

      // Transform the weather data to include city/country at root level
      const transformedData = {
        ...weatherData.data,
        city: weatherData.data.apiResponse?.name,
        country: weatherData.data.apiResponse?.sys?.country,
      };

      setCurrentWeather(transformedData);
      setForecast(forecastData.data);
    } catch (error) {
      setError("Failed to fetch weather data. Please try again.");
      console.error("Weather fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setShowSuggestions(false);
    setLoading(true);
    setError(null);

    try {
      const [weatherData, forecastData] = await Promise.all([
        getWeather(searchQuery),
        getForecast(searchQuery),
      ]);

      // Transform the weather data
      const transformedData = {
        ...weatherData.data,
        city: weatherData.data.apiResponse?.name,
        country: weatherData.data.apiResponse?.sys?.country,
      };

      setCurrentWeather(transformedData);
      setForecast(forecastData.data);
    } catch (error) {
      setError("City not found. Please check the name and try again.");
      console.error("Weather fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSuggestions([]);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          // You'll need to implement reverse geocoding here
          setError("Geolocation feature coming soon!");
        } catch (error) {
          setError("Failed to get weather for your location");
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError("Unable to retrieve your location");
        setLoading(false);
      },
    );
  };

  return (
    <div className="relative flex-1 max-w-xl">
      <form onSubmit={handleSearch}>
        {/* Search Input - Enhanced */}
        <div className="relative group">
          {/* Gradient border on focus */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 blur-sm"></div>

          {/* Input container */}
          <div className="relative flex items-center">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 group-focus-within:text-blue-400 transition-colors" />

            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Search for a city..."
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-20 py-3 text-sm text-white placeholder-white/40 focus:outline-none focus:border-white/20 focus:bg-white/10 transition-all group-focus-within:bg-white/10"
              minLength="2"
            />

            {/* Right side icons */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
              {isSearching && (
                <Loader2 className="w-4 h-4 text-white/40 animate-spin" />
              )}
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-3.5 h-3.5 text-white/40" />
                </button>
              )}
              <button
                type="button"
                onClick={handleGeolocation}
                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors group/geo"
                title="Use my location"
              >
                <MapPin className="w-4 h-4 text-white/40 group-hover/geo:text-blue-400 transition-colors" />
              </button>
            </div>
          </div>
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && (
          <div
            ref={dropdownRef}
            className="absolute z-50 w-full mt-2 glass-card overflow-hidden animate-fade-in-up"
            style={{ animationDuration: "0.2s" }}
          >
            {/* Recent searches section */}
            {searchQuery.length < 2 && recentSearches.length > 0 && (
              <div className="p-2 border-b border-white/10">
                <div className="flex items-center gap-2 px-3 py-2">
                  <History className="w-3.5 h-3.5 text-white/30" />
                  <span className="text-xs font-medium text-white/40 uppercase tracking-wider">
                    Recent Searches
                  </span>
                </div>
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() =>
                      handleSelectCity({
                        cityName: search.name,
                        countryCode: search.country,
                      })
                    }
                    className="w-full px-3 py-2.5 hover:bg-white/5 transition-colors rounded-lg flex items-center gap-3 group"
                  >
                    <History className="w-3.5 h-3.5 text-white/20 group-hover:text-white/40 transition-colors" />
                    <span className="text-sm text-white/70 group-hover:text-white">
                      {search.name}, {search.country}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* Search results */}
            {suggestions.length > 0 ? (
              <ul className="max-h-80 overflow-y-auto">
                {suggestions.map((city, index) => (
                  <li
                    key={`${city.cityName}-${index}`}
                    onClick={() => handleSelectCity(city)}
                    className="px-4 py-3 hover:bg-white/10 cursor-pointer transition-all border-b border-white/5 last:border-b-0 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <MapPin className="relative z-10 w-4 h-4 text-white/40 group-hover:text-blue-400 transition-colors" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-white text-sm font-medium group-hover:text-blue-400 transition-colors">
                            {city.cityName}
                          </p>
                          {city.stateCode && (
                            <span className="text-xs text-white/30">
                              {city.stateCode}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-white/40 group-hover:text-white/60 transition-colors">
                          {city.countryCode}
                        </p>
                      </div>
                      {/* Quick weather preview (you can add this later) */}
                      <span className="text-xs text-white/20 group-hover:text-white/40 transition-colors">
                        ⚡
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              searchQuery.length >= 2 &&
              !isSearching && (
                <div className="px-4 py-8 text-center">
                  <p className="text-sm text-white/30">No cities found</p>
                  <p className="text-xs text-white/20 mt-1">
                    Try a different search term
                  </p>
                </div>
              )
            )}

            {/* Loading state */}
            {isSearching && (
              <div className="px-4 py-8 text-center">
                <Loader2 className="w-6 h-6 text-white/20 animate-spin mx-auto mb-2" />
                <p className="text-xs text-white/30">Searching cities...</p>
              </div>
            )}
          </div>
        )}
      </form>
    </div>
  );
};

export default SearchBar;
