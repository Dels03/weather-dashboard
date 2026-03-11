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
  if (!unixTimestamp) return "N/A";

  const utcTime = new Date(unixTimestamp * 1000);
  const cityDate = new Date(utcTime.getTime() + timezone * 1000);

  const hours = cityDate.getUTCHours();
  const minutes = cityDate.getUTCMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  const displayHours = (hours % 12 || 12).toString().padStart(2, "0");

  return `${displayHours}:${minutes} ${ampm}`;
};

/**
 * Format a Unix timestamp to show full date and time
 */
export const formatCityDateTime = (unixTimestamp, timezone) => {
  if (!unixTimestamp) return "N/A";

  const utcTime = new Date(unixTimestamp * 1000);
  const cityDate = new Date(utcTime.getTime() + timezone * 1000);

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayName = days[cityDate.getUTCDay()];
  const monthName = months[cityDate.getUTCMonth()];
  const day = cityDate.getUTCDate();
  const year = cityDate.getUTCFullYear();

  const hours = cityDate.getUTCHours();
  const minutes = cityDate.getUTCMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  const displayHours = (hours % 12 || 12).toString().padStart(2, "0");

  return `${dayName}, ${monthName} ${day}, ${year} at ${displayHours}:${minutes} ${ampm}`;
};

/**
 * Get current time in a specific city - FIXED VERSION
 * @param {number} timezone - Timezone offset in seconds from UTC
 * @returns {string} Current time in city
 */
export const getCurrentCityTime = (timezone) => {
  // Handle missing timezone
  if (timezone === undefined || timezone === null) {
    const now = new Date();
    return now.toLocaleTimeString("en-US", {
      weekday: "long",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }

  // Get current time
  const now = new Date();

  // Calculate UTC time CORRECTLY - same as OtherCities.jsx
  const utcTime = now.getTime() + now.getTimezoneOffset() * 60000;

  // Add city's timezone offset
  const cityTimeMs = utcTime + timezone * 1000;
  const cityDate = new Date(cityTimeMs);

  // Format using UTC methods
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const dayName = days[cityDate.getUTCDay()];

  const hours = cityDate.getUTCHours();
  const minutes = cityDate.getUTCMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  const displayHours = (hours % 12 || 12).toString().padStart(2, "0");

  return `${dayName} ${displayHours}:${minutes} ${ampm}`;
};
