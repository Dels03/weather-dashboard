export const transformWeatherData = (weatherData) => {
  return {
    ...weatherData,
    city: weatherData.apiResponse?.name,
    country: weatherData.apiResponse?.sys?.country,
  };
};
