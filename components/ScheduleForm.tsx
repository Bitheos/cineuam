"use client";
import { useActionState } from "react";
import { createSchedule } from "@/lib/actions";
import { CalendarDays, ListOrdered, Film, Monitor, MousePointer2, Clock, Sparkles } from "lucide-react";

export default function ScheduleForm({ movies, salas }: { movies: any[], salas: any[] }) {
    const [state, formAction, isPending] = useActionState(createSchedule, null);

    return (
        <form action={formAction} className="flex flex-col h-full space-y-10">
            <div>
                <h3 className="text-3xl font-black flex items-center gap-4 uppercase italic text-white tracking-tighter leading-none">
                    <Sparkles className="text-orange-500" size={32} /> 
                    Programar Función
                </h3>
            </div>

            {state?.message === "error" && (
                <div className="bg-red-500/10 border border-red-400/20 text-red-400 p-5 rounded-2xl text-[11px] font-bold leading-relaxed">
                    ERROR: {state.error}
                </div>
            )}

            <div className="space-y-10">
                {/* SELECTOR DE PELÍCULA */}
                <div className="space-y-4">
                    <label className="text-[10px] font-black text-orange-500/50 uppercase tracking-[0.25em] ml-1 flex items-center gap-2">
                        <Film size={12} /> Seleccionar Película
                    </label>
                    <select 
                        name="movieId" 
                        required 
                        defaultValue="" 
                        className="w-full bg-neutral-950 p-6 rounded-3xl border border-neutral-800 text-white font-bold text-sm outline-none focus:border-orange-500 transition-all appearance-none cursor-pointer"
                    >
                        <option value="" disabled>— Elige una película —</option>
                        {movies.map(m => (
                            <option key={m.id} value={m.id}>{m.title.toUpperCase()} ({m.duration} min)</option>
                        ))}
                    </select>
                </div>

                {/* SELECTOR DE SALA */}
                <div className="space-y-4">
                    <label className="text-[10px] font-black text-orange-500/50 uppercase tracking-[0.25em] ml-1 flex items-center gap-2">
                        <Monitor size={12} /> Asignar Sala
                    </label>
                    <select 
                        name="salaId" 
                        required 
                        defaultValue="" 
                        className="w-full bg-neutral-950 p-6 rounded-3xl border border-neutral-800 text-white font-bold text-sm outline-none focus:border-orange-500 transition-all appearance-none cursor-pointer"
                    >
                        <option value="" disabled>— Elige una sala —</option>
                        {salas.map(s => (
                            <option key={s.id} value={s.id}>{s.nombre} ({s.tipo})</option>
                        ))}
                    </select>
                </div>

                <div className="space-y-4">
                    <label className="text-[10px] font-black text-orange-500/50 uppercase tracking-[0.25em] ml-1 flex items-center gap-2">
                        <Clock size={12} /> Horario de Inicio
                    </label>
                    <input type="datetime-local" name="startTime" required className="w-full bg-neutral-950 p-6 rounded-3xl border border-neutral-800 text-white font-bold text-sm outline-none focus:border-orange-500 transition-all scheme:dark" />
                </div>

                <div className="space-y-4">
                    <label className="text-[10px] font-black text-orange-500/50 uppercase tracking-[0.25em] ml-1 flex items-center gap-2">
                        <ListOrdered size={12} /> Repeticiones seguidas
                    </label>
                    <select 
                        name="repetitions" 
                        defaultValue="1"
                        className="w-full bg-neutral-950 p-6 rounded-3xl border border-neutral-800 text-white font-bold text-sm outline-none focus:border-orange-500 transition-all appearance-none"
                    >
                        <option value="1">Sólo una función</option>
                        <option value="2">2 funciones continuas</option>
                        <option value="3">3 funciones continuas</option>
                        <option value="4">4 funciones continuas</option>
                        <option value="5">Jornada completa (5)</option>
                    </select>
                </div>

                <button disabled={isPending} className="w-full bg-orange-500 hover:bg-white text-black font-black py-7 rounded-3xl uppercase tracking-[0.3em] text-[11px] transition-all shadow-2xl shadow-orange-500/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed">
                    {isPending ? "GENERANDO..." : "REGISTRAR EN CARTELERA"}
                </button>
            </div>
        </form>
    );
}