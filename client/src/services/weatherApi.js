import api from "./api";

export const searchCities = async (query) => {
  try {
    const response = await api.get("/weather/search", {
      params: { query },
    });
    return response.data;
  } catch (error) {
    console.error("Search cities error:", error);
    throw error;
  }
};

export const getWeather = async (city, country = null) => {
  try {
    const response = await api.get("/weather/current", {
      params: { city, country },
    });

    const weatherData = response.data;

    // If the weather data doesn't have coordinates, try to get them from search
    if (weatherData.data && !weatherData.data.coordinates) {
      try {
        const searchResults = await searchCities(city);
        if (searchResults.data && searchResults.data.length > 0) {
          const cityData = searchResults.data[0];
          weatherData.data.coordinates = {
            lat: cityData.latitude,
            lon: cityData.longitude,
          };
        }
      } catch (searchError) {
        console.warn("Could not fetch coordinates for city:", city);
      }
    }

    return weatherData;
  } catch (error) {
    console.error("Get weather error:", error);
    throw error;
  }
};

export const getForecast = async (city, country = null) => {
  try {
    const response = await api.get("/weather/forecast", {
      params: { city, country },
    });
    return response.data;
  } catch (error) {
    console.error("Get forecast error:", error);
    throw error;
  }
};

// New function to get weather by coordinates (useful for geolocation)
export const getWeatherByCoords = async (lat, lon) => {
  try {
    // First, reverse geocode to get city name
    const geoResponse = await fetch(
      `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=9c6b94cfd46dca3ede6fdd9b1053dbca`,
    );

    if (!geoResponse.ok) {
      throw new Error("Failed to get location name");
    }

    const geoData = await geoResponse.json();

    if (!geoData || geoData.length === 0) {
      throw new Error("Location not found");
    }

    const location = geoData[0];

    // Then get weather for that city
    return await getWeather(location.name, location.country);
  } catch (error) {
    console.error("Get weather by coordinates error:", error);
    throw error;
  }
};
