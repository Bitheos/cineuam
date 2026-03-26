import { prisma } from "@/lib/prisma";
import { Film, Monitor, LogOut, ArrowLeft, Clock, CalendarDays, Ticket } from "lucide-react";
import Link from "next/link";
import ScheduleForm from "@/components/ScheduleForm";

export default async function SchedulesPage() {
    const movies = await prisma.movie.findMany();
    const salas = await prisma.sala.findMany();
    const schedules = await prisma.schedule.findMany({
        include: { movie: true, sala: true },
        orderBy: { startTime: 'asc' }
    });

    return (
        <div className="flex w-full h-screen bg-neutral-950 text-white font-sans overflow-hidden">
            
            {/* 1. COLUMNA DE CONFIGURACIÓN (FORMULARIO) */}
            <div className="w-112.5 border-r border-neutral-900 bg-neutral-950 p-10 overflow-y-auto shrink-0 shadow-[20px_0_50px_rgba(0,0,0,0.5)] z-10">
                <Link href="/dashboard?role=admin" className="flex items-center gap-2 text-neutral-500 hover:text-orange-500 mb-10 transition-colors text-[10px] font-black uppercase tracking-[0.2em] group">
                    <div className="p-2 rounded-full border border-neutral-900 group-hover:border-orange-500/50">
                        <ArrowLeft size={14} /> 
                    </div>
                    Volver al panel principal
                </Link>
                
                <ScheduleForm movies={movies} salas={salas} />
            </div>

            {/* 2. ÁREA DE VISUALIZACIÓN (AGENDA) */}
            <main className="flex-1 p-12 overflow-y-auto bg-neutral-950/50 relative">
                <div className="absolute top-0 right-0 w-125 h-125 bg-orange-500/5 blur-[150px] -z-10" />

                <header className="mb-12">
                    <h2 className="text-6xl font-black italic uppercase tracking-tighter">
                        Agenda de <span className="text-orange-500">Funciones</span>
                    </h2>
                    <p className="text-neutral-500 mt-2 font-medium uppercase text-[10px] tracking-[0.3em]">
                        Control maestro de salas y horarios • {schedules.length} Eventos programados
                    </p>
                </header>

                <div className="space-y-12 pb-20">
                    {salas.map((sala) => (
                        <section key={sala.id} className="bg-neutral-900/20 rounded-[3rem] border border-neutral-900/50 p-10 backdrop-blur-sm">
                            <div className="flex items-center justify-between mb-8 border-b border-neutral-800/50 pb-6">
                                <div className="flex items-center gap-5">
                                    <div className="p-4 bg-orange-500/10 rounded-2xl border border-orange-500/20">
                                        <Monitor className="text-orange-500" size={28} />
                                    </div>
                                    <div>
                                        <h3 className="text-3xl font-black uppercase italic tracking-tighter leading-none">{sala.nombre}</h3>
                                        <p className="text-[10px] font-bold text-neutral-600 uppercase tracking-[0.2em] mt-2">
                                            {sala.tipo} • {sala.capacidad} Butacas
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* GRID DE FUNCIONES */}
                            <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
                                {schedules.filter(s => s.salaId === sala.id).length > 0 ? (
                                    schedules.filter(s => s.salaId === sala.id).map((s) => (
                                        <div key={s.id} className="relative group bg-neutral-950 border border-neutral-900 rounded-[2.2rem] overflow-hidden hover:border-orange-500/40 transition-all duration-500 shadow-2xl flex flex-col">
                                            
                                            <div className="p-7 flex-1 space-y-3">
                                                <div className="flex items-center gap-2">
                                                    <Ticket size={14} className="text-orange-500" />
                                                    <span className="px-2 py-0.5 bg-orange-500/10 border border-orange-500/20 text-orange-500 text-[8px] font-black uppercase tracking-widest rounded-full">
                                                        Función Programada
                                                    </span>
                                                </div>
                                                
                                                <h4 className="text-2xl font-black uppercase italic tracking-tighter text-white group-hover:text-orange-500 transition-colors leading-tight min-h-12">
                                                    {s.movie.title}
                                                </h4>
                                                
                                                <p className="text-[11px] font-bold uppercase tracking-widest text-neutral-500 flex items-center gap-2 pt-1">
                                                    <CalendarDays size={14} className="text-neutral-700" />
                                                    {new Date(s.startTime).toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })}
                                                </p>
                                            </div>

                                            <div className="mt-auto border-t border-neutral-900 bg-neutral-900/50 group-hover:bg-orange-500 transition-all duration-500">
                                                <div className="px-7 py-5 flex items-center justify-center gap-6 tabular-nums">
                                                    <div className="text-center flex-1">
                                                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-neutral-500 group-hover:text-black/60 mb-1">Inicia</p>
                                                        <p className="text-2xl font-mono font-black text-white group-hover:text-black leading-none">
                                                            {new Date(s.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </p>
                                                    </div>
                                                    
                                                    <div className="relative h-10 w-px bg-neutral-800 group-hover:bg-black/20">
                                                        <div className="absolute -top-1 -left-1 w-2 h-2 rounded-full bg-neutral-950 group-hover:bg-orange-500" />
                                                        <div className="absolute -bottom-1 -left-1 w-2 h-2 rounded-full bg-neutral-950 group-hover:bg-orange-500" />
                                                    </div>

                                                    <div className="text-center flex-1">
                                                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-neutral-500 group-hover:text-black/60 mb-1">Fin</p>
                                                        <p className="text-base font-mono font-bold text-neutral-400 group-hover:text-black/80 leading-none">
                                                            {new Date(s.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-full py-16 flex flex-col items-center justify-center border-2 border-dashed border-neutral-900 rounded-[3rem] opacity-30">
                                        <Clock size={40} className="mb-4 text-neutral-700" />
                                        <p className="text-neutral-500 text-xs font-black uppercase tracking-[0.3em]">No hay proyecciones asignadas</p>
                                    </div>
                                )}
                            </div>
                        </section>
                    ))}
                </div>
            </main>
        </div>
    );
}