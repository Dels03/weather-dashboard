import React from "react";
import { Droplets } from "lucide-react";

const PrecipitationChart = ({ forecast }) => {
  if (!forecast || forecast.length === 0) {
    return (
      <div className="bg-white/[0.03] backdrop-blur-sm border border-white/[0.08] rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Droplets className="w-5 h-5 text-[#4A90E2]" />
          <h4 className="text-sm font-medium text-white">Chance of Rain</h4>
        </div>
        <p className="text-sm text-white/40 text-center py-4">No data</p>
      </div>
    );
  }

  // Get next 8 items
  const next8 = forecast.slice(0, 8);

  // Calculate values
  const values = next8.map((item) =>
    item.pop ? Math.round(item.pop * 100) : 0,
  );
  const maxValue = Math.max(...values);

  return (
    <div className="bg-white/[0.03] backdrop-blur-sm border border-white/[0.08] rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Droplets className="w-5 h-5 text-[#4A90E2]" />
        <h4 className="text-sm font-medium text-white">Chance of Rain</h4>
      </div>

      {/* Simple bars */}
      <div className="flex gap-1 h-32 items-end mb-2">
        {values.map((value, i) => (
          <div key={i} className="flex-1 flex flex-col items-center">
            <div className="text-xs text-white mb-1">{value}%</div>
            <div
              className="w-full bg-blue-500 rounded-t"
              style={{ height: `${value}px`, minHeight: "4px" }}
            ></div>
          </div>
        ))}
      </div>

      <div className="text-xs text-white/40">Max: {maxValue}%</div>
    </div>
  );
};

export default PrecipitationChart;
