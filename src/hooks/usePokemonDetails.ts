/**
 * @fileoverview Custom hook for fetching detailed Pokémon information with caching
 * This hook provides a way to fetch detailed information about a specific Pokémon
 * and includes an in-memory cache to avoid redundant API calls.
 */

import axios from "axios";
import { useRef, useState } from "react";
import { PokemonDetails } from "../types/pokemon";

/**
 * Custom hook for fetching detailed Pokémon information with caching
 * 
 * This hook provides functionality to fetch detailed information about a specific Pokémon
 * by name or URL. It includes an in-memory cache to avoid making redundant API calls
 * for the same Pokémon.
 * 
 * @returns An object containing:
 *   - `data`: Detailed Pokémon information or null if not loaded
 *   - `loading`: Boolean indicating if a request is in progress
 *   - `error`: String containing error message if request failed, null otherwise
 *   - `fetchDetails`: Function to fetch details for a specific Pokémon
 * 
 * @example
 * ```typescript
 * function PokemonDetail({ pokemonName }: { pokemonName: string }) {
 *   const { data, loading, error, fetchDetails } = usePokemonDetails();
 * 
 *   useEffect(() => {
 *     fetchDetails(pokemonName);
 *   }, [pokemonName, fetchDetails]);
 * 
 *   if (loading) return <div>Loading...</div>;
 *   if (error) return <div>Error: {error}</div>;
 *   if (!data) return <div>No data</div>;
 * 
 *   return (
 *     <div>
 *       <h1>{data.name}</h1>
 *       <p>Height: {data.height}</p>
 *       <p>Weight: {data.weight}</p>
 *     </div>
 *   );
 * }
 * ```
 */
export function usePokemonDetails() {
  /** In-memory cache for Pokémon details */
  const cache = useRef<Record<string, PokemonDetails>>({});
  /** Loading state for the current request */
  const [loading, setLoading] = useState(false);
  /** Error message if the request failed */
  const [error, setError] = useState<string | null>(null);
  /** Current Pokémon details data */
  const [data, setData] = useState<PokemonDetails | null>(null);

  /**
   * Fetches detailed information for a specific Pokémon
   * 
   * @param nameOrUrl - The name of the Pokémon or the full URL to fetch details from
   * 
   * @example
   * ```typescript
   * // Using Pokémon name
   * await fetchDetails("charizard");
   * 
   * // Using full URL
   * await fetchDetails("https://pokeapi.co/api/v2/pokemon/6");
   * ```
   */
  const fetchDetails = async (nameOrUrl: string) => {
    setLoading(true);
    setError(null);
    setData(null);

    const key = nameOrUrl.toLowerCase();

    // Check cache first
    if (cache.current[key]) {
      setData(cache.current[key]);
      setLoading(false);
      return;
    }

    try {
      const url = nameOrUrl.startsWith("http")
        ? nameOrUrl
        : `https://pokeapi.co/api/v2/pokemon/${nameOrUrl}`;
      const res = await axios.get(url);
      cache.current[key] = res.data;
      setData(res.data);
    } catch {
      setError("Error al cargar detalles del Pokémon");
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    error,
    fetchDetails,
  };
}
