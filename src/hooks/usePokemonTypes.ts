import { useEffect, useState } from "react";
import axios from "axios";
import { PokemonTypeOption } from "../types/pokemon";

export function usePokemonTypes() {
  const [types, setTypes] = useState<PokemonTypeOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    axios
      .get("https://pokeapi.co/api/v2/type")
      .then((res) => setTypes(res.data.results))
      .catch(() => setError("Error al cargar los tipos"))
      .finally(() => setLoading(false));
  }, []);

  return { types, loading, error };
} 