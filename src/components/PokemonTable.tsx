import React, { useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnDef,
  Row,
} from "@tanstack/react-table";
import { PokemonListItem } from "../types/pokemon";
import { getTypeColor } from "../utils/pokemonColors";
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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";

interface PokemonTableProps {
  pokemons: PokemonListItem[];
  getDetails: (nameOrUrl: string) => void;
  getDetailsData: (nameOrUrl: string) => any;
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

const StatBar = ({ value, max = 255 }: { value: number; max?: number }) => {
  const percentage = (value / max) * 100;
  const getColor = (val: number) => {
    if (val >= 80) return "bg-emerald-500";
    if (val >= 60) return "bg-blue-500";
    if (val >= 40) return "bg-yellow-500";
    return "bg-gray-400";
  };

  return (
    <div className="flex items-center gap-2">
      <div className="w-12 bg-gray-100 rounded-full h-1.5">
        <div
          className={`h-1.5 rounded-full transition-all duration-300 ${getColor(
            value
          )}`}
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
          const getPokemonImageUrl = (details: any) => {
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
              {details.types.map((t: any) => (
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
            const stat = details.stats.find((x: any) => x.stat.name === s.key);
            return stat ? (
              <StatBar value={stat.base_stat} />
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
    state: {},
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

      {/* Paginación minimalista */}
      <div className="flex justify-between items-center mt-6 bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 rounded-md transition-colors duration-200 font-medium"
        >
          <ChevronLeft className="w-4 h-4" />
          Anterior
        </button>
        <span className="text-sm text-gray-600 font-medium">
          Página {table.getState().pagination?.pageIndex + 1} de {table.getPageCount()}
        </span>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 rounded-md transition-colors duration-200 font-medium"
        >
          Siguiente
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default PokemonTable;
