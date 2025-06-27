/**
 * @fileoverview Componente de paginación reutilizable
 * Este componente proporciona una interfaz completa de paginación con
 * navegación por páginas, selector de tamaño de página y información de elementos.
 */

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Props del componente Pagination
 */
interface PaginationProps {
  /** Página actual */
  currentPage: number;
  /** Número total de páginas */
  totalPages: number;
  /** Número de elementos por página */
  pageSize: number;
  /** Si se puede navegar a la página anterior */
  canPreviousPage: boolean;
  /** Si se puede navegar a la página siguiente */
  canNextPage: boolean;
  /** Función para navegar a la página anterior */
  onPreviousPage: () => void;
  /** Función para navegar a la página siguiente */
  onNextPage: () => void;
  /** Función para cambiar el tamaño de página */
  onPageSizeChange: (pageSize: number) => void;
  /** Función para navegar a una página específica (opcional) */
  onGoToPage?: (page: number) => void;
  /** Número total de elementos (opcional) */
  totalItems?: number;
}

/**
 * Opciones de tamaño de página disponibles
 */
const pageSizeOptions = [10, 20, 30, 40, 50];

/**
 * Componente de paginación completo y reutilizable
 * 
 * Este componente proporciona una interfaz completa de paginación que incluye:
 * - Selector de tamaño de página
 * - Información de elementos mostrados
 * - Botones de navegación (anterior/siguiente)
 * - Números de página con navegación directa
 * - Indicadores de estado (activo, deshabilitado)
 * - Diseño responsivo
 * 
 * El componente calcula automáticamente qué páginas mostrar basándose en
 * la página actual, mostrando un delta de páginas alrededor de la actual
 * y agregando elipsis cuando es necesario.
 * 
 * @param props - Propiedades del componente
 * @param props.currentPage - Página actual
 * @param props.totalPages - Total de páginas
 * @param props.pageSize - Elementos por página
 * @param props.canPreviousPage - Si se puede ir a la anterior
 * @param props.canNextPage - Si se puede ir a la siguiente
 * @param props.onPreviousPage - Función para página anterior
 * @param props.onNextPage - Función para página siguiente
 * @param props.onPageSizeChange - Función para cambiar tamaño
 * @param props.onGoToPage - Función para ir a página específica
 * @param props.totalItems - Total de elementos
 * 
 * @returns JSX.Element - Componente de paginación completo
 * 
 * @example
 * ```typescript
 * <Pagination
 *   currentPage={1}
 *   totalPages={10}
 *   pageSize={20}
 *   canPreviousPage={false}
 *   canNextPage={true}
 *   onPreviousPage={() => setPage(page - 1)}
 *   onNextPage={() => setPage(page + 1)}
 *   onPageSizeChange={(size) => setPageSize(size)}
 *   onGoToPage={(page) => setPage(page)}
 *   totalItems={200}
 * />
 * ```
 */
const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  pageSize,
  canPreviousPage,
  canNextPage,
  onPreviousPage,
  onNextPage,
  onPageSizeChange,
  onGoToPage,
  totalItems,
}) => {
  
  /**
   * Calcula qué páginas mostrar en la navegación
   * Incluye elipsis cuando hay muchas páginas
   * 
   * @returns Array de números de página y elipsis
   */
  const getVisiblePages = () => {
    const pages = [];
    const delta = 2; // Mostrar 2 páginas antes y después de la actual
    
    const start = Math.max(1, currentPage - delta);
    const end = Math.min(totalPages, currentPage + delta);
    
    // Agregar primera página y elipsis si es necesario
    if (start > 1) {
      pages.push(1);
      if (start > 2) pages.push('...');
    }
    
    // Agregar páginas del rango visible
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    // Agregar última página y elipsis si es necesario
    if (end < totalPages) {
      if (end < totalPages - 1) pages.push('...');
      pages.push(totalPages);
    }
    
    return pages;
  };

  /** Cálculo del rango de elementos mostrados */
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems || 0);

  return (
    <div className="w-full bg-white/95 backdrop-blur-xl rounded-xl border border-gray-300/60 p-6 mb-8 shadow-sm">
      <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
        
        {/* Selector de tamaño de página */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-600">Mostrar:</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="px-3 py-2.5 bg-gray-50/80 backdrop-blur-sm border border-gray-300/70 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 shadow-sm hover:bg-gray-100/80"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <span className="text-sm text-gray-600">por página</span>
        </div>

        {/* Información de elementos mostrados */}
        {totalItems && (
          <div className="text-sm text-gray-600 font-medium">
            Mostrando {startItem} - {endItem} de {totalItems}
          </div>
        )}

        {/* Botones de navegación con números de página */}
        <div className="flex items-center gap-2">
          {/* Botón anterior */}
          <button
            onClick={onPreviousPage}
            disabled={!canPreviousPage}
            className="flex items-center gap-2 px-4 py-2.5 bg-gray-50/80 backdrop-blur-sm hover:bg-gray-100/80 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 rounded-lg transition-all duration-300 font-medium border border-gray-300/70 shadow-sm"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Anterior</span>
          </button>
          
          {/* Números de página */}
          {onGoToPage && totalPages > 1 && (
            <div className="flex items-center gap-1 mx-2">
              {getVisiblePages().map((page, index) => {
                if (page === '...') {
                  return (
                    <span key={`ellipsis-${index}`} className="px-2 py-1 text-gray-500 font-medium">
                      ...
                    </span>
                  );
                }
                
                const pageNum = page as number;
                const isActive = pageNum === currentPage;
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => onGoToPage(pageNum)}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-300 border shadow-sm ${
                      isActive
                        ? 'bg-purple-600 text-white border-purple-700/50'
                        : 'bg-gray-50/80 backdrop-blur-sm hover:bg-gray-100/80 text-gray-700 border-gray-300/70'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
          )}
          
          {/* Botón siguiente */}
          <button
            onClick={onNextPage}
            disabled={!canNextPage}
            className="flex items-center gap-2 px-4 py-2.5 bg-gray-50/80 backdrop-blur-sm hover:bg-gray-100/80 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 rounded-lg transition-all duration-300 font-medium border border-gray-300/70 shadow-sm"
          >
            <span className="hidden sm:inline">Siguiente</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination; 