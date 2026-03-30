"use client";

import { useActionState, useState } from "react";
import { createTicket } from "@/lib/actions";
import {
    Armchair,
    CheckCircle,
    CreditCard,
    ArrowLeft
} from "lucide-react";
import Link from "next/link";
import ToastError from "./ToastError"; //

interface SeatMapProps {
    salaConfig: {
        id: number;
        nombre: string;
        tipo: string;
        capacidad: number;
    };
    movieTitle: string;
    startTime: Date;
    occupiedSeats: string[];
    scheduleId: string;
    role?: string;
}

export default function SeatMapManager({
                                           salaConfig,
                                           movieTitle,
                                           startTime,
                                           occupiedSeats,
                                           scheduleId,
                                           role = 'client'
                                       }: SeatMapProps) {
    const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
    // Usamos <any, any> para que no marque error en state.message o state.error
    const [state, formAction, isPending] = useActionState<any, any>(createTicket, null);

    const isAdmin = role === 'admin';

    // Configuración de precios
    const prices = { "Normal": 70, "3D": 95, "VIP": 120 };
    const pricePerSeat = prices[salaConfig.tipo as keyof typeof prices] || 70;
    const totalAmount = selectedSeats.length * pricePerSeat;

    const toggleSeat = (seatId: string) => {
        if (isAdmin || occupiedSeats.includes(seatId)) return;

        setSelectedSeats(prev =>
            prev.includes(seatId) ? prev.filter(s => s !== seatId) : [...prev, seatId]
        );
    };

    return (
        <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-700">

            {/* ÚNICO BOTÓN DE REGRESO */}
            <Link
                href={`/dashboard/movies?role=${role}`}
                className="flex items-center gap-2 text-neutral-500 hover:text-orange-500 mb-6 transition-colors w-fit font-bold uppercase text-[10px] tracking-widest"
            >
                <ArrowLeft size={16}/> Volver a Cartelera
            </Link>

            {/* Header de la Película */}
            <header className="text-center space-y-2">
                <h1 className="text-6xl font-black italic uppercase text-white tracking-tighter italic">
                    {movieTitle}
                </h1>
                <p className="text-orange-500 font-black uppercase tracking-[0.3em] text-[10px]">
                    {isAdmin ? "Vista de Administrador • Estado de Aforo" : "Confirmación de Ticket"} • {new Date(startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} HRS
                </p>
            </header>

            <div className="bg-neutral-900/50 border border-neutral-800 p-10 rounded-[3rem] shadow-2xl">
                <p className="text-[10px] font-bold text-neutral-500 uppercase mb-6 tracking-widest flex items-center gap-2">
                    <Armchair size={14} className="text-orange-500" /> Sala: {salaConfig.nombre} ({salaConfig.tipo})
                </p>

                {/* Mapa de Asientos */}
                <div className="grid grid-cols-10 gap-3 mb-10 justify-center">
                    {Array.from({ length: salaConfig.capacidad }).map((_, i) => {
                        const row = String.fromCharCode(65 + Math.floor(i / 10));
                        const num = (i % 10) + 1;
                        const seatId = `${row}${num}`;
                        const isOccupied = occupiedSeats.includes(seatId);
                        const isSelected = selectedSeats.includes(seatId);

                        return (
                            <button
                                key={seatId}
                                onClick={() => toggleSeat(seatId)}
                                disabled={isOccupied || isPending || isAdmin}
                                className={`group relative flex flex-col items-center transition-all duration-300 ${
                                    isOccupied ? "opacity-30 cursor-not-allowed" :
                                        isAdmin ? "cursor-default" : "hover:scale-110"
                                }`}
                            >
                                <Armchair
                                    size={24}
                                    className={`${
                                        isOccupied ? "text-red-600" :
                                            isSelected ? "text-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.5)]" :
                                                "text-neutral-700 group-hover:text-neutral-400"
                                    }`}
                                />
                                <span className="text-[8px] mt-1 font-bold text-neutral-500">{seatId}</span>
                            </button>
                        );
                    })}
                </div>

                {/* LEYENDA DE ICONOGRAFÍA */}
                <div className="flex justify-center gap-8 mb-10 border-b border-neutral-800/50 pb-8">
                    <div className="flex items-center gap-2">
                        <Armchair size={18} className="text-neutral-700" />
                        <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Disponible</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Armchair size={18} className="text-red-600 opacity-50" />
                        <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Ocupado</span>
                    </div>
                    {!isAdmin && (
                        <div className="flex items-center gap-2">
                            <Armchair size={18} className="text-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.3)]" />
                            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Tu Selección</span>
                        </div>
                    )}
                </div>

                {/* Formulario de Pago o Mensaje de Admin */}
                {!isAdmin ? (
                    <form action={formAction} className="pt-4 space-y-6">
                        <input type="hidden" name="scheduleId" value={scheduleId} />
                        <input type="hidden" name="seats" value={JSON.stringify(selectedSeats)} />
                        <input type="hidden" name="total" value={totalAmount} />

                        <div className="flex justify-between items-end">
                            <div>
                                <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Monto Total</p>
                                <h3 className="text-5xl font-black text-white italic">${totalAmount}</h3>
                            </div>

                            <button
                                disabled={selectedSeats.length === 0 || isPending}
                                className="bg-orange-500 hover:bg-white text-black px-10 py-5 rounded-2xl font-black uppercase italic text-xs transition-all flex items-center gap-3 disabled:opacity-20 disabled:grayscale"
                            >
                                <CreditCard size={18} />
                                {isPending ? "Procesando..." : "Pagar Ahora"}
                            </button>
                        </div>

                        {state?.message === "success" && (
                            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 p-4 rounded-xl flex items-center gap-3 text-xs font-bold animate-in zoom-in duration-300">
                                <CheckCircle size={18} /> ¡Reserva realizada con éxito!
                            </div>
                        )}

                        {state?.message === "error" && (
                            <ToastError message={state.error} action={() => {}} />
                        )}
                    </form>
                ) : (
                    <div className="pt-4 text-center">
                        <p className="text-neutral-500 text-[10px] font-bold uppercase tracking-[0.2em]">
                            Modo Visualización: Los administradores no pueden reservar asientos.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}