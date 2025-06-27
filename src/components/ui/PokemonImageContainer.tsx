import Image from "next/image";
import React from "react";
import { PokemonDetails } from "../../types/pokemon";
import PokeballSVG from "./PokeballSVG";

interface PokemonImageContainerProps {
  details: PokemonDetails;
}

const PokemonImageContainer: React.FC<PokemonImageContainerProps> = ({ details }) => {
  return (
    <div className="relative md:w-64 w-full h-48 md:h-auto flex items-center justify-center order-1 md:order-2">
      {/* Contenedor para la pokebola con overflow hidden */}
      <div className="relative w-full h-full overflow-hidden">
        <PokeballSVG size={220} className="opacity-10" />
      </div>

      {/* Imagen del pokemon que puede sobresalir */}
      <div
        className="w-56 h-56 md:w-72 md:h-72 lg:w-96 lg:h-96"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 40,
          pointerEvents: "none",
          filter: "drop-shadow(0 12px 48px rgba(0,0,0,0.25))",
        }}
      >
        <Image
          src={
            details?.sprites?.other?.["official-artwork"]
              ?.front_default ?? ""
          }
          alt={details.name}
          width={2000}
          height={2000}
          className="object-contain select-none"
          style={{ width: "100%", height: "100%" }}
          priority
        />
      </div>
    </div>
  );
};

export default PokemonImageContainer; 