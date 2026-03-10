import React, { createContext, useState, useContext, useEffect } from "react";

const FavoritesContext = createContext();

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
};

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("favorites");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = (city) => {
    setFavorites((prev) => {
      // Check if city already exists
      const exists = prev.some(
        (f) =>
          f.cityName === city.cityName && f.countryCode === city.countryCode,
      );
      if (exists) return prev;

      // Limit to 10 favorites
      if (prev.length >= 10) {
        alert("You can only have up to 10 favorite cities");
        return prev;
      }

      return [...prev, city];
    });
  };

  const removeFavorite = (cityToRemove) => {
    setFavorites((prev) =>
      prev.filter(
        (city) =>
          !(
            city.cityName === cityToRemove.cityName &&
            city.countryCode === cityToRemove.countryCode
          ),
      ),
    );
  };

  return (
    <FavoritesContext.Provider
      value={{ favorites, addFavorite, removeFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};
