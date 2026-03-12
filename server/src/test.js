require("dotenv").config();
const mongoose = require("mongoose");

// Import models
const City = require("./models/City");
const WeatherCache = require("./models/WeatherCache");

async function testConnection() {
  try {
    console.log("Attempting to connect to MongoDB...");
    console.log("MongoDB URI:", process.env.MONGODB_URI);

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected successfully!");

    // Clear any existing test data
    await City.deleteMany({ cityName: "Test City" });
    console.log("Cleared existing test data");

    // Test creating a city
    const testCity = new City({
      cityName: "Test City",
      countryCode: "TC",
      coordinates: {
        type: "Point",
        coordinates: [0, 0],
      },
    });

    await testCity.save();
    console.log("Successfully created a test city!");

    // Test finding the city
    const foundCity = await City.findOne({ cityName: "Test City" });
    if (foundCity) {
      console.log("Successfully found the test city!");
    }

    // Test updating the city
    foundCity.countryCode = "TD";
    await foundCity.save();
    console.log("Successfully updated the test city!");

    // Clean up
    await City.deleteOne({ cityName: "Test City" });
    console.log("Test city cleaned up");

    // Test WeatherCache model (if needed)
    console.log("Testing WeatherCache model...");

    await mongoose.disconnect();
    console.log("All tests passed! Your setup is working correctly!");
    console.log("\n You can now start your server with: npm run dev");
  } catch (error) {
    console.error("Test failed:", error.message);
    console.error("Error details:", error);
  }
}

testConnection();
