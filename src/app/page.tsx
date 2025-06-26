"use client";
import React from "react";
import Loader from "../components/Loader";
import PokemonGrid from "../components/PokemonGrid";
import PokemonModal from "../components/PokemonModal";
import PokemonTable from "../components/PokemonTable";
import ControlBar from "../components/ControlBar";
import Header from "../components/Header";
import { usePersistedView } from "../components/ViewToggle";
import { PokemonDataProvider, usePokemonData } from "../context/PokemonDataContext";

function MainPage() {
  const [selected, setSelected] = React.useState<string | null>(null);
  const [filterType, setFilterType] = React.useState("");
  const [searchTerm, setSearchTerm] = React.useState("");
  const [viewMode, setViewMode] = usePersistedView();

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
    id ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png` : "/favicon.ico";


  // Filtrado unificado para ambas vistas
  const filteredPokemons = React.useMemo(() => {
    return pokemons.filter((p) => {
      // Filtro por búsqueda
      const matchesSearch = searchTerm === "" || 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getIdFromUrl(p.url).toString().includes(searchTerm);
      
      // Filtro por tipo
      const matchesType = filterType === "" || (() => {
        const details = getDetails(p.name);
        if (details && details.types) {
          return details.types.some((t: any) => t.type.name === filterType);
        }
        return true; // Si no hay detalles, no filtrar por tipo
      })();
      
      return matchesSearch && matchesType;
    });
  }, [pokemons, searchTerm, filterType, getDetails]);

  const handleSelect = (nameOrUrl: string) => {
    setSelected(nameOrUrl);
    fetchDetails([nameOrUrl]);
  };

  // Manejar selección desde el Header
  const handleHeaderPokemonSelect = (pokemonName: string) => {
    setSelected(pokemonName);
    fetchDetails([pokemonName]);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header onPokemonSelect={handleHeaderPokemonSelect} />
      
      <main className="flex-1 flex flex-col items-center px-2 sm:px-8 py-6 w-full">
        <ControlBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterType={filterType}
          setFilterType={setFilterType}
          pokemonTypes={pokemonTypes}
          viewMode={viewMode}
          setViewMode={setViewMode}
          isLoadingDetails={filterType !== "" && pokemons.some(p => isLoadingDetails(p.name))}
        />
        
        {loading ? (
          <Loader />
        ) : error ? (
          <div className="text-red-500 font-bold text-center py-10">{error}</div>
        ) : (
          <div className="w-full">
            {viewMode === "table" ? (
              <PokemonTable
                pokemons={filteredPokemons}
                getDetails={handleSelect}
                getDetailsData={getDetails}
                isLoadingDetails={isLoadingDetails}
              />
            ) : (
              <PokemonGrid
                pokemons={filteredPokemons}
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
      </main>
    </div>
  );
}

export default function Page() {
  return (
    <PokemonDataProvider>
      <MainPage />
    </PokemonDataProvider>
  );
}
