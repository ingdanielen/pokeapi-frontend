import React from "react";

interface CloseButtonProps {
  onClose: () => void;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const CloseButton: React.FC<CloseButtonProps> = ({ 
  onClose, 
  className = "", 
  size = "md" 
}) => {
  const sizeClasses = {
    sm: "text-xl",
    md: "text-3xl",
    lg: "text-4xl"
  };

  return (
    <button
      onClick={onClose}
      className={`absolute top-3 right-3 font-bold text-gray-400 hover:text-red-500 z-20 transition-colors duration-200 ${sizeClasses[size]} ${className}`}
      aria-label="Cerrar"
    >
      ×
    </button>
  );
};

export default CloseButton; 