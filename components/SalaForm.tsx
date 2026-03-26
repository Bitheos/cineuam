"use client";
import { useActionState, useEffect, useState } from "react";
import { createSala } from "@/lib/actions"; 
import { Monitor } from "lucide-react";
import ToastError from "./ToastError";

export default function SalaForm() {
    // Nota: Si usas Next.js 15+, 'useActionState' es lo correcto.
    const [state, formAction, isPending] = useActionState(createSala, null);
    const [showError, setShowError] = useState(false);

    useEffect(() => {
        if (state?.message === "error") {
            setShowError(true);
        }
    }, [state]);

    return (
        <div className="sticky top-10">
            {showError && state?.error && (
                <ToastError
                    key={Date.now()}
                    message={state.error}
                    onClose={() => setShowError(false)}
                />
            )}

            {state?.message === "success" && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 p-4 rounded-xl mb-6 text-sm font-bold uppercase tracking-widest text-center">
                    Sala registrada con éxito.
                </div>
            )}

            <form action={formAction} className="bg-neutral-900 p-8 rounded-[2.5rem] border border-neutral-800 shadow-2xl shadow-black">
                <h3 className="text-xl font-black mb-8 flex items-center gap-3 italic uppercase tracking-tighter text-white">
                    <Monitor size={24} className="text-orange-500" /> Nueva Sala
                </h3>
                
                <div className="space-y-5">
                    <div>
                        <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.2em] ml-2 mb-2 block">Identificador</label>
                        <input
                            name="nombre"
                            placeholder="Ej: Sala 1 - IMAX"
                            className="w-full bg-neutral-950 p-4 rounded-2xl border border-neutral-800 text-white outline-none focus:border-orange-500 transition-all placeholder:text-neutral-700"
                            required
                        />
                    </div>

                    <div>
                        <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.2em] ml-2 mb-2 block">Tipo de Proyección</label>
                        <select
                            name="tipo"
                            className="w-full bg-neutral-950 p-4 rounded-2xl border border-neutral-800 text-white outline-none focus:border-orange-500 transition-all appearance-none cursor-pointer"
                            required
                            defaultValue="" // <--- SOLUCIÓN AL ERROR: El valor inicial se define aquí
                        >
                            <option value="" disabled>Selecciona tipo...</option> 
                            <option value="Normal">Normal</option>
                            <option value="3D">3D</option>
                            <option value="VIP">VIP</option>
                        </select>
                    </div>

                    <div>
                        <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.2em] ml-2 mb-2 block">Capacidad</label>
                        <input
                            name="capacidad"
                            type="number"
                            placeholder="Número de asientos"
                            className="w-full bg-neutral-950 p-4 rounded-2xl border border-neutral-800 text-white outline-none focus:border-orange-500 transition-all placeholder:text-neutral-700"
                            required
                        />
                    </div>

                    <button
                        disabled={isPending}
                        className="w-full bg-orange-500 hover:bg-white disabled:bg-neutral-800 text-black font-black py-4 rounded-2xl transition-all shadow-lg shadow-orange-500/10 uppercase tracking-widest text-xs mt-4"
                    >
                        {isPending ? "Procesando..." : "Registrar Sala"}
                    </button>
                </div>
            </form>
        </div>
    );
}