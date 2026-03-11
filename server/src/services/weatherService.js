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

  async searchCities(query) {
    try {
      // First, try to search in our database
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

      // Map all responses - don't filter out anything
      const cities = response.data.map((city) => ({
        cityName: city.name,
        countryCode: city.country || "Unknown",
        stateCode: city.state,
        latitude: city.lat,
        longitude: city.lon,
      }));

      // Save new cities to database (optional, for caching)
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
          // Continue even if save fails (don't block search results)
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

  mapForecastResponse(data) {
    const dailyForecasts = [];
    const forecastMap = new Map();

    // Group by day
    data.list.forEach((item) => {
      const date = new Date(item.dt * 1000).toDateString();

      if (!forecastMap.has(date)) {
        forecastMap.set(date, {
          date: new Date(item.dt * 1000),
          temps: [],
          weathers: [],
          items: [],
          pops: [], // ADD THIS LINE - store precipitation probabilities
        });
      }

      const dayData = forecastMap.get(date);
      dayData.temps.push(item.main.temp);
      dayData.weathers.push(item.weather[0]);
      dayData.items.push(item);
      dayData.pops.push(item.pop || 0); // ADD THIS LINE - collect pop values
    });

    // Calculate daily aggregates
    forecastMap.forEach((value) => {
      const tempHigh = Math.max(...value.temps);
      const tempLow = Math.min(...value.temps);

      // Calculate average pop for the day
      const avgPop = value.pops.reduce((a, b) => a + b, 0) / value.pops.length;

      // Get most frequent weather condition
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

      dailyForecasts.push({
        date: value.date,
        tempHigh,
        tempLow,
        condition: representativeWeather.main,
        description: representativeWeather.description,
        icon: representativeWeather.icon,
        humidity: value.items[0].main.humidity,
        windSpeed: value.items[0].wind.speed,
        pop: avgPop, // ADD THIS LINE - include pop in the response
      });
    });

    return dailyForecasts.slice(0, 5); // Return 5 days
  }
}

module.exports = new WeatherService();
