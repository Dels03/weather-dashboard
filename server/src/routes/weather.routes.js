const express = require("express");
const router = express.Router();
const weatherController = require("../controllers/weather.controller");

// Weather API endpoints
router.get("/current", weatherController.getCurrentWeather);
router.get("/forecast", weatherController.getForecast);
router.get("/search", weatherController.searchCities);

// Test endpoints
router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Weather API test endpoint working!",
    timestamp: new Date(),
  });
});

module.exports = router;
