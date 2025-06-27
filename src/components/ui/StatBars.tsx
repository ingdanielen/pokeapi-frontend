/**
 * @fileoverview Componente para mostrar barras de estadísticas de Pokémon
 * Este componente renderiza barras de progreso visuales para las estadísticas
 * más importantes de un Pokémon (HP, Ataque, Defensa, Velocidad).
 */

import React from "react";
import { PokemonStat } from "../../types/pokemon";
import {
  getStatBarColor,
  getStatBarPercentage,
  getStatShortName,
} from "../../utils/statColors";

/**
 * Props del componente StatBars
 */
interface StatBarsProps {
  /** Array de estadísticas del Pokémon */
  stats: PokemonStat[];
  /** Clases CSS adicionales para el contenedor */
  className?: string;
}

/**
 * Componente que renderiza barras de progreso para las estadísticas de un Pokémon
 * 
 * Este componente muestra las 4 estadísticas más importantes (HP, Ataque, Defensa, Velocidad)
 * en formato de barras de progreso con colores que indican el nivel de la estadística.
 * Cada barra incluye el nombre abreviado de la estadística y su valor numérico.
 * 
 * @param props - Propiedades del componente
 * @param props.stats - Array de estadísticas del Pokémon
 * @param props.className - Clases CSS adicionales (opcional)
 * 
 * @returns JSX.Element - Barras de progreso de estadísticas
 * 
 * @example
 * ```typescript
 * <StatBars 
 *   stats={pokemon.stats} 
 *   className="grid grid-cols-2 gap-2" 
 * />
 * ```
 */
const StatBars: React.FC<StatBarsProps> = ({ 
  stats, 
  className = "grid grid-cols-2 gap-1" 
}) => {
  /** Estadísticas más importantes a mostrar */
  const importantStats = ["hp", "attack", "defense", "speed"];
  
  /** Filtra solo las estadísticas importantes */
  const filteredStats = stats.filter((stat) =>
    importantStats.includes(stat.stat.name)
  );

  return (
    <div className={className}>
      {filteredStats.map((stat) => {
        /** Porcentaje de la barra basado en el valor de la estadística */
        const percentage = getStatBarPercentage(stat.base_stat);
        
        return (
          <div key={stat.stat.name} className="flex flex-col gap-0.5">
            {/* Encabezado con nombre y valor de la estadística */}
            <div className="flex items-center justify-between">
              <span className="text-[8px] font-semibold text-gray-700 group-hover:text-white transition-colors duration-300 drop-shadow-sm">
                {getStatShortName(stat.stat.name)}
              </span>
              <span className="text-[8px] font-bold text-gray-700 group-hover:text-white transition-colors duration-300 drop-shadow-sm">
                {stat.base_stat}
              </span>
            </div>
            
            {/* Barra de progreso */}
            <div className="bg-gray-300 group-hover:bg-black/30 rounded-full h-1.5 overflow-hidden transition-all duration-300">
              <div
                className={`${getStatBarColor(
                  stat.stat.name,
                  stat.base_stat
                )} h-full rounded-full transition-all duration-300`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatBars; 