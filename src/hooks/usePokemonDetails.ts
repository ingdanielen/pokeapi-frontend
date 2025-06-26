import { useRef, useState } from "react";
import axios from "axios";
import { PokemonDetails } from "../types/pokemon";

export interface PokemonSpecies {
  id: number;
  name: string;
  order: number;
  gender_rate: number;
  capture_rate: number;
  base_happiness: number;
  is_baby: boolean;
  is_legendary: boolean;
  is_mythical: boolean;
  hatch_counter: number;
  has_gender_differences: boolean;
  forms_switchable: boolean;
  growth_rate: {
    name: string;
    url: string;
  };
  pokedex_numbers: Array<{
    entry_number: number;
    pokedex: {
      name: string;
      url: string;
    };
  }>;
  egg_groups: Array<{
    name: string;
    url: string;
  }>;
  color: {
    name: string;
    url: string;
  };
  shape: {
    name: string;
    url: string;
  };
  evolves_from_species: {
    name: string;
    url: string;
  } | null;
  evolution_chain: {
    url: string;
  };
  habitat: {
    name: string;
    url: string;
  } | null;
  generation: {
    name: string;
    url: string;
  };
  names: Array<{
    name: string;
    language: {
      name: string;
      url: string;
    };
  }>;
  flavor_text_entries: Array<{
    flavor_text: string;
    language: {
      name: string;
      url: string;
    };
    version: {
      name: string;
      url: string;
    };
  }>;
  form_descriptions: Array<{
    description: string;
    language: {
      name: string;
      url: string;
    };
  }>;
  genera: Array<{
    genus: string;
    language: {
      name: string;
      url: string;
    };
  }>;
  varieties: Array<{
    is_default: boolean;
    pokemon: {
      name: string;
      url: string;
    };
  }>;
}

export interface MoveDetails {
  id: number;
  name: string;
  accuracy: number;
  effect_chance: number;
  pp: number;
  priority: number;
  power: number;
  contest_combos: {
    normal: {
      use_before: Array<{
        name: string;
        url: string;
      }>;
      use_after: Array<{
        name: string;
        url: string;
      }>;
    };
    super: {
      use_before: Array<{
        name: string;
        url: string;
      }>;
      use_after: Array<{
        name: string;
        url: string;
      }>;
    };
  };
  contest_type: {
    name: string;
    url: string;
  };
  contest_effect: {
    url: string;
  };
  damage_class: {
    name: string;
    url: string;
  };
  effect_entries: Array<{
    effect: string;
    language: {
      name: string;
      url: string;
    };
    short_effect: string;
  }>;
  effect_changes: Array<{
    effect_entries: Array<{
      effect: string;
      language: {
        name: string;
        url: string;
      };
    }>;
    version_group: {
      name: string;
      url: string;
    };
  }>;
  flavor_text_entries: Array<{
    flavor_text: string;
    language: {
      name: string;
      url: string;
    };
    version_group: {
      name: string;
      url: string;
    };
  }>;
  generation: {
    name: string;
    url: string;
  };
  machines: Array<{
    machine: {
      url: string;
    };
    version_group: {
      name: string;
      url: string;
    };
  }>;
  meta: {
    ailment: {
      name: string;
      url: string;
    };
    category: {
      name: string;
      url: string;
    };
    min_hits: number;
    max_hits: number;
    min_turns: number;
    max_turns: number;
    drain: number;
    healing: number;
    crit_rate: number;
    ailment_chance: number;
    flinch_chance: number;
    stat_chance: number;
  };
  names: Array<{
    name: string;
    language: {
      name: string;
      url: string;
    };
  }>;
  past_values: Array<{
    accuracy: number;
    effect_chance: number;
    effect_entries: Array<{
      effect: string;
      language: {
        name: string;
        url: string;
      };
    }>;
    power: number;
    pp: number;
    type: {
      name: string;
      url: string;
    };
    version_group: {
      name: string;
      url: string;
    };
  }>;
  stat_changes: Array<{
    change: number;
    stat: {
      name: string;
      url: string;
    };
  }>;
  super_contest_effect: {
    url: string;
  };
  target: {
    name: string;
    url: string;
  };
  type: {
    name: string;
    url: string;
  };
}

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
    } catch (e) {
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
    } catch (e) {
      console.error("Error al cargar información de especies:", e);
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
    } catch (e) {
      console.error("Error al cargar detalles del movimiento:", e);
      return null;
    }
  };

  return { 
    data, 
    speciesData,
    loading, 
    error, 
    fetchDetails,
    fetchMoveDetails
  };
} 