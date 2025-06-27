import React from "react";
import { PokemonDetails } from "../../types/pokemon";

interface AbilitiesSectionProps {
  details: PokemonDetails;
}

const AbilitiesSection: React.FC<AbilitiesSectionProps> = ({ details }) => {
  return (
    <div>
      <h3 className="font-bold text-xs md:text-sm mb-2 text-gray-800">
        Habilidades
      </h3>
      <div className="flex flex-wrap gap-1">
        {details.abilities.map((ability) => (
          <span
            key={ability.ability.name}
            className={`px-2 py-1 rounded-full text-[9px] md:text-[10px] font-semibold shadow ${
              ability.is_hidden
                ? "bg-purple-200 text-purple-900"
                : "bg-blue-200 text-blue-900"
            }`}
          >
            {ability.ability.name.replace("-", " ")}
            {ability.is_hidden ? " (Oculta)" : ""}
          </span>
        ))}
      </div>
    </div>
  );
};

export default AbilitiesSection; 