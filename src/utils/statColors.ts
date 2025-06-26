/**
 * Utility functions for Pokemon stat bar colors and styling
 */

// Rangos de valores para cada stat específica
const STAT_RANGES = {
  hp: { low: 30, medium: 60, high: 90 },
  attack: { low: 40, medium: 70, high: 100 },
  defense: { low: 40, medium: 70, high: 100 },
  'special-attack': { low: 40, medium: 70, high: 100 },
  'special-defense': { low: 40, medium: 70, high: 100 },
  speed: { low: 30, medium: 60, high: 90 }
} as const;

// Colores consistentes para las barras
const STAT_COLORS = {
  low: 'bg-red-500',
  medium: 'bg-amber-500', 
  high: 'bg-emerald-500',
  default: 'bg-gray-500'
} as const;

/**
 * Obtiene el color de la barra de estadística basado en el nombre y valor
 * @param statName - Nombre de la estadística
 * @param value - Valor de la estadística
 * @returns Clase CSS para el color de la barra
 */
export const getStatBarColor = (statName: string, value: number): string => {
  const range = STAT_RANGES[statName as keyof typeof STAT_RANGES];
  
  if (!range) {
    // Para stats desconocidas, usar rangos generales
    if (value >= 80) return STAT_COLORS.high;
    if (value >= 50) return STAT_COLORS.medium;
    return STAT_COLORS.low;
  }

  if (value >= range.high) return STAT_COLORS.high;
  if (value >= range.medium) return STAT_COLORS.medium;
  return STAT_COLORS.low;
};

/**
 * Calcula el porcentaje de la barra basado en el valor y un máximo
 * @param value - Valor actual
 * @param maxValue - Valor máximo (por defecto 150 que es un buen máximo para stats)
 * @returns Porcentaje como número entre 0 y 100
 */
export const getStatBarPercentage = (value: number, maxValue: number = 150): number => {
  return Math.min((value / maxValue) * 100, 100);
};

/**
 * Obtiene las clases CSS completas para una barra de estadística
 * @param statName - Nombre de la estadística
 * @param value - Valor de la estadística
 * @param additionalClasses - Clases CSS adicionales
 * @returns String con todas las clases CSS
 */
export const getStatBarClasses = (
  statName: string, 
  value: number, 
  additionalClasses: string = 'h-full rounded-full transition-all duration-300'
): string => {
  const colorClass = getStatBarColor(statName, value);
  return `${colorClass} ${additionalClasses}`;
};

/**
 * Obtiene el nombre corto de una estadística para mostrar en UI
 * @param statName - Nombre completo de la estadística
 * @returns Nombre corto
 */
export const getStatShortName = (statName: string): string => {
  const shortNames: { [key: string]: string } = {
    hp: 'HP',
    attack: 'ATK',
    defense: 'DEF',
    'special-attack': 'SP.ATK',
    'special-defense': 'SP.DEF',
    speed: 'SPD'
  };
  return shortNames[statName] || statName.toUpperCase();
}; 