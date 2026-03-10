import React from "react";
import { useNavigate } from "react-router-dom";
import { CloudSun, Calendar, MapPin, Star, ArrowRight } from "lucide-react";

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: CloudSun,
      title: "Real-time Weather",
      desc: "Live updates every 10 minutes",
    },
    {
      icon: Calendar,
      title: "5-Day Forecast",
      desc: "Plan ahead with confidence",
    },
    { icon: MapPin, title: "Any Location", desc: "Search cities worldwide" },
    { icon: Star, title: "Favorites", desc: "Save your most visited places" },
  ];

  const stats = [
    { value: "200M+", label: "Cities worldwide" },
    { value: "99.9%", label: "Uptime" },
    { value: "10min", label: "Update frequency" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20 animate-gradient"></div>

        {/* Floating weather icons */}
        <div className="absolute top-20 left-20 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse-slow"></div>

        <div className="relative z-10 container mx-auto px-6 py-20">
          <div className="max-w-4xl mx-auto text-center">
            {/* Logo/Icon */}
            <div className="relative inline-block mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-2xl opacity-50 animate-pulse"></div>
              <div className="relative w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center animate-float">
                <CloudSun className="w-12 h-12 text-white" />
              </div>
            </div>

            <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
              Weather Dashboard
            </h1>

            <p className="text-xl text-white/60 mb-12 max-w-2xl mx-auto">
              Beautiful, accurate weather forecasts for any location worldwide.
              Real-time data, 5-day predictions, and a stunning dark interface.
            </p>

            {/* Single button to go to dashboard */}
            <button
              onClick={() => navigate("/dashboard")}
              className="btn-primary px-8 py-3 text-lg inline-flex items-center gap-2"
            >
              Launch Dashboard <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="container mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-4">
          Everything you need
        </h2>
        <p className="text-white/60 text-center mb-12 max-w-2xl mx-auto">
          Powerful features to help you plan your day, week, and beyond
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="glass-card p-6 text-center group hover:scale-105 transition-all duration-300"
              >
                <div className="relative inline-block mb-4">
                  <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-lg group-hover:blur-xl transition-all"></div>
                  <div className="relative w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-white/60">{feature.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="glass-card p-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-white/60">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Simple Footer */}
      <footer className="border-t border-white/5 py-4 text-center text-xs text-white/30">
        <p>Powered by OpenWeather • Data updates every 10 minutes</p>
      </footer>
    </div>
  );
};

export default LandingPage;
