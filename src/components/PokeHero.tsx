/**
 * @fileoverview Componente Hero principal de la aplicación Pokémon
 * Este componente renderiza la sección hero con título, descripción,
 * botón de exploración y elementos decorativos animados.
 */

"use client"
import type React from "react"
import Image from "next/image"
import WaveAnimation from "./PixelDissolveAnimation"
import { EyeIcon } from "lucide-react"

/**
 * Props del componente PokemonHero
 */
interface PokemonHeroProps {
  /** Función opcional que se ejecuta al hacer clic en explorar */
  onExploreClick?: () => void
}

/**
 * Componente Hero principal de la aplicación Pokémon
 * 
 * Este componente crea la sección hero de la aplicación con:
 * - Título principal con branding
 * - Descripción de la aplicación
 * - Botón de exploración con scroll suave
 * - Imagen decorativa de Pokémon
 * - Elementos animados (pokéball giratoria, oleaje)
 * - Diseño responsivo completo
 * 
 * El componente incluye funcionalidad de scroll automático
 * hacia la sección de contenido cuando se hace clic en "Explorar".
 * 
 * @param props - Propiedades del componente
 * @param props.onExploreClick - Función callback opcional
 * 
 * @returns JSX.Element - Sección hero completa
 * 
 * @example
 * ```typescript
 * <PokemonHero 
 *   onExploreClick={() => console.log('Explorando...')} 
 * />
 * ```
 */
const PokemonHero: React.FC<PokemonHeroProps> = ({ onExploreClick }) => {
  /**
   * Maneja el clic en el botón de exploración
   * Realiza scroll suave hacia la sección de contenido
   */
  const handleExploreClick = () => {
    // Buscar el elemento que contenga el ControlBar o PokemonGrid como referencia
    const contentElement = document.querySelector('[data-content-section]') || 
                          document.querySelector('.control-bar') ||
                          document.querySelector('.pokemon-grid') ||
                          document.querySelector('.pokemon-table');
    
    if (contentElement) {
      contentElement.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    } else {
      // Fallback: scroll down by the hero height
      window.scrollBy({ 
        top: window.innerHeight, 
        behavior: 'smooth' 
      });
    }
    
    // También ejecutar la función prop si existe
    if (onExploreClick) {
      onExploreClick();
    }
  };

  return (
    <div className="relative bg-orange-600 overflow-hidden -mt-5" >
      {/* Decorative elements */}


      {/* Hero Content */}
      <div className="relative z-10 flex items-center py-10  lg:py-16 px-4 lg:px-16">
        <div className="w-full grid md:grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
          {/* Contenido del hero */}
          <div className="space-y-4 sm:space-y-6 lg:space-y-8 md:text-center lg:text-left md:max-w-2xl md:mx-auto">
            {/* Logo Pokémon */}
            {/* Título principal */}
            <div className="space-y-2 sm:space-y-3 lg:space-y-4">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white drop-shadow-2xl leading-tight font-kinetika">
                PokeApi
                <span className="text-blue-900/50">Kanto</span>
              </h1>
              <p className="text-lg sm:text-xl md:text-xl text-white/90 max-w-lg md:max-w-2xl md:mx-auto lg:mx-0 leading-relaxed drop-shadow-lg">
                Explora los datos de los Pokémon de la primera generación.
              </p>
            </div>

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:justify-center lg:justify-start">
              <button
                onClick={handleExploreClick}
                className="group px-6 sm:px-8 md:px-10 lg:px-12 py-3 sm:py-4 bg-white text-orange-600 rounded-lg font-bold text-base sm:text-lg md:text-lg cursor-pointer hover:text-orange-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3"
              >
                <EyeIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                Explorar Pokémon
              </button>
            </div>

            {/* Pokéball decorativa con animación */}
            <div className="absolute -right-20 top-1/2 transform -translate-y-1/2 opacity-20 animate-spin-slow">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={256}
                height={256}
                viewBox="0 0 131 133"
                fill="none"
                className="w-64 h-64"
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
            </div>
          </div>

          {/* Imagen de Pokémon - Reemplazando las pokédex */}
          <div className="relative md:flex md:justify-center md:order-first lg:order-last">
            <div className="relative  z-10 transform  hover:scale-105 transition-transform duration-500 w-full md:w-9/12 lg:w-full md:h-auto">
              <Image
                src="/images/pokehero.png"
                alt="Pokémon Group"
                width={800}
                height={600}
                className="object-contain drop-shadow-2xl"
                priority
              />
            </div>

            {/* Efectos de fondo */}
          </div>
        </div>
      </div>

      {/* Animación de oleaje */}
      <div className="mt-28 lg:mt-40">
      <WaveAnimation 
        height={180}
        waveColor="#ffffff"
      />
      </div>
      <style jsx>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
      `}</style>
    </div>
  )
}

export default PokemonHero
