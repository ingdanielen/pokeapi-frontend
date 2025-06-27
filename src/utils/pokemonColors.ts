/**
 * @fileoverview Utility functions for Pokémon type colors
 * This module provides color mappings and helper functions for displaying
 * Pokémon types with their canonical colors.
 */

/**
 * Color mapping for all Pokémon types
 * Each type has a specific hex color that represents it in the Pokémon universe
 */
export const typeColors: Record<string, string> = {
  normal: "#A8A878",    // Grayish brown
  fire: "#F08030",      // Orange-red
  water: "#6890F0",     // Blue
  electric: "#F8D030",  // Yellow
  grass: "#78C850",     // Green
  ice: "#98D8D8",       // Light blue
  fighting: "#C03028",  // Red
  poison: "#A040A0",    // Purple
  ground: "#E0C068",    // Brown
  flying: "#A890F0",    // Light purple
  psychic: "#F85888",   // Pink
  bug: "#A8B820",       // Green-yellow
  rock: "#B8A038",      // Brown-yellow
  ghost: "#705898",     // Dark purple
  dark: "#705848",      // Dark brown
  dragon: "#7038F8",    // Purple-blue
  steel: "#B8B8D0",     // Light gray
  fairy: "#EE99AC",     // Light pink
};

/**
 * Gets the color for a specific Pokémon type
 * 
 * @param typeName - The name of the Pokémon type (e.g., "fire", "water", "grass")
 * @returns The hex color code for the type, or a default gray color if type is not found
 * 
 * @example
 * ```typescript
 * const fireColor = getTypeColor("fire"); // "#F08030"
 * const unknownColor = getTypeColor("unknown"); // "#888888"
 * ```
 */
export const getTypeColor = (typeName: string): string => {
  return typeColors[typeName] || "#888888";
};

/**
 * Gets the main type color for a Pokémon with multiple types
 * Uses the first type in the array as the primary type
 * 
 * @param types - Array of Pokémon types from the API response
 * @returns The hex color code for the primary type, or default gray if no types provided
 * 
 * @example
 * ```typescript
 * const types = [
 *   { type: { name: "fire" } },
 *   { type: { name: "flying" } }
 * ];
 * const mainColor = getMainTypeColor(types); // "#F08030" (fire color)
 * ```
 */
export const getMainTypeColor = (types: { type: { name: string } }[]): string => {
  if (!types || types.length === 0) return '#888888';
  return getTypeColor(types[0].type.name);
}; 