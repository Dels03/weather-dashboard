const mongoose = require("mongoose");
const dotenv = require("dotenv");
const City = require("../models/City");

dotenv.config();

const cities = [
  {
    cityName: "New York",
    countryCode: "US",
    stateCode: "NY",
    coordinates: {
      type: "Point",
      coordinates: [-74.006, 40.7128],
    },
    timezone: "America/New_York",
    population: 8336817,
    openWeatherId: 5128581,
  },
  {
    cityName: "London",
    countryCode: "GB",
    coordinates: {
      type: "Point",
      coordinates: [-0.1278, 51.5074],
    },
    timezone: "Europe/London",
    population: 9002488,
    openWeatherId: 2643743,
  },
  {
    cityName: "Tokyo",
    countryCode: "JP",
    coordinates: {
      type: "Point",
      coordinates: [139.6503, 35.6762],
    },
    timezone: "Asia/Tokyo",
    population: 13960000,
    openWeatherId: 1850144,
  },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    await City.deleteMany({});
    console.log("Cleared cities collection");

    await City.insertMany(cities);
    console.log("Cities seeded successfully");

    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

seedDatabase();
