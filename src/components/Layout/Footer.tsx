import React from "react";
import Image from "next/image";
import WaveAnimation from "../PixelDissolveAnimation";
import { HeartIcon } from "lucide-react";

const Footer: React.FC = () => (
  <>
    {/* Animación de olas arriba del footer */}
    <div className="relative mt-30">
      <WaveAnimation height={120} waveColor="#f14b00" />
    </div>

    <footer className="w-full bg-orange-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 py-8">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Logo y descripción */}
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              <Image
                src="/images/pokemon-logo-04.png"
                alt="Pokémon Explorer"
                width={120}
                height={120}
                className="object-contain w-20 h-20 drop-shadow-lg"
              />
            </div>
            <div className="flex flex-col space-y-1">
              <h3 className="text-white font-black text-2xl font-kinetika drop-shadow-lg">
                PokeApi<span className="text-blue-900/50">Kanto</span>
              </h3>
              <p className="text-white/90 text-sm font-medium drop-shadow-md">
                Explora los datos de los Pokémon de la primera generación
              </p>
            </div>
          </div>

          {/* Enlaces y créditos */}
          <div className="flex flex-col items-start md:items-end gap-4">
            <div className="flex flex-col md:items-end gap-2">
              <a
                href="https://pokeapi.co/"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                <span className="text-white font-semibold text-sm drop-shadow-md">
                  Powered by PokéAPI
                </span>
                <svg
                  className="w-4 h-4 text-white/80 group-hover:text-white transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
              <div className="flex items-center gap-2 text-white/80 text-sm">
                <span>Hecho con</span>
                <span className="text-red-300 text-lg"><HeartIcon className="w-4 h-4 fill-white" /></span>
                <span>por Daniel Escorcia</span>
              </div>
            </div>

            <div className="border-t border-white/20 pt-3 w-full md:text-right">
              <p className="text-xs text-white/70 leading-relaxed max-w-md">
                Pokémon es marca registrada de Nintendo, Game Freak y Creatures
                Inc.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  </>
);

export default Footer;
