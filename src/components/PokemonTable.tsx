/**
 * @fileoverview Componente de tabla para mostrar Pokémon con TanStack Table
 * Este componente renderiza una tabla interactiva y ordenable que muestra
 * información detallada de Pokémon con paginación y estados de carga.
 */

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Row,
  useReactTable,
} from "@tanstack/react-table";
import {
  Flame,
  Heart,
  Image as ImageIcon,
  Palette,
  Ruler,
  Shield,
  Sparkles,
  Star,
  Sword,
  Weight,
  Zap
} from "lucide-react";
import React, { useMemo, useState } from "react";
import {
  PokemonDetails,
  PokemonListItem,
  PokemonStat,
  PokemonType,
} from "../types/pokemon";
import { getTypeColor } from "../utils/pokemonColors";
import Pagination from "./Pagination";
import {
  LoaderCell,
  PokemonImage,
  StatBar,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableHeaderWrapper,
  TableRow,
  ViewButton,
} from "./ui";

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
  /** Página actual de la paginación */
  const [currentPage, setCurrentPage] = useState(1);
  /** Número de elementos por página */
  const [pageSize, setPageSize] = useState(20);

  // Cálculos de paginación
  const totalItems = pokemons.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
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
    setCurrentPage(1);
  };

  /**
   * Navega directamente a una página específica
   *
   * @param page - Número de página a la que navegar
   */
  const handleGoToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(totalPages, page)));
  };

  /**
   * Definición de columnas para la tabla
   * Cada columna incluye renderizado condicional para estados de carga
   */
  const columns = useMemo<ColumnDef<PokemonListItem>[]>(
    () => [
      {
        header: () => <TableHeader icon={ImageIcon} label="Imagen" />,
        accessorKey: "name",
        id: "image",
        size: 80,
        cell: ({ row }: { row: Row<PokemonListItem> }) => {
          const details = getDetailsData(row.original.name);
          if (isLoadingDetails(row.original.name) || !details)
            return <LoaderCell />;

          return (
            <div className="flex justify-center">
              <PokemonImage
                src={details?.sprites?.other?.["official-artwork"]?.front_default ?? ""}
                alt={row.original.name}
              />
            </div>
          );
        },
        enableSorting: false,
      },
      {
        header: ({ column }) => (
          <TableHeader 
            label="Nombre" 
            canSort={true}
            isSorted={column.getIsSorted() as false | "asc" | "desc"}
            onSort={() => column.toggleSorting()}
          />
        ),
        accessorKey: "name",
        id: "name",
        size: 120,
        cell: ({ getValue }) => (
          <div className="flex justify-center">
            <span className="capitalize text-gray-900 font-medium">
              {getValue() as string}
            </span>
          </div>
        ),
        sortingFn: "alphanumeric",
      },
      {
        header: ({ column }) => (
          <TableHeader 
            icon={Palette} 
            label="Tipos" 
            canSort={true}
            isSorted={column.getIsSorted() as false | "asc" | "desc"}
            onSort={() => column.toggleSorting()}
          />
        ),
        accessorKey: "name",
        id: "types",
        size: 100,
        cell: ({ row }: { row: Row<PokemonListItem> }) => {
          const details = getDetailsData(row.original.name);
          if (isLoadingDetails(row.original.name) || !details)
            return <LoaderCell />;
          return (
            <div className="flex justify-center">
              <div className="flex flex-col gap-1">
                {details.types.map((t: PokemonType) => (
                  <span
                    key={t.type.name}
                    className="px-2 py-0.5 rounded text-xs capitalize text-white font-medium"
                    style={{ background: getTypeColor(t.type.name) }}
                  >
                    {t.type.name}
                  </span>
                ))}
              </div>
            </div>
          );
        },
        sortingFn: (a, b) => {
          const detailsA = getDetailsData(a.original.name);
          const detailsB = getDetailsData(b.original.name);
          
          if (!detailsA || !detailsB) return 0;
          
          // Ordenar por primer tipo
          const firstTypeA = detailsA.types[0]?.type.name || "";
          const firstTypeB = detailsB.types[0]?.type.name || "";
          
          if (firstTypeA !== firstTypeB) {
            return firstTypeA.localeCompare(firstTypeB);
          }
          
          // Si el primer tipo es igual, ordenar por segundo tipo
          const secondTypeA = detailsA.types[1]?.type.name || "";
          const secondTypeB = detailsB.types[1]?.type.name || "";
          
          return secondTypeA.localeCompare(secondTypeB);
        },
      },
      {
        header: ({ column }) => (
          <TableHeader 
            icon={Weight} 
            label="Peso (kg)" 
            canSort={true}
            isSorted={column.getIsSorted() as false | "asc" | "desc"}
            onSort={() => column.toggleSorting()}
          />
        ),
        accessorKey: "name",
        id: "weight",
        size: 100,
        cell: ({ row }: { row: Row<PokemonListItem> }) => {
          const details = getDetailsData(row.original.name);
          if (isLoadingDetails(row.original.name) || !details)
            return <LoaderCell />;
          return (
            <div className="flex justify-center">
              <span className="text-sm text-gray-700 font-medium">
                {(details.weight / 10).toFixed(1)}
              </span>
            </div>
          );
        },
        sortingFn: (a, b) => {
          const detailsA = getDetailsData(a.original.name);
          const detailsB = getDetailsData(b.original.name);
          
          if (!detailsA || !detailsB) return 0;
          
          return detailsA.weight - detailsB.weight;
        },
      },
      {
        header: ({ column }) => (
          <TableHeader 
            icon={Ruler} 
            label="Altura (m)" 
            canSort={true}
            isSorted={column.getIsSorted() as false | "asc" | "desc"}
            onSort={() => column.toggleSorting()}
          />
        ),
        accessorKey: "name",
        id: "height",
        size: 100,
        cell: ({ row }: { row: Row<PokemonListItem> }) => {
          const details = getDetailsData(row.original.name);
          if (isLoadingDetails(row.original.name) || !details)
            return <LoaderCell />;
          return (
            <div className="flex justify-center">
              <span className="text-sm text-gray-700 font-medium">
                {(details.height / 10).toFixed(1)}
              </span>
            </div>
          );
        },
        sortingFn: (a, b) => {
          const detailsA = getDetailsData(a.original.name);
          const detailsB = getDetailsData(b.original.name);
          
          if (!detailsA || !detailsB) return 0;
          
          return detailsA.height - detailsB.height;
        },
      },
      {
        header: ({ column }) => (
          <TableHeader 
            icon={Heart} 
            label="HP Base" 
            canSort={true}
            isSorted={column.getIsSorted() as false | "asc" | "desc"}
            onSort={() => column.toggleSorting()}
          />
        ),
        accessorKey: "name",
        id: "hp",
        size: 120,
        cell: ({ row }: { row: Row<PokemonListItem> }) => {
          const details = getDetailsData(row.original.name);
          if (isLoadingDetails(row.original.name) || !details)
            return <LoaderCell />;
          const stat = details.stats.find(
            (x: PokemonStat) => x.stat.name === "hp"
          );
          return stat ? (
            <div className="flex justify-center">
              <StatBar value={stat.base_stat} statName="hp" />
            </div>
          ) : (
            <div className="flex justify-center">
              <span className="text-gray-400">-</span>
            </div>
          );
        },
        sortingFn: (a, b) => {
          const detailsA = getDetailsData(a.original.name);
          const detailsB = getDetailsData(b.original.name);
          
          if (!detailsA || !detailsB) return 0;
          
          const statA = detailsA.stats.find((x: PokemonStat) => x.stat.name === "hp");
          const statB = detailsB.stats.find((x: PokemonStat) => x.stat.name === "hp");
          
          const valueA = statA?.base_stat || 0;
          const valueB = statB?.base_stat || 0;
          
          return valueA - valueB;
        },
      },
      {
        header: ({ column }) => (
          <TableHeader 
            icon={Star} 
            label="XP Base" 
            canSort={true}
            isSorted={column.getIsSorted() as false | "asc" | "desc"}
            onSort={() => column.toggleSorting()}
          />
        ),
        accessorKey: "name",
        id: "base_experience",
        size: 100,
        cell: ({ row }: { row: Row<PokemonListItem> }) => {
          const details = getDetailsData(row.original.name);
          if (isLoadingDetails(row.original.name) || !details)
            return <LoaderCell />;
          return (
            <div className="flex justify-center">
              <span className="text-sm text-gray-700 font-medium">
                {details.base_experience}
              </span>
            </div>
          );
        },
        sortingFn: (a, b) => {
          const detailsA = getDetailsData(a.original.name);
          const detailsB = getDetailsData(b.original.name);
          
          if (!detailsA || !detailsB) return 0;
          
          return detailsA.base_experience - detailsB.base_experience;
        },
      },
      {
        header: ({ column }) => (
          <TableHeader 
            icon={Sword} 
            label="Ataque Base" 
            canSort={true}
            isSorted={column.getIsSorted() as false | "asc" | "desc"}
            onSort={() => column.toggleSorting()}
          />
        ),
        accessorKey: "name",
        id: "attack",
        size: 120,
        cell: ({ row }: { row: Row<PokemonListItem> }) => {
          const details = getDetailsData(row.original.name);
          if (isLoadingDetails(row.original.name) || !details)
            return <LoaderCell />;
          const stat = details.stats.find(
            (x: PokemonStat) => x.stat.name === "attack"
          );
          return stat ? (
            <div className="flex justify-center">
              <StatBar value={stat.base_stat} statName="attack" />
            </div>
          ) : (
            <div className="flex justify-center">
              <span className="text-gray-400">-</span>
            </div>
          );
        },
        sortingFn: (a, b) => {
          const detailsA = getDetailsData(a.original.name);
          const detailsB = getDetailsData(b.original.name);
          
          if (!detailsA || !detailsB) return 0;
          
          const statA = detailsA.stats.find((x: PokemonStat) => x.stat.name === "attack");
          const statB = detailsB.stats.find((x: PokemonStat) => x.stat.name === "attack");
          
          const valueA = statA?.base_stat || 0;
          const valueB = statB?.base_stat || 0;
          
          return valueA - valueB;
        },
      },
      {
        header: ({ column }) => (
          <TableHeader 
            icon={Shield} 
            label="Defensa Base" 
            canSort={true}
            isSorted={column.getIsSorted() as false | "asc" | "desc"}
            onSort={() => column.toggleSorting()}
          />
        ),
        accessorKey: "name",
        id: "defense",
        size: 120,
        cell: ({ row }: { row: Row<PokemonListItem> }) => {
          const details = getDetailsData(row.original.name);
          if (isLoadingDetails(row.original.name) || !details)
            return <LoaderCell />;
          const stat = details.stats.find(
            (x: PokemonStat) => x.stat.name === "defense"
          );
          return stat ? (
            <div className="flex justify-center">
              <StatBar value={stat.base_stat} statName="defense" />
            </div>
          ) : (
            <div className="flex justify-center">
              <span className="text-gray-400">-</span>
            </div>
          );
        },
        sortingFn: (a, b) => {
          const detailsA = getDetailsData(a.original.name);
          const detailsB = getDetailsData(b.original.name);
          
          if (!detailsA || !detailsB) return 0;
          
          const statA = detailsA.stats.find((x: PokemonStat) => x.stat.name === "defense");
          const statB = detailsB.stats.find((x: PokemonStat) => x.stat.name === "defense");
          
          const valueA = statA?.base_stat || 0;
          const valueB = statB?.base_stat || 0;
          
          return valueA - valueB;
        },
      },
      {
        header: ({ column }) => (
          <TableHeader 
            icon={Flame} 
            label="Ataque Esp." 
            canSort={true}
            isSorted={column.getIsSorted() as false | "asc" | "desc"}
            onSort={() => column.toggleSorting()}
          />
        ),
        accessorKey: "name",
        id: "special-attack",
        size: 120,
        cell: ({ row }: { row: Row<PokemonListItem> }) => {
          const details = getDetailsData(row.original.name);
          if (isLoadingDetails(row.original.name) || !details)
            return <LoaderCell />;
          const stat = details.stats.find(
            (x: PokemonStat) => x.stat.name === "special-attack"
          );
          return stat ? (
            <div className="flex justify-center">
              <StatBar value={stat.base_stat} statName="special-attack" />
            </div>
          ) : (
            <div className="flex justify-center">
              <span className="text-gray-400">-</span>
            </div>
          );
        },
        sortingFn: (a, b) => {
          const detailsA = getDetailsData(a.original.name);
          const detailsB = getDetailsData(b.original.name);
          
          if (!detailsA || !detailsB) return 0;
          
          const statA = detailsA.stats.find((x: PokemonStat) => x.stat.name === "special-attack");
          const statB = detailsB.stats.find((x: PokemonStat) => x.stat.name === "special-attack");
          
          const valueA = statA?.base_stat || 0;
          const valueB = statB?.base_stat || 0;
          
          return valueA - valueB;
        },
      },
      {
        header: ({ column }) => (
          <TableHeader 
            icon={Sparkles} 
            label="Defensa Esp." 
            canSort={true}
            isSorted={column.getIsSorted() as false | "asc" | "desc"}
            onSort={() => column.toggleSorting()}
          />
        ),
        accessorKey: "name",
        id: "special-defense",
        size: 120,
        cell: ({ row }: { row: Row<PokemonListItem> }) => {
          const details = getDetailsData(row.original.name);
          if (isLoadingDetails(row.original.name) || !details)
            return <LoaderCell />;
          const stat = details.stats.find(
            (x: PokemonStat) => x.stat.name === "special-defense"
          );
          return stat ? (
            <div className="flex justify-center">
              <StatBar value={stat.base_stat} statName="special-defense" />
            </div>
          ) : (
            <div className="flex justify-center">
              <span className="text-gray-400">-</span>
            </div>
          );
        },
        sortingFn: (a, b) => {
          const detailsA = getDetailsData(a.original.name);
          const detailsB = getDetailsData(b.original.name);
          
          if (!detailsA || !detailsB) return 0;
          
          const statA = detailsA.stats.find((x: PokemonStat) => x.stat.name === "special-defense");
          const statB = detailsB.stats.find((x: PokemonStat) => x.stat.name === "special-defense");
          
          const valueA = statA?.base_stat || 0;
          const valueB = statB?.base_stat || 0;
          
          return valueA - valueB;
        },
      },
      {
        header: ({ column }) => (
          <TableHeader 
            icon={Zap} 
            label="Velocidad" 
            canSort={true}
            isSorted={column.getIsSorted() as false | "asc" | "desc"}
            onSort={() => column.toggleSorting()}
          />
        ),
        accessorKey: "name",
        id: "speed",
        size: 100,
        cell: ({ row }: { row: Row<PokemonListItem> }) => {
          const details = getDetailsData(row.original.name);
          if (isLoadingDetails(row.original.name) || !details)
            return <LoaderCell />;
          const stat = details.stats.find(
            (x: PokemonStat) => x.stat.name === "speed"
          );
          return stat ? (
            <div className="flex justify-center">
              <StatBar value={stat.base_stat} statName="speed" />
            </div>
          ) : (
            <div className="flex justify-center">
              <span className="text-gray-400">-</span>
            </div>
          );
        },
        sortingFn: (a, b) => {
          const detailsA = getDetailsData(a.original.name);
          const detailsB = getDetailsData(b.original.name);
          
          if (!detailsA || !detailsB) return 0;
          
          const statA = detailsA.stats.find((x: PokemonStat) => x.stat.name === "speed");
          const statB = detailsB.stats.find((x: PokemonStat) => x.stat.name === "speed");
          
          const valueA = statA?.base_stat || 0;
          const valueB = statB?.base_stat || 0;
          
          return valueA - valueB;
        },
      },
      {
        header: "Ver Detalles",
        id: "details",
        size: 100,
        cell: ({ row }: { row: Row<PokemonListItem> }) => (
          <div className="flex justify-center">
            <ViewButton onClick={() => getDetails(row.original.name)} />
          </div>
        ),
        enableSorting: false,
      },
    ],
    [getDetailsData, isLoadingDetails, getDetails]
  );

  // Tabla y paginación
  const table = useReactTable<PokemonListItem>({
    data: currentPageData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      pagination: {
        pageIndex: currentPage - 1,
        pageSize,
      },
    },
    onPaginationChange: (updater) => {
      if (typeof updater === "function") {
        const newState = updater({ pageIndex: currentPage - 1, pageSize });
        setCurrentPage(newState.pageIndex + 1);
        setPageSize(newState.pageSize);
      }
    },
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 20,
      },
    },
    enableSorting: true,
    enableMultiSort: false,
  });

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
        canPreviousPage={currentPage > 1}
        canNextPage={currentPage < totalPages}
        onPreviousPage={handlePreviousPage}
        onNextPage={handleNextPage}
        onGoToPage={handleGoToPage}
        onPageSizeChange={handlePageSizeChange}
        totalItems={totalItems}
      />
    </div>
  );
};

export default PokemonTable;
