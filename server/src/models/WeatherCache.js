const mongoose = require("mongoose");

const weatherCacheSchema = new mongoose.Schema({
  cityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "City",
    required: true,
  },

  // Add this field
  timezone: {
    type: Number,
    required: false,
  },

  temperature: {
    type: Number,
    required: true,
  },
  feelsLike: Number,
  tempMin: Number,
  tempMax: Number,

  pressure: Number,
  humidity: {
    type: Number,
    min: 0,
    max: 100,
    required: true,
  },
  visibility: Number,

  wind: {
    speed: Number,
    direction: Number,
    gust: Number,
  },

  weather: {
    main: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
  },

  cloudiness: {
    type: Number,
    min: 0,
    max: 100,
  },

  rain: {
    oneHour: Number,
    threeHour: Number,
  },

  snow: {
    oneHour: Number,
    threeHour: Number,
  },

  sunrise: Date,
  sunset: Date,

  apiResponse: mongoose.Schema.Types.Mixed,

  fetchedAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

// Add TTL index for automatic expiration
weatherCacheSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
weatherCacheSchema.index({ cityId: 1, expiresAt: -1 });
weatherCacheSchema.index({ fetchedAt: -1 });

module.exports = mongoose.model("WeatherCache", weatherCacheSchema);
