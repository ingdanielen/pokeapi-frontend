"use client";
import React from "react";
import Loader from "../Loader";
import PokemonGrid from "../PokemonGrid";
import PokemonModal from "../PokemonModal";
import PokemonTable from "../PokemonTable";
import ControlBar from "../ControlBar";
import { usePersistedView } from "../ViewToggle";
import { usePokemonData } from "../../context/PokemonDataContext";
import PokeHero from "../PokeHero";
import { PokemonType } from "../../types/pokemon";

export default function HomePage() {
  const [selected, setSelected] = React.useState<string | null>(null);
  const [filterType, setFilterType] = React.useState<string[]>([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [viewMode, setViewMode] = usePersistedView();
  const [sortBy, setSortBy] = React.useState<"name" | "id" | "none">("none");
  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("asc");

  const {
    pokemons,
    loading,
    error,
    pokemonTypes,
    fetchDetails,
    getDetails,
    isLoadingDetails,
  } = usePokemonData();

  const getIdFromUrl = (url: string) => {
    const match = url.match(/\/pokemon\/(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  };
  const getImageUrl = (id: number) =>
    id
      ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
      : "/favicon.ico";

  // Filtrado y ordenamiento unificado para ambas vistas
  const filteredAndSortedPokemons = React.useMemo(() => {
    // Primero filtrar
    const filtered = pokemons.filter((p) => {
      // Filtro por búsqueda
      const matchesSearch =
        searchTerm === "" ||
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getIdFromUrl(p.url).toString().includes(searchTerm);

      // Filtro por tipos múltiples
      const matchesType =
        filterType.length === 0 ||
        (() => {
          const details = getDetails(p.name);
          if (details && details.types) {
            // Si hay tipos seleccionados, el pokémon debe tener al menos uno de ellos
            return details.types.some((t: PokemonType) => 
              filterType.includes(t.type.name)
            );
          }
          return true; // Si no hay detalles, no filtrar por tipo
        })();

      return matchesSearch && matchesType;
    });

    // Luego ordenar (solo si hay un criterio de ordenamiento activo)
    if (sortBy === "none") {
      return filtered; // Sin ordenamiento, mantener orden original
    }

    return filtered.sort((a, b) => {
      let comparison = 0;
      
      if (sortBy === "name") {
        comparison = a.name.localeCompare(b.name);
      } else if (sortBy === "id") {
        const idA = getIdFromUrl(a.url);
        const idB = getIdFromUrl(b.url);
        comparison = idA - idB;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });
  }, [pokemons, searchTerm, filterType, getDetails, sortBy, sortOrder, getIdFromUrl]);

  const handleSelect = (nameOrUrl: string) => {
    setSelected(nameOrUrl);
    fetchDetails([nameOrUrl]);
  };

  return (
    <div className="flex flex-col">
      <PokeHero />
      <div className="flex-1 flex flex-col items-center px-4 w-full" data-content-section>
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

        {loading ? (
          <Loader />
        ) : error ? (
          <div className="text-red-500 font-bold text-center py-10">
            {error}
          </div>
        ) : (
          <div className="w-full">
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
        <PokemonModal
          open={!!selected}
          onClose={() => setSelected(null)}
          details={getDetails(selected || "")}
          loading={isLoadingDetails(selected || "")}
          error={null}
        />
      </div>
    </div>
  );
} 