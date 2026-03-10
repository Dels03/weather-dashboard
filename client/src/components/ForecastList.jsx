import React, { useRef, useState, useEffect } from "react";
import ForecastCard from "./ForecastCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ForecastList = ({ forecast }) => {
  const scrollContainerRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  if (!forecast || forecast.length === 0) return null;

  // Check scroll position to show/hide arrows
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 10);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  // Initialize scroll state
  useEffect(() => {
    handleScroll();
    window.addEventListener("resize", handleScroll);
    return () => window.removeEventListener("resize", handleScroll);
  }, [forecast]);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 280;
      const newScrollLeft =
        direction === "left"
          ? scrollContainerRef.current.scrollLeft - scrollAmount
          : scrollContainerRef.current.scrollLeft + scrollAmount;

      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="w-full">
      {/* Horizontal scrolling container */}
      <div className="relative">
        {/* Left Scroll Button */}
        {showLeftArrow && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 bg-black/40 hover:bg-black/60 backdrop-blur-sm border border-white/10 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
        )}

        {/* Right Scroll Button */}
        {showRightArrow && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 bg-black/40 hover:bg-black/60 backdrop-blur-sm border border-white/10 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
        )}

        {/* Scrollable Cards Container */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-hide pb-2 px-1"
          style={{ scrollBehavior: "smooth" }}
        >
          {forecast.map((day, index) => (
            <div
              key={index}
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <ForecastCard forecast={day} isToday={index === 0} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ForecastList;
