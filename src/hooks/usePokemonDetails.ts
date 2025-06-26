import axios from "axios";
import { useRef, useState } from "react";
import { PokemonDetails } from "../types/pokemon";

export function usePokemonDetails() {
  const cache = useRef<Record<string, PokemonDetails>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<PokemonDetails | null>(null);

  const fetchDetails = async (nameOrUrl: string) => {
    setLoading(true);
    setError(null);
    setData(null);

    const key = nameOrUrl.toLowerCase();

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
