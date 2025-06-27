import React from "react";
import { PokemonDetails } from "../../types/pokemon";

interface PokemonInfoCardProps {
  details: PokemonDetails;
}

const PokemonInfoCard: React.FC<PokemonInfoCardProps> = ({ details }) => {
  return (
    <div className="bg-white rounded-2xl py-3 md:py-4 shadow-lg px-4 md:px-8 lg:mr-10 relative z-20">
      {/* Peso, altura, categoría, habilidad principales */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-base mb-3">
        <div className="bg-gray-50 rounded-xl p-2 text-center">
          <div className="mb-1">
            <span className="text-[9px] md:text-[10px] font-semibold text-gray-500 uppercase tracking-wide">
              PESO
            </span>
          </div>
          <span className="font-bold text-xs md:text-sm">
            {details.weight / 10} kg
          </span>
        </div>

        <div className="bg-gray-50 rounded-xl p-2 text-center">
          <div className="mb-1">
            <span className="text-[9px] md:text-[10px] font-semibold text-gray-500 uppercase tracking-wide">
              ALTURA
            </span>
          </div>
          <span className="font-bold text-xs md:text-sm">
            {details.height / 10} m
          </span>
        </div>

        <div className="bg-gray-50 rounded-xl p-2 text-center">
          <div className="mb-1">
            <span className="text-[9px] md:text-[10px] font-semibold text-gray-500 uppercase tracking-wide">
              CATEGORÍA
            </span>
          </div>
          <span className="font-bold text-xs md:text-sm">Pokémon</span>
        </div>

        <div className="bg-gray-50 rounded-xl p-2 text-center">
          <div className="mb-1">
            <span className="text-[9px] md:text-[10px] font-semibold text-gray-500 uppercase tracking-wide">
              HABILIDAD
            </span>
          </div>
          <span className="font-bold text-xs md:text-sm">
            {details.abilities
              ?.filter((a) => !a.is_hidden)[0]
              ?.ability.name.replace("-", " ") || "Overgrow"}
          </span>
        </div>
      </div>

      {/* Descripción */}
      <div className="mb-3">
        <p className="text-gray-700 text-xs leading-tight">
          Un Pokémon de tipo{" "}
          {details.types.map((t) => t.type.name).join(" y ")}.
        </p>
      </div>
    </div>
  );
};

export default PokemonInfoCard; 