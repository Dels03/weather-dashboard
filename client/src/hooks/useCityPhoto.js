import { useState, useEffect } from "react";
import { fetchCityPhoto } from "../services/unsplashApi";

export const useCityPhoto = (cityName) => {
  const [photoUrl, setPhotoUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!cityName) return;

    const getPhoto = async () => {
      setLoading(true);
      setError(null);
      try {
        const url = await fetchCityPhoto(cityName);
        setPhotoUrl(url);
      } catch (err) {
        setError(err.message);
        setPhotoUrl(null);
      } finally {
        setLoading(false);
      }
    };

    getPhoto();
  }, [cityName]);

  return { photoUrl, loading, error };
};
