/**
 * @fileoverview React Context for managing Pokémon data throughout the application
 * This context provides centralized state management for Pokémon data, including
 * the list of Pokémon, their details, types, and modal state.
 */

import React, { createContext, useContext, useEffect, useState } from "react";
import { usePokemonDetailsCache } from "../hooks/usePokemonDetailsCache";
import { usePokemonList } from "../hooks/usePokemonList";
import { usePokemonTypes } from "../hooks/usePokemonTypes";
import { PokemonDetails, PokemonListItem, PokemonTypeOption } from "../types/pokemon";

/**
 * Interface defining the shape of the Pokémon data context
 */
interface PokemonDataContextProps {
  /** Array of Pokémon list items */
  pokemons: PokemonListItem[];
  /** Loading state for the Pokémon list */
  loading: boolean;
  /** Error message for the Pokémon list */
  error: string | null;
  /** Array of available Pokémon types */
  pokemonTypes: PokemonTypeOption[];
  /** Loading state for Pokémon types */
  typesLoading: boolean;
  /** Error message for Pokémon types */
  typesError: string | null;
  /** Function to fetch details for multiple Pokémon */
  fetchDetails: (namesOrUrls: string[]) => Promise<void>;
  /** Function to get cached Pokémon details */
  getDetails: (nameOrUrl: string) => PokemonDetails | null;
  /** Function to check if details are loading for a specific Pokémon */
  isLoadingDetails: (nameOrUrl: string) => boolean;
  /** Currently selected Pokémon for modal display */
  selectedPokemon: string | null;
  /** Function to set the selected Pokémon */
  setSelectedPokemon: (pokemonName: string | null) => void;
  /** Function to open the modal for a specific Pokémon */
  openModal: (pokemonName: string) => void;
  /** Function to close the modal */
  closeModal: () => void;
}

/**
 * React Context for Pokémon data
 */
const PokemonDataContext = createContext<PokemonDataContextProps | undefined>(undefined);

/**
 * Provider component that wraps the application and provides Pokémon data
 * 
 * This component combines multiple hooks to provide a unified interface for
 * managing Pokémon data throughout the application. It automatically loads
 * the initial list of Pokémon and their types, and provides functions for
 * fetching detailed information and managing the modal state.
 * 
 * @param children - React components that will have access to the context
 * 
 * @example
 * ```typescript
 * function App() {
 *   return (
 *     <PokemonDataProvider>
 *       <HomePage />
 *     </PokemonDataProvider>
 *   );
 * }
 * ```
 */
export const PokemonDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Fetch basic Pokémon list
  const { data: pokemons, loading, error } = usePokemonList();
  // Fetch available Pokémon types
  const { types: pokemonTypes, loading: typesLoading, error: typesError } = usePokemonTypes();
  // Cache for detailed Pokémon information
  const { fetchDetails, getDetails, isLoading } = usePokemonDetailsCache();
  
  /** Currently selected Pokémon for modal display */
  const [selectedPokemon, setSelectedPokemon] = useState<string | null>(null);

  // Automatically load details for all Pokémon when the list is loaded
  useEffect(() => {
    if (pokemons.length > 0 && !loading) {
      const pokemonNames = pokemons.map(p => p.name);
      fetchDetails(pokemonNames);
    }
  }, [pokemons, loading, fetchDetails]);

  /**
   * Opens the modal for a specific Pokémon
   * This function ensures the Pokémon details are loaded before opening the modal
   * 
   * @param pokemonName - The name of the Pokémon to display in the modal
   */
  const openModal = async (pokemonName: string) => {
    await fetchDetails([pokemonName]);
    setSelectedPokemon(pokemonName);
  };

  /**
   * Closes the modal by clearing the selected Pokémon
   */
  const closeModal = () => {
    setSelectedPokemon(null);
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
        selectedPokemon,
        setSelectedPokemon,
        openModal,
        closeModal,
      }}
    >
      {children}
    </PokemonDataContext.Provider>
  );
};

/**
 * Custom hook to access the Pokémon data context
 * 
 * This hook provides access to all the Pokémon data and functions
 * defined in the context. It must be used within a component that
 * is wrapped by the PokemonDataProvider.
 * 
 * @returns The Pokémon data context value
 * @throws Error if used outside of PokemonDataProvider
 * 
 * @example
 * ```typescript
 * function PokemonList() {
 *   const { pokemons, loading, error, openModal } = usePokemonData();
 * 
 *   if (loading) return <div>Loading...</div>;
 *   if (error) return <div>Error: {error}</div>;
 * 
 *   return (
 *     <div>
 *       {pokemons.map(pokemon => (
 *         <button key={pokemon.name} onClick={() => openModal(pokemon.name)}>
 *           {pokemon.name}
 *         </button>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export function usePokemonData() {
  const ctx = useContext(PokemonDataContext);
  if (!ctx) throw new Error("usePokemonData must be used within a PokemonDataProvider");
  return ctx;
} 