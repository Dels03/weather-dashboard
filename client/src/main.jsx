import React from "react";
import ReactDOM from "react-dom/client";
import { HelmetProvider } from "react-helmet-async"; // Add this import
import { WeatherProvider } from "./context/WeatherContext";
import { ThemeProvider } from "./context/ThemeContext";
import { SettingsProvider } from "./context/SettingsContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HelmetProvider>
      {" "}
      {/* Wrap everything with HelmetProvider */}
      <WeatherProvider>
        <ThemeProvider>
          <SettingsProvider>
            <FavoritesProvider>
              <App />
            </FavoritesProvider>
          </SettingsProvider>
        </ThemeProvider>
      </WeatherProvider>
    </HelmetProvider>
  </React.StrictMode>,
);
