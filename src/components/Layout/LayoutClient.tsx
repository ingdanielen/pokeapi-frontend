"use client";
import React from "react";
import Footer from "./Footer";
import Header from "./Header";
import { PokemonDataProvider } from "../../context/PokemonDataContext";

interface LayoutClientProps {
  children: React.ReactNode;
}

export default function LayoutClient({ children }: LayoutClientProps) {
  return (
    <PokemonDataProvider>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 mt-20">
          {children}
        </main>
        <Footer />
      </div>
    </PokemonDataProvider>
  );
} 