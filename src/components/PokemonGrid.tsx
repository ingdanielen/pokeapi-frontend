/**
 * @fileoverview Componente para mostrar Pokémon en formato de cuadrícula
 * Este componente renderiza una cuadrícula de tarjetas de Pokémon con paginación
 * y manejo de estados de carga.
 */

import React from "react";
import { PokemonListItem } from "../types/pokemon";
import { usePokemonData } from "../context/PokemonDataContext";
import Pagination from "./Pagination";
import { PokemonCard } from "./ui";

/**
 * Props del componente PokemonGrid
 */
interface PokemonGridProps {
  /** Lista de Pokémon a mostrar en la cuadrícula */
  pokemons: PokemonListItem[];
  /** Función que se ejecuta al hacer clic en un Pokémon */
  getDetails: (nameOrUrl: string) => void;
  /** Función para extraer el ID del Pokémon desde su URL */
  getIdFromUrl: (url: string) => number;
  /** Función para generar la URL de la imagen del Pokémon */
  getImageUrl: (id: number) => string;
}

/**
 * Componente que renderiza una cuadrícula de tarjetas de Pokémon
 * 
 * Este componente muestra los Pokémon en un formato de cuadrícula responsiva
 * con paginación interna. Cada Pokémon se muestra como una tarjeta individual
 * que puede ser clickeada para ver más detalles.
 * 
 * @param props - Propiedades del componente
 * @param props.pokemons - Lista de Pokémon a mostrar
 * @param props.getDetails - Función para manejar la selección de un Pokémon
 * @param props.getIdFromUrl - Función para extraer ID desde URL
 * @param props.getImageUrl - Función para generar URL de imagen
 * 
 * @returns JSX.Element - Cuadrícula de tarjetas de Pokémon con paginación
 * 
 * @example
 * ```typescript
 * <PokemonGrid
 *   pokemons={filteredPokemons}
 *   getDetails={handlePokemonSelect}
 *   getIdFromUrl={getIdFromUrl}
 *   getImageUrl={getImageUrl}
 * />
 * ```
 */
const PokemonGrid: React.FC<PokemonGridProps> = ({
  pokemons,
  getDetails,
  getIdFromUrl,
}) => {
  // Obtener funciones del contexto para datos y estados de carga
  const { getDetails: getCachedDetails, isLoadingDetails } = usePokemonData();

  /** Página actual de la paginación */
  const [currentPage, setCurrentPage] = React.useState(1);
  /** Número de elementos por página */
  const [pageSize, setPageSize] = React.useState(20);

  // Cálculos de paginación
  const totalItems = pokemons.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentPageData = pokemons.slice(startIndex, endIndex);

  /**
   * Navega a la página anterior
   */
  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  /**
   * Navega a la página siguiente
   */
  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  /**
   * Cambia el número de elementos por página
   * 
   * @param newPageSize - Nuevo tamaño de página
   */
  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset a la primera página
  };

  /**
   * Navega directamente a una página específica
   * 
   * @param page - Número de página a la que navegar
   */
  const handleGoToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(totalPages, page)));
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Cuadrícula responsiva de tarjetas de Pokémon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
        {currentPageData.map((pokemon) => {
          const id = getIdFromUrl(pokemon.url);
          const details = getCachedDetails(pokemon.name);
          const loading = isLoadingDetails(pokemon.name);

          return (
            <PokemonCard
              key={pokemon.name}
              pokemon={pokemon}
              details={details ?? undefined}
              loading={loading}
              id={id}
              onClick={() => getDetails(pokemon.name)}
            />
          );
        })}
      </div>

      {/* Componente de paginación */}
      {totalItems > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          canPreviousPage={currentPage > 1}
          canNextPage={currentPage < totalPages}
          onPreviousPage={handlePreviousPage}
          onNextPage={handleNextPage}
          onPageSizeChange={handlePageSizeChange}
          onGoToPage={handleGoToPage}
          totalItems={totalItems}
        />
      )}
    </div>
  );
};

export default PokemonGrid;
