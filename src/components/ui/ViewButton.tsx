import React from "react";
import { Eye } from "lucide-react";

interface ViewButtonProps {
  onClick: () => void;
  className?: string;
  children?: React.ReactNode;
}

export const ViewButton: React.FC<ViewButtonProps> = ({
  onClick,
  className = "",
  children = "Ver",
}) => {
  return (
    <button
      className={`flex items-center justify-center gap-1 px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors duration-200 text-xs font-medium ${className}`}
      onClick={onClick}
    >
      <Eye className="w-3 h-3" />
      {children}
    </button>
  );
}; 