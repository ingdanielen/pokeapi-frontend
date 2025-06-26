import React from "react";
import { PokemonListItem, PokemonType, PokemonStat } from "../types/pokemon";
import { usePokemonData } from "../context/PokemonDataContext";
import { getTypeColor } from "../utils/pokemonColors";
import { getStatBarColor, getStatBarPercentage, getStatShortName } from "../utils/statColors";
import Image from "next/image";
import Pagination from "./Pagination";

const PokeballSVG = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 131 133" fill="none" className="absolute right-1 -top-6 w-28 h-28 pointer-events-none select-none opacity-20">
    <g>
      <path d="M81.2548 66.5C81.2548 75.2445 74.2011 82.3333 65.5 82.3333C56.7989 82.3333 49.7452 75.2445 49.7452 66.5C49.7452 57.7555 56.7989 50.6667 65.5 50.6667C74.2011 50.6667 81.2548 57.7555 81.2548 66.5Z" fill="white"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M65.5 133C98.8353 133 126.413 108.227 131 76H92.245C88.3519 87.0693 77.8475 95 65.5 95C53.1525 95 42.6481 87.0693 38.755 76H0C4.58681 108.227 32.1647 133 65.5 133ZM38.755 57H0C4.58681 24.7732 32.1647 0 65.5 0C98.8353 0 126.413 24.7732 131 57H92.245C88.3519 45.9307 77.8475 38 65.5 38C53.1525 38 42.6481 45.9307 38.755 57ZM81.2548 66.5C81.2548 75.2445 74.2011 82.3333 65.5 82.3333C56.7989 82.3333 49.7452 75.2445 49.7452 66.5C49.7452 57.7555 56.7989 50.6667 65.5 50.6667C74.2011 50.6667 81.2548 57.7555 81.2548 66.5Z" fill="white"/>
    </g>
  </svg>
);

const LoaderCard = () => (
  <div className="flex items-center justify-center h-40 w-full">
    <span className="inline-block w-8 h-8 border-2 border-gray-300 border-t-gray-500 rounded-full animate-spin" />
  </div>
);



// Componente para mostrar las stats como barras indicadoras
const StatBars = ({ stats }: { stats: PokemonStat[] }) => {
  // Seleccionar las 4 stats más importantes
  const importantStats = ['hp', 'attack', 'defense', 'speed'];
  const filteredStats = stats.filter(stat => 
    importantStats.includes(stat.stat.name)
  );

  return (
    <div className="grid grid-cols-2 gap-1">
      {filteredStats.map((stat) => {
        const percentage = getStatBarPercentage(stat.base_stat);
        return (
          <div key={stat.stat.name} className="flex flex-col gap-0.5">
            <div className="flex items-center justify-between">
              <span className="text-[8px] font-semibold text-gray-700 group-hover:text-white transition-colors duration-300 drop-shadow-sm">
                {getStatShortName(stat.stat.name)}
              </span>
              <span className="text-[8px] font-bold text-gray-700 group-hover:text-white transition-colors duration-300 drop-shadow-sm">
                {stat.base_stat}
              </span>
            </div>
            <div className="bg-gray-300 group-hover:bg-black/30 rounded-full h-1.5 overflow-hidden transition-all duration-300">
              <div 
                className={`${getStatBarColor(stat.stat.name, stat.base_stat)} h-full rounded-full transition-all duration-300`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

interface PokemonGridProps {
  pokemons: PokemonListItem[];
  getDetails: (nameOrUrl: string) => void;
  getIdFromUrl: (url: string) => number;
  getImageUrl: (id: number) => string;
}

const PokemonGrid: React.FC<PokemonGridProps> = ({ 
  pokemons, 
  getDetails, 
  getIdFromUrl, 
}) => {
  const { getDetails: getCachedDetails, isLoadingDetails } = usePokemonData();
  
  // Estados para paginación interna
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(20);

  // Lógica de paginación
  const totalItems = pokemons.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentPageData = pokemons.slice(startIndex, endIndex);

  // Resetear página cuando cambian los pokémon (filtros externos)
  React.useEffect(() => {
    setCurrentPage(1);
  }, [pokemons.length]);

  // Funciones de paginación
  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1));
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  const handleGoToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(totalPages, page)));
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
        {currentPageData.map((p) => {
          const id = getIdFromUrl(p.url);
          const details = getCachedDetails(p.name);
          const loading = isLoadingDetails(p.name);
          let bg = "#f4f4f4";
          
          if (details) {
            const t1 = details.types[0]?.type.name;
            const t2 = details.types[1]?.type.name;
            if (t1 && t2 && t1 !== t2) {
              bg = `linear-gradient(90deg, ${getTypeColor(t1)} 60%, ${getTypeColor(t2)} 100%)`;
            } else if (t1) {
              bg = getTypeColor(t1);
            }
          }
          
          return (
            <button
              key={p.name}
              className="relative flex items-stretch rounded-3xl shadow-sm h-36 group transition-all duration-500 ease-out hover:scale-[1.03] focus:outline-none cursor-pointer"
              style={{ background: bg, transition: 'background 0.6s cubic-bezier(0.4, 0, 0.2, 1)' }}
              onClick={() => getDetails(p.name)}
              aria-label={`Ver detalles de ${p.name}`}
            >
              {/* Columna izquierda: info fija */}
              <div className="flex flex-col justify-between h-full w-2/5 min-w-24 bg-[#f6f7f9] group-hover:bg-transparent rounded-l-3xl px-4 py-3 z-10 transition-all duration-500 ease-out">
                {/* Número de Pokédex arriba del nombre */}
                <span className="block text-xs text-start text-gray-500 group-hover:text-white font-semibold transition-colors duration-500 ease-out">
                  #{id.toString().padStart(3, "0")}
                </span>
                
                {/* Nombre del Pokémon */}
                <span className="block text-lg text-start font-bold capitalize text-gray-800 group-hover:text-white mb-1 transition-colors duration-500 ease-out">
                  {p.name}
                </span>
                
                {/* Stats bars */}
                {details && details.stats && (
                  <div className="mb-1.5">
                    <StatBars stats={details.stats} />
                  </div>
                )}
                
                {/* Tipos */}
                <div className="flex gap-1 flex-wrap">
                  {details && details.types.map((t: PokemonType) => (
                    <span
                      key={t.type.name}
                      className="px-2 py-0.5 rounded-full text-xs font-semibold capitalize shadow max-w-[70px] truncate transition-all duration-500 ease-out"
                      style={{ background: getTypeColor(t.type.name), color: "#fff" }}
                      title={t.type.name}
                    >
                      {t.type.name}
                    </span>
                  ))}
                </div>
              </div>
              {/* Fondo pokebola y Pokémon a la derecha */}
              <div className="flex-1 relative flex items-end justify-end pr-6 w-1/2">
                <PokeballSVG />
                {loading ? (
                  <LoaderCard />
                ) : (
                  <Image
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`}
                    alt={p.name}
                    className="w-44 h-44 select-none z-20 -mt-8"
                    loading="lazy"
                    width={1000}
                    height={1000}
                  />
                )}
              </div>
            </button>
          );
        })}
      </div>
      
      {/* Paginación interna */}
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