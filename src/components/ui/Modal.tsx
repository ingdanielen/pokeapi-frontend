/**
 * @fileoverview Componente Modal reutilizable con animaciones suaves
 * Este componente proporciona un modal con animaciones de entrada y salida,
 * manejo de clics fuera del modal, y prevención de scroll del body.
 */

import React, { useEffect, useRef, useState } from "react";

/**
 * Props del componente Modal
 */
interface ModalProps {
  /** Estado de apertura del modal */
  open: boolean;
  /** Función para cerrar el modal */
  onClose: () => void;
  /** Contenido del modal */
  children: React.ReactNode;
  /** Clases CSS adicionales para el contenido */
  className?: string;
  /** Estilos CSS adicionales para el contenido */
  style?: React.CSSProperties;
}

/**
 * Componente Modal con animaciones y funcionalidades avanzadas
 * 
 * Este modal incluye:
 * - Animaciones suaves de entrada y salida
 * - Cierre al hacer clic fuera del contenido
 * - Prevención de scroll del body cuando está abierto
 * - Manejo de estados de animación
 * - Diseño responsivo
 * - Z-index optimizado
 * 
 * El componente utiliza estados de animación para controlar las transiciones:
 * - "entering": Animación de entrada
 * - "visible": Modal completamente visible
 * - "exiting": Animación de salida
 * - "hidden": Modal oculto
 * 
 * @param props - Propiedades del componente
 * @param props.open - Estado de apertura
 * @param props.onClose - Función de cierre
 * @param props.children - Contenido del modal
 * @param props.className - Clases CSS adicionales
 * @param props.style - Estilos CSS adicionales
 * 
 * @returns JSX.Element - Modal con animaciones
 * 
 * @example
 * ```typescript
 * <Modal
 *   open={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   className="bg-white p-6"
 * >
 *   <h2>Contenido del Modal</h2>
 *   <p>Este es el contenido del modal.</p>
 * </Modal>
 * ```
 */
const Modal: React.FC<ModalProps> = ({ open, onClose, children, className = "", style = {} }) => {
  /** Referencia al contenedor del modal */
  const modalRef = useRef<HTMLDivElement>(null);
  /** Estado para controlar el cierre animado */
  const [isClosing, setIsClosing] = useState(false);
  /** Estado actual de la animación */
  const [animationState, setAnimationState] = useState<"entering" | "visible" | "exiting" | "hidden">("hidden");

  /**
   * Efecto para manejar la apertura y cierre del modal
   * Controla el scroll del body y las animaciones
   */
  useEffect(() => {
    if (open) {
      // Prevenir scroll del body cuando el modal está abierto
      document.body.style.overflow = "hidden";
      setIsClosing(false);
      setAnimationState("entering");
      
      // Iniciar animación de entrada después de un pequeño delay
      const timer = setTimeout(() => {
        setAnimationState("visible");
      }, 10);
      
      return () => clearTimeout(timer);
    } else {
      // Restaurar scroll del body
      document.body.style.overflow = "unset";
      setAnimationState("hidden");
    }
    
    // Cleanup: restaurar scroll al desmontar
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  /**
   * Maneja el clic fuera del modal para cerrarlo
   * 
   * @param e - Evento de clic
   */
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      handleClose();
    }
  };

  /**
   * Maneja el cierre del modal con animación suave
   */
  const handleClose = () => {
    setIsClosing(true);
    setAnimationState("exiting");
    
    // Esperar a que termine la animación antes de cerrar
    setTimeout(() => {
      onClose();
      setIsClosing(false);
      setAnimationState("hidden");
    }, 250);
  };

  // No renderizar si no está abierto y no está cerrando
  if (!open && !isClosing) return null;

  // Determinar clases CSS basadas en el estado de animación
  const backdropClass = animationState === "entering" ? "modal-backdrop-enter" : 
                       animationState === "visible" ? "" : 
                       animationState === "exiting" ? "modal-backdrop-exit" : "";
  
  const contentClass = animationState === "entering" ? "modal-content-enter" : 
                      animationState === "visible" ? "" : 
                      animationState === "exiting" ? "modal-content-exit" : "";

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center modal-optimized ${backdropClass}`}
      onClick={handleBackdropClick}
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        opacity: animationState === "hidden" ? 0 : 1,
        transition: "opacity 0.3s ease",
      }}
    >
      <div
        ref={modalRef}
        className={`relative rounded-3xl shadow-2xl w-full mx-3 lg:mx-24 modal-optimized ${contentClass} ${className}`}
        style={{
          zIndex: 10,
          maxHeight: "95vh",
          overflow: "visible",
          ...style,
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default Modal; 