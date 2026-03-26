import { prisma } from "@/lib/prisma";
import { 
    Film, 
    Monitor, 
    LogOut, 
    ArrowLeft, 
    Armchair, 
    Settings, 
    Clock, 
    Tag, 
    CalendarDays 
} from "lucide-react";
import Link from "next/link";

export default async function DashboardPage({ 
    searchParams 
}: { 
    searchParams: Promise<{ role: string, tab?: string }> 
}) {
    const params = await searchParams;
    const role = params.role || 'client';
    const isAdmin = role === 'admin';
    const currentTab = params.tab || 'cartelera';

    // Obtenemos las películas para la vista del cliente
    const movies = await prisma.movie.findMany({ orderBy: { createdAt: 'desc' } });

    return (
        <div className="flex w-full h-screen bg-neutral-950 text-white font-sans">
            {/* MENÚ IZQUIERDO (SOLO ADMIN) */}
            {isAdmin && (
                <aside className="w-72 border-r border-neutral-900 p-8 flex flex-col gap-10 bg-neutral-950 shrink-0 h-full">
                    <h1 className="text-3xl font-black italic text-orange-500 uppercase tracking-tighter leading-none">
                        CINEUAM
                    </h1>
                    <nav className="flex flex-col gap-3">
                        <Link 
                            href="/dashboard?role=admin&tab=cartelera" 
                            className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${currentTab === 'cartelera' ? 'bg-orange-500/10 border-orange-500/20 text-white' : 'text-neutral-400 border-transparent hover:bg-neutral-900'}`}
                        >
                            <Film size={20} className={currentTab === 'cartelera' ? 'text-orange-500' : ''} />
                            <span className="font-bold uppercase text-[11px] tracking-widest">Cartelera</span>
                        </Link>

                        <Link 
                            href="/dashboard?role=admin&tab=salas" 
                            className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${currentTab === 'salas' ? 'bg-orange-500/10 border-orange-500/20 text-white' : 'text-neutral-400 border-transparent hover:bg-neutral-900'}`}
                        >
                            <Monitor size={20} className={currentTab === 'salas' ? 'text-orange-500' : ''} />
                            <span className="font-bold uppercase text-[11px] tracking-widest">Salas</span>
                        </Link>

                        <Link href="/" className="flex items-center gap-3 text-red-600 p-3 mt-auto border-t border-neutral-900 pt-6 hover:text-red-500 transition-colors">
                            <LogOut size={20} />
                            <span className="font-bold uppercase text-[11px] tracking-widest">Cerrar Sesión</span>
                        </Link>
                    </nav>
                </aside>
            )}

            {/* CONTENIDO PRINCIPAL */}
            <main className="flex-1 overflow-y-auto p-12">
                <div className="max-w-6xl mx-auto">
                    
                    {/* VISTA CLIENTE: CARTELERA COMPLETA */}
                    {!isAdmin ? (
                        <section>
                            <Link href="/" className="flex items-center gap-2 text-neutral-500 hover:text-orange-500 mb-8 transition-colors text-xs font-bold uppercase tracking-widest">
                                <ArrowLeft size={14} /> Volver al Inicio
                            </Link>
                            
                            <header className="mb-12">
                                <h2 className="text-5xl font-black italic uppercase tracking-tighter">
                                    Cartelera <span className="text-orange-500">Disponible</span>
                                </h2>
                                <p className="text-neutral-500 mt-2 font-medium uppercase text-[10px] tracking-[0.2em]">Selecciona una película para ver horarios</p>
                            </header>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {movies.map((movie) => (
                                    <div key={movie.id} className="group bg-neutral-900/50 p-8 rounded-[2.5rem] border border-neutral-800 hover:border-orange-500 transition-all flex flex-col gap-4">
                                        <div className="flex justify-between items-start">
                                            <h4 className="text-2xl font-black text-orange-500 italic uppercase tracking-tight leading-none group-hover:text-white transition-colors">{movie.title}</h4>
                                            <span className="text-[10px] font-mono bg-neutral-800 px-2 py-1 rounded border border-neutral-700 text-neutral-400">{movie.classification}</span>
                                        </div>
                                        <div className="flex gap-4 text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                                            <span className="flex items-center gap-1"><Clock size={14}/> {movie.duration} min</span>
                                            <span className="flex items-center gap-1"><Tag size={14}/> 4K Ultra HD</span>
                                        </div>
                                        <p className="text-neutral-400 text-sm leading-relaxed line-clamp-3 mb-4">{movie.synopsis}</p>
                                        <button className="w-full bg-white text-black font-black py-4 rounded-2xl uppercase tracking-widest text-xs hover:bg-orange-500 hover:text-white transition-all shadow-xl shadow-white/5">
                                            Reservar Tickets
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </section>
                    ) : (
                        /* VISTA ADMIN: BOTONES DE GESTIÓN */
                        <>
                            <header className="mb-12">
                                <h2 className="text-4xl font-black border-l-4 border-orange-500 pl-4 italic uppercase tracking-tighter">
                                    {currentTab === 'cartelera' ? "Módulo de Cartelera" : "Módulo de Instalaciones"}
                                </h2>
                                <p className="text-neutral-500 mt-2 font-medium uppercase text-[10px] tracking-[0.2em]">Selecciona una acción para continuar</p>
                            </header>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* SECCIÓN CARTELERA (PELÍCULAS Y HORARIOS) */}
                                {currentTab === 'cartelera' && (
                                    <>
                                        <Link 
                                            href="/dashboard/movies?role=admin"
                                            className="group bg-neutral-900 border border-neutral-800 p-12 rounded-[2.5rem] hover:border-orange-500 transition-all flex flex-col items-center text-center gap-6 shadow-2xl shadow-black"
                                        >
                                            <div className="p-5 bg-orange-500/10 rounded-2xl group-hover:bg-orange-500 transition-all transform group-hover:-translate-y-2">
                                                <Settings size={48} className="text-orange-500 group-hover:text-black" />
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-black uppercase italic mb-2">Gestión de Películas</h3>
                                                <p className="text-neutral-500 text-sm max-w-50">Administra el catálogo y estrenos disponibles.</p>
                                            </div>
                                        </Link>

                                        <Link 
                                            href="/dashboard/schedules?role=admin"
                                            className="group bg-neutral-900 border border-neutral-800 p-12 rounded-[2.5rem] hover:border-orange-500 transition-all flex flex-col items-center text-center gap-6 shadow-2xl shadow-black"
                                        >
                                            <div className="p-5 bg-orange-500/10 rounded-2xl group-hover:bg-orange-500 transition-all transform group-hover:-translate-y-2">
                                                <CalendarDays size={48} className="text-orange-500 group-hover:text-black" />
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-black uppercase italic mb-2">Gestor de Horarios</h3>
                                                <p className="text-neutral-500 text-sm max-w-50">Asigna películas a salas evitando traslapes.</p>
                                            </div>
                                        </Link>
                                    </>
                                )}

                                {/* SECCIÓN SALAS (SALAS Y ASIENTOS) */}
                                {currentTab === 'salas' && (
                                    <>
                                        <Link 
                                            href="/dashboard/salas?role=admin"
                                            className="group bg-neutral-900 border border-neutral-800 p-12 rounded-[2.5rem] hover:border-orange-500 transition-all flex flex-col items-center text-center gap-6 shadow-2xl shadow-black"
                                        >
                                            <div className="p-5 bg-orange-500/10 rounded-2xl group-hover:bg-orange-500 transition-all transform group-hover:-translate-y-2">
                                                <Monitor size={48} className="text-orange-500 group-hover:text-black" />
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-black uppercase italic mb-2">Gestión de Salas</h3>
                                                <p className="text-neutral-500 text-sm max-w-50">Configura los espacios y tipos de proyección.</p>
                                            </div>
                                        </Link>

                                        <Link 
                                            href="/dashboard/asientos?role=admin"
                                            className="group bg-neutral-900 border border-neutral-800 p-12 rounded-[2.5rem] hover:border-orange-500 transition-all flex flex-col items-center text-center gap-6 shadow-2xl shadow-black"
                                        >
                                            <div className="p-5 bg-orange-500/10 rounded-2xl group-hover:bg-orange-500 transition-all transform group-hover:-translate-y-2">
                                                <Armchair size={48} className="text-orange-500 group-hover:text-black" />
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-black uppercase italic mb-2">Gestión de Asientos</h3>
                                                <p className="text-neutral-500 text-sm max-w-50">Mapeo y distribución de butacas.</p>
                                            </div>
                                        </Link>
                                    </>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}