import React from "react";
import { getStatBarColor, getStatBarPercentage } from "../../utils/statColors";

interface StatBarProps {
  value: number;
  statName: string;
  max?: number;
  className?: string;
}

export const StatBar: React.FC<StatBarProps> = ({
  value,
  statName,
  max = 255,
  className = "",
}) => {
  const percentage = getStatBarPercentage(value, max);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="w-12 bg-gray-100 rounded-full h-1.5">
        <div
          className={`h-1.5 rounded-full transition-all duration-300 ${getStatBarColor(
            statName,
            value
          )}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <span className="text-sm font-medium text-gray-600 min-w-[1.5rem]">
        {value}
      </span>
    </div>
  );
}; 