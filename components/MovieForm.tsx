"use client";
import { useActionState, useEffect, useState } from "react";
import { createMovie } from "@/lib/actions";
import { PlusCircle } from "lucide-react";
import ToastError from "./ToastError";

export default function MovieForm() {
const [state, formAction, isPending] = useActionState(createMovie, null);
const [showError, setShowError] = useState(false);

useEffect(() => {
    if (state?.message === "error") {
        setShowError(true);
    }
}, [state]);

return (
    <div className="sticky top-10">
        {/* Notificación con barra de tiempo */}
        {showError && state?.error && (
            <ToastError 
                key={Date.now()}
                message={state.error} 
                onClose={() => setShowError(false)} 
            />
        )}
        {/* Notificación de Éxito */}
        {state?.message === "success" && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 p-4 rounded-xl mb-6 text-sm">
                Pelicula registrada con éxito.
            </div>
        )}

        <form action={formAction} className="bg-neutral-900 p-6 rounded-2xl border border-neutral-800">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <PlusCircle size={20} className="text-amber-500" /> Nueva Película
            </h3>
            <div className="space-y-4">
                <input name="title" placeholder="Título" className="w-full bg-neutral-800 p-3 rounded-lg border border-neutral-700 outline-none focus:border-amber-500 transition-colors" required />
                <div className="flex gap-2">
                    <input name="duration" type="number" placeholder="Min" className="w-1/2 bg-neutral-800 p-3 rounded-lg border border-neutral-700 outline-none" required />
                    <input name="classification" placeholder="A, B15" className="w-1/2 bg-neutral-800 p-3 rounded-lg border border-neutral-700 outline-none" required />
                </div>
                <textarea name="synopsis" placeholder="Sinopsis..." rows={4} className="w-full bg-neutral-800 p-3 rounded-lg border border-neutral-700 outline-none" required />
                <button 
                    disabled={isPending}
                    className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-neutral-700 text-black font-bold py-3 rounded-lg transition-all shadow-lg shadow-amber-500/5"
                >
                    {isPending ? "Procesando..." : "Registrar Película"}
                </button>
            </div>
        </form>
    </div>
);
}