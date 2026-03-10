import React from "react";
import ReactDOM from "react-dom/client";
import { WeatherProvider } from "./context/WeatherContext";
import { ThemeProvider } from "./context/ThemeContext";
import { SettingsProvider } from "./context/SettingsContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <WeatherProvider>
      <ThemeProvider>
        <SettingsProvider>
          <FavoritesProvider>
            <App />
          </FavoritesProvider>
        </SettingsProvider>
      </ThemeProvider>
    </WeatherProvider>
  </React.StrictMode>,
);
