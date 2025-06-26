import { Filter, Grid, List, Loader2, Search, Target, X } from "lucide-react";
import React from "react";
import { PokemonTypeOption } from "../types/pokemon";
import { getTypeColor } from "../utils/pokemonColors";

interface ControlBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterType: string;
  setFilterType: (type: string) => void;
  pokemonTypes: PokemonTypeOption[];
  viewMode: "grid" | "table";
  setViewMode: (mode: "grid" | "table") => void;
  isLoadingDetails?: boolean;
}

const ControlBar: React.FC<ControlBarProps> = ({
  searchTerm,
  setSearchTerm,
  filterType,
  setFilterType,
  pokemonTypes,
  viewMode,
  setViewMode,
  isLoadingDetails = false,
}) => {
  return (
    <div className="w-full bg-white rounded-lg border border-gray-200 p-6 mb-6 shadow-sm">
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        {/* Búsqueda */}
        <div className="flex-1 w-full lg:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar Pokémon por nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-gray-500"
            />
          </div>
        </div>

        {/* Filtro por tipo */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-500 rounded-md">
              <Filter className="w-4 h-4 text-white" />
            </div>
            <label htmlFor="type-filter" className="text-sm font-medium text-gray-700">
              Tipo
            </label>
          </div>
          <div className="relative">
            {isLoadingDetails && (
              <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue-500 animate-spin" />
            )}
            <select
              id="type-filter"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className={`appearance-none border border-gray-300 rounded-lg px-3 py-2 pr-10 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors min-w-[140px] ${
                isLoadingDetails ? 'opacity-50' : ''
              }`}
              disabled={isLoadingDetails}
            >
              <option value="">Todos los tipos</option>
              {pokemonTypes.map((type) => (
                <option key={type.name} value={type.name}>
                  {type.name.charAt(0).toUpperCase() + type.name.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Toggle de vista */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700">Vista</span>
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode("grid")}
              disabled={isLoadingDetails}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === "grid"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              } ${isLoadingDetails ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Grid className="w-4 h-4" />
              Grid
            </button>
            <button
              onClick={() => setViewMode("table")}
              disabled={isLoadingDetails}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === "table"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              } ${isLoadingDetails ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <List className="w-4 h-4" />
              Lista
            </button>
          </div>
        </div>
      </div>

      {/* Badges de filtros activos */}
      {(filterType || searchTerm) && (
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
          {filterType && (
            <div 
              className="flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium text-white"
              style={{ backgroundColor: getTypeColor(filterType) }}
            >
              <Target className="w-3 h-3" />
              <span>{filterType.charAt(0).toUpperCase() + filterType.slice(1)}</span>
              <button
                onClick={() => setFilterType("")}
                className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
                disabled={isLoadingDetails}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
          {searchTerm && (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500 text-white text-sm font-medium">
              <Search className="w-3 h-3" />
              <span>"{searchTerm}"</span>
              <button
                onClick={() => setSearchTerm("")}
                className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
          {isLoadingDetails && (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-500 text-white text-sm font-medium">
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>Cargando...</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ControlBar; 