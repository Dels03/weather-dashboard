import React from "react";

// Forecast Card Skeleton
export const ForecastSkeleton = () => {
  return (
    <div className="flex space-x-4">
      {/* Today's Card Skeleton */}
      <div className="bg-gradient-to-br from-blue-200/20 to-blue-300/20 rounded-3xl p-6 min-w-[200px] animate-pulse">
        <div className="h-4 bg-white/20 rounded w-20 mb-2"></div>
        <div className="h-3 bg-white/20 rounded w-16 mb-4"></div>

        <div className="w-16 h-16 bg-white/20 rounded-full mx-auto mb-4"></div>

        <div className="h-12 bg-white/20 rounded w-24 mb-4"></div>

        <div className="space-y-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex justify-between">
              <div className="h-3 bg-white/20 rounded w-16"></div>
              <div className="h-3 bg-white/20 rounded w-12"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Other Days Skeleton */}
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="bg-white/5 rounded-2xl p-4 min-w-[100px] animate-pulse"
        >
          <div className="h-3 bg-white/20 rounded w-12 mx-auto mb-3"></div>
          <div className="w-12 h-12 bg-white/20 rounded-full mx-auto mb-3"></div>
          <div className="h-6 bg-white/20 rounded w-16 mx-auto"></div>
        </div>
      ))}
    </div>
  );
};

// Weather Card Skeleton
export const WeatherCardSkeleton = () => {
  return (
    <div className="bg-white/5 rounded-3xl p-8 animate-pulse">
      <div className="mb-6">
        <div className="h-3 bg-white/20 rounded w-32 mb-2"></div>
        <div className="h-6 bg-white/20 rounded w-48"></div>
      </div>

      <div className="flex items-center justify-between mb-8">
        <div className="flex-1">
          <div className="h-24 bg-white/20 rounded w-40 mb-4"></div>
          <div className="h-4 bg-white/20 rounded w-32 mb-2"></div>
          <div className="h-3 bg-white/20 rounded w-24"></div>
        </div>
        <div className="w-32 h-32 bg-white/20 rounded-full"></div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white/5 rounded-2xl p-4">
            <div className="h-3 bg-white/20 rounded w-16 mb-2"></div>
            <div className="h-6 bg-white/20 rounded w-20 mb-2"></div>
            <div className="h-3 bg-white/20 rounded w-12"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Search Suggestions Skeleton
export const SearchSkeleton = () => {
  return (
    <div className="bg-white/10 backdrop-blur-2xl rounded-xl border border-white/10 shadow-2xl overflow-hidden mt-2">
      <div className="px-5 py-3 border-b border-white/10">
        <div className="h-4 bg-white/20 rounded w-32 animate-pulse"></div>
      </div>
      <ul>
        {[1, 2, 3, 4].map((i) => (
          <li
            key={i}
            className="px-4 py-3 border-b border-white/5 last:border-b-0 animate-pulse"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg"></div>
              <div className="flex-1">
                <div className="h-4 bg-white/20 rounded w-32 mb-2"></div>
                <div className="h-3 bg-white/20 rounded w-20"></div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Empty State Component
export const EmptyState = ({ onLocationClick }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] text-center px-4">
      {/* Animated Weather Icon */}
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/30 to-purple-400/30 blur-3xl animate-pulse"></div>
        <div className="relative text-8xl animate-float">🌤️</div>
      </div>

      {/* Welcome Text */}
      <h2 className="text-3xl font-bold text-white mb-3">
        Welcome to Weather Dashboard
      </h2>
      <p className="text-white/60 text-lg mb-8 max-w-md">
        Search for any city to get started, or use your current location for
        instant weather updates
      </p>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={onLocationClick}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-xl font-medium text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 transform hover:scale-105"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span>Use My Location</span>
        </button>

        <div className="text-white/40 flex items-center">or</div>

        <div className="text-white/60">
          Search for cities like{" "}
          <span className="text-blue-400 font-medium">Manila</span>,{" "}
          <span className="text-blue-400 font-medium">Tokyo</span>, or{" "}
          <span className="text-blue-400 font-medium">London</span>
        </div>
      </div>

      {/* Popular Cities Quick Links (Optional) */}
      <div className="mt-12">
        <p className="text-sm text-white/40 mb-4">Popular cities</p>
        <div className="flex flex-wrap gap-2 justify-center">
          {["New York", "London", "Tokyo", "Paris", "Dubai"].map((city) => (
            <button
              key={city}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-white/80 hover:text-white transition-all border border-white/10 hover:border-white/20"
            >
              {city}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// Add float animation
const style = document.createElement("style");
style.textContent = `
  @keyframes float {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-20px);
    }
  }
  
  .animate-float {
    animation: float 6s ease-in-out infinite;
  }
`;
document.head.appendChild(style);

export default {
  ForecastSkeleton,
  WeatherCardSkeleton,
  SearchSkeleton,
  EmptyState,
};
