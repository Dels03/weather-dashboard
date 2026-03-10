const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

// Import routes
const weatherRoutes = require("./routes/weather.routes");

const app = express();

// Security middleware
app.use(helmet());
app.use(compression());

// CORS configuration
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    process.env.CLIENT_URL,
  ].filter(Boolean),
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
  optionsSuccessStatus: 200,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 60000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 60,
  message: "Too many requests from this IP, please try again later.",
});
app.use("/api/", limiter);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
app.use(morgan("dev"));

// Test endpoints
app.get("/api/test", (req, res) => {
  res.json({ success: true, message: "API test endpoint working!", timestamp: new Date() });
});

app.get("/api/test-cors", (req, res) => {
  res.json({
    success: true,
    message: "CORS is working correctly!",
    origin: req.headers.origin || "No origin header",
    timestamp: new Date(),
  });
});

// Routes
app.use("/api/weather", weatherRoutes);

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found", path: req.originalUrl });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error stack:", err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? { message: err.message, stack: err.stack } : {},
  });
});

// MongoDB connection - cache the connection for serverless
let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) return cachedDb;
  
  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI);
    cachedDb = connection;
    console.log("✅ MongoDB connected");
    return connection;
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    throw error;
  }
}

// Wrap routes to ensure DB connection
app.use("/api/weather", async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (error) {
    res.status(500).json({ error: "Database connection failed" });
  }
}, weatherRoutes);

// Export for Vercel serverless
module.exports = app;
