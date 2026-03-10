import React, { useState } from "react";
import { useSettings } from "../context/SettingsContext";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import {
  Moon,
  Sun,
  Thermometer,
  Globe,
  Bell,
  MapPin,
  ChevronRight,
  RotateCcw,
} from "lucide-react";

const Settings = () => {
  const { unit, toggleUnit } = useSettings();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState(false);
  const [locationAccess, setLocationAccess] = useState(false);
  const [language, setLanguage] = useState("english");
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleReset = () => {
    localStorage.clear();
    window.location.reload();
  };

  const SettingSection = ({ title, children }) => (
    <div className="glass-card p-6 mb-4">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="space-y-4">{children}</div>
    </div>
  );

  const SettingItem = ({ icon, label, value, onClick, type = "toggle" }) => (
    <div
      className="flex items-center justify-between py-2 hover:bg-white/5 px-3 rounded-xl transition-colors cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
          {icon}
        </div>
        <span className="text-sm">{label}</span>
      </div>

      {type === "toggle" ? (
        <div
          className={`w-12 h-6 rounded-full transition-colors ${value ? "bg-blue-500" : "bg-white/20"}`}
        >
          <div
            className={`w-5 h-5 bg-white rounded-full transition-transform ${value ? "translate-x-7" : "translate-x-1"}`}
          />
        </div>
      ) : (
        <div className="flex items-center gap-2 text-white/60">
          <span className="text-sm">{value}</span>
          <ChevronRight className="w-4 h-4" />
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Settings</h1>
            <p className="text-white/60">Customize your weather experience</p>
          </div>
          <button
            onClick={() => navigate("/dashboard")}
            className="text-white/60 hover:text-white transition-colors"
          >
            ← Back to Dashboard
          </button>
        </div>

        {/* Appearance Settings */}
        <SettingSection title="Appearance">
          <SettingItem
            icon={
              isDark ? (
                <Moon className="w-4 h-4 text-purple-400" />
              ) : (
                <Sun className="w-4 h-4 text-yellow-400" />
              )
            }
            label="Dark Mode"
            value={isDark}
            onClick={toggleTheme}
            type="toggle"
          />
        </SettingSection>

        {/* Units Settings */}
        <SettingSection title="Units">
          <SettingItem
            icon={<Thermometer className="w-4 h-4 text-blue-400" />}
            label="Temperature Unit"
            value={unit === "celsius" ? "Celsius (°C)" : "Fahrenheit (°F)"}
            onClick={toggleUnit}
            type="select"
          />
        </SettingSection>

        {/* Language Settings */}
        <SettingSection title="Regional">
          <SettingItem
            icon={<Globe className="w-4 h-4 text-green-400" />}
            label="Language"
            value={language.charAt(0).toUpperCase() + language.slice(1)}
            onClick={() =>
              setLanguage(language === "english" ? "spanish" : "english")
            }
            type="select"
          />
        </SettingSection>

        {/* Privacy Settings */}
        <SettingSection title="Privacy">
          <SettingItem
            icon={<MapPin className="w-4 h-4 text-red-400" />}
            label="Location Access"
            value={locationAccess}
            onClick={() => setLocationAccess(!locationAccess)}
            type="toggle"
          />
          <SettingItem
            icon={<Bell className="w-4 h-4 text-yellow-400" />}
            label="Notifications"
            value={notifications}
            onClick={() => setNotifications(!notifications)}
            type="toggle"
          />
        </SettingSection>

        {/* Data Management */}
        <SettingSection title="Data">
          <div className="space-y-2">
            <button
              onClick={() => setShowResetConfirm(true)}
              className="flex items-center justify-between w-full py-2 hover:bg-white/5 px-3 rounded-xl transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-red-500/10 rounded-lg flex items-center justify-center">
                  <RotateCcw className="w-4 h-4 text-red-400" />
                </div>
                <span className="text-sm">Reset All Settings</span>
              </div>
              <ChevronRight className="w-4 h-4 text-white/60" />
            </button>

            <div className="text-xs text-white/30 px-3">
              <p>
                Storage Usage:{" "}
                {Math.round(JSON.stringify(localStorage).length / 1024)} KB
              </p>
            </div>
          </div>
        </SettingSection>

        {/* About Section */}
        <SettingSection title="About">
          <div className="space-y-3 px-3">
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Version</span>
              <span>2.0.0</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Data Updates</span>
              <span>Every 10 minutes</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">API Provider</span>
              <span>OpenWeather</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Map Tiles</span>
              <span>OpenStreetMap</span>
            </div>
          </div>
        </SettingSection>

        {/* Reset Confirmation Modal */}
        {showResetConfirm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="glass-card p-6 max-w-md mx-4">
              <h3 className="text-xl font-bold mb-3">Reset All Settings?</h3>
              <p className="text-white/60 mb-6">
                This will clear all your preferences, favorites, and saved data.
                This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleReset}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-xl py-2 transition-colors"
                >
                  Reset
                </button>
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 bg-white/5 hover:bg-white/10 rounded-xl py-2 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
