/**
 * @fileoverview Componente principal de la página de inicio
 * Este componente orquesta toda la funcionalidad de la aplicación Pokémon,
 * incluyendo filtros, búsqueda, ordenamiento y la visualización de datos.
 */

"use client";
import React from "react";
import { usePokemonData } from "../../context/PokemonDataContext";
import ControlBar from "../ControlBar";
import Loader from "../Loader";
import PokeHero from "../PokeHero";
import PokemonGrid from "../PokemonGrid";
import PokemonModal from "../PokemonModal";
import PokemonTable from "../PokemonTable";
import { usePersistedView } from "../ViewToggle";

/**
 * Componente principal que renderiza la página de inicio de la aplicación
 * 
 * Este componente maneja toda la lógica de estado para filtros, búsqueda,
 * ordenamiento y la visualización de Pokémon. Coordina la comunicación
 * entre los diferentes componentes de la interfaz.
 * 
 * @returns JSX.Element - La página de inicio completa con todos sus componentes
 * 
 * @example
 * ```typescript
 * // Uso en app/page.tsx
 * export default function Page() {
 *   return <HomePage />;
 * }
 * ```
 */
export default function HomePage() {
  /** Estado para filtrar Pokémon por tipo */
  const [filterType, setFilterType] = React.useState<string[]>([]);
  /** Estado para el término de búsqueda */
  const [searchTerm, setSearchTerm] = React.useState("");
  /** Estado para el modo de vista (grid/table) con persistencia */
  const [viewMode, setViewMode] = usePersistedView();
  /** Estado para el criterio de ordenamiento */
  const [sortBy, setSortBy] = React.useState<"name" | "id" | "none">("none");
  /** Estado para el orden de clasificación */
  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("asc");

  // Obtener datos del contexto
  const {
    pokemons,
    loading,
    error,
    pokemonTypes,
    getDetails,
    isLoadingDetails,
    selectedPokemon,
    openModal,
    closeModal,
  } = usePokemonData();

  /**
   * Extrae el ID del Pokémon desde su URL
   * 
   * @param url - URL del Pokémon de la API
   * @returns number - ID numérico del Pokémon
   * 
   * @example
   * ```typescript
   * const id = getIdFromUrl("https://pokeapi.co/api/v2/pokemon/25/");
   * // id = 25
   * ```
   */
  const getIdFromUrl = (url: string) => {
    const match = url.match(/\/pokemon\/(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  };

  /**
   * Genera la URL de la imagen del Pokémon basada en su ID
   * 
   * @param id - ID numérico del Pokémon
   * @returns string - URL de la imagen oficial del Pokémon
   * 
   * @example
   * ```typescript
   * const imageUrl = getImageUrl(25);
   * // "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png"
   * ```
   */
  const getImageUrl = (id: number) =>
    id
      ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
      : "/favicon.ico";

  /**
   * Filtra los Pokémon por tipo seleccionado
   * Utiliza useMemo para optimizar el rendimiento
   */
  const filteredByType = React.useMemo(() => {
    if (filterType.length === 0) return pokemons;
    return pokemons.filter((pokemon) => {
      const details = getDetails(pokemon.name);
      if (!details) return false;
      return details.types.some((t) => filterType.includes(t.type.name));
    });
  }, [pokemons, filterType, getDetails]);

  /**
   * Filtra los Pokémon por término de búsqueda
   * Utiliza useMemo para optimizar el rendimiento
   */
  const filteredBySearch = React.useMemo(() => {
    if (!searchTerm) return filteredByType;
    return filteredByType.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [filteredByType, searchTerm]);

  /**
   * Ordena los Pokémon según los criterios seleccionados
   * Utiliza useMemo para optimizar el rendimiento
   */
  const filteredAndSortedPokemons = React.useMemo(() => {
    if (sortBy === "none") return filteredBySearch;

    return [...filteredBySearch].sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      if (sortBy === "name") {
        aValue = a.name;
        bValue = b.name;
      } else {
        // sortBy === "id"
        aValue = getIdFromUrl(a.url);
        bValue = getIdFromUrl(b.url);
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }, [filteredBySearch, sortBy, sortOrder]);

  /**
   * Maneja la selección de un Pokémon para abrir el modal
   * 
   * @param nameOrUrl - Nombre o URL del Pokémon seleccionado
   */
  const handleSelect = async (nameOrUrl: string) => {
    const pokemonName = nameOrUrl.includes("/") 
      ? nameOrUrl.split("/").slice(-2, -1)[0] 
      : nameOrUrl;
    await openModal(pokemonName);
  };

  return (
    <div className="flex flex-col">
      {/* Componente hero con imagen y título */}
      <PokeHero />
      
      {/* Contenido principal de la aplicación */}
      <div className="flex-1 flex flex-col items-center px-4 w-full" data-content-section>
        {/* Barra de controles con filtros, búsqueda y ordenamiento */}
        <ControlBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterType={filterType}
          setFilterType={setFilterType}
          pokemonTypes={pokemonTypes}
          viewMode={viewMode}
          setViewMode={setViewMode}
          isLoadingDetails={
            filterType.length > 0 && pokemons.some((p) => isLoadingDetails(p.name))
          }
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
        />

        {/* Renderizado condicional basado en el estado de carga */}
        {loading ? (
          <Loader />
        ) : error ? (
          <div className="text-red-500 font-bold text-center py-10">
            {error}
          </div>
        ) : (
          <div className="w-full">
            {/* Renderizado condicional basado en el modo de vista */}
            {viewMode === "table" ? (
              <PokemonTable
                pokemons={filteredAndSortedPokemons}
                getDetails={handleSelect}
                getDetailsData={getDetails}
                isLoadingDetails={isLoadingDetails}
              />
            ) : (
              <PokemonGrid
                pokemons={filteredAndSortedPokemons}
                getDetails={handleSelect}
                getIdFromUrl={getIdFromUrl}
                getImageUrl={getImageUrl}
              />
            )}
          </div>
        )}
        
        {/* Modal para mostrar detalles del Pokémon */}
        <PokemonModal
          open={!!selectedPokemon}
          onClose={closeModal}
          details={getDetails(selectedPokemon || "")}
          loading={isLoadingDetails(selectedPokemon || "")}
          error={null}
        />
      </div>
    </div>
  );
} 