import axios from "axios";
import { useRef, useState } from "react";
import {
  MoveDetails,
  PokemonDetails,
  PokemonSpecies
} from "../types/pokemon";

export function usePokemonDetails() {
  const cache = useRef<Record<string, PokemonDetails>>({});
  const speciesCache = useRef<Record<string, PokemonSpecies>>({});
  const moveCache = useRef<Record<string, MoveDetails>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<PokemonDetails | null>(null);
  const [speciesData, setSpeciesData] = useState<PokemonSpecies | null>(null);

  const fetchDetails = async (nameOrUrl: string) => {
    setLoading(true);
    setError(null);
    setData(null);
    setSpeciesData(null);
    
    const key = nameOrUrl.toLowerCase();
    
    if (cache.current[key]) {
      setData(cache.current[key]);
      // También cargar especies si no está en caché
      const pokemonData = cache.current[key];
      if (pokemonData.species?.url && !speciesCache.current[key]) {
        await fetchSpecies(pokemonData.species.url, key);
      } else if (speciesCache.current[key]) {
        setSpeciesData(speciesCache.current[key]);
      }
      setLoading(false);
      return;
    }
    
    try {
      const url = nameOrUrl.startsWith("http") ? nameOrUrl : `https://pokeapi.co/api/v2/pokemon/${nameOrUrl}`;
      const res = await axios.get(url);
      cache.current[key] = res.data;
      setData(res.data);
      
      // Cargar información de especies
      if (res.data.species?.url) {
        await fetchSpecies(res.data.species.url, key);
      }
    } catch {
      setError("Error al cargar detalles del Pokémon");
    } finally {
      setLoading(false);
    }
  };

  const fetchSpecies = async (speciesUrl: string, pokemonKey: string) => {
    try {
      const res = await axios.get(speciesUrl);
      speciesCache.current[pokemonKey] = res.data;
      setSpeciesData(res.data);
      
      // También cargar cadena de evolución
      if (res.data.evolution_chain?.url) {
        await fetchEvolutionChain(res.data.evolution_chain.url);
      }
    } catch {
      console.error("Error al cargar información de especies");
    }
  };

  const fetchEvolutionChain = async (evolutionUrl: string) => {
    try {
      await axios.get(evolutionUrl);
    } catch {
      console.error("Error al cargar cadena de evolución");
    }
  };

  const fetchMoveDetails = async (moveName: string) => {
    const key = moveName.toLowerCase();
    
    if (moveCache.current[key]) {
      return moveCache.current[key];
    }
    
    try {
      const res = await axios.get(`https://pokeapi.co/api/v2/move/${moveName}`);
      moveCache.current[key] = res.data;
      return res.data;
    } catch {
      console.error("Error al cargar detalles del movimiento");
      return null;
    }
  };

  return { 
    data, 
    speciesData,
    loading, 
    error, 
    fetchDetails,
    fetchSpecies,
    fetchMoveDetails
  };
} 