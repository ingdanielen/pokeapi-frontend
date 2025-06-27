/**
 * @fileoverview TypeScript interfaces for Pokémon data structures
 * This file contains all the type definitions used throughout the application
 * for handling Pokémon data from the PokéAPI.
 */

/**
 * Basic Pokémon information from the list endpoint
 */
export interface PokemonListItem {
  /** The name of the Pokémon */
  name: string;
  /** URL to fetch detailed information about this Pokémon */
  url: string;
}

/**
 * Pokémon type information
 */
export interface PokemonType {
  /** Type details containing the type name */
  type: { 
    /** The name of the type (e.g., "fire", "water", "grass") */
    name: string 
  };
}

/**
 * Pokémon base statistics
 */
export interface PokemonStat {
  /** The base value of the stat */
  base_stat: number;
  /** Stat information containing the stat name */
  stat: { 
    /** The name of the stat (e.g., "hp", "attack", "defense") */
    name: string 
  };
}

/**
 * All available sprite images for a Pokémon
 */
export interface PokemonSprites {
  /** Default front sprite */
  front_default: string;
  /** Shiny front sprite */
  front_shiny: string;
  /** Female front sprite */
  front_female: string;
  /** Shiny female front sprite */
  front_shiny_female: string;
  /** Default back sprite */
  back_default: string;
  /** Shiny back sprite */
  back_shiny: string;
  /** Female back sprite */
  back_female: string;
  /** Shiny female back sprite */
  back_shiny_female: string;
  /** Other sprite variants */
  other: {
    /** Official artwork sprites */
    "official-artwork": {
      /** Default official artwork */
      front_default: string;
      /** Shiny official artwork */
      front_shiny: string;
    };
    /** Dream world sprites */
    dream_world: {
      /** Default dream world sprite */
      front_default: string;
      /** Female dream world sprite */
      front_female: string;
    };
    /** Home sprites */
    home: {
      /** Default home sprite */
      front_default: string;
      /** Female home sprite */
      front_female: string;
      /** Shiny home sprite */
      front_shiny: string;
      /** Shiny female home sprite */
      front_shiny_female: string;
    };
  };
}

/**
 * Pokémon ability information
 */
export interface PokemonAbility {
  /** Ability details */
  ability: {
    /** The name of the ability */
    name: string;
    /** URL to fetch ability details */
    url: string;
  };
  /** Whether this is a hidden ability */
  is_hidden: boolean;
  /** The slot number for this ability */
  slot: number;
}

/**
 * Pokémon move information
 */
export interface PokemonMove {
  /** Move details */
  move: {
    /** The name of the move */
    name: string;
    /** URL to fetch move details */
    url: string;
  };
  /** Version group details for this move */
  version_group_details: Array<{
    /** Level at which the move is learned */
    level_learned_at: number;
    /** Method by which the move is learned */
    move_learn_method: {
      /** The name of the learning method */
      name: string;
      /** URL to fetch method details */
      url: string;
    };
    /** Version group information */
    version_group: {
      /** The name of the version group */
      name: string;
      /** URL to fetch version group details */
      url: string;
    };
  }>;
}

/**
 * Items that a Pokémon can hold
 */
export interface PokemonHeldItem {
  /** Item details */
  item: {
    /** The name of the item */
    name: string;
    /** URL to fetch item details */
    url: string;
  };
  /** Version-specific details for this held item */
  version_details: Array<{
    /** Rarity of the item in this version */
    rarity: number;
    /** Version information */
    version: {
      /** The name of the version */
      name: string;
      /** URL to fetch version details */
      url: string;
    };
  }>;
}

/**
 * Game index information for a Pokémon
 */
export interface PokemonGameIndex {
  /** The game index number */
  game_index: number;
  /** Version information */
  version: {
    /** The name of the version */
    name: string;
    /** URL to fetch version details */
    url: string;
  };
}

/**
 * Pokémon form information
 */
export interface PokemonForm {
  /** The name of the form */
  name: string;
  /** URL to fetch form details */
  url: string;
}

/**
 * Complete Pokémon details from the API
 * This is the main interface used throughout the application
 */
export interface PokemonDetails {
  /** Unique identifier for the Pokémon */
  id: number;
  /** The name of the Pokémon */
  name: string;
  /** Base experience points */
  base_experience: number;
  /** Height in decimeters */
  height: number;
  /** Weight in hectograms */
  weight: number;
  /** Whether this is the default form */
  is_default: boolean;
  /** Order number for sorting */
  order: number;
  /** URL for location area encounters */
  location_area_encounters: string;

  /** All available sprites and forms */
  sprites: PokemonSprites;
  /** Available forms of this Pokémon */
  forms: PokemonForm[];

  /** Pokémon types */
  types: PokemonType[];
  /** Base statistics */
  stats: PokemonStat[];

  /** Abilities */
  abilities: PokemonAbility[];

  /** Moves */
  moves: PokemonMove[];

  /** Items that can be held */
  held_items: PokemonHeldItem[];

  /** Game indices */
  game_indices: PokemonGameIndex[];

  /** Species reference */
  species: {
    /** The name of the species */
    name: string;
    /** URL to fetch species details */
    url: string;
  };
}

/**
 * Pokémon type option for filtering
 */
export interface PokemonTypeOption {
  /** The name of the type */
  name: string;
  /** URL to fetch type details */
  url: string;
}

/**
 * Detailed species information
 */
export interface PokemonSpecies {
  /** Unique identifier for the species */
  id: number;
  /** The name of the species */
  name: string;
  /** Order number for sorting */
  order: number;
  /** Gender rate (-1 = genderless, 0-8 = female percentage) */
  gender_rate: number;
  /** Capture rate */
  capture_rate: number;
  /** Base happiness */
  base_happiness: number;
  /** Whether this is a baby Pokémon */
  is_baby: boolean;
  /** Whether this is a legendary Pokémon */
  is_legendary: boolean;
  /** Whether this is a mythical Pokémon */
  is_mythical: boolean;
  /** Hatch counter */
  hatch_counter: number;
  /** Whether this species has gender differences */
  has_gender_differences: boolean;
  /** Whether forms are switchable */
  forms_switchable: boolean;
  /** Growth rate information */
  growth_rate: {
    /** The name of the growth rate */
    name: string;
    /** URL to fetch growth rate details */
    url: string;
  };
  /** Pokédex numbers in different Pokédexes */
  pokedex_numbers: Array<{
    /** The entry number in the Pokédex */
    entry_number: number;
    /** Pokédex information */
    pokedex: {
      /** The name of the Pokédex */
      name: string;
      /** URL to fetch Pokédex details */
      url: string;
    };
  }>;
  /** Egg groups */
  egg_groups: Array<{
    /** The name of the egg group */
    name: string;
    /** URL to fetch egg group details */
    url: string;
  }>;
  /** Color information */
  color: {
    /** The name of the color */
    name: string;
    /** URL to fetch color details */
    url: string;
  };
  /** Shape information */
  shape: {
    /** The name of the shape */
    name: string;
    /** URL to fetch shape details */
    url: string;
  };
  /** Species this evolves from */
  evolves_from_species: {
    /** The name of the species */
    name: string;
    /** URL to fetch species details */
    url: string;
  } | null;
  /** Evolution chain information */
  evolution_chain: {
    /** URL to fetch evolution chain details */
    url: string;
  };
  /** Habitat information */
  habitat: {
    /** The name of the habitat */
    name: string;
    /** URL to fetch habitat details */
    url: string;
  } | null;
  /** Generation information */
  generation: {
    /** The name of the generation */
    name: string;
    /** URL to fetch generation details */
    url: string;
  };
  /** Names in different languages */
  names: Array<{
    /** The name in the language */
    name: string;
    /** Language information */
    language: {
      /** The name of the language */
      name: string;
      /** URL to fetch language details */
      url: string;
    };
  }>;
  /** Flavor text entries */
  flavor_text_entries: Array<{
    /** The flavor text */
    flavor_text: string;
    /** Language information */
    language: {
      /** The name of the language */
      name: string;
      /** URL to fetch language details */
      url: string;
    };
    /** Version information */
    version: {
      /** The name of the version */
      name: string;
      /** URL to fetch version details */
      url: string;
    };
  }>;
  /** Form descriptions */
  form_descriptions: Array<{
    /** The description */
    description: string;
    /** Language information */
    language: {
      /** The name of the language */
      name: string;
      /** URL to fetch language details */
      url: string;
    };
  }>;
  /** Genera (taxonomic classifications) */
  genera: Array<{
    /** The genus */
    genus: string;
    /** Language information */
    language: {
      /** The name of the language */
      name: string;
      /** URL to fetch language details */
      url: string;
    };
  }>;
  /** Varieties of this species */
  varieties: Array<{
    /** Whether this is the default variety */
    is_default: boolean;
    /** Pokémon information */
    pokemon: {
      /** The name of the Pokémon */
      name: string;
      /** URL to fetch Pokémon details */
      url: string;
    };
  }>;
}

/**
 * Detailed move information
 */
export interface MoveDetails {
  /** Unique identifier for the move */
  id: number;
  /** The name of the move */
  name: string;
  /** Accuracy percentage */
  accuracy: number;
  /** Effect chance percentage */
  effect_chance: number;
  /** Power points */
  pp: number;
  /** Priority value */
  priority: number;
  /** Base power */
  power: number;
  /** Contest combinations */
  contest_combos: {
    /** Normal contest combos */
    normal: {
      /** Moves to use before this move */
      use_before: Array<{
        /** The name of the move */
        name: string;
        /** URL to fetch move details */
        url: string;
      }>;
      /** Moves to use after this move */
      use_after: Array<{
        /** The name of the move */
        name: string;
        /** URL to fetch move details */
        url: string;
      }>;
    };
    /** Super contest combos */
    super: {
      /** Moves to use before this move */
      use_before: Array<{
        /** The name of the move */
        name: string;
        /** URL to fetch move details */
        url: string;
      }>;
      /** Moves to use after this move */
      use_after: Array<{
        /** The name of the move */
        name: string;
        /** URL to fetch move details */
        url: string;
      }>;
    };
  };
  /** Contest type information */
  contest_type: {
    /** The name of the contest type */
    name: string;
    /** URL to fetch contest type details */
    url: string;
  };
  /** Contest effect information */
  contest_effect: {
    /** URL to fetch contest effect details */
    url: string;
  };
  /** Damage class information */
  damage_class: {
    /** The name of the damage class */
    name: string;
    /** URL to fetch damage class details */
    url: string;
  };
  /** Effect entries */
  effect_entries: Array<{
    /** The full effect description */
    effect: string;
    /** Language information */
    language: {
      /** The name of the language */
      name: string;
      /** URL to fetch language details */
      url: string;
    };
    /** Short effect description */
    short_effect: string;
  }>;
  /** Effect changes across versions */
  effect_changes: Array<{
    /** Effect entries for this version */
    effect_entries: Array<{
      /** The effect description */
      effect: string;
      /** Language information */
      language: {
        /** The name of the language */
        name: string;
        /** URL to fetch language details */
        url: string;
      };
    }>;
    /** Version group information */
    version_group: {
      /** The name of the version group */
      name: string;
      /** URL to fetch version group details */
      url: string;
    };
  }>;
  /** Flavor text entries */
  flavor_text_entries: Array<{
    /** The flavor text */
    flavor_text: string;
    /** Language information */
    language: {
      /** The name of the language */
      name: string;
      /** URL to fetch language details */
      url: string;
    };
    /** Version group information */
    version_group: {
      /** The name of the version group */
      name: string;
      /** URL to fetch version group details */
      url: string;
    };
  }>;
  /** Generation information */
  generation: {
    /** The name of the generation */
    name: string;
    /** URL to fetch generation details */
    url: string;
  };
  /** Machine information */
  machines: Array<{
    /** Machine information */
    machine: {
      /** URL to fetch machine details */
      url: string;
    };
    /** Version group information */
    version_group: {
      /** The name of the version group */
      name: string;
      /** URL to fetch version group details */
      url: string;
    };
  }>;
  /** Move metadata */
  meta: {
    /** Ailment information */
    ailment: {
      /** The name of the ailment */
      name: string;
      /** URL to fetch ailment details */
      url: string;
    };
    /** Category information */
    category: {
      /** The name of the category */
      name: string;
      /** URL to fetch category details */
      url: string;
    };
    /** Minimum number of hits */
    min_hits: number;
    /** Maximum number of hits */
    max_hits: number;
    /** Minimum number of turns */
    min_turns: number;
    /** Maximum number of turns */
    max_turns: number;
    /** HP drain percentage */
    drain: number;
    /** HP healing percentage */
    healing: number;
    /** Critical hit rate */
    crit_rate: number;
    /** Ailment chance percentage */
    ailment_chance: number;
    /** Flinch chance percentage */
    flinch_chance: number;
    /** Stat change chance percentage */
    stat_chance: number;
  };
  /** Names in different languages */
  names: Array<{
    /** The name in the language */
    name: string;
    /** Language information */
    language: {
      /** The name of the language */
      name: string;
      /** URL to fetch language details */
      url: string;
    };
  }>;
  /** Past values from previous generations */
  past_values: Array<{
    /** Accuracy in this version */
    accuracy: number;
    /** Effect chance in this version */
    effect_chance: number;
    /** Effect entries for this version */
    effect_entries: Array<{
      /** The effect description */
      effect: string;
      /** Language information */
      language: {
        /** The name of the language */
        name: string;
        /** URL to fetch language details */
        url: string;
      };
    }>;
    /** Power in this version */
    power: number;
    /** PP in this version */
    pp: number;
    /** Type information */
    type: {
      /** The name of the type */
      name: string;
      /** URL to fetch type details */
      url: string;
    };
    /** Version group information */
    version_group: {
      /** The name of the version group */
      name: string;
      /** URL to fetch version group details */
      url: string;
    };
  }>;
  /** Stat changes caused by this move */
  stat_changes: Array<{
    /** The amount of change */
    change: number;
    /** Stat information */
    stat: {
      /** The name of the stat */
      name: string;
      /** URL to fetch stat details */
      url: string;
    };
  }>;
  /** Super contest effect information */
  super_contest_effect: {
    /** URL to fetch super contest effect details */
    url: string;
  };
  /** Target information */
  target: {
    /** The name of the target */
    name: string;
    /** URL to fetch target details */
    url: string;
  };
  /** Type information */
  type: {
    /** The name of the type */
    name: string;
    /** URL to fetch type details */
    url: string;
  };
}
