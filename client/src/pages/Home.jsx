import React from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, CloudSun, ArrowRight } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        navigate("/dashboard");
      },
      () => {
        alert("Unable to retrieve your location");
      },
    );
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white relative overflow-hidden flex items-center justify-center">
      {/* Subtle Background Effects - Very minimal */}
      <div className="absolute inset-0">
        {/* Very subtle gradient blobs - matching our dashboard */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-[#4A90E2]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#F5A623]/5 rounded-full blur-3xl"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-2xl px-6 text-center">
        {/* Logo/Icon */}
        <div className="relative inline-block mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-[#4A90E2] to-[#F5A623] rounded-2xl blur-2xl opacity-20"></div>
          <div className="relative w-20 h-20 bg-gradient-to-br from-[#4A90E2] to-[#F5A623] rounded-2xl flex items-center justify-center shadow-xl hover:scale-110 transition-transform duration-300">
            <CloudSun className="w-10 h-10 text-white" strokeWidth={2} />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-4 leading-tight">
          <span className="text-white">Weather Dashboard</span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-white/50 mb-12 font-normal max-w-xl mx-auto">
          Beautiful, accurate weather forecasts for any location worldwide
        </p>

        {/* Launch Dashboard Button */}
        <button
          onClick={() => navigate("/dashboard")}
          className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#4A90E2] to-[#5BA3F5] hover:from-[#3A80D2] hover:to-[#4A90E2] rounded-xl transition-all duration-200 hover:scale-105 shadow-lg mb-6"
        >
          <span className="text-white font-medium">Launch Dashboard</span>
          <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-white/5"></div>
          <span className="text-xs text-white/30 uppercase tracking-wider">
            or
          </span>
          <div className="flex-1 h-px bg-white/5"></div>
        </div>

        {/* Use Location Button */}
        <button
          onClick={handleUseLocation}
          className="group inline-flex items-center gap-3 px-6 py-3 bg-white/[0.03] hover:bg-white/[0.05] border border-white/[0.08] hover:border-[#4A90E2]/30 rounded-xl transition-all duration-200"
        >
          <MapPin className="w-4 h-4 text-white/50 group-hover:text-[#4A90E2] transition-colors" />
          <span className="text-sm text-white/60 group-hover:text-white transition-colors">
            Use my location
          </span>
        </button>

        {/* Bottom Stats - Clean and minimal */}
        <div className="mt-16 flex items-center justify-center gap-8 text-xs text-white/30">
          <div>Real-time data</div>
          <div className="w-1 h-1 bg-white/20 rounded-full"></div>
          <div>7-day forecast</div>
          <div className="w-1 h-1 bg-white/20 rounded-full"></div>
          <div>Global coverage</div>
        </div>
      </div>
    </div>
  );
};

export default Home;
