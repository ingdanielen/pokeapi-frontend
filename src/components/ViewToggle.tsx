import React, { useEffect, useState } from "react";

interface ViewToggleProps {
  value: "grid" | "table";
  onChange: (v: "grid" | "table") => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({ value, onChange }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return null;

  return (
    <div className="flex gap-2 items-center bg-gray-100 rounded-full px-2 py-1 shadow-sm">
      <button
        className={`px-4 py-1 rounded-full font-semibold transition-colors text-sm ${value === "grid" ? "bg-gray-800 text-white" : "bg-transparent text-gray-800 hover:bg-gray-200"}`}
        onClick={() => onChange("grid")}
      >
        Grid
      </button>
      <button
        className={`px-4 py-1 rounded-full font-semibold transition-colors text-sm ${value === "table" ? "bg-gray-800 text-white" : "bg-transparent text-gray-800 hover:bg-gray-200"}`}
        onClick={() => onChange("table")}
      >
        Tabla
      </button>
    </div>
  );
};

export function usePersistedView(): ["grid" | "table", (v: "grid" | "table") => void] {
  const [view, setView] = useState<"grid" | "table">("grid");
  useEffect(() => {
    const stored = localStorage.getItem("poke_view") as "grid" | "table" | null;
    if (stored && (stored === "grid" || stored === "table")) {
      setView(stored);
    } else {
      // If no valid value is stored, default to grid
      setView("grid");
      localStorage.setItem("poke_view", "grid");
    }
  }, []);
  useEffect(() => {
    localStorage.setItem("poke_view", view);
  }, [view]);
  return [view, setView];
}

export default ViewToggle; 