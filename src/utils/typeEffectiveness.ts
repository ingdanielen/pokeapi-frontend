/**
 * Type effectiveness chart for Pokemon
 * Values: 2 = super effective, 0.5 = not very effective, 0 = no effect, 1 = normal effectiveness
 */
const TYPE_CHART: Record<string, Record<string, number>> = {
  normal: { fighting: 2, ghost: 0 },
  fire: { water: 2, ground: 2, rock: 2 },
  water: { electric: 2, grass: 2 },
  electric: { ground: 2 },
  grass: { fire: 2, ice: 2, poison: 2, flying: 2, bug: 2 },
  ice: { fire: 2, fighting: 2, rock: 2, steel: 2 },
  fighting: { flying: 2, psychic: 2, fairy: 2 },
  poison: { ground: 2, psychic: 2 },
  ground: { water: 2, grass: 2, ice: 2 },
  flying: { electric: 2, ice: 2, rock: 2 },
  psychic: { bug: 2, ghost: 2, dark: 2 },
  bug: { fire: 2, flying: 2, rock: 2 },
  rock: { water: 2, grass: 2, fighting: 2, ground: 2, steel: 2 },
  ghost: { ghost: 2, dark: 2 },
  dragon: { ice: 2, dragon: 2, fairy: 2 },
  dark: { fighting: 2, bug: 2, fairy: 2 },
  steel: { fire: 2, fighting: 2, ground: 2 },
  fairy: { poison: 2, steel: 2 }
};

/**
 * Gets the weaknesses for a Pokemon's types
 */
export const getTypeWeaknesses = (types: { type: { name: string } }[]): string[] => {
  const weaknesses = new Set<string>();
  const typeNames = types.map(t => t.type.name);

  // Check all types for weaknesses
  Object.keys(TYPE_CHART).forEach(attackingType => {
    let effectiveness = 1;
    
    typeNames.forEach(defendingType => {
      const typeEffectiveness = TYPE_CHART[defendingType]?.[attackingType];
      if (typeEffectiveness !== undefined) {
        effectiveness *= typeEffectiveness;
      }
    });

    // If the attacking type is super effective (2x or higher), it's a weakness
    if (effectiveness >= 2) {
      weaknesses.add(attackingType);
    }
  });

  return Array.from(weaknesses);
};

/**
 * Calculates gender percentage from gender_rate
 * gender_rate -1 = genderless, 0 = always male, 8 = always female
 * Each point represents 12.5% chance of being female
 */
export const getGenderRatio = (genderRate: number) => {
  if (genderRate === -1) {
    return { male: 0, female: 0, genderless: 100 };
  }
  
  const femalePercentage = (genderRate / 8) * 100;
  const malePercentage = 100 - femalePercentage;
  
  return {
    male: Math.round(malePercentage * 10) / 10,
    female: Math.round(femalePercentage * 10) / 10,
    genderless: 0
  };
};

/**
 * Spanish translations for type names
 */
export const typeTranslations: Record<string, string> = {
  normal: 'Normal',
  fire: 'Fuego',
  water: 'Agua',
  electric: 'Eléctrico',
  grass: 'Planta',
  ice: 'Hielo',
  fighting: 'Lucha',
  poison: 'Veneno',
  ground: 'Tierra',
  flying: 'Volador',
  psychic: 'Psíquico',
  bug: 'Bicho',
  rock: 'Roca',
  ghost: 'Fantasma',
  dragon: 'Dragón',
  dark: 'Siniestro',
  steel: 'Acero',
  fairy: 'Hada'
}; 