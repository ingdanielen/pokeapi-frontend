import { useEffect, useState } from "react";
import axios from "axios";
import { PokemonListItem } from "../types/pokemon";

export function usePokemonList() {
  const [data, setData] = useState<PokemonListItem[]>([]);
  const [loading, setLoading] = useState(true);
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