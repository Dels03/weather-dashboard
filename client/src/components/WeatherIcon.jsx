import React from "react";
import * as Wi from "react-icons/wi"; // Weather Icons
import * as Lu from "lucide-react"; // Lucide icons as fallback

const WeatherIcon = ({ condition, icon, size = 48, className = "" }) => {
  const getIcon = () => {
    const iconCode = icon || "";
    const isDay = !iconCode.endsWith("n");

    // Map OpenWeather icon codes to Weather Icons (react-icons/wi)
    const iconMap = {
      "01d": Wi.WiDaySunny,
      "01n": Wi.WiNightClear,
      "02d": Wi.WiDayCloudy,
      "02n": Wi.WiNightAltPartlyCloudy,
      "03d": Wi.WiCloud,
      "03n": Wi.WiCloud,
      "04d": Wi.WiCloudy,
      "04n": Wi.WiCloudy,
      "09d": Wi.WiShowers,
      "09n": Wi.WiShowers,
      "10d": Wi.WiDayRain,
      "10n": Wi.WiNightRain,
      "11d": Wi.WiThunderstorm,
      "11n": Wi.WiThunderstorm,
      "13d": Wi.WiSnow,
      "13n": Wi.WiSnow,
      "50d": Wi.WiFog,
      "50n": Wi.WiFog,
    };

    // Check if we have a mapped icon
    if (iconMap[iconCode]) {
      return iconMap[iconCode];
    }

    // Fallback to Lucide icons
    const conditionLower = (condition || "").toLowerCase();
    if (conditionLower.includes("clear") || conditionLower.includes("sun"))
      return isDay ? Lu.Sun : Lu.Moon;
    if (conditionLower.includes("cloud")) return Lu.Cloud;
    if (conditionLower.includes("rain")) return Lu.CloudRain;
    if (conditionLower.includes("snow")) return Lu.CloudSnow;
    if (conditionLower.includes("thunder")) return Lu.CloudLightning;
    if (conditionLower.includes("drizzle")) return Lu.CloudDrizzle;
    if (conditionLower.includes("fog") || conditionLower.includes("mist"))
      return Lu.CloudFog;
    if (conditionLower.includes("wind")) return Lu.Wind;

    return isDay ? Lu.Sun : Lu.Moon;
  };

  const IconComponent = getIcon();

  // Determine color based on weather condition
  const getIconColor = () => {
    const iconCode = icon || "";
    if (iconCode.startsWith("01")) return "text-yellow-400"; // Sunny
    if (iconCode.startsWith("02")) return "text-yellow-300"; // Partly cloudy
    if (iconCode.startsWith("03") || iconCode.startsWith("04"))
      return "text-gray-400"; // Cloudy
    if (iconCode.startsWith("09") || iconCode.startsWith("10"))
      return "text-blue-400"; // Rain
    if (iconCode.startsWith("11")) return "text-purple-400"; // Thunder
    if (iconCode.startsWith("13")) return "text-blue-200"; // Snow
    if (iconCode.startsWith("50")) return "text-gray-300"; // Fog
    return "text-white";
  };

  // Get animation class
  const getAnimationClass = () => {
    const iconCode = icon || "";
    if (iconCode.startsWith("01")) return "animate-spin-slow"; // Sun rotates slowly
    if (iconCode.startsWith("02") || iconCode.startsWith("03"))
      return "animate-float"; // Clouds float
    if (iconCode.startsWith("09") || iconCode.startsWith("10"))
      return "animate-bounce-subtle"; // Rain drops bounce
    if (iconCode.startsWith("11")) return "animate-pulse"; // Thunder pulses
    if (iconCode.startsWith("13")) return "animate-snow"; // Snow falls
    return "";
  };

  return (
    <div className="relative inline-block">
      {/* Glow effect */}
      <div
        className={`absolute inset-0 rounded-full blur-xl opacity-30 ${getIconColor()}`}
      ></div>

      {/* Icon */}
      <IconComponent
        size={size}
        className={`relative z-10 ${getIconColor()} ${getAnimationClass()} ${className}`}
      />
    </div>
  );
};

// Add these animations to your index.css if not already there
const additionalStyles = `
@keyframes bounce-subtle {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

@keyframes snow {
  0% { transform: translateY(0) rotate(0deg); }
  100% { transform: translateY(10px) rotate(5deg); }
}

.animate-bounce-subtle {
  animation: bounce-subtle 2s ease-in-out infinite;
}

.animate-snow {
  animation: snow 3s ease-in-out infinite;
}
`;

export default WeatherIcon;
