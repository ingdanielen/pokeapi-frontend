import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  canPreviousPage: boolean;
  canNextPage: boolean;
  onPreviousPage: () => void;
  onNextPage: () => void;
  onPageSizeChange: (pageSize: number) => void;
  onGoToPage?: (page: number) => void;
  totalItems?: number;
}

const pageSizeOptions = [10, 20, 30, 40, 50];

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
  
  const getVisiblePages = () => {
    const pages = [];
    const delta = 2; // Mostrar 2 páginas antes y después de la actual
    
    const start = Math.max(1, currentPage - delta);
    const end = Math.min(totalPages, currentPage + delta);
    
    if (start > 1) {
      pages.push(1);
      if (start > 2) pages.push('...');
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    if (end < totalPages) {
      if (end < totalPages - 1) pages.push('...');
      pages.push(totalPages);
    }
    
    return pages;
  };

  // Calcular el rango de elementos mostrados
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems || 0);

  return (
    <div className="w-full bg-white/95 backdrop-blur-xl rounded-xl border border-gray-300/60 p-6 mb-8 shadow-sm">
      <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
        
        {/* Page size selector */}
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

        {/* Page info - showing x of x */}
        {totalItems && (
          <div className="text-sm text-gray-600 font-medium">
            Mostrando {startItem} - {endItem} de {totalItems}
          </div>
        )}

        {/* Navigation buttons with page numbers */}
        <div className="flex items-center gap-2">
          <button
            onClick={onPreviousPage}
            disabled={!canPreviousPage}
            className="flex items-center gap-2 px-4 py-2.5 bg-gray-50/80 backdrop-blur-sm hover:bg-gray-100/80 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 rounded-lg transition-all duration-300 font-medium border border-gray-300/70 shadow-sm"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Anterior</span>
          </button>
          
          {/* Page numbers */}
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