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

  return (
    <SettingsContext.Provider value={{ unit, toggleUnit }}>
      {children}
    </SettingsContext.Provider>
  );
};
