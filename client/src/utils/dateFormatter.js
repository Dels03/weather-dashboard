/**
 * Format a Unix timestamp to the local time of a specific city
 * @param {number} unixTimestamp - Unix timestamp in seconds
 * @param {number} timezone - Timezone offset in seconds from UTC
 * @param {Object} options - Formatting options
 * @returns {string} Formatted local time
 */
export const formatCityTime = (unixTimestamp, timezone, options = {}) => {
  if (!unixTimestamp) return "N/A";

  // Convert Unix timestamp (seconds) to milliseconds
  const utcTime = new Date(unixTimestamp * 1000);

  // Calculate city's local time using timezone offset
  // OpenWeather returns timezone in seconds from UTC
  const localTime = new Date(utcTime.getTime() + timezone * 1000);

  const defaultOptions = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    ...options,
  };

  return localTime.toLocaleString("en-US", defaultOptions);
};

/**
 * Format a Unix timestamp to show only time
 */
export const formatCityTimeOnly = (unixTimestamp, timezone) => {
  return formatCityTime(unixTimestamp, timezone, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

/**
 * Format a Unix timestamp to show full date and time
 */
export const formatCityDateTime = (unixTimestamp, timezone) => {
  return formatCityTime(unixTimestamp, timezone, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

/**
 * Get current time in a specific city
 * @param {number} timezone - Timezone offset in seconds from UTC
 * @returns {string} Current time in city
 */
export const getCurrentCityTime = (timezone) => {
  const now = new Date();
  // Get current UTC time in milliseconds, add timezone offset
  const utcNow = Date.now() + now.getTimezoneOffset() * 60000;
  const cityTime = new Date(utcNow + timezone * 1000);

  return cityTime.toLocaleTimeString("en-US", {
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};
