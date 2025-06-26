export interface PokemonListItem {
  name: string;
  url: string;
}

export interface PokemonType {
  type: { name: string };
}

export interface PokemonStat {
  base_stat: number;
  stat: { name: string };
}

export interface PokemonSprites {
  front_default: string;
  front_shiny: string;
  front_female: string;
  front_shiny_female: string;
  back_default: string;
  back_shiny: string;
  back_female: string;
  back_shiny_female: string;
  other: {
    'official-artwork': {
      front_default: string;
      front_shiny: string;
    };
    dream_world: {
      front_default: string;
      front_female: string;
    };
    home: {
      front_default: string;
      front_female: string;
      front_shiny: string;
      front_shiny_female: string;
    };
  };
}

export interface PokemonAbility {
  ability: {
    name: string;
    url: string;
  };
  is_hidden: boolean;
  slot: number;
}

export interface PokemonMove {
  move: {
    name: string;
    url: string;
  };
  version_group_details: Array<{
    level_learned_at: number;
    move_learn_method: {
      name: string;
      url: string;
    };
    version_group: {
      name: string;
      url: string;
    };
  }>;
}

export interface PokemonHeldItem {
  item: {
    name: string;
    url: string;
  };
  version_details: Array<{
    rarity: number;
    version: {
      name: string;
      url: string;
    };
  }>;
}

export interface PokemonGameIndex {
  game_index: number;
  version: {
    name: string;
    url: string;
  };
}

export interface PokemonForm {
  name: string;
  url: string;
}

export interface PokemonDetails {
  id: number;
  name: string;
  base_experience: number;
  height: number;
  weight: number;
  is_default: boolean;
  order: number;
  location_area_encounters: string;
  
  // Sprites y formas
  sprites: PokemonSprites;
  forms: PokemonForm[];
  
  // Tipos y estadísticas
  types: PokemonType[];
  stats: PokemonStat[];
  
  // Habilidades
  abilities: PokemonAbility[];
  
  // Movimientos
  moves: PokemonMove[];
  
  // Objetos que puede llevar
  held_items: PokemonHeldItem[];
  
  // Índices de juegos
  game_indices: PokemonGameIndex[];
  
  // Especies (referencia para más info)
  species: {
    name: string;
    url: string;
  };
}

export interface PokemonTypeOption {
  name: string;
  url: string;
} 