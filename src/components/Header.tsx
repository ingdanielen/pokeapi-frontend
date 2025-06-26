"use client";
import React, { useState, useEffect, useRef } from "react";
import { usePokemonData } from "../context/PokemonDataContext";
import { usePokemonDetailsCache } from "../hooks/usePokemonDetailsCache";
import Image from "next/image";

interface HeaderProps {
  onPokemonSelect?: (pokemonName: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onPokemonSelect }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const { pokemons } = usePokemonData();
  const { fetchDetails } = usePokemonDetailsCache();

  // Función para obtener el ID del Pokémon desde la URL
  const getIdFromUrl = (url: string) => {
    const match = url.match(/\/pokemon\/(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  };

  // Función para obtener la URL de la imagen del Pokémon
  const getPokemonImageUrl = (url: string) => {
    const id = getIdFromUrl(url);
    return id ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png` : "/favicon.ico";
  };

  // Filtrar Pokémon basado en el término de búsqueda
  const filteredPokemons = pokemons.filter(pokemon =>
    pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 8); // Limitar a 8 resultados

  // Manejar clics fuera del área de búsqueda
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Manejar navegación con teclado
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => 
        prev < filteredPokemons.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      handlePokemonSelect(filteredPokemons[selectedIndex].name);
    } else if (e.key === 'Escape') {
      setShowResults(false);
      setSelectedIndex(-1);
    }
  };

  const handlePokemonSelect = async (pokemonName: string) => {
    await fetchDetails([pokemonName]);
    onPokemonSelect?.(pokemonName);
    setSearchTerm("");
    setShowResults(false);
    setSelectedIndex(-1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowResults(value.length > 0);
    setSelectedIndex(-1);
  };

  const handleInputFocus = () => {
    if (searchTerm.length > 0) {
      setShowResults(true);
    }
  };

  return (
    <header className="w-full bg-red-800 shadow-sm border-b border-gray-200 p-4 rounded-b-xl">
        <div className="flex items-center gap-6 h-16 lg:px-16 px-4">
          {/* Logo y título */}
            <div className="relative flex-shrink-0">
              <Image
                src="/images/pokeapi.png"
                alt="Pokémon Explorer"
                width={150}
                height={150}
                className="object-contain md:w-32 md:h-32 w-16 h-16"
              />
            </div>

          {/* Barra de búsqueda */}
          <div className="flex-1 max-w-md" ref={searchRef}>
            <div className="relative">
              <div className="relative">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Buscar Pokémon..."
                  value={searchTerm}
                  onChange={handleInputChange}
                  onFocus={handleInputFocus}
                  onKeyDown={handleKeyDown}
                  className="w-full px-4 py-1 pl-10 pr-4 bg-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder-gray-500 text-gray-900"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              {/* Resultados de búsqueda */}
              {showResults && filteredPokemons.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-50">
                  <div className="max-h-80 overflow-y-auto">
                    {filteredPokemons.map((pokemon, index) => (
                      <button
                        key={pokemon.name}
                        onClick={() => handlePokemonSelect(pokemon.name)}
                        className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors duration-150 ${
                          index === selectedIndex ? 'bg-blue-50' : ''
                        } ${index === 0 ? 'rounded-t-lg' : ''} ${index === filteredPokemons.length - 1 ? 'rounded-b-lg' : ''}`}
                      >
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                          <Image
                            src={getPokemonImageUrl(pokemon.url)}
                            alt={pokemon.name}
                            width={100}
                            height={100}
                            className="object-contain"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "/favicon.ico";
                            }}
                          />
                        </div>
                        <div className="flex flex-col flex-1 text-left">
                          <span className="text-gray-800 font-medium capitalize">
                            {pokemon.name}
                          </span>
                          <span className="text-gray-500 text-sm">
                            #{getIdFromUrl(pokemon.url)}
                          </span>
                        </div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Mensaje cuando no hay resultados */}
              {showResults && searchTerm.length > 0 && filteredPokemons.length === 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50">
                  <div className="text-center text-gray-500">
                    <svg className="w-6 h-6 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
                    </svg>
                    <p className="font-medium">No se encontraron Pokémon</p>
                    <p className="text-sm">Intenta con otro nombre</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
    </header>
  );
};

export default Header; 