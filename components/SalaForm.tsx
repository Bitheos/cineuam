"use client";
import { useActionState, useEffect, useState } from "react";
import { createSala } from "@/lib/actions"; // La función que ya creamos
import { PlusCircle, Monitor } from "lucide-react";
import ToastError from "./ToastError";

export default function SalaForm() {
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
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 p-4 rounded-xl mb-6 text-sm">
                    Sala registrada con éxito.
                </div>
            )}

            <form action={formAction} className="bg-neutral-900 p-6 rounded-2xl border border-neutral-800">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                    <Monitor size={20} className="text-amber-500" /> Nueva Sala
                </h3>
                <div className="space-y-4 text-white">
                    <input
                        name="nombre"
                        placeholder="Identificador (ej: Sala 1)"
                        className="w-full bg-neutral-800 p-3 rounded-lg border border-neutral-700 outline-none focus:border-amber-500 transition-colors"
                        required
                    />

                    <select
                        name="tipo"
                        className="w-full bg-neutral-800 p-3 rounded-lg border border-neutral-700 outline-none focus:border-amber-500 transition-colors"
                        required
                    >
                        <option value="" disabled selected>Selecciona tipo</option>
                        <option value="Normal">Normal</option>
                        <option value="3D">3D</option>
                        <option value="VIP">VIP</option>
                    </select>

                    <input
                        name="capacidad"
                        type="number"
                        placeholder="Capacidad Total"
                        className="w-full bg-neutral-800 p-3 rounded-lg border border-neutral-700 outline-none focus:border-amber-500 transition-colors"
                        required
                    />

                    <button
                        disabled={isPending}
                        className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-neutral-700 text-black font-bold py-3 rounded-lg transition-all shadow-lg shadow-amber-500/5"
                    >
                        {isPending ? "Guardando..." : "Registrar Sala"}
                    </button>
                </div>
            </form>
        </div>
    );
}