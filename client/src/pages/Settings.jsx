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
  const {
    unit,
    toggleUnit,
    language,
    toggleLanguage,
    notifications,
    toggleNotifications,
    locationEnabled,
    toggleLocation,
    resetAllSettings,
  } = useSettings();

  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleReset = () => {
    resetAllSettings();
    setShowResetConfirm(false);
  };

  const SettingSection = ({ title, children }) => (
    <div className="glass-card p-6 mb-4">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white light:text-gray-900">
        {title}
      </h3>
      <div className="space-y-4">{children}</div>
    </div>
  );

  const SettingItem = ({ icon, label, value, onClick, type = "toggle" }) => (
    <div
      className="flex items-center justify-between py-2 hover:bg-white/10 dark:hover:bg-white/5 light:hover:bg-black/5 px-3 rounded-xl transition-colors cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
          {icon}
        </div>
        <span className="text-sm text-gray-900 dark:text-white light:text-gray-900">
          {label}
        </span>
      </div>

      {type === "toggle" ? (
        <div
          className={`w-12 h-6 rounded-full transition-colors ${
            value
              ? "bg-blue-500"
              : "bg-gray-300 dark:bg-white/20 light:bg-gray-300"
          }`}
        >
          <div
            className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
              value ? "translate-x-7" : "translate-x-1"
            }`}
          />
        </div>
      ) : (
        <div className="flex items-center gap-2 text-gray-500 dark:text-white/60 light:text-gray-600">
          <span className="text-sm capitalize">{value}</span>
          <ChevronRight className="w-4 h-4" />
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] light:bg-white text-gray-900 dark:text-white light:text-gray-900 transition-colors duration-300 p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Settings</h1>
            <p className="text-gray-500 dark:text-white/60 light:text-gray-600">
              Customize your weather experience
            </p>
          </div>
          <button
            onClick={() => navigate("/dashboard")}
            className="text-gray-500 dark:text-white/60 light:text-gray-600 hover:text-gray-700 dark:hover:text-white light:hover:text-gray-700 transition-colors"
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
            value={language}
            onClick={toggleLanguage}
            type="select"
          />
        </SettingSection>

        {/* Privacy Settings */}
        <SettingSection title="Privacy">
          <SettingItem
            icon={<MapPin className="w-4 h-4 text-red-400" />}
            label="Location Access"
            value={locationEnabled}
            onClick={toggleLocation}
            type="toggle"
          />
          <SettingItem
            icon={<Bell className="w-4 h-4 text-yellow-400" />}
            label="Notifications"
            value={notifications}
            onClick={toggleNotifications}
            type="toggle"
          />
        </SettingSection>

        {/* Data Management */}
        <SettingSection title="Data">
          <div className="space-y-2">
            <button
              onClick={() => setShowResetConfirm(true)}
              className="flex items-center justify-between w-full py-2 hover:bg-white/10 dark:hover:bg-white/5 light:hover:bg-black/5 px-3 rounded-xl transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-red-500/10 rounded-lg flex items-center justify-center">
                  <RotateCcw className="w-4 h-4 text-red-400" />
                </div>
                <span className="text-sm text-gray-900 dark:text-white light:text-gray-900">
                  Reset All Settings
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-500 dark:text-white/60 light:text-gray-600" />
            </button>

            <div className="text-xs text-gray-400 dark:text-white/30 light:text-gray-500 px-3">
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
              <span className="text-gray-500 dark:text-white/60 light:text-gray-600">
                Version
              </span>
              <span className="text-gray-900 dark:text-white light:text-gray-900">
                2.0.0
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-white/60 light:text-gray-600">
                Data Updates
              </span>
              <span className="text-gray-900 dark:text-white light:text-gray-900">
                Every 10 minutes
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-white/60 light:text-gray-600">
                API Provider
              </span>
              <span className="text-gray-900 dark:text-white light:text-gray-900">
                OpenWeather
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-white/60 light:text-gray-600">
                Map Tiles
              </span>
              <span className="text-gray-900 dark:text-white light:text-gray-900">
                OpenStreetMap
              </span>
            </div>
          </div>
        </SettingSection>

        {/* Reset Confirmation Modal */}
        {showResetConfirm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="glass-card p-6 max-w-md mx-4">
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white light:text-gray-900">
                Reset All Settings?
              </h3>
              <p className="text-gray-500 dark:text-white/60 light:text-gray-600 mb-6">
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
                  className="flex-1 bg-white/10 dark:bg-white/5 light:bg-black/5 hover:bg-white/20 dark:hover:bg-white/10 light:hover:bg-black/10 rounded-xl py-2 transition-colors text-gray-900 dark:text-white light:text-gray-900"
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
