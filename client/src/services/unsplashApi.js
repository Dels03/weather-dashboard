import axios from "axios";

const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

export const fetchCityPhoto = async (cityName) => {
  try {
    const response = await axios.get("https://api.unsplash.com/search/photos", {
      params: { query: cityName, per_page: 1, orientation: "landscape" },
      headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` },
    });
    return response.data.results[0]?.urls?.regular || null;
  } catch {
    return null;
  }
};
