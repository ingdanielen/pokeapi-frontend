import React from "react";
import { LucideIcon, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

interface TableHeaderProps {
  icon?: LucideIcon;
  label: string;
  className?: string;
  canSort?: boolean;
  isSorted?: false | "asc" | "desc";
  onSort?: () => void;
}

export const TableHeader: React.FC<TableHeaderProps> = ({ 
  icon: Icon, 
  label, 
  className = "",
  canSort = false,
  isSorted = false,
  onSort
}) => {
  const getSortIcon = () => {
    if (!canSort) return null;
    if (isSorted === "asc") return <ArrowUp className="w-3 h-3" />;
    if (isSorted === "desc") return <ArrowDown className="w-3 h-3" />;
    return <ArrowUpDown className="w-3 h-3" />;
  };

  const handleClick = () => {
    if (canSort && onSort) {
      onSort();
    }
  };

  return (
    <div 
      className={`flex items-center justify-center gap-1 ${className} ${
        canSort ? "cursor-pointer hover:bg-gray-100 rounded px-1 py-0.5 transition-colors" : ""
      }`}
      onClick={handleClick}
    >
      {Icon && <Icon className="w-3 h-3" />}
      <span className="text-xs font-medium">{label}</span>
      {getSortIcon()}
    </div>
  );
}; 