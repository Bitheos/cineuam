"use client";
import { useState } from "react";

interface Sala {
  id: number;
  nombre: string;
  capacidad: number;
  tipo: string;
}

export default function Asientos({ salas }: { salas: Sala[] }) {
  const [selectedSala, setSelectedSala] = useState<Sala | null>(null);
  const alfabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const COLUMNAS = 10; // Estándar visual

  return (
    <div className="bg-neutral-900 p-6 rounded-2xl border border-neutral-800 shadow-2xl">
      <h2 className="text-xl font-bold text-amber-500 mb-6 uppercase italic flex items-center gap-2">
        Mapeo de Capacidad
      </h2>

      <div className="mb-8">
        <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-2">
          Seleccionar Sala Registrada
        </label>
        <select
          onChange={(e) => {
            const sala = salas.find((s) => s.id === parseInt(e.target.value));
            setSelectedSala(sala || null);
          }}
          className="w-full bg-neutral-950 border border-neutral-800 p-3 rounded-lg text-white focus:border-amber-500 outline-none transition-all text-sm"
        >
          <option value="">-- Selecciona para visualizar --</option>
          {salas.map((sala) => (
            <option key={sala.id} value={sala.id}>
              {sala.nombre} ({sala.tipo}) - {sala.capacidad} Butacas
            </option>
          ))}
        </select>
      </div>

      {selectedSala ? (
        <div className="space-y-6 animate-in fade-in duration-500">
          {/* Pantalla Visual */}
          <div className="flex flex-col items-center mb-10">
            <div className="w-full h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-40 shadow-[0_0_15px_rgba(245,158,11,0.5)]"></div>
            <p className="text-[9px] text-neutral-600 uppercase tracking-[0.3em] mt-2 font-bold">Pantalla Proyectora</p>
          </div>

          <div 
            className="grid gap-1.5 mx-auto"
            style={{ 
              gridTemplateColumns: `repeat(${COLUMNAS}, minmax(0, 1fr))`,
              maxWidth: "380px" 
            }}
          >
            {Array.from({ length: selectedSala.capacidad }).map((_, i) => {
              const filaIdx = Math.floor(i / COLUMNAS);
              const colIdx = (i % COLUMNAS) + 1;
              const codigo = `${alfabet[filaIdx]}${colIdx}`;

              return (
                <div
                  key={codigo}
                  className="aspect-square flex items-center justify-center text-[8px] font-bold rounded-sm border border-neutral-800 bg-neutral-950 text-neutral-500 hover:border-amber-500/50 hover:text-amber-500 transition-all cursor-default"
                  title={`Asiento ${codigo}`}
                >
                  {codigo}
                </div>
              );
            })}
          </div>

          {/* Leyenda */}
          <div className="pt-6 border-t border-neutral-800 flex justify-center gap-6 text-[9px] text-neutral-500 font-bold uppercase tracking-tighter">
             <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 bg-neutral-950 border border-neutral-800 rounded-sm"></div>
                Disponible
             </div>
             <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 bg-amber-500 rounded-sm"></div>
                Asignado
             </div>
          </div>
        </div>
      ) : (
        <div className="h-48 flex flex-col items-center justify-center border-2 border-dashed border-neutral-800 rounded-xl text-neutral-600 text-xs text-center p-6">
          <p className="italic">Elige una sala para generar el mapa dinámico</p>
          <p className="text-[10px] mt-2 opacity-50 uppercase font-bold tracking-tighter text-amber-500">HU-03: Registro de Mapeo</p>
        </div>
      )}
    </div>
  );
}
