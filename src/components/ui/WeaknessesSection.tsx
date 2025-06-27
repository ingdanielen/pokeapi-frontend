import React from "react";
import { getTypeColor } from "../../utils/pokemonColors";
import { typeTranslations } from "../../utils/typeEffectiveness";

interface WeaknessesSectionProps {
  weaknesses: string[];
}

const WeaknessesSection: React.FC<WeaknessesSectionProps> = ({ weaknesses }) => {
  if (weaknesses.length === 0) return null;

  return (
    <div className="mb-3">
      <h3 className="font-bold text-xs md:text-sm mb-2 text-gray-800">
        Debilidades
      </h3>
      <div className="flex flex-wrap gap-1">
        {weaknesses.slice(0, 4).map((weakness) => (
          <div
            key={weakness}
            className="flex items-center px-2 py-1 rounded-full text-white font-semibold shadow-lg"
            style={{ backgroundColor: getTypeColor(weakness) }}
          >
            <span className="text-white text-[9px] md:text-[10px]">
              {typeTranslations[weakness] || weakness}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeaknessesSection; 