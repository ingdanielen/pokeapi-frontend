import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { PokemonDetails } from "../types/pokemon";
import { getMainTypeColor, getTypeColor } from "../utils/pokemonColors";
import { getStatBarColor, getStatBarPercentage } from "../utils/statColors";
import {
  getTypeWeaknesses,
  typeTranslations,
} from "../utils/typeEffectiveness";

interface PokemonModalProps {
  open: boolean;
  onClose: () => void;
  details: PokemonDetails | null;
  loading: boolean;
  error: string | null;
}

const PokeballSVG = ({ size = 340, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 131 133"
    fill="none"
    className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none opacity-20 ${className}`}
  >
    <g>
      <path
        d="M81.2548 66.5C81.2548 75.2445 74.2011 82.3333 65.5 82.3333C56.7989 82.3333 49.7452 75.2445 49.7452 66.5C49.7452 57.7555 56.7989 50.6667 65.5 50.6667C74.2011 50.6667 81.2548 57.7555 81.2548 66.5Z"
        fill="white"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M65.5 133C98.8353 133 126.413 108.227 131 76H92.245C88.3519 87.0693 77.8475 95 65.5 95C53.1525 95 42.6481 87.0693 38.755 76H0C4.58681 108.227 32.1647 133 65.5 133ZM38.755 57H0C4.58681 24.7732 32.1647 0 65.5 0C98.8353 0 126.413 24.7732 131 57H92.245C88.3519 45.9307 77.8475 38 65.5 38C53.1525 38 42.6481 45.9307 38.755 57ZM81.2548 66.5C81.2548 75.2445 74.2011 82.3333 65.5 82.3333C56.7989 82.3333 49.7452 75.2445 49.7452 66.5C49.7452 57.7555 56.7989 50.6667 65.5 50.6667C74.2011 50.6667 81.2548 57.7555 81.2548 66.5Z"
        fill="white"
      />
    </g>
  </svg>
);

const PokemonModal: React.FC<PokemonModalProps> = ({
  open,
  onClose,
  details,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [isClosing, setIsClosing] = useState(false);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      setIsClosing(false);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  // Handle click outside to close modal
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      handleClose();
    }
  };

  // Handle close with smooth animation
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 150);
  };

  if (!open && !isClosing) return null;

  // Get the best quality image URL
  const getPokemonImageUrl = (details: PokemonDetails) => {
    if (details.sprites.other?.["official-artwork"]?.front_default) {
      return details.sprites.other["official-artwork"].front_default;
    }
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${details.id}.png`;
  };

  // Colores y fondo
  const mainColor = details ? getMainTypeColor(details.types) : "#f4f4f4";
  

  const weaknesses = details
    ? getTypeWeaknesses(details.types)
    : ["fire", "psychic", "flying", "ice"];

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 transition-opacity duration-150 ${
        isClosing ? "opacity-0" : "opacity-100"
      }`}
      onClick={handleBackdropClick}
      style={{ backdropFilter: "blur(4px)" }}
    >
      <div
        ref={modalRef}
        className={`relative rounded-3xl shadow-2xl w-full mx-2 md:mx-24 flex flex-col md:flex-row transition-all duration-200 ${
          isClosing
            ? "scale-95 opacity-0 translate-y-2"
            : "scale-100 opacity-100 translate-y-0"
        }`}
        style={{
          zIndex: 10,
          maxHeight: "95vh",
          background: mainColor,
          overflow: "visible",
        }}
      >
        {/* Columna izquierda: datos */}
        <div className="flex-1 flex flex-col gap-3 z-10 p-4 order-2 md:order-1">
          {/* Header - Nombre y tipos */}
          <div className="text-center md:text-left">
            {/* Nombre y número */}
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
              <span className="text-2xl md:text-3xl font-extrabold capitalize text-white drop-shadow-lg">
                {details?.name}
              </span>
              {details && (
                <span className="text-white/80 font-bold text-xl md:text-2xl drop-shadow-lg">
                  #{details.id.toString().padStart(3, "0")}
                </span>
              )}
            </div>
            {/* Tipos */}
            <div className="flex gap-2 justify-center md:justify-start mb-3">
              {details?.types.map((t) => (
                <span
                  key={t.type.name}
                  className="px-3 py-1 rounded-full bg-white text-xs font-semibold shadow"
                  style={{ color: getTypeColor(t.type.name) }}
                >
                  {t.type.name}
                </span>
              ))}
            </div>
          </div>

          {/* Card principal con información */}
          <div className="bg-white rounded-2xl py-4 shadow-lg px-8 lg:mr-10 ">
            {/* Peso, altura, categoría, habilidad principales */}
            <div className="grid grid-cols-4 gap-2 text-base mb-3">
              <div className="bg-gray-50 rounded-xl p-2 text-center">
                <div className="mb-1">
                  <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">
                    PESO
                  </span>
                </div>
                <span className="font-bold text-sm">
                  {details ? details.weight / 10 : "6,9"} kg
                </span>
              </div>

              <div className="bg-gray-50 rounded-xl p-2 text-center">
                <div className="mb-1">
                  <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">
                    ALTURA
                  </span>
                </div>
                <span className="font-bold text-sm">
                  {details ? details.height / 10 : "0,7"} m
                </span>
              </div>

              <div className="bg-gray-50 rounded-xl p-2 text-center">
                <div className="mb-1">
                  <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">
                    CATEGORÍA
                  </span>
                </div>
                <span className="font-bold text-sm">Pokémon</span>
              </div>

              <div className="bg-gray-50 rounded-xl p-2 text-center">
                <div className="mb-1">
                  <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">
                    HABILIDAD
                  </span>
                </div>
                <span className="font-bold text-sm">
                  {details?.abilities
                    ?.filter((a) => !a.is_hidden)[0]
                    ?.ability.name.replace("-", " ") || "Overgrow"}
                </span>
              </div>
            </div>

            {/* Descripción */}
            {details && (
              <div className="mb-3">
                <p className="text-gray-700 text-xs leading-tight">
                  Un Pokémon de tipo{" "}
                  {details.types.map((t) => t.type.name).join(" y ")}.
                </p>
              </div>
            )}



            {/* Debilidades */}
            {weaknesses.length > 0 && (
              <div className="mb-3">
                <h3 className="font-bold text-sm mb-2 text-gray-800">
                  Debilidades
                </h3>
                <div className="flex flex-wrap gap-1">
                  {weaknesses.slice(0, 4).map((weakness) => (
                    <div
                      key={weakness}
                      className="flex items-center px-2 py-1 rounded-full text-white font-semibold shadow-lg"
                      style={{ backgroundColor: getTypeColor(weakness) }}
                    >
                      <span className="text-white text-[10px]">
                        {typeTranslations[weakness] || weakness}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Stats y Habilidades en grid */}
            <div className="grid grid-cols-2 gap-3">
              {/* Stats SIEMPRE visibles */}
              {details && (
                <div>
                  <h3 className="font-bold text-sm mb-2 text-gray-800">
                    Estadísticas base
                  </h3>
                  <ul className="flex flex-col gap-1">
                    {details.stats.map((s) => (
                      <li key={s.stat.name} className="flex items-center gap-1">
                        <span className="capitalize w-16 inline-block text-[10px] font-medium">
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
                        <span className="w-6 text-right font-bold text-[10px]">
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
                  <h3 className="font-bold text-sm mb-2 text-gray-800">
                    Habilidades
                  </h3>
                  <div className="flex flex-wrap gap-1">
                    {details.abilities.map((ability) => (
                      <span
                        key={ability.ability.name}
                        className={`px-2 py-1 rounded-full text-[10px] font-semibold shadow ${
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
        <div className="relative md:w-64 w-full h-64 md:h-auto flex items-center justify-center order-1 md:order-2">
          {/* Contenedor para la pokebola con overflow hidden */}
          <div className="relative w-full h-full overflow-hidden">
            <PokeballSVG size={240} className="opacity-10" />
          </div>

          {/* Imagen del pokemon que puede sobresalir */}
          {details && (
            <div
              className="w-72 h-72 md:w- md:h-96 lg:w-112 lg:h-112"
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 30,
                pointerEvents: "none",
                filter: "drop-shadow(0 12px 48px rgba(0,0,0,0.25))",
              }}
            >
              <Image
                src={getPokemonImageUrl(details)}
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
          onClick={handleClose}
          className="absolute top-3 right-3 text-3xl font-bold text-gray-400 hover:text-red-500 z-20 transition-colors duration-200"
          aria-label="Cerrar"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default PokemonModal;
