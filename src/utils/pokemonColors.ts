export const typeColors: Record<string, string> = {
  normal: "#A8A878",
  fire: "#F08030",
  water: "#6890F0",
  electric: "#F8D030",
  grass: "#78C850",
  ice: "#98D8D8",
  fighting: "#C03028",
  poison: "#A040A0",
  ground: "#E0C068",
  flying: "#A890F0",
  psychic: "#F85888",
  bug: "#A8B820",
  rock: "#B8A038",
  ghost: "#705898",
  dark: "#705848",
  dragon: "#7038F8",
  steel: "#B8B8D0",
  fairy: "#EE99AC",
};

export const getTypeColor = (typeName: string): string => {
  return typeColors[typeName] || "#888888";
};

export const getMainTypeColor = (types: { type: { name: string } }[]): string => {
  if (!types || types.length === 0) return '#888888';
  return getTypeColor(types[0].type.name);
}; 