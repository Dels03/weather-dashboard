import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useWeather } from "../context/WeatherContext";

// Fix for default markers in Leaflet
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Fix default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Custom marker icon for current location
const currentLocationIcon = new L.Icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  className: "current-location-marker", // For custom styling
});

// Custom marker icon for favorite cities
const favoriteIcon = new L.Icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  className: "favorite-marker", // For custom styling
});

const WeatherMap = ({ height = "400px", showMarkers = true }) => {
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);
  const markersRef = useRef([]);
  const { currentWeather, favorites } = useWeather();
  const [mapInitialized, setMapInitialized] = useState(false);

  // Initialize map only once
  useEffect(() => {
    if (!mapRef.current && mapContainerRef.current) {
      // Start with a default view (world view)
      mapRef.current = L.map(mapContainerRef.current).setView([20, 0], 2);

      // Add dark theme tiles
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; CartoDB',
          subdomains: "abcd",
          maxZoom: 19,
        },
      ).addTo(mapRef.current);

      setMapInitialized(true);
    }

    // Cleanup on unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Auto-center and update markers when currentWeather changes
  useEffect(() => {
    if (!mapRef.current || !mapInitialized || !currentWeather) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Get coordinates from current weather
    let lat, lon;

    if (currentWeather.coordinates) {
      lat = currentWeather.coordinates.lat;
      lon = currentWeather.coordinates.lon;
    } else if (currentWeather.lat && currentWeather.lon) {
      lat = currentWeather.lat;
      lon = currentWeather.lon;
    }

    if (lat && lon) {
      // Center map on this location with smooth animation
      mapRef.current.flyTo([lat, lon], 10, {
        animate: true,
        duration: 1.5, // seconds
      });

      // Add marker for current weather location
      const marker = L.marker([lat, lon], { icon: currentLocationIcon })
        .addTo(mapRef.current)
        .bindPopup(
          `
          <div style="text-align: center;">
            <strong style="color: #60a5fa;">${currentWeather.city || "Unknown"}, ${currentWeather.country || ""}</strong><br/>
            <span style="font-size: 20px;">${Math.round(currentWeather.temperature || 0)}°C</span><br/>
            <span style="text-transform: capitalize;">${currentWeather.condition || "Unknown"}</span><br/>
            <span style="font-size: 11px; color: #888;">Current Location</span>
          </div>
        `,
        )
        .openPopup(); // Auto-open popup for current location

      markersRef.current.push(marker);
    }

    // Add markers for favorite cities
    favorites?.forEach((city) => {
      if (city.latitude && city.longitude) {
        const marker = L.marker([city.latitude, city.longitude], {
          icon: favoriteIcon,
        }).addTo(mapRef.current).bindPopup(`
            <div style="text-align: center;">
              <strong>${city.cityName}, ${city.countryCode}</strong><br/>
              <span style="font-size: 11px; color: #888;">Favorite</span>
            </div>
          `);

        markersRef.current.push(marker);
      }
    });
  }, [currentWeather, favorites, mapInitialized]);

  // Function to reset map to world view
  const resetMapView = () => {
    if (mapRef.current) {
      mapRef.current.flyTo([20, 0], 2, {
        animate: true,
        duration: 1.5,
      });
    }
  };

  return (
    <div className="relative w-full h-full">
      <div
        ref={mapContainerRef}
        style={{ height, width: "100%" }}
        className="rounded-2xl overflow-hidden border border-white/10"
      />

      {/* Map controls overlay */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-[1000]">
        <button
          onClick={resetMapView}
          className="bg-black/50 hover:bg-black/70 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-sm border border-white/10 transition-all flex items-center gap-2"
          title="Reset map view"
        >
          <span>🌍</span>
          <span>Reset</span>
        </button>
      </div>

      {/* Location indicator */}
      {currentWeather && (
        <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-sm border border-white/10 z-[1000] flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span>Showing: {currentWeather.city}</span>
        </div>
      )}
    </div>
  );
};

export default WeatherMap;
