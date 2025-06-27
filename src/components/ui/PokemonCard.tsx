/**
 * @fileoverview Componente de tarjeta individual para mostrar un Pokémon
 * Este componente renderiza una tarjeta interactiva que muestra la información
 * básica de un Pokémon con su imagen, tipos, estadísticas y efectos visuales.
 */

import React from "react";
import Image from "next/image";
import { PokemonDetails, PokemonListItem, PokemonType } from "../../types/pokemon";
import { getTypeColor } from "../../utils/pokemonColors";
import PokeballSVG from "./PokeballSVG";
import LoaderCard from "./LoaderCard";
import StatBars from "./StatBars";
import PokemonTypeBadge from "./PokemonTypeBadge";

/**
 * Props del componente PokemonCard
 */
interface PokemonCardProps {
  /** Datos básicos del Pokémon */
  pokemon: PokemonListItem;
  /** Datos detallados del Pokémon desde el caché */
  details?: PokemonDetails; // Pokemon details from cache
  /** Estado de carga de los datos del Pokémon */
  loading: boolean;
  /** ID numérico del Pokémon */
  id: number;
  /** Función que se ejecuta al hacer clic en la tarjeta */
  onClick: () => void;
}

/**
 * Componente de tarjeta individual para mostrar un Pokémon
 * 
 * Este componente renderiza una tarjeta interactiva que muestra:
 * - Número de Pokédex
 * - Nombre del Pokémon
 * - Estadísticas básicas
 * - Tipos del Pokémon
 * - Imagen oficial del Pokémon
 * - Fondo con colores basados en los tipos
 * 
 * La tarjeta incluye efectos visuales como hover, transiciones suaves
 * y un diseño responsivo que se adapta a diferentes tamaños de pantalla.
 * 
 * @param props - Propiedades del componente
 * @param props.pokemon - Datos básicos del Pokémon
 * @param props.details - Datos detallados del Pokémon (opcional)
 * @param props.loading - Estado de carga
 * @param props.id - ID numérico del Pokémon
 * @param props.onClick - Función de click
 * 
 * @returns JSX.Element - Tarjeta interactiva del Pokémon
 * 
 * @example
 * ```typescript
 * <PokemonCard
 *   pokemon={pokemonData}
 *   details={pokemonDetails}
 *   loading={isLoading}
 *   id={25}
 *   onClick={() => openModal(pokemon.name)}
 * />
 * ```
 */
const PokemonCard: React.FC<PokemonCardProps> = ({
  pokemon,
  details,
  loading,
  id,
  onClick,
}) => {
  /** Color de fondo de la tarjeta basado en los tipos del Pokémon */
  let bg = "#f4f4f4";

  if (details) {
    const t1 = details.types[0]?.type.name;
    const t2 = details.types[1]?.type.name;
    if (t1 && t2 && t1 !== t2) {
      // Gradiente para Pokémon con dos tipos diferentes
      bg = `linear-gradient(90deg, ${getTypeColor(t1)} 60%, ${getTypeColor(t2)} 100%)`;
    } else if (t1) {
      // Color sólido para Pokémon con un solo tipo
      bg = getTypeColor(t1);
    }
  }

  return (
    <button
      className="relative flex items-stretch rounded-3xl shadow-sm h-36 group transition-all duration-500 ease-out hover:scale-[1.03] focus:outline-none cursor-pointer"
      style={{
        background: bg,
        transition: "background 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
      onClick={onClick}
      aria-label={`Ver detalles de ${pokemon.name}`}
    >
      {/* Columna izquierda: información fija del Pokémon */}
      <div className="flex flex-col justify-between h-full w-2/5 min-w-24 bg-[#f6f7f9] group-hover:bg-transparent rounded-l-3xl px-4 py-3 transition-all duration-500 ease-out">
        {/* Número de Pokédex */}
        <span className="block text-xs text-start text-gray-500 group-hover:text-white font-semibold transition-colors duration-500 ease-out">
          #{id.toString().padStart(3, "0")}
        </span>

        {/* Nombre del Pokémon */}
        <span className="block text-lg text-start font-bold capitalize text-gray-800 group-hover:text-white mb-1 transition-colors duration-500 ease-out">
          {pokemon.name}
        </span>

        {/* Barras de estadísticas */}
        {details && details.stats && (
          <div className="mb-1.5">
            <StatBars stats={details.stats} />
          </div>
        )}

        {/* Badges de tipos */}
        <div className="flex gap-1 flex-wrap">
          {details &&
            details.types.map((t: PokemonType) => (
              <PokemonTypeBadge key={t.type.name} type={t} />
            ))}
        </div>
      </div>

      {/* Columna derecha: imagen del Pokémon con fondo de pokebola */}
      <div className="flex-1 relative flex items-end justify-end pr-6 w-1/2">
        {/* Fondo decorativo de pokebola */}
        <PokeballSVG />
        
        {/* Imagen del Pokémon o loader */}
        {loading ? (
          <LoaderCard />
        ) : (
          <Image
            src={
              details?.sprites?.other?.["official-artwork"]?.front_default ?? ""
            }
            alt={pokemon.name}
            className="w-44 h-44 select-none z-20 -mt-8"
            loading="lazy"
            width={1000}
            height={1000}
          />
        )}
      </div>
    </button>
  );
};

export default PokemonCard; 