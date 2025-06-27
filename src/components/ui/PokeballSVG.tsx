import React from "react";

interface PokeballSVGProps {
  className?: string;
  size?: number;
}

export const PokeballSVG: React.FC<PokeballSVGProps> = ({ 
  className = "absolute right-1 -top-6 w-28 h-28 pointer-events-none select-none opacity-20",
  size = 180
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 131 133"
    fill="none"
    className={className}
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

export default PokeballSVG; 