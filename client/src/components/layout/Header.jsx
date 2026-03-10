import { Search, Settings, Moon, Sun, MapPin, Bell, Grid, Star, Cloud, Droplets, Wind, ThermometerSun } from "lucide-react";
import SearchBar from "../SearchBar";
import { useWeather } from "../../context/WeatherContext";
import { useTheme } from "../../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const Header = ({ showFavorites, setShowFavorites }) => {
  const { currentWeather } = useWeather();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (currentWeather) {
      const newNotifications = [];

      if (currentWeather.condition?.toLowerCase().includes("rain")) {
        newNotifications.push({
          id: "rain",
          title: "Rain Expected",
          message: `Don't forget your umbrella in ${currentWeather.city}!`,
          time: "Just now",
          icon: <Droplets className="w-5 h-5 text-blue-400" />
        });
      }

      if (currentWeather.temperature > 30) {
        newNotifications.push({
          id: "heat",
          title: "High Temperature",
          message: `It's ${Math.round(currentWeather.temperature)}°C in ${currentWeather.city}. Stay hydrated!`,
          time: "Just now",
          icon: <ThermometerSun className="w-5 h-5 text-orange-400" />
        });
      }

      if (currentWeather.temperature < 10) {
        newNotifications.push({
          id: "cold",
          title: "Cold Weather",
          message: `Bundle up! It's ${Math.round(currentWeather.temperature)}°C in ${currentWeather.city}.`,
          time: "Just now",
          icon: <Cloud className="w-5 h-5 text-blue-200" />
        });
      }

      if (currentWeather.windSpeed > 20) {
        newNotifications.push({
          id: "wind",
          title: "Windy Conditions",
          message: `Strong winds (${Math.round(currentWeather.windSpeed)} km/h) in ${currentWeather.city}.`,
          time: "Just now",
          icon: <Wind className="w-5 h-5 text-gray-400" />
        });
      }

      setNotifications(newNotifications);
      setUnreadCount(newNotifications.length);
    }
  }, [currentWeather]);

  const markAllAsRead = () => {
    setUnreadCount(0);
  };

  return (
    <header className="border-b border-white/5 px-6 py-4 sticky top-0 bg-[#0a0a0a]/80 backdrop-blur-xl z-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate("/")}
            className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center transition-all group"
            title="Home"
          >
            <Grid className="w-5 h-5 text-white/40 group-hover:text-white/60" />
          </button>

          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center transition-all group relative"
              title="Notifications"
            >
              <Bell className="w-4 h-4 text-white/40 group-hover:text-white/60" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 rounded-full text-[10px] flex items-center justify-center text-white font-medium px-1">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute top-12 left-0 w-80 glass-card p-3 animate-fade-in-up">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">Notifications</h3>
                  {notifications.length > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-white/40 hover:text-white/60 transition-colors"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                {notifications.length === 0 ? (
                  <p className="text-sm text-white/40 text-center py-4">
                    No new notifications
                  </p>
                ) : (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className="flex gap-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
                      >
                        <div className="text-2xl">{notif.icon}</div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-sm">
                              {notif.title}
                            </h4>
                            <span className="text-[10px] text-white/30">
                              {notif.time}
                            </span>
                          </div>
                          <p className="text-xs text-white/60 mt-1">
                            {notif.message}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2 px-4 py-2 bg-white/5 rounded-xl border border-white/10">
            <MapPin className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium">
              {currentWeather
                ? `${currentWeather.city}, ${currentWeather.country}`
                : "Select a city"}
            </span>
          </div>
        </div>

        <SearchBar />

        <div className="flex items-center space-x-3">
          <button
            onClick={() => {
              setShowFavorites(!showFavorites);
              navigate("/favorites");
            }}
            className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center transition-all group relative"
            title="Favorites"
          >
            <Star className="w-4 h-4 text-white/40 group-hover:text-yellow-400 transition-colors" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full"></span>
          </button>

          <button
            onClick={() => navigate("/settings")}
            className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center transition-all group"
            title="Settings"
          >
            <Settings className="w-4 h-4 text-white/40 group-hover:text-white/60" />
          </button>

          <button
            onClick={toggleTheme}
            className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center transition-all group"
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-white/40 group-hover:text-yellow-400 transition-colors" />
            ) : (
              <Moon className="w-4 h-4 text-white/40 group-hover:text-white/60 transition-colors" />
            )}
          </button>

          <div
            onClick={() => navigate("/dashboard")}
            className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center text-white font-semibold cursor-pointer hover:scale-105 transition-transform"
            title="Dashboard"
          >
            WD
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
