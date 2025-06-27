/**
 * @fileoverview Barra de controles para filtrado, búsqueda y ordenamiento
 * Este componente proporciona una interfaz completa para controlar la visualización
 * de Pokémon con búsqueda, filtros por tipo, ordenamiento y cambio de vista.
 */

import { Filter, Grid, List, Loader2, Search, Target, X, ArrowUpDown, ArrowUp, ArrowDown, Plus } from "lucide-react";
import React, { useState } from "react";
import { PokemonTypeOption } from "../types/pokemon";
import { getTypeColor } from "../utils/pokemonColors";

/**
 * Props del componente ControlBar
 */
interface ControlBarProps {
  /** Término de búsqueda actual */
  searchTerm: string;
  /** Función para actualizar el término de búsqueda */
  setSearchTerm: (term: string) => void;
  /** Array de tipos seleccionados para filtrar */
  filterType: string[];
  /** Función para actualizar los tipos de filtro */
  setFilterType: (types: string[]) => void;
  /** Lista de todos los tipos de Pokémon disponibles */
  pokemonTypes: PokemonTypeOption[];
  /** Modo de vista actual (grid o table) */
  viewMode: "grid" | "table";
  /** Función para cambiar el modo de vista */
  setViewMode: (mode: "grid" | "table") => void;
  /** Estado de carga para deshabilitar controles */
  isLoadingDetails?: boolean;
  /** Campo actual de ordenamiento */
  sortBy?: "name" | "id" | "none";
  /** Función para cambiar el campo de ordenamiento */
  setSortBy?: (sort: "name" | "id" | "none") => void;
  /** Orden actual (ascendente o descendente) */
  sortOrder?: "asc" | "desc";
  /** Función para cambiar el orden */
  setSortOrder?: (order: "asc" | "desc") => void;
}

/**
 * Componente de barra de controles para la aplicación Pokémon
 * 
 * Este componente proporciona una interfaz completa para controlar la visualización
 * de Pokémon. Incluye funcionalidades de:
 * - Búsqueda por nombre
 * - Filtrado por tipos (multiselect)
 * - Ordenamiento por ID o nombre
 * - Cambio entre vista de cuadrícula y tabla
 * 
 * El componente maneja estados de carga y proporciona feedback visual
 * para todas las interacciones del usuario.
 * 
 * @param props - Propiedades del componente
 * @param props.searchTerm - Término de búsqueda actual
 * @param props.setSearchTerm - Función para actualizar búsqueda
 * @param props.filterType - Tipos seleccionados para filtrar
 * @param props.setFilterType - Función para actualizar filtros
 * @param props.pokemonTypes - Lista de tipos disponibles
 * @param props.viewMode - Modo de vista actual
 * @param props.setViewMode - Función para cambiar vista
 * @param props.isLoadingDetails - Estado de carga
 * @param props.sortBy - Campo de ordenamiento
 * @param props.setSortBy - Función para cambiar ordenamiento
 * @param props.sortOrder - Orden actual
 * @param props.setSortOrder - Función para cambiar orden
 * 
 * @returns JSX.Element - Barra de controles completa
 * 
 * @example
 * ```typescript
 * <ControlBar
 *   searchTerm={searchTerm}
 *   setSearchTerm={setSearchTerm}
 *   filterType={filterType}
 *   setFilterType={setFilterType}
 *   pokemonTypes={pokemonTypes}
 *   viewMode={viewMode}
 *   setViewMode={setViewMode}
 *   isLoadingDetails={isLoading}
 *   sortBy={sortBy}
 *   setSortBy={setSortBy}
 *   sortOrder={sortOrder}
 *   setSortOrder={setSortOrder}
 * />
 * ```
 */
const ControlBar: React.FC<ControlBarProps> = ({
  searchTerm,
  setSearchTerm,
  filterType,
  setFilterType,
  pokemonTypes,
  viewMode,
  setViewMode,
  isLoadingDetails = false,
  sortBy = "none",
  setSortBy = () => {},
  sortOrder = "asc",
  setSortOrder = () => {},
}) => {
  /** Estado para mostrar/ocultar el dropdown de tipos */
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);

  /**
   * Alterna el ordenamiento entre ascendente, descendente y sin orden
   * 
   * @param newSortBy - Nuevo campo de ordenamiento
   */
  const toggleSort = (newSortBy: "name" | "id") => {
    if (sortBy === newSortBy) {
      if (sortOrder === "asc") {
        setSortOrder("desc");
      } else {
        // Si ya está en desc, desactivar el ordenamiento
        setSortBy("none");
        setSortOrder("asc");
      }
    } else {
      setSortBy(newSortBy);
      setSortOrder("asc");
    }
  };

  /**
   * Obtiene el icono apropiado para el ordenamiento
   * 
   * @param type - Tipo de ordenamiento (name o id)
   * @returns JSX.Element - Icono de ordenamiento
   */
  const getSortIcon = (type: "name" | "id") => {
    if (sortBy !== type) return <ArrowUpDown className="w-4 h-4" />;
    return sortOrder === "asc" ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />;
  };

  /**
   * Alterna la selección de un tipo de filtro
   * 
   * @param typeName - Nombre del tipo a alternar
   */
  const handleTypeToggle = (typeName: string) => {
    if (filterType.includes(typeName)) {
      setFilterType(filterType.filter(t => t !== typeName));
    } else {
      setFilterType([...filterType, typeName]);
    }
  };

  /**
   * Remueve un tipo específico del filtro
   * 
   * @param typeName - Nombre del tipo a remover
   */
  const removeType = (typeName: string) => {
    setFilterType(filterType.filter(t => t !== typeName));
  };

  /**
   * Limpia todos los filtros de tipo
   */
  const clearAllTypes = () => {
    setFilterType([]);
  };

  /** Tipos disponibles para agregar (excluyendo los ya seleccionados) */
  const availableTypes = pokemonTypes.filter(type => !filterType.includes(type.name));

  return (
    <div className="w-full bg-white/95 backdrop-blur-xl rounded-xl border border-gray-300/60 p-6 mb-8 shadow-sm relative z-10">
      
      <div className="relative z-10">
        {/* Fila principal de controles */}
        <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center mb-4">
          {/* Sección de búsqueda */}
          <div className="flex-1 w-full lg:w-auto">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-blue-600 rounded-lg shadow-md">
                <Search className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-semibold text-gray-700">Buscar</span>
            </div>
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 group-hover:text-blue-600 transition-colors duration-300" />
              <input
                type="text"
                placeholder="Nombre del Pokémon..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50/80 backdrop-blur-sm border border-gray-300/70 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 placeholder-gray-500 text-gray-800 shadow-md"
              />
            </div>
          </div>

          {/* Sección de ordenamiento */}
          <div className="flex-shrink-0">
            <div className="flex items-center gap-2 mb-2">
              <div className={`p-1.5 rounded-lg shadow-md ${
                sortBy === "none" ? "bg-gray-500" : "bg-indigo-600"
              }`}>
                <ArrowUpDown className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-semibold text-gray-700">
                Ordenar {sortBy === "none" && "(Sin orden)"}
              </span>
            </div>
            <div className="flex bg-gray-100/80 backdrop-blur-sm rounded-lg p-1 border border-gray-300/50 shadow-md">
              <button
                onClick={() => toggleSort("id")}
                disabled={isLoadingDetails}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium transition-all duration-300 relative ${
                  sortBy === "id"
                    ? "bg-indigo-600 text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-200/70 hover:text-gray-800"
                } ${isLoadingDetails ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="flex items-center gap-1">
                  {getSortIcon("id")}
                  <span># Pokédex</span>
                </div>
                {sortBy === "id" && (
                  <div className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${
                    sortOrder === "asc" ? "bg-green-400" : "bg-orange-400"
                  }`}></div>
                )}
              </button>
              <button
                onClick={() => toggleSort("name")}
                disabled={isLoadingDetails}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium transition-all duration-300 relative ${
                  sortBy === "name"
                    ? "bg-indigo-600 text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-200/70 hover:text-gray-800"
                } ${isLoadingDetails ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="flex items-center gap-1">
                  {getSortIcon("name")}
                  <span>Nombre</span>
                </div>
                {sortBy === "name" && (
                  <div className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${
                    sortOrder === "asc" ? "bg-green-400" : "bg-orange-400"
                  }`}></div>
                )}
              </button>
            </div>
          </div>

          {/* Filtro por tipo - Multiselect */}
          <div className="flex-shrink-0">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-emerald-600 rounded-lg shadow-md">
                <Filter className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-semibold text-gray-700">
                Tipos {filterType.length > 0 && `(${filterType.length})`}
              </span>
            </div>
            
            {/* Dropdown para agregar tipos */}
            <div className="relative z-11">
              <button
                onClick={() => setShowTypeDropdown(!showTypeDropdown)}
                disabled={isLoadingDetails || availableTypes.length === 0}
                className={`flex items-center gap-2 px-3 py-2.5 bg-gray-50/80 backdrop-blur-sm border border-gray-300/70 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 min-w-[140px] shadow-md text-sm ${
                  isLoadingDetails ? 'opacity-50' : 'hover:bg-gray-100/80'
                }`}
              >
                <Plus className="w-4 h-4 text-emerald-600" />
                <span className="text-gray-700">
                  {availableTypes.length === 0 ? 'Todos agregados' : 'Agregar tipo'}
                </span>
                {isLoadingDetails && (
                  <Loader2 className="w-4 h-4 text-emerald-600 animate-spin" />
                )}
              </button>

              {showTypeDropdown && availableTypes.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300/70 rounded-lg shadow-xl z-[9999] max-h-60 overflow-y-auto">
                  {availableTypes.map((type) => (
                    <button
                      key={type.name}
                      onClick={() => {
                        handleTypeToggle(type.name);
                        setShowTypeDropdown(false);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-gray-50 transition-colors duration-200 text-sm border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: getTypeColor(type.name) }}
                        ></div>
                        <span>{type.name.charAt(0).toUpperCase() + type.name.slice(1)}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* VISTA */}
          <div className="flex-shrink-0">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-purple-600 rounded-lg shadow-md">
                <Grid className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-semibold text-gray-700">Vista</span>
            </div>
            <div className="flex bg-gray-100/80 backdrop-blur-sm rounded-lg p-1 border border-gray-300/50 shadow-md">
              <button
                onClick={() => setViewMode("grid")}
                disabled={isLoadingDetails}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium transition-all duration-300 ${
                  viewMode === "grid"
                    ? "bg-purple-600 text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-200/70 hover:text-gray-800"
                } ${isLoadingDetails ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Grid className="w-4 h-4" />
                <span>Grid</span>
              </button>
              <button
                onClick={() => setViewMode("table")}
                disabled={isLoadingDetails}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium transition-all duration-300 ${
                  viewMode === "table"
                    ? "bg-purple-600 text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-200/70 hover:text-gray-800"
                } ${isLoadingDetails ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <List className="w-4 h-4" />
                <span>Lista</span>
              </button>
            </div>
          </div>
        </div>

        {/* FILTROS ACTIVOS */}
        {(filterType.length > 0 || searchTerm || isLoadingDetails) && (
          <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-gray-300/50">
            {filterType.map((type) => (
              <div 
                key={type}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-white shadow-md transition-all duration-300 border border-white/40"
                style={{ 
                  backgroundColor: getTypeColor(type),
                  boxShadow: `0 4px 12px ${getTypeColor(type)}25`
                }}
              >
                <Target className="w-3 h-3" />
                <span>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
                <button
                  onClick={() => removeType(type)}
                  className="hover:bg-white/30 rounded-full p-0.5 transition-all duration-300"
                  disabled={isLoadingDetails}
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            {searchTerm && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-medium shadow-md border border-blue-200/50 transition-all duration-300">
                <Search className="w-3 h-3" />
                <span>&quot;{searchTerm}&quot;</span>
                <button
                  onClick={() => setSearchTerm("")}
                  className="hover:bg-white/30 rounded-full p-0.5 transition-all duration-300"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
            {isLoadingDetails && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-500 text-white text-xs font-medium shadow-md border border-gray-300/40">
                <Loader2 className="w-3 h-3 animate-spin" />
                <span>Cargando...</span>
              </div>
            )}
            {filterType.length >= 2 && (
              <button
                onClick={clearAllTypes}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-400 hover:bg-red-700 text-white text-xs font-medium shadow-md transition-all duration-300"
                disabled={isLoadingDetails}
              >
                <X className="w-3 h-3" />
                <span>Borrar todos</span>
              </button>
            )}
          </div>
        )}
      </div>

             {/* Overlay para cerrar dropdown */}
       {showTypeDropdown && (
         <div 
           className="fixed inset-0 z-40" 
           onClick={() => setShowTypeDropdown(false)}
         />
       )}
    </div>
  );
};

export default ControlBar; 