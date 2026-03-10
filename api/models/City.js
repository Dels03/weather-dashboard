const mongoose = require("mongoose");

const citySchema = new mongoose.Schema({
  cityName: {
    type: String,
    required: true,
    trim: true,
  },
  countryCode: {
    type: String,
    required: true,
    uppercase: true,
    match: /^[A-Z]{2}$/,
  },
  stateCode: String,

  coordinates: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
      default: "Point",
    },
    coordinates: {
      type: [Number],
      required: true,
      validate: {
        validator: function (coords) {
          return (
            coords.length === 2 &&
            coords[0] >= -180 &&
            coords[0] <= 180 &&
            coords[1] >= -90 &&
            coords[1] <= 90
          );
        },
        message: "Invalid coordinates",
      },
    },
  },

  timezone: String,
  population: Number,
  openWeatherId: Number,

  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

citySchema.pre("save", function () {
  this.updatedAt = Date.now();
});

// Create indexes
citySchema.index(
  { cityName: 1, countryCode: 1, stateCode: 1 },
  { unique: true, sparse: true },
);
citySchema.index({ openWeatherId: 1 }, { unique: true, sparse: true });
citySchema.index({ cityName: "text" });
citySchema.index({ coordinates: "2dsphere" });
citySchema.index({ countryCode: 1 });

module.exports = mongoose.model("City", citySchema);
