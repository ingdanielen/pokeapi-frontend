import React from "react";

const Footer: React.FC = () => (
  <footer className="w-full bg-gray-50 border-t border-gray-200 mt-auto">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo y descripción */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">P</span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-900 font-semibold">Pokémon Explorer</span>
            <span className="text-gray-500 text-sm">Descubre el mundo Pokémon</span>
          </div>
        </div>

        {/* Enlaces y créditos */}
        <div className="flex flex-col items-center md:items-end gap-2">
          <div className="flex items-center gap-4 text-gray-600 text-sm">
            <a 
              href="https://pokeapi.co/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-gray-900 transition-colors duration-200 flex items-center gap-1"
            >
              <span>Powered by</span>
              <span className="font-semibold">PokéAPI</span>
            </a>
            <span className="text-gray-400">•</span>
            <span className="text-gray-600">Hecho con ❤️</span>
          </div>
          <span className="text-xs text-gray-400 text-center md:text-right">
            Pokémon es marca registrada de Nintendo, Game Freak y Creatures Inc.
          </span>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer; 