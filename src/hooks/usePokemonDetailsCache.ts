import { useRef, useState } from "react";
import axios from "axios";
import { PokemonDetails } from "../types/pokemon";

export function usePokemonDetailsCache() {
  const cache = useRef<Record<string, PokemonDetails | undefined>>({});
  const [loadingIds, setLoadingIds] = useState<Set<string>>(new Set());
  const [, forceUpdate] = useState({});

  // Pedir detalles de varios pokémon por nombre o url
  const fetchDetails = async (namesOrUrls: string[]) => {
    const toFetch = namesOrUrls.filter(
      (key) => !cache.current[key.toLowerCase()] && !loadingIds.has(key.toLowerCase())
    );
    if (toFetch.length === 0) return;
    setLoadingIds((prev) => new Set([...prev, ...toFetch.map((k) => k.toLowerCase())]));
    await Promise.all(
      toFetch.map(async (nameOrUrl) => {
        try {
          const url = nameOrUrl.startsWith("http")
            ? nameOrUrl
            : `https://pokeapi.co/api/v2/pokemon/${nameOrUrl}`;
          const res = await axios.get(url);
          cache.current[nameOrUrl.toLowerCase()] = res.data;
        } catch (e) {
          cache.current[nameOrUrl.toLowerCase()] = undefined;
        }
      })
    );
    setLoadingIds((prev) => {
      const next = new Set(prev);
      toFetch.forEach((k) => next.delete(k.toLowerCase()));
      return next;
    });
    forceUpdate({}); // Forzar rerender
  };

  // Obtener detalles de un pokémon
  const getDetails = (nameOrUrl: string) =>
    cache.current[nameOrUrl.toLowerCase()] ?? null;

  // Saber si está cargando
  const isLoading = (nameOrUrl: string) =>
    loadingIds.has(nameOrUrl.toLowerCase());

  return { fetchDetails, getDetails, isLoading };
} 