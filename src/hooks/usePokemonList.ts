/**
 * @fileoverview Custom hook for fetching the list of Pokémon from the PokéAPI
 * This hook manages the state for loading, error handling, and data fetching
 * for the initial list of Pokémon (limited to the first 151).
 */

import { useEffect, useState } from "react";
import axios from "axios";
import { PokemonListItem } from "../types/pokemon";

/**
 * Custom hook that fetches the list of Pokémon from the PokéAPI
 * 
 * This hook automatically fetches the first 151 Pokémon when the component mounts.
 * It provides loading states, error handling, and the list of Pokémon.
 * 
 * @returns An object containing:
 *   - `data`: Array of Pokémon list items with name and URL
 *   - `loading`: Boolean indicating if the request is in progress
 *   - `error`: String containing error message if request failed, null otherwise
 * 
 * @example
 * ```typescript
 * function PokemonList() {
 *   const { data: pokemons, loading, error } = usePokemonList();
 * 
 *   if (loading) return <div>Loading...</div>;
 *   if (error) return <div>Error: {error}</div>;
 * 
 *   return (
 *     <ul>
 *       {pokemons.map(pokemon => (
 *         <li key={pokemon.name}>{pokemon.name}</li>
 *       ))}
 *     </ul>
 *   );
 * }
 * ```
 */
export function usePokemonList() {
  /** Array of Pokémon list items from the API */
  const [data, setData] = useState<PokemonListItem[]>([]);
  /** Loading state for the API request */
  const [loading, setLoading] = useState(true);
  /** Error message if the request failed */
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    axios
      .get("https://pokeapi.co/api/v2/pokemon?limit=151")
      .then((res) => setData(res.data.results))
      .catch(() => setError("Error al cargar la lista de Pokémon"))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
} 