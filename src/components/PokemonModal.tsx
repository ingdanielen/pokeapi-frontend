import { Activity, BarChart2, Info, Zap } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import {
  MoveDetails,
  PokemonSpecies,
  usePokemonDetails,
} from "../hooks/usePokemonDetails";
import { PokemonDetails } from "../types/pokemon";
import { getMainTypeColor, getTypeColor } from "../utils/pokemonColors";

interface PokemonModalProps {
  open: boolean;
  onClose: () => void;
  details: PokemonDetails | null;
  loading: boolean;
  error: string | null;
}

const statColor = (value: number) => {
  if (value >= 100) return "bg-green-400";
  if (value <= 50) return "bg-red-400";
  return "bg-yellow-300";
};

const PokeballSVG = ({ size = 340, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 131 133"
    fill="none"
    className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none opacity-20 ${className}`}
  >
    <g>
      <path
        d="M81.2548 66.5C81.2548 75.2445 74.2011 82.3333 65.5 82.3333C56.7989 82.3333 49.7452 75.2445 49.7452 66.5C49.7452 57.7555 56.7989 50.6667 65.5 50.6667C74.2011 50.6667 81.2548 57.7555 81.2548 66.5Z"
        fill="white"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M65.5 133C98.8353 133 126.413 108.227 131 76H92.245C88.3519 87.0693 77.8475 95 65.5 95C53.1525 95 42.6481 87.0693 38.755 76H0C4.58681 108.227 32.1647 133 65.5 133ZM38.755 57H0C4.58681 24.7732 32.1647 0 65.5 0C98.8353 0 126.413 24.7732 131 57H92.245C88.3519 45.9307 77.8475 38 65.5 38C53.1525 38 42.6481 45.9307 38.755 57ZM81.2548 66.5C81.2548 75.2445 74.2011 82.3333 65.5 82.3333C56.7989 82.3333 49.7452 75.2445 49.7452 66.5C49.7452 57.7555 56.7989 50.6667 65.5 50.6667C74.2011 50.6667 81.2548 57.7555 81.2548 66.5Z"
        fill="white"
      />
    </g>
  </svg>
);

const aspectTabs = [
  { key: 'info', label: 'Info', icon: Info },
  { key: 'stats', label: 'Stats', icon: BarChart2 },
  { key: 'abilities', label: 'Habilidades', icon: Zap },
  { key: 'moves', label: 'Movimientos', icon: Activity },
];

const PokemonModal: React.FC<PokemonModalProps> = ({
  open,
  onClose,
  details,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [activeTab, setActiveTab] = useState<
    'info' | 'stats' | 'moves' | 'abilities'
  >('info');
  const [selectedMove, setSelectedMove] = useState<string | null>(null);
  const [moveDetails, setMoveDetails] = useState<MoveDetails | null>(null);
  const { fetchDetails, speciesData, fetchMoveDetails } = usePokemonDetails();
  const router = useRouter();

  // Cargar detalles del movimiento seleccionado solo si está en el tab de movimientos
  useEffect(() => {
    if (activeTab === 'moves' && selectedMove) {
      fetchMoveDetails(selectedMove).then(setMoveDetails);
    } else {
      setMoveDetails(null);
    }
  }, [selectedMove, fetchMoveDetails, activeTab]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      setIsClosing(false);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [open]);

  // Handle click outside to close modal
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      handleClose();
    }
  };

  // Handle close with smooth animation
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 150);
  };

  if (!open && !isClosing) return null;

  // Get the best quality image URL
  const getPokemonImageUrl = (details: PokemonDetails) => {
    if (details.sprites.other?.['official-artwork']?.front_default) {
      return details.sprites.other['official-artwork'].front_default;
    }
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${details.id}.png`;
  };

  // Obtener descripción en español
  const getSpanishDescription = (species: PokemonSpecies) => {
    const spanishEntry = species.flavor_text_entries.find(
      entry => entry.language.name === 'es'
    );
    return spanishEntry?.flavor_text || 'Descripción no disponible en español';
  };

  // Obtener género en español
  const getSpanishGenus = (species: PokemonSpecies) => {
    const spanishGenus = species.genera.find(
      genus => genus.language.name === 'es'
    );
    return spanishGenus?.genus || 'Género no disponible';
  };

  // Obtener descripción del movimiento en español
  const getMoveDescription = (move: MoveDetails) => {
    const spanishEntry = move.flavor_text_entries.find(
      entry => entry.language.name === 'es'
    );
    return spanishEntry?.flavor_text || 'Descripción no disponible';
  };

  // Obtener efecto del movimiento en español
  const getMoveEffect = (move: MoveDetails) => {
    const spanishEntry = move.effect_entries.find(
      entry => entry.language.name === 'es'
    );
    return spanishEntry?.short_effect || 'Efecto no disponible';
  };

  // Navegar al perfil del Pokémon
  const goToProfile = () => {
    if (details) router.push(`/pokemon/${details.name}`);
  };

  // Colores y fondo
  const mainColor = details ? getMainTypeColor(details.types) : '#f4f4f4';

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 transition-opacity duration-150 ${isClosing ? 'opacity-0' : 'opacity-100'}`}
      onClick={handleBackdropClick}
      style={{ backdropFilter: 'blur(4px)' }}
    >
      <div
        ref={modalRef}
        className={`relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl mx-2 md:mx-0 flex flex-col md:flex-row overflow-hidden transition-all duration-200 ${isClosing ? 'scale-95 opacity-0 translate-y-2' : 'scale-100 opacity-100 translate-y-0'}`}
        style={{ zIndex: 10, minHeight: 520 }}
      >
        {/* Columna izquierda: datos */}
        <div className="flex-1 flex flex-col gap-4 z-10 px-6 py-8 md:py-10 max-h-[90vh] overflow-y-auto">
          {/* Nombre y número */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-3xl md:text-4xl font-extrabold capitalize">{details?.name}</span>
            {details && (
              <span className="text-gray-400 font-bold text-2xl md:text-3xl">#{details.id.toString().padStart(3, '0')}</span>
            )}
          </div>
          {/* Tipos */}
          <div className="flex gap-2 mb-2">
            {details?.types.map((t) => (
              <span
                key={t.type.name}
                className="px-4 py-1 rounded-full text-white text-sm font-semibold shadow"
                style={{ background: getTypeColor(t.type.name) }}
              >
                {t.type.name}
              </span>
            ))}
          </div>
          {/* Peso, altura, habilidades principales */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-base mb-2">
            <div className="flex flex-col items-center bg-gray-50 rounded-lg p-2">
              <span className="font-bold text-lg">{details ? (details.weight / 10) : '-'} kg</span>
              <span className="text-gray-500 text-xs">Peso</span>
            </div>
            <div className="flex flex-col items-center bg-gray-50 rounded-lg p-2">
              <span className="font-bold text-lg">{details ? (details.height / 10) : '-'} m</span>
              <span className="text-gray-500 text-xs">Altura</span>
            </div>
            <div className="flex flex-col items-center bg-gray-50 rounded-lg p-2">
              <span className="font-bold text-lg">
                {details?.abilities?.filter(a => !a.is_hidden).map(a => a.ability.name).join(', ') || '-'}
              </span>
              <span className="text-gray-500 text-xs">Habilidad</span>
            </div>
          </div>
          {/* Descripción */}
          {speciesData && (
            <div className="mb-2">
              <p className="text-gray-700 text-base leading-relaxed">
                {getSpanishDescription(speciesData)}
              </p>
            </div>
          )}
          {/* Stats SIEMPRE visibles */}
          {details && (
            <div className="mb-2">
              <h3 className="font-semibold mb-2 text-gray-700">Estadísticas base</h3>
              <ul className="flex flex-col gap-1">
                {details.stats.map((s) => (
                  <li key={s.stat.name} className="flex items-center gap-2">
                    <span className="capitalize w-28 md:w-32 inline-block text-xs md:text-sm">{s.stat.name}</span>
                    <div className="flex-1 h-3 rounded bg-gray-200 overflow-hidden">
                      <div className={`h-3 ${statColor(s.base_stat)}`} style={{ width: `${Math.min(s.base_stat, 150) / 1.5}%` }} />
                    </div>
                    <span className="w-8 text-right font-bold text-xs md:text-sm">{s.base_stat}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {/* Habilidades (todas) */}
          {details && (
            <div className="mb-2">
              <h3 className="font-semibold mb-2 text-gray-700">Habilidades</h3>
              <div className="flex flex-wrap gap-2">
                {details.abilities.map((ability) => (
                  <span
                    key={ability.ability.name}
                    className={`px-3 py-1 rounded-full text-xs font-semibold shadow ${ability.is_hidden ? 'bg-purple-200 text-purple-900' : 'bg-blue-200 text-blue-900'}`}
                  >
                    {ability.ability.name.replace('-', ' ')}{ability.is_hidden ? ' (Oculta)' : ''}
                  </span>
                ))}
              </div>
            </div>
          )}
          {/* Botón ver perfil */}
          <button
            onClick={goToProfile}
            className="mt-4 flex items-center gap-2 px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-full shadow transition-colors text-base w-fit"
          >
            <span className="inline-block w-6 h-6"><PokeballSVG size={28} /></span> Ver perfil
          </button>
        </div>
        {/* Columna derecha: imagen y fondo decorativo */}
        <div
          className="relative flex flex-col items-center justify-center md:w-[420px] w-full min-h-[420px] bg-gradient-to-b from-white/80 to-white"
          style={{ background: mainColor, transition: 'background 0.6s cubic-bezier(0.4, 0, 0.2, 1)', overflow: 'visible' }}
        >
          <div className="relative w-full flex flex-col items-center justify-center h-[420px]">
            <PokeballSVG  />
            {details && (
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -60%)',
                  zIndex: 20,
                  width: '320px',
                  height: '320px',
                  pointerEvents: 'none',
                  filter: 'drop-shadow(0 8px 32px rgba(0,0,0,0.18))',
                }}
              >
                <Image
                  src={getPokemonImageUrl(details)}
                  alt={details.name}
                  width={1000}
                  height={1000}
                  className="object-contain select-none"
                  style={{ width: '100%', height: '100%' }}
                  priority
                />
              </div>
            )}
          </div>
        </div>
        {/* Botón cerrar */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-3xl font-bold text-gray-400 hover:text-red-500 z-20 transition-colors duration-200"
          aria-label="Cerrar"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default PokemonModal;
