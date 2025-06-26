import React, { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnDef,
  Row,
} from "@tanstack/react-table";
import { PokemonListItem, PokemonDetails, PokemonType, PokemonStat } from "../types/pokemon";
import { getTypeColor } from "../utils/pokemonColors";
import { getStatBarColor, getStatBarPercentage } from "../utils/statColors";
import {
  Image as ImageIcon,
  Hash,
  Palette,
  Weight,
  Ruler,
  Star,
  Heart,
  Sword,
  Shield,
  Zap,
  Flame,
  Sparkles,
  Eye,
} from "lucide-react";
import Image from "next/image";
import Pagination from "./Pagination";

interface PokemonTableProps {
  pokemons: PokemonListItem[];
  getDetails: (nameOrUrl: string) => void;
  getDetailsData: (nameOrUrl: string) => PokemonDetails | null;
  isLoadingDetails: (nameOrUrl: string) => boolean;
}

const statNames = [
  { key: "hp", label: "HP", icon: Heart, color: "text-red-500" },
  { key: "attack", label: "Ataque", icon: Sword, color: "text-orange-500" },
  { key: "defense", label: "Defensa", icon: Shield, color: "text-blue-500" },
  {
    key: "special-attack",
    label: "Ataque Esp.",
    icon: Flame,
    color: "text-red-600",
  },
  {
    key: "special-defense",
    label: "Defensa Esp.",
    icon: Sparkles,
    color: "text-purple-500",
  },
  { key: "speed", label: "Velocidad", icon: Zap, color: "text-yellow-500" },
];

const LoaderCell = () => (
  <div className="flex justify-center items-center h-12">
    <div className="w-6 h-6 border-2 border-gray-200 border-t-gray-600 rounded-full animate-spin" />
  </div>
);

const StatBar = ({ value, statName, max = 255 }: { value: number; statName: string; max?: number }) => {
  const percentage = getStatBarPercentage(value, max);

  return (
    <div className="flex items-center gap-2">
      <div className="w-12 bg-gray-100 rounded-full h-1.5">
        <div
          className={`h-1.5 rounded-full transition-all duration-300 ${getStatBarColor(statName, value)}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <span className="text-xs font-medium text-gray-600 min-w-[1.5rem]">
        {value}
      </span>
    </div>
  );
};

const PokemonTable: React.FC<PokemonTableProps> = ({
  pokemons,
  getDetails,
  getDetailsData,
  isLoadingDetails,
}) => {
  // Estado para la paginación
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  
  // Columnas con renderizado condicional (loader o dato)
  const columns = useMemo<ColumnDef<PokemonListItem>[]>(
    () => [
      {
        header: () => (
          <div className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4" />
            <span>Imagen</span>
          </div>
        ),
        accessorKey: "name",
        id: "image",
        cell: ({ row }: { row: Row<PokemonListItem> }) => {
          const details = getDetailsData(row.original.name);
          if (isLoadingDetails(row.original.name) || !details) return <LoaderCell />;
          
          // Get the best quality image URL
          const getPokemonImageUrl = (details: PokemonDetails) => {
            if (details.sprites.other?.['official-artwork']?.front_default) {
              return details.sprites.other['official-artwork'].front_default;
            }
            // Fallback to direct URL
            return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${details.id}.png`;
          };
          
          return (
            <div className="flex justify-center">
              <div className="relative group">
                <Image
                  src={getPokemonImageUrl(details)}
                  alt={row.original.name}
                  width={100}
                  height={100}
                  className="w-12 h-12 object-contain transition-transform duration-200 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm border border-gray-200">
                  <Hash className="w-3 h-3 text-gray-500" />
                </div>
              </div>
            </div>
          );
        },
        enableSorting: false,
      },
      {
        header: "Nombre",
        accessorKey: "name",
        id: "name",
        cell: ({ getValue }) => (
          <span className="capitalize text-gray-900 font-medium">
            {getValue() as string}
          </span>
        ),
      },
      {
        header: () => (
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            <span>Tipos</span>
          </div>
        ),
        accessorKey: "name",
        id: "types",
        cell: ({ row }: { row: Row<PokemonListItem> }) => {
          const details = getDetailsData(row.original.name);
          if (isLoadingDetails(row.original.name) || !details) return <LoaderCell />;
          return (
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
          );
        },
        sortingFn: (a, b) => {
          const tA = getDetailsData(a.original.name)?.types[0]?.type.name || "";
          const tB = getDetailsData(b.original.name)?.types[0]?.type.name || "";
          return tA.localeCompare(tB);
        },
      },
      {
        header: () => (
          <div className="flex items-center gap-2">
            <Weight className="w-4 h-4" />
            <span>Peso</span>
          </div>
        ),
        accessorKey: "name",
        id: "weight",
        cell: ({ row }: { row: Row<PokemonListItem> }) => {
          const details = getDetailsData(row.original.name);
          if (isLoadingDetails(row.original.name) || !details) return <LoaderCell />;
          return (
            <span className="text-sm text-gray-700 font-medium">
              {(details.weight / 10).toFixed(1)} kg
            </span>
          );
        },
      },
      {
        header: () => (
          <div className="flex items-center gap-2">
            <Ruler className="w-4 h-4" />
            <span>Altura</span>
          </div>
        ),
        accessorKey: "name",
        id: "height",
        cell: ({ row }: { row: Row<PokemonListItem> }) => {
          const details = getDetailsData(row.original.name);
          if (isLoadingDetails(row.original.name) || !details) return <LoaderCell />;
          return (
            <span className="text-sm text-gray-700 font-medium">
              {(details.height / 10).toFixed(1)} m
            </span>
          );
        },
      },
      {
        header: () => (
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4" />
            <span>Exp. Base</span>
          </div>
        ),
        accessorKey: "name",
        id: "base_experience",
        cell: ({ row }: { row: Row<PokemonListItem> }) => {
          const details = getDetailsData(row.original.name);
          if (isLoadingDetails(row.original.name) || !details) return <LoaderCell />;
          return (
            <span className="text-sm text-gray-700 font-medium">
              {details.base_experience}
            </span>
          );
        },
      },
      ...statNames.map((s) => {
        const IconComponent = s.icon;
        return {
          header: () => (
            <div className="flex items-center gap-2">
              <IconComponent className={`w-4 h-4 ${s.color}`} />
              <span>{s.label}</span>
            </div>
          ),
          accessorKey: "name",
          id: s.key,
          cell: ({ row }: { row: Row<PokemonListItem> }) => {
            const details = getDetailsData(row.original.name);
            if (isLoadingDetails(row.original.name) || !details) return <LoaderCell />;
            const stat = details.stats.find((x: PokemonStat) => x.stat.name === s.key);
            return stat ? (
              <StatBar value={stat.base_stat} statName={s.key} />
            ) : (
              <span className="text-gray-400">-</span>
            );
          },
        };
      }),
      {
        header: "Acciones",
        id: "details",
        cell: ({ row }: { row: Row<PokemonListItem> }) => (
          <button
            className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors duration-200 text-sm font-medium"
            onClick={() => getDetails(row.original.name)}
          >
            <Eye className="w-4 h-4" />
            Ver
          </button>
        ),
        enableSorting: false,
      },
    ],
    [getDetailsData, isLoadingDetails, getDetails]
  );

  // Tabla y paginación
  const table = useReactTable<PokemonListItem>({
    data: pokemons,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    onPaginationChange: (updater) => {
      if (typeof updater === 'function') {
        const newState = updater({ pageIndex, pageSize });
        setPageIndex(newState.pageIndex);
        setPageSize(newState.pageSize);
      }
    },
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 20,
      },
    },
  });

  return (
    <div className="w-full">
      {/* Tabla minimalista */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id} className="px-4 py-3 text-left font-medium text-gray-700 text-sm whitespace-nowrap">
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-gray-100">
              {table.getRowModel().rows.map((row) => (
                <tr 
                  key={row.id} 
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="px-4 py-3 whitespace-nowrap">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Paginación componetizada */}
      <Pagination
        currentPage={table.getState().pagination.pageIndex + 1}
        totalPages={table.getPageCount()}
        pageSize={pageSize}
        canPreviousPage={table.getCanPreviousPage()}
        canNextPage={table.getCanNextPage()}
        onPreviousPage={() => table.previousPage()}
        onNextPage={() => table.nextPage()}
        onGoToPage={(page) => {
          const pageIndex = page - 1; // Convert to 0-based index
          setPageIndex(pageIndex);
          table.setPageIndex(pageIndex);
        }}
        onPageSizeChange={(newPageSize) => {
          setPageIndex(0); // Reset to first page when changing page size
          setPageSize(newPageSize);
          table.setPageSize(newPageSize);
          table.setPageIndex(0);
        }}
        totalItems={pokemons.length}
      />
    </div>
  );
};

export default PokemonTable;
