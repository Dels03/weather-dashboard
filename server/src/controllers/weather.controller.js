const weatherService = require("../services/weatherService");

class WeatherController {
  async getCurrentWeather(req, res, next) {
    try {
      const { city, country } = req.query;

      if (!city) {
        return res.status(400).json({
          success: false,
          message: "City name is required",
        });
      }

      const weatherData = await weatherService.getCurrentWeather(city, country);

      res.json({
        success: true,
        data: weatherData,
      });
    } catch (error) {
      if (error.message === "City not found") {
        return res.status(404).json({
          success: false,
          message: "City not found",
        });
      }
      next(error);
    }
  }

  async getForecast(req, res, next) {
    try {
      const { city, country } = req.query;

      if (!city) {
        return res.status(400).json({
          success: false,
          message: "City name is required",
        });
      }

      const forecast = await weatherService.getForecast(city, country);

      res.json({
        success: true,
        data: forecast,
      });
    } catch (error) {
      if (error.message === "City not found") {
        return res.status(404).json({
          success: false,
          message: "City not found",
        });
      }
      next(error);
    }
  }

  /**
   * Get UV Index data for a city
   */
  async getUVIndex(req, res, next) {
    try {
      const { city, country } = req.query;

      if (!city) {
        return res.status(400).json({
          success: false,
          message: "City name is required",
        });
      }

      const uvData = await weatherService.getUVIndex(city, country);

      res.json({
        success: true,
        data: uvData,
      });
    } catch (error) {
      if (error.message === "City not found") {
        return res.status(404).json({
          success: false,
          message: "City not found",
        });
      }
      next(error);
    }
  }

  /**
   * Get air quality data for a city
   */
  async getAirQuality(req, res, next) {
    try {
      const { city, country } = req.query;

      if (!city) {
        return res.status(400).json({
          success: false,
          message: "City name is required",
        });
      }

      const airQuality = await weatherService.getAirQuality(city, country);

      res.json({
        success: true,
        data: airQuality,
      });
    } catch (error) {
      if (error.message === "City not found") {
        return res.status(404).json({
          success: false,
          message: "City not found",
        });
      }
      next(error);
    }
  }

  async searchCities(req, res, next) {
    try {
      const { query } = req.query;

      if (!query || query.length < 2) {
        return res.status(400).json({
          success: false,
          message: "Search query must be at least 2 characters",
        });
      }

      const cities = await weatherService.searchCities(query);

      res.json({
        success: true,
        data: cities,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new WeatherController();
