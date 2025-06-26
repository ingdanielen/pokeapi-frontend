"use client"
import type React from "react"

interface WaveAnimationProps {
  height?: number
  waveColor?: string
}

const WaveAnimation: React.FC<WaveAnimationProps> = ({
  height = 120,
  waveColor = "#ffffff"
}) => {
  return (
    <div 
      className="absolute bottom-0 left-0 w-full  overflow-hidden pointer-events-none"
      style={{ height: `${height}px` }}
    >
      {/* Múltiples capas de olas para crear profundidad */}
      <div className="wave-container">
        {/* Ola principal (más lenta) */}
        <svg
          className="wave wave-1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,60 C300,120 900,0 1200,60 L1200,120 L0,120 Z"
            fill={waveColor}
            fillOpacity="0.9"
          />
        </svg>

        {/* Ola secundaria (velocidad media) */}
        <svg
          className="wave wave-2"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,80 C400,20 800,100 1200,40 L1200,120 L0,120 Z"
            fill={waveColor}
            fillOpacity="0.7"
          />
        </svg>

        {/* Ola rápida (detalle superior) */}
        <svg
          className="wave wave-3"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,40 C200,80 600,20 900,60 C1000,80 1100,20 1200,40 L1200,120 L0,120 Z"
            fill={waveColor}
            fillOpacity="0.8"
          />
        </svg>

        {/* Ola de fondo (muy lenta, más amplia) */}
        <svg
          className="wave wave-4"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,100 C600,20 600,100 1200,20 L1200,120 L0,120 Z"
            fill={waveColor}
            fillOpacity="0.6"
          />
        </svg>
      </div>

      {/* Gradiente para suavizar la transición */}
      <div 
        className="absolute top-0 left-0 w-full h-8 "
      />

      <style jsx>{`
        .wave-container {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }

        .wave {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 100%;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
          animation-direction: alternate;
        }

        .wave-1 {
          animation: waveFloat1 8s ease-in-out infinite;
          transform-origin: center bottom;
        }

        .wave-2 {
          animation: waveFloat2 6s ease-in-out infinite;
          animation-delay: -2s;
          transform-origin: center bottom;
        }

        .wave-3 {
          animation: waveFloat3 4s ease-in-out infinite;
          animation-delay: -1s;
          transform-origin: center bottom;
        }

        .wave-4 {
          animation: waveFloat4 12s ease-in-out infinite;
          animation-delay: -4s;
          transform-origin: center bottom;
        }

        @keyframes waveFloat1 {
          0%, 100% {
            transform: translateX(0px) scaleY(1);
          }
          50% {
            transform: translateX(-20px) scaleY(1.1);
          }
        }

        @keyframes waveFloat2 {
          0%, 100% {
            transform: translateX(0px) scaleY(0.9);
          }
          50% {
            transform: translateX(15px) scaleY(1.2);
          }
        }

        @keyframes waveFloat3 {
          0%, 100% {
            transform: translateX(0px) scaleY(1.1);
          }
          50% {
            transform: translateX(-10px) scaleY(0.8);
          }
        }

        @keyframes waveFloat4 {
          0%, 100% {
            transform: translateX(0px) scaleY(0.8);
          }
          50% {
            transform: translateX(25px) scaleY(1.3);
          }
        }

        /* Efecto de respiración en las olas */
        .wave-container:hover .wave {
          animation-duration: 3s;
        }
      `}</style>
    </div>
  )
}

export default WaveAnimation 