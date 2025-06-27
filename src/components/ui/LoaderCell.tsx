import React from "react";

interface LoaderCellProps {
  className?: string;
}

export const LoaderCell: React.FC<LoaderCellProps> = ({ className = "" }) => {
  return (
    <div className={`flex justify-center items-center h-8 ${className}`}>
      <div className="w-4 h-4 border-2 border-gray-200 border-t-gray-600 rounded-full animate-spin" />
    </div>
  );
}; 