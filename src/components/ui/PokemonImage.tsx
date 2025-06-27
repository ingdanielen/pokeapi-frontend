import React from "react";
import Image from "next/image";
import { Hash } from "lucide-react";

interface PokemonImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  showHashIcon?: boolean;
}

export const PokemonImage: React.FC<PokemonImageProps> = ({
  src,
  alt,
  width = 48,
  height = 48,
  className = "",
  showHashIcon = true,
}) => {
  return (
    <div className="flex justify-center items-center">
      <div className="relative group">
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={`w-10 h-10 object-contain transition-transform duration-200 group-hover:scale-110 ${className}`}
          loading="lazy"
        />
        {showHashIcon && (
          <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm border border-gray-200">
            <Hash className="w-2 h-2 text-gray-500" />
          </div>
        )}
      </div>
    </div>
  );
}; 