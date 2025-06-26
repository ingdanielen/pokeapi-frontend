import React, { createContext, useContext, useEffect, useState } from "react";
import { usePokemonList } from "../hooks/usePokemonList";
import { usePokemonTypes } from "../hooks/usePokemonTypes";
import { usePokemonDetailsCache } from "../hooks/usePokemonDetailsCache";
import { PokemonListItem, PokemonTypeOption } from "../types/pokemon";

interface PokemonDataContextProps {
  pokemons: PokemonListItem[];
  loading: boolean;
  error: string | null;
  pokemonTypes: PokemonTypeOption[];
  typesLoading: boolean;
  typesError: string | null;
  fetchDetails: (namesOrUrls: string[]) => Promise<void>;
  getDetails: (nameOrUrl: string) => any;
  isLoadingDetails: (nameOrUrl: string) => boolean;
  getSpeciesData: (nameOrUrl: string) => any;
}

const PokemonDataContext = createContext<PokemonDataContextProps | undefined>(undefined);

export const PokemonDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: pokemons, loading, error } = usePokemonList();
  const { types: pokemonTypes, loading: typesLoading, error: typesError } = usePokemonTypes();
  const { fetchDetails, getDetails, isLoading } = usePokemonDetailsCache();

  // Cargar detalles de todos los pokémon automáticamente cuando se carguen los datos iniciales
  useEffect(() => {
    if (pokemons.length > 0 && !loading) {
      const pokemonNames = pokemons.map(p => p.name);
      fetchDetails(pokemonNames);
    }
  }, [pokemons, loading, fetchDetails]);

  // Función para obtener datos de especies (placeholder por ahora)
  const getSpeciesData = (nameOrUrl: string) => {
    // Por ahora retornamos null, pero esto se puede expandir
    // para incluir caché de datos de especies
    return null;
  };

  return (
    <PokemonDataContext.Provider
      value={{
        pokemons,
        loading,
        error,
        pokemonTypes,
        typesLoading,
        typesError,
        fetchDetails,
        getDetails,
        isLoadingDetails: isLoading,
        getSpeciesData,
      }}
    >
      {children}
    </PokemonDataContext.Provider>
  );
};

export function usePokemonData() {
  const ctx = useContext(PokemonDataContext);
  if (!ctx) throw new Error("usePokemonData must be used within a PokemonDataProvider");
  return ctx;
} 