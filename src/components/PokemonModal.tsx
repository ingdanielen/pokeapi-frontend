/**
 * @fileoverview Modal para mostrar información detallada de un Pokémon
 * Este componente renderiza un modal completo que muestra toda la información
 * detallada de un Pokémon incluyendo estadísticas, habilidades, debilidades y más.
 */

import Image from "next/image";
import React from "react";
import { PokemonDetails } from "../types/pokemon";
import { getMainTypeColor, getTypeColor } from "../utils/pokemonColors";
import { getStatBarColor, getStatBarPercentage } from "../utils/statColors";
import {
  getTypeWeaknesses,
  typeTranslations,
} from "../utils/typeEffectiveness";
import Modal from "./ui/Modal";
import { PokeballSVG } from "./ui/PokeballSVG";
import { Weight, Ruler, LayoutGrid, BadgeCheck } from "lucide-react";

/**
 * Props del componente PokemonModal
 */
interface PokemonModalProps {
  /** Estado de apertura del modal */
  open: boolean;
  /** Función para cerrar el modal */
  onClose: () => void;
  /** Datos detallados del Pokémon */
  details: PokemonDetails | null;
  /** Estado de carga de los datos */
  loading: boolean;
  /** Mensaje de error si existe */
  error: string | null;
}

/**
 * Modal que muestra información detallada de un Pokémon
 * 
 * Este componente renderiza un modal completo con diseño responsivo que incluye:
 * - Imagen oficial del Pokémon
 * - Información básica (nombre, número, tipos)
 * - Características físicas (peso, altura)
 * - Estadísticas base con barras de progreso
 * - Habilidades (normales y ocultas)
 * - Debilidades de tipo
 * - Descripción básica
 * 
 * El modal utiliza colores basados en los tipos del Pokémon y se adapta
 * a diferentes tamaños de pantalla con un diseño mobile-first.
 * 
 * @param props - Propiedades del componente
 * @param props.open - Estado de apertura del modal
 * @param props.onClose - Función para cerrar el modal
 * @param props.details - Datos detallados del Pokémon
 * @param props.loading - Estado de carga
 * @param props.error - Mensaje de error
 * 
 * @returns JSX.Element - Modal con información detallada del Pokémon
 * 
 * @example
 * ```typescript
 * <PokemonModal
 *   open={isModalOpen}
 *   onClose={() => setIsModalOpen(false)}
 *   details={selectedPokemon}
 *   loading={isLoading}
 *   error={error}
 * />
 * ```
 */
const PokemonModal: React.FC<PokemonModalProps> = ({
  open,
  onClose,
  details,
}) => {
  /** Color principal basado en el tipo del Pokémon */
  const mainColor = details ? getMainTypeColor(details.types) : "#f4f4f4";

  /** Debilidades del Pokémon calculadas desde sus tipos */
  const weaknesses = details
    ? getTypeWeaknesses(details.types)
    : ["fire", "psychic", "flying", "ice"];

  return (
    <Modal 
      open={open} 
      onClose={onClose}
      className="flex flex-col md:flex-row"
      style={{
        background: mainColor,
      }}
    >
      {/* Columna izquierda: información detallada */}
      <div className="flex-1 flex flex-col gap-3 z-10 p-3 md:p-4 order-2 md:order-1 overflow-y-auto">
        {/* Encabezado con nombre, número y tipos */}
        <div className="text-center md:text-left">
          {/* Nombre y número de Pokédex */}
          <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
            <span className="text-xl md:text-3xl font-extrabold capitalize text-white drop-shadow-lg">
              {details?.name}
            </span>
            {details && (
              <span className="text-white/80 font-bold text-lg md:text-2xl drop-shadow-lg">
                #{details.id.toString().padStart(3, "0")}
              </span>
            )}
          </div>
          
          {/* Badges de tipos */}
          <div className="flex gap-2 justify-center md:justify-start mb-3">
            {details?.types.map((t) => (
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

        {/* Tarjeta principal con información detallada */}
        <div className="bg-white rounded-2xl py-3 md:py-4 shadow-lg px-2 md:px-8 lg:mr-10 relative z-20">
          {/* Grid 1x4 de características básicas compacto */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-4">
            {/* Peso */}
            <div className="bg-white/80 border border-gray-200 rounded-2xl p-3 flex flex-col items-start shadow-none min-w-0">
              <div className="flex items-center gap-1 mb-1">
                {/* Ícono peso Lucide */}
                <Weight size={16} className="text-gray-400" />
                <span className="text-[11px] font-medium text-gray-400 uppercase tracking-[0.12em]">Peso</span>
              </div>
              <span className="text-2xl font-semibold text-gray-800 leading-none">{details ? (details.weight / 10).toLocaleString('es-ES', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) : "6,9"} kg</span>
            </div>
            {/* Altura */}
            <div className="bg-white/80 border border-gray-200 rounded-2xl p-3 flex flex-col items-start shadow-none min-w-0">
              <div className="flex items-center gap-1 mb-1">
                {/* Ícono altura Lucide */}
                <Ruler size={16} className="text-gray-400" />
                <span className="text-[11px] font-medium text-gray-400 uppercase tracking-[0.12em]">Altura</span>
              </div>
              <span className="text-2xl font-semibold text-gray-800 leading-none">{details ? (details.height / 10).toLocaleString('es-ES', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) : "0,7"} m</span>
            </div>
            {/* Categoría */}
            <div className="bg-white/80 border border-gray-200 rounded-2xl p-3 flex flex-col items-start shadow-none min-w-0">
              <div className="flex items-center gap-1 mb-1">
                {/* Ícono categoría Lucide */}
                <LayoutGrid size={16} className="text-gray-400" />
                <span className="text-[11px] font-medium text-gray-400 uppercase tracking-[0.12em]">Categoria</span>
              </div>
              <span className="text-2xl font-semibold text-gray-800 leading-none">Pokemon</span>
            </div>
            {/* Habilidad principal */}
            <div className="bg-white/80 border border-gray-200 rounded-2xl p-3 flex flex-col items-start shadow-none min-w-0">
              <div className="flex items-center gap-1 mb-1">
                {/* Ícono habilidad Lucide */}
                <BadgeCheck size={16} className="text-gray-400" />
                <span className="text-[11px] font-medium text-gray-400 uppercase tracking-[0.12em]">Habilidad</span>
              </div>
              <span className="text-2xl font-semibold text-gray-800 leading-none">{details?.abilities?.filter((a) => !a.is_hidden)[0]?.ability.name.replace("-", " ") || "Overgrow"}</span>
            </div>
          </div>

          {/* Descripción básica */}
          {details && (
            <div className="mb-3">
              <p className="text-gray-700 text-xs leading-tight">
                Un Pokémon de tipo{" "}
                {details.types.map((t) => t.type.name).join(" y ")}.
              </p>
            </div>
          )}

          {/* Sección de debilidades */}
          {weaknesses.length > 0 && (
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
          )}

          {/* Grid de estadísticas y habilidades */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Estadísticas base */}
            {details && (
              <div>
                <h3 className="font-bold text-xs md:text-sm mb-2 text-gray-800">
                  Estadísticas base
                </h3>
                <ul className="flex flex-col gap-1">
                  {details.stats.map((s) => (
                    <li key={s.stat.name} className="flex items-center gap-1">
                      <span className="capitalize w-12 md:w-16 inline-block text-[9px] md:text-[10px] font-medium">
                        {s.stat.name}
                      </span>
                      <div className="flex-1 h-2 rounded-full bg-gray-200 overflow-hidden">
                        <div
                          className={`h-2 rounded-full ${getStatBarColor(
                            s.stat.name,
                            s.base_stat
                          )}`}
                          style={{
                            width: `${getStatBarPercentage(s.base_stat)}%`,
                          }}
                        />
                      </div>
                      <span className="w-6 text-right font-bold text-[9px] md:text-[10px]">
                        {s.base_stat}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Habilidades (todas) */}
            {details && (
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
            )}
          </div>
        </div>
      </div>

      {/* Columna derecha: imagen superpuesta */}
      <div className="relative md:w-64 w-full h-48 md:h-auto flex items-center justify-center order-1 md:order-2">
        {/* Contenedor para la pokebola con overflow hidden */}
        <div className="relative w-full h-full overflow-hidden mt-40">
          <PokeballSVG size={280} className="opacity-10" />
        </div>

        {/* Imagen del pokemon que puede sobresalir */}
        {details && (
          <div
            className="w-56 h-56 md:w-72 md:h-72 lg:w-96 lg:h-96"
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 40,
              pointerEvents: "none",
              filter: "drop-shadow(0 12px 48px rgba(0,0,0,0.25))",
            }}
          >
            <Image
              src={
                details?.sprites?.other?.["official-artwork"]
                  ?.front_default ?? ""
              }
              alt={details.name}
              width={1000}
              height={1000}
              className="object-contain select-none"
              style={{ width: "100%", height: "100%" }}
              priority
            />
          </div>
        )}
      </div>

      {/* Botón cerrar */}
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-3xl font-bold text-gray-400 hover:text-red-500 z-20 transition-colors duration-200"
        aria-label="Cerrar"
      >
        ×
      </button>
    </Modal>
  );
};

export default PokemonModal;
