import { WeatherProvider } from "./WeatherProvider";
import { ThemeProvider } from "./ThemeProvider";
import { FavoritesProvider } from "./FavoritesProvider";

export const AppProviders = ({ children }) => (
  <WeatherProvider>
    <ThemeProvider>
      <FavoritesProvider>{children}</FavoritesProvider>
    </ThemeProvider>
  </WeatherProvider>
);
