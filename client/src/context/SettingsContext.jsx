import React, { createContext, useState, useContext, useEffect } from "react";

const SettingsContext = createContext();

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};

export const SettingsProvider = ({ children }) => {
  // ============================================================================
  // UNIT SETTING
  // ============================================================================
  const [unit, setUnit] = useState(() => {
    const saved = localStorage.getItem("unit");
    return saved || "celsius";
  });

  useEffect(() => {
    localStorage.setItem("unit", unit);
  }, [unit]);

  const toggleUnit = () => {
    setUnit((prev) => (prev === "celsius" ? "fahrenheit" : "celsius"));
  };

  // ============================================================================
  // LANGUAGE SETTING
  // ============================================================================
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem("language");
    return saved || "english";
  });

  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "english" ? "spanish" : "english"));
  };

  // ============================================================================
  // NOTIFICATIONS SETTING
  // ============================================================================
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem("notifications");
    return saved ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem("notifications", JSON.stringify(notifications));
  }, [notifications]);

  const toggleNotifications = () => {
    setNotifications((prev) => !prev);
  };

  // ============================================================================
  // LOCATION ACCESS SETTING
  // ============================================================================
  const [locationEnabled, setLocationEnabled] = useState(() => {
    const saved = localStorage.getItem("locationEnabled");
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem("locationEnabled", JSON.stringify(locationEnabled));
  }, [locationEnabled]);

  const toggleLocation = () => {
    setLocationEnabled((prev) => !prev);
  };

  // ============================================================================
  // RESET ALL SETTINGS
  // ============================================================================
  const resetAllSettings = () => {
    // Reset to defaults
    setUnit("celsius");
    setLanguage("english");
    setNotifications(true);
    setLocationEnabled(false);

    // Note: Theme is handled separately in ThemeContext
    // Favorites are handled separately in FavoritesContext
  };

  return (
    <SettingsContext.Provider
      value={{
        // Unit
        unit,
        toggleUnit,

        // Language
        language,
        toggleLanguage,

        // Notifications
        notifications,
        toggleNotifications,

        // Location
        locationEnabled,
        toggleLocation,

        // Reset
        resetAllSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};
