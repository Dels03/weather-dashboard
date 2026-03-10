import React, { useState, useEffect } from "react";
import {
  MapPin,
  Search,
  Star,
  CloudSun,
  CloudRain,
  CloudSnow,
  Wind,
} from "lucide-react";

const EmptyState = () => {
  const [currentTip, setCurrentTip] = useState(0);

  // Weather tips to rotate through
  const tips = [
    {
      icon: <Search className="w-5 h-5" />,
      title: "Search for a city",
      description: "Type any city name to get started",
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      title: "Use your location",
      description: "Click the location pin for local weather",
    },
    {
      icon: <Star className="w-5 h-5" />,
      title: "Save favorites",
      description: "Star cities for quick access later",
    },
    {
      icon: <CloudSun className="w-5 h-5" />,
      title: "5-day forecast",
      description: "Plan ahead with detailed forecasts",
    },
  ];

  // Rotate tips every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % tips.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Random weather icons for background
  const backgroundIcons = [
    { Icon: CloudSun, delay: 0 },
    { Icon: CloudRain, delay: 1 },
    { Icon: CloudSnow, delay: 2 },
    { Icon: Wind, delay: 3 },
  ];

  return (
    <div className="relative w-full min-h-[500px] flex items-center justify-center overflow-hidden rounded-3xl">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20 animate-gradient"></div>

      {/* Floating weather icons in background */}
      {backgroundIcons.map((item, index) => (
        <div
          key={index}
          className="absolute animate-float"
          style={{
            top: `${Math.random() * 70 + 10}%`,
            left: `${Math.random() * 70 + 10}%`,
            animationDelay: `${item.delay}s`,
            opacity: 0.1,
          }}
        >
          <item.Icon className="w-16 h-16 text-white" />
        </div>
      ))}

      {/* Glowing orbs */}
      <div className="absolute top-20 left-20 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse-slower"></div>

      {/* Main content */}
      <div className="relative z-10 max-w-2xl mx-auto text-center px-4">
        {/* Animated weather icon */}
        <div className="relative inline-block mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-2xl opacity-50 animate-pulse"></div>
          <div className="relative w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center animate-float">
            <CloudSun className="w-16 h-16 text-white" />
          </div>

          {/* Orbiting dots */}
          <div className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-400 rounded-full animate-ping opacity-75"></div>
          <div
            className="absolute -bottom-4 -left-4 w-6 h-6 bg-blue-400 rounded-full animate-ping opacity-50"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>

        {/* Main title */}
        <h2 className="text-4xl font-bold text-white mb-3 animate-fade-in">
          Weather Dashboard
        </h2>

        <p
          className="text-xl text-white/60 mb-8 animate-fade-in-up"
          style={{ animationDelay: "0.1s" }}
        >
          Your personal weather companion
        </p>

        {/* Search hint with animated border */}
        <div className="relative max-w-md mx-auto mb-8 group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl opacity-75 group-hover:opacity-100 blur transition-all duration-500 animate-pulse-slow"></div>
          <div className="relative bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/20">
            <div className="flex items-center gap-3 text-left">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Search className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-white/90 text-sm">Try typing</p>
                <p className="text-white font-medium">
                  "Manila", "New York", "Tokyo"...
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Rotating tips carousel */}
        <div className="relative h-16 mb-8">
          {tips.map((tip, index) => (
            <div
              key={index}
              className={`absolute inset-0 flex items-center justify-center gap-3 transition-all duration-700 transform ${
                currentTip === index
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4 pointer-events-none"
              }`}
            >
              <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                {tip.icon}
              </div>
              <div>
                <p className="text-white font-medium">{tip.title}</p>
                <p className="text-white/40 text-sm">{tip.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Feature pills */}
        <div
          className="flex flex-wrap justify-center gap-2 animate-fade-in-up"
          style={{ animationDelay: "0.3s" }}
        >
          {[
            "Real-time weather",
            "5-day forecast",
            "Dark mode",
            "Favorites",
          ].map((feature, index) => (
            <span
              key={index}
              className="px-3 py-1.5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full text-xs text-white/60 hover:bg-white/10 hover:text-white/80 transition-all cursor-default"
            >
              {feature}
            </span>
          ))}
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-4 mt-12 max-w-md mx-auto">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">200M+</div>
            <div className="text-xs text-white/40">Cities worldwide</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">实时</div>
            <div className="text-xs text-white/40">Live updates</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">10min</div>
            <div className="text-xs text-white/40">Cache refresh</div>
          </div>
        </div>

        {/* Decorative line */}
        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent mx-auto mt-12"></div>
      </div>
    </div>
  );
};

export default EmptyState;
