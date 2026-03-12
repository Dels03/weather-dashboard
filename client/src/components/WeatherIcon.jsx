import React from "react";

const WeatherIcon = ({ condition, icon, size = 48, className = "" }) => {
  const getEmoji = () => {
    const iconCode = icon || "";

    const emojiMap = {
      "01d": "☀️",
      "01n": "🌙",
      "02d": "⛅",
      "02n": "☁️", // Partly cloudy night
      "03d": "☁️", // Cloudy
      "03n": "☁️",
      "04d": "☁️", // Overcast
      "04n": "☁️",
      "09d": "🌧️", // Rain
      "09n": "🌧️",
      "10d": "🌦️", // Light rain
      "10n": "🌦️",
      "11d": "⛈️", // Thunderstorm
      "11n": "⛈️",
      "13d": "❄️", // Snow
      "13n": "❄️",
      "50d": "🌫️", // Fog
      "50n": "🌫️",
    };

    return emojiMap[iconCode] || "☀️";
  };

  return (
    <div
      className={`inline-flex items-center justify-center ${className}`}
      style={{ fontSize: `${size}px`, lineHeight: 1 }}
    >
      {getEmoji()}
    </div>
  );
};

export default WeatherIcon;
