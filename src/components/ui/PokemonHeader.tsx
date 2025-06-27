import React from "react";
import { PokemonType } from "../../types/pokemon";
import { getTypeColor } from "../../utils/pokemonColors";

interface PokemonHeaderProps {
  name: string;
  id: number;
  types: PokemonType[];
}

const PokemonHeader: React.FC<PokemonHeaderProps> = ({ name, id, types }) => {
  return (
    <div className="text-center md:text-left">
      {/* Nombre y número */}
      <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
        <span className="text-xl md:text-3xl font-extrabold capitalize text-white drop-shadow-lg">
          {name}
        </span>
        <span className="text-white/80 font-bold text-lg md:text-2xl drop-shadow-lg">
          #{id.toString().padStart(3, "0")}
        </span>
      </div>
      {/* Tipos */}
      <div className="flex gap-2 justify-center md:justify-start mb-3">
        {types.map((t) => (
          <span
            key={t.type.name}
            className="px-2 md:px-3 py-1 rounded-full bg-white text-xs font-semibold shadow"
            style={{ color: getTypeColor(t.type.name) }}
          >
            {t.type.name}
          </span>
        ))}
      </div>
    </div>
  );
};

export default PokemonHeader; 