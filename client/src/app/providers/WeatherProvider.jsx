import { WeatherProvider as OriginalWeatherProvider } from "../../context/WeatherContext";

export const WeatherProvider = ({ children }) => {
  return <OriginalWeatherProvider>{children}</OriginalWeatherProvider>;
};
