import React from "react";
import { PokemonType } from "../../types/pokemon";
import { getTypeColor } from "../../utils/pokemonColors";

interface PokemonTypeBadgeProps {
  type: PokemonType;
  className?: string;
}

const PokemonTypeBadge: React.FC<PokemonTypeBadgeProps> = ({ 
  type, 
  className = "px-2 py-0.5 rounded-full text-xs font-semibold capitalize shadow max-w-[70px] truncate transition-all duration-500 ease-out" 
}) => (
  <span
    className={className}
    style={{
      background: getTypeColor(type.type.name),
      color: "#fff",
    }}
    title={type.type.name}
  >
    {type.type.name}
  </span>
);

export default PokemonTypeBadge; 