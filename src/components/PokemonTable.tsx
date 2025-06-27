/**
 * @fileoverview Componente de tabla para mostrar Pokémon con TanStack Table
 * Este componente renderiza una tabla interactiva y ordenable que muestra
 * información detallada de Pokémon con paginación y estados de carga.
 */

import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React, { useMemo, useState } from "react";
import {
  PokemonDetails,
  PokemonListItem,
} from "../types/pokemon";
import Pagination from "./Pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderWrapper,
  TableRow,
} from "./ui";
import { createPokemonTableColumns } from "./PokemonTable/columns";

/**
 * Props del componente PokemonTable
 */
interface PokemonTableProps {
  /** Lista de Pokémon a mostrar en la tabla */
  pokemons: PokemonListItem[];
  /** Función para manejar la selección de un Pokémon */
  getDetails: (nameOrUrl: string) => void;
  /** Función para obtener datos detallados de un Pokémon */
  getDetailsData: (nameOrUrl: string) => PokemonDetails | null;
  /** Función para verificar si los detalles están cargando */
  isLoadingDetails: (nameOrUrl: string) => boolean;
}

/**
 * Componente de tabla para mostrar información detallada de Pokémon
 *
 * Este componente utiliza TanStack Table para crear una tabla interactiva
 * que muestra información completa de Pokémon incluyendo:
 * - Imagen oficial del Pokémon
 * - Nombre y número de Pokédex
 * - Tipos con colores
 * - Características físicas (peso, altura)
 * - Estadísticas base con barras de progreso
 * - Experiencia base
 * - Botón para ver detalles completos
 *
 * La tabla incluye funcionalidades de:
 * - Ordenamiento por columnas
 * - Paginación
 * - Estados de carga
 * - Diseño responsivo
 *
 * @param props - Propiedades del componente
 * @param props.pokemons - Lista de Pokémon a mostrar
 * @param props.getDetails - Función para manejar selección
 * @param props.getDetailsData - Función para obtener datos
 * @param props.isLoadingDetails - Función para verificar carga
 *
 * @returns JSX.Element - Tabla interactiva de Pokémon
 *
 * @example
 * ```typescript
 * <PokemonTable
 *   pokemons={filteredPokemons}
 *   getDetails={handlePokemonSelect}
 *   getDetailsData={getCachedDetails}
 *   isLoadingDetails={isLoadingDetails}
 * />
 * ```
 */
const PokemonTable: React.FC<PokemonTableProps> = ({
  pokemons,
  getDetails,
  getDetailsData,
  isLoadingDetails,
}) => {
  /** Número de elementos por página */
  const [pageSize, setPageSize] = useState(20);

  /**
   * Definición de columnas para la tabla
   * Utiliza las columnas factorizadas del archivo columns.tsx
   */
  const columns = useMemo(
    () => createPokemonTableColumns({
      getDetailsData,
      isLoadingDetails,
      getDetails,
    }),
    [getDetailsData, isLoadingDetails, getDetails]
  );

  // Tabla con paginación integrada
  const table = useReactTable<PokemonListItem>({
    data: pokemons,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: pageSize,
      },
    },
    enableSorting: true,
    enableMultiSort: false,
  });

  // Obtener información de paginación de la tabla
  const currentPage = table.getState().pagination.pageIndex + 1;
  const totalPages = table.getPageCount();
  const totalItems = pokemons.length;

  return (
    <div className="w-full">
      {/* Tabla minimalista */}
      <Table>
        <TableHeaderWrapper>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </tr>
          ))}
        </TableHeaderWrapper>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Paginación componetizada */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        canPreviousPage={table.getCanPreviousPage()}
        canNextPage={table.getCanNextPage()}
        onPreviousPage={() => table.previousPage()}
        onNextPage={() => table.nextPage()}
        onGoToPage={(page) => table.setPageIndex(page - 1)}
        onPageSizeChange={(newPageSize) => {
          setPageSize(newPageSize);
          table.setPageSize(newPageSize);
        }}
        totalItems={totalItems}
      />
    </div>
  );
};

export default PokemonTable;
