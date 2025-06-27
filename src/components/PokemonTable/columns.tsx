/**
 * @fileoverview Definiciones de columnas para PokemonTable
 * Este archivo contiene todas las definiciones de columnas utilizadas en la tabla de Pokémon,
 * organizadas de manera modular para facilitar el mantenimiento.
 */

import {
  ColumnDef,
  Row,
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
  Zap,
  LucideIcon
} from "lucide-react";
import React from "react";
import {
  PokemonDetails,
  PokemonListItem,
  PokemonStat,
  PokemonType,
} from "../../types/pokemon";
import { getTypeColor } from "../../utils/pokemonColors";
import {
  LoaderCell,
  PokemonImage,
  StatBar,
  TableHeader,
  ViewButton,
} from "../ui";

/**
 * Props para las funciones de datos de las columnas
 */
interface ColumnHelpers {
  getDetailsData: (nameOrUrl: string) => PokemonDetails | null;
  isLoadingDetails: (nameOrUrl: string) => boolean;
  getDetails: (nameOrUrl: string) => void;
}

/**
 * Columna de imagen del Pokémon
 */
const createImageColumn = ({ getDetailsData, isLoadingDetails }: ColumnHelpers): ColumnDef<PokemonListItem> => ({
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
});

/**
 * Columna de nombre del Pokémon
 */
const createNameColumn = (): ColumnDef<PokemonListItem> => ({
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
      <span className="capitalize text-gray-900 font-medium text-base">
        {getValue() as string}
      </span>
    </div>
  ),
  sortingFn: "alphanumeric",
});

/**
 * Columna de tipos del Pokémon
 */
const createTypesColumn = ({ getDetailsData, isLoadingDetails }: ColumnHelpers): ColumnDef<PokemonListItem> => ({
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
              className="px-2 py-1 rounded text-sm capitalize text-white font-medium"
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
});

/**
 * Columna de peso del Pokémon
 */
const createWeightColumn = ({ getDetailsData, isLoadingDetails }: ColumnHelpers): ColumnDef<PokemonListItem> => ({
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
        <span className="text-base text-gray-700 font-medium">
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
});

/**
 * Columna de altura del Pokémon
 */
const createHeightColumn = ({ getDetailsData, isLoadingDetails }: ColumnHelpers): ColumnDef<PokemonListItem> => ({
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
        <span className="text-base text-gray-700 font-medium">
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
});

/**
 * Columna de HP base del Pokémon
 */
const createHpColumn = ({ getDetailsData, isLoadingDetails }: ColumnHelpers): ColumnDef<PokemonListItem> => ({
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
});

/**
 * Columna de experiencia base del Pokémon
 */
const createBaseExperienceColumn = ({ getDetailsData, isLoadingDetails }: ColumnHelpers): ColumnDef<PokemonListItem> => ({
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
        <span className="text-base text-gray-700 font-medium">
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
});

/**
 * Función helper para crear columnas de estadísticas
 */
const createStatColumn = (
  statName: string,
  icon: LucideIcon,
  label: string,
  helpers: ColumnHelpers
): ColumnDef<PokemonListItem> => ({
  header: ({ column }) => (
    <TableHeader 
      icon={icon} 
      label={label} 
      canSort={true}
      isSorted={column.getIsSorted() as false | "asc" | "desc"}
      onSort={() => column.toggleSorting()}
    />
  ),
  accessorKey: "name",
  id: statName,
  size: 120,
  cell: ({ row }: { row: Row<PokemonListItem> }) => {
    const details = helpers.getDetailsData(row.original.name);
    if (helpers.isLoadingDetails(row.original.name) || !details)
      return <LoaderCell />;
    const stat = details.stats.find(
      (x: PokemonStat) => x.stat.name === statName
    );
    return stat ? (
      <div className="flex justify-center">
        <StatBar value={stat.base_stat} statName={statName} />
      </div>
    ) : (
      <div className="flex justify-center">
        <span className="text-gray-400">-</span>
      </div>
    );
  },
  sortingFn: (a, b) => {
    const detailsA = helpers.getDetailsData(a.original.name);
    const detailsB = helpers.getDetailsData(b.original.name);
    
    if (!detailsA || !detailsB) return 0;
    
    const statA = detailsA.stats.find((x: PokemonStat) => x.stat.name === statName);
    const statB = detailsB.stats.find((x: PokemonStat) => x.stat.name === statName);
    
    const valueA = statA?.base_stat || 0;
    const valueB = statB?.base_stat || 0;
    
    return valueA - valueB;
  },
});

/**
 * Columna de botón de detalles
 */
const createDetailsColumn = ({ getDetails }: ColumnHelpers): ColumnDef<PokemonListItem> => ({
  header: "Ver Detalles",
  id: "details",
  size: 100,
  cell: ({ row }: { row: Row<PokemonListItem> }) => (
    <div className="flex justify-center">
      <ViewButton onClick={() => getDetails(row.original.name)} />
    </div>
  ),
  enableSorting: false,
});

/**
 * Función principal para crear todas las columnas
 */
export const createPokemonTableColumns = (helpers: ColumnHelpers): ColumnDef<PokemonListItem>[] => [
  createImageColumn(helpers),
  createNameColumn(),
  createTypesColumn(helpers),
  createWeightColumn(helpers),
  createHeightColumn(helpers),
  createHpColumn(helpers),
  createBaseExperienceColumn(helpers),
  createStatColumn("attack", Sword, "Ataque Base", helpers),
  createStatColumn("defense", Shield, "Defensa Base", helpers),
  createStatColumn("special-attack", Flame, "Ataque Esp.", helpers),
  createStatColumn("special-defense", Sparkles, "Defensa Esp.", helpers),
  createStatColumn("speed", Zap, "Velocidad", helpers),
  createDetailsColumn(helpers),
]; 