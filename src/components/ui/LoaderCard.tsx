import React from "react";

interface LoaderCardProps {
  className?: string;
}

const LoaderCard: React.FC<LoaderCardProps> = ({ 
  className = "flex items-center justify-center h-40 w-full" 
}) => (
  <div className={className}>
    <span className="inline-block w-8 h-8 border-2 border-gray-300 border-t-gray-500 rounded-full animate-spin" />
  </div>
);

export default LoaderCard; 