const axios = require("axios");
const City = require("../models/City");
const WeatherCache = require("../models/WeatherCache");

class WeatherService {
  constructor() {
    this.apiKey = process.env.OPENWEATHER_API_KEY;
    this.baseUrl = process.env.OPENWEATHER_BASE_URL;
  }

  async getCurrentWeather(cityName, countryCode = null) {
    try {
      // Find or create city
      let city = await City.findOne({
        cityName: new RegExp(`^${cityName}$`, "i"),
        ...(countryCode && { countryCode }),
      });

      if (!city) {
        // Geocode the city
        const geoData = await this.geocodeCity(cityName, countryCode);
        city = await this.createCityFromGeocode(geoData);
      }

      // Check cache
      const cached = await WeatherCache.findOne({
        cityId: city._id,
        expiresAt: { $gt: new Date() },
      }).sort({ fetchedAt: -1 });

      if (cached) {
        console.log("Returning cached weather data for:", cityName);
        return cached;
      }

      console.log("Fetching fresh weather data for:", cityName);
      // Fetch from API
      const response = await axios.get(`${this.baseUrl}/weather`, {
        params: {
          lat: city.coordinates.coordinates[1],
          lon: city.coordinates.coordinates[0],
          appid: this.apiKey,
          units: "metric",
        },
      });

      // Create cache entry
      const weatherData = this.mapWeatherResponse(response.data, city._id);
      await weatherData.save();

      return weatherData;
    } catch (error) {
      console.error(
        "Weather Service Error:",
        error.response?.data || error.message,
      );
      throw error;
    }
  }

  async getForecast(cityName, countryCode = null) {
    try {
      const city = await City.findOne({
        cityName: new RegExp(`^${cityName}$`, "i"),
        ...(countryCode && { countryCode }),
      });

      if (!city) {
        throw new Error("City not found");
      }

      const response = await axios.get(`${this.baseUrl}/forecast`, {
        params: {
          lat: city.coordinates.coordinates[1],
          lon: city.coordinates.coordinates[0],
          appid: this.apiKey,
          units: "metric",
          cnt: 40,
        },
      });

      return this.mapForecastResponse(response.data);
    } catch (error) {
      console.error(
        "Forecast Service Error:",
        error.response?.data || error.message,
      );
      throw error;
    }
  }

  /**
   * Get UV Index data using OpenWeather One Call API 3.0
   * @param {string} cityName - City name
   * @param {string} countryCode - Optional country code
   * @returns {Object} UV Index data including current and forecast
   */
  async getUVIndex(cityName, countryCode = null) {
    try {
      // Find city coordinates
      const city = await City.findOne({
        cityName: new RegExp(`^${cityName}$`, "i"),
        ...(countryCode && { countryCode }),
      });

      if (!city) {
        throw new Error("City not found");
      }

      // Fetch One Call API data (includes UV index)
      const response = await axios.get(
        "https://api.openweathermap.org/data/3.0/onecall",
        {
          params: {
            lat: city.coordinates.coordinates[1],
            lon: city.coordinates.coordinates[0],
            appid: this.apiKey,
            units: "metric",
            exclude: "minutely,alerts", // Exclude data we don't need
          },
        },
      );

      return {
        current: response.data.current,
        hourly: response.data.hourly.slice(0, 24), // Next 24 hours
        daily: response.data.daily.slice(0, 7), // Next 7 days
      };
    } catch (error) {
      console.error(
        "UV Index Service Error:",
        error.response?.data || error.message,
      );
      throw error;
    }
  }

  /**
   * Get air quality data for a city
   * @param {string} cityName - City name
   * @param {string} countryCode - Optional country code
   * @returns {Object} Air quality data
   */
  async getAirQuality(cityName, countryCode = null) {
    try {
      // Find city coordinates
      const city = await City.findOne({
        cityName: new RegExp(`^${cityName}$`, "i"),
        ...(countryCode && { countryCode }),
      });

      if (!city) {
        throw new Error("City not found");
      }

      // Fetch air quality data from OpenWeather API
      const response = await axios.get(
        "https://api.openweathermap.org/data/2.5/air_pollution",
        {
          params: {
            lat: city.coordinates.coordinates[1],
            lon: city.coordinates.coordinates[0],
            appid: this.apiKey,
          },
        },
      );

      return response.data;
    } catch (error) {
      console.error(
        "Air Quality Service Error:",
        error.response?.data || error.message,
      );
      throw error;
    }
  }

  async searchCities(query) {
    try {
      // First, try to search in database
      const dbCities = await City.find({
        $text: { $search: query },
      }).limit(5);

      if (dbCities.length > 0) {
        return dbCities.map((city) => ({
          cityName: city.cityName,
          countryCode: city.countryCode,
          stateCode: city.stateCode,
          latitude: city.coordinates.coordinates[1],
          longitude: city.coordinates.coordinates[0],
        }));
      }

      // If not found in DB, search using OpenWeather Geocoding API
      const response = await axios.get(
        "https://api.openweathermap.org/geo/1.0/direct",
        {
          params: {
            q: query,
            limit: 5,
            appid: this.apiKey,
          },
        },
      );

      if (!response.data || response.data.length === 0) {
        return [];
      }

      // Map all responses
      const cities = response.data.map((city) => ({
        cityName: city.name,
        countryCode: city.country || "Unknown",
        stateCode: city.state,
        latitude: city.lat,
        longitude: city.lon,
      }));

      // Save new cities to database
      for (const cityData of response.data) {
        try {
          // Skip if no country code
          if (!cityData.country) continue;

          const existingCity = await City.findOne({
            cityName: cityData.name,
            countryCode: cityData.country,
          });

          if (!existingCity) {
            const newCity = new City({
              cityName: cityData.name,
              countryCode: cityData.country,
              stateCode: cityData.state,
              coordinates: {
                type: "Point",
                coordinates: [cityData.lon, cityData.lat],
              },
            });
            await newCity.save();
          }
        } catch (err) {
          // Continue even if save fails
          console.error("Error saving city:", err.message);
        }
      }

      return cities;
    } catch (error) {
      console.error(
        "Search cities error:",
        error.response?.data || error.message,
      );
      throw error;
    }
  }

  async geocodeCity(cityName, countryCode = null) {
    const response = await axios.get(
      "https://api.openweathermap.org/geo/1.0/direct",
      {
        params: {
          q: countryCode ? `${cityName},${countryCode}` : cityName,
          limit: 5,
          appid: this.apiKey,
        },
      },
    );

    if (!response.data || response.data.length === 0) {
      throw new Error("City not found");
    }

    // If country code is provided, try to find the matching country
    if (countryCode) {
      const matchingCity = response.data.find(
        (city) => city.country === countryCode,
      );
      if (matchingCity) {
        return matchingCity;
      }
    }

    // If no country match or no country code, return first result
    console.log(
      `Multiple cities found for ${cityName}, using: ${response.data[0].name}, ${response.data[0].country}`,
    );
    return response.data[0];
  }

  async createCityFromGeocode(geoData) {
    const city = new City({
      cityName: geoData.name,
      countryCode: geoData.country,
      stateCode: geoData.state,
      coordinates: {
        type: "Point",
        coordinates: [geoData.lon, geoData.lat],
      },
      openWeatherId: geoData.local_names?.openweathermap,
    });

    await city.save();
    return city;
  }

  mapWeatherResponse(data, cityId) {
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10); // 10 minute cache

    return new WeatherCache({
      cityId,
      timezone: data.timezone,

      temperature: data.main.temp,
      feelsLike: data.main.feels_like,
      tempMin: data.main.temp_min,
      tempMax: data.main.temp_max,
      pressure: data.main.pressure,
      humidity: data.main.humidity,
      visibility: data.visibility,
      wind: {
        speed: data.wind.speed,
        direction: data.wind.deg,
        gust: data.wind.gust,
      },
      weather: {
        main: data.weather[0].main,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
      },
      cloudiness: data.clouds?.all,
      rain: data.rain,
      snow: data.snow,
      sunrise: data.sys.sunrise,
      sunset: data.sys.sunset,
      apiResponse: data,
      fetchedAt: new Date(),
      expiresAt,
    });
  }

  /**
   * Map forecast response to include both daily aggregates and raw hourly data
   * @param {Object} data - Raw API response from OpenWeather
   * @returns {Object} Object containing daily forecasts and hourly data
   */
  mapForecastResponse(data) {
    const dailyForecasts = [];
    const forecastMap = new Map();

    // Group by day for daily forecast cards
    data.list.forEach((item) => {
      const date = new Date(item.dt * 1000).toDateString();

      if (!forecastMap.has(date)) {
        forecastMap.set(date, {
          date: new Date(item.dt * 1000),
          temps: [],
          weathers: [],
          items: [],
          pops: [],
        });
      }

      const dayData = forecastMap.get(date);
      dayData.temps.push(item.main.temp);
      dayData.weathers.push(item.weather[0]);
      dayData.items.push(item);
      dayData.pops.push(item.pop || 0);
    });

    // Calculate daily aggregates
    forecastMap.forEach((value) => {
      const tempHigh = Math.max(...value.temps);
      const tempLow = Math.min(...value.temps);

      const avgPop = value.pops.reduce((a, b) => a + b, 0) / value.pops.length;

      const weatherCounts = {};
      value.weathers.forEach((w) => {
        weatherCounts[w.main] = (weatherCounts[w.main] || 0) + 1;
      });
      const mainWeather = Object.keys(weatherCounts).reduce((a, b) =>
        weatherCounts[a] > weatherCounts[b] ? a : b,
      );

      const representativeWeather = value.weathers.find(
        (w) => w.main === mainWeather,
      );

      // Create a weather object with all necessary data
      const weatherData = {
        main: representativeWeather.main,
        description: representativeWeather.description,
        icon: representativeWeather.icon,
      };

      dailyForecasts.push({
        date: value.date,
        tempHigh,
        tempLow,
        weather: weatherData,
        humidity: value.items[0].main.humidity,
        windSpeed: value.items[0].wind.speed,
        pop: avgPop,
      });
    });

    // Return BOTH daily forecasts AND raw hourly data
    return {
      daily: dailyForecasts.slice(0, 5), // 5-day forecast for cards
      hourly: data.list.map((item) => ({
        dt: item.dt,
        date: new Date(item.dt * 1000).toISOString(),
        temp: item.main.temp,
        feelsLike: item.main.feels_like,
        tempMin: item.main.temp_min,
        tempMax: item.main.temp_max,
        pressure: item.main.pressure,
        humidity: item.main.humidity,
        weather: {
          main: item.weather[0].main,
          description: item.weather[0].description,
          icon: item.weather[0].icon,
        },
        wind: {
          speed: item.wind.speed,
          direction: item.wind.deg,
        },
        clouds: item.clouds?.all,
        pop: item.pop || 0,
      })), // Raw 3-hour data for precipitation chart
    };
  }
}

module.exports = new WeatherService();
