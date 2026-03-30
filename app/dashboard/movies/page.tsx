import { prisma } from "@/lib/prisma";
import { Clock, Tag, ArrowLeft, Ticket, LayoutDashboard } from "lucide-react"; // Añadimos LayoutDashboard
import Link from "next/link";
import MovieForm from "@/components/MovieForm";

export default async function MoviesPage({
                                             searchParams
                                         }: {
    searchParams: Promise<{ role?: string }>
}) {
    const sParams = await searchParams;
    const role = sParams.role || 'client';
    const isAdmin = role === 'admin';

    // 1. Buscamos películas e incluimos sus horarios (schedules)
    let movies: any[] = [];
    try {
        movies = await prisma.movie.findMany({
            include: {
                schedules: {
                    take: 1,
                    orderBy: { startTime: 'asc' }
                }
            },
            orderBy: { id: 'desc' }
        });
    } catch (error) {
        console.error("Error cargando películas con horarios:", error);
    }

    return (
        <div className="min-h-screen bg-neutral-950 text-white p-10">
            <div className="max-w-6xl mx-auto">
                <Link
                    href={`/dashboard?role=${role}`}
                    className="flex items-center gap-2 text-neutral-500 hover:text-amber-500 mb-6 transition-colors w-fit"
                >
                    <ArrowLeft size={18}/> Volver al panel
                </Link>

                <h2 className="text-3xl font-bold mb-10 border-l-4 border-amber-500 pl-4 italic uppercase flex items-center gap-4">
                    Cartelera
                    {isAdmin && (
                        <span
                            className="text-[10px] bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2 py-1 rounded tracking-widest">
                            MODO ADMINISTRADOR
                        </span>
                    )}
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {isAdmin && (
                        <div className="lg:col-span-1">
                            <div className="sticky top-10 bg-neutral-900 p-6 rounded-2xl border border-neutral-800 shadow-2xl">
                                <h3 className="text-amber-500 font-bold mb-6 uppercase text-xs tracking-tighter flex items-center gap-2">
                                    <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"/>
                                    Registrar Nueva Película
                                </h3>
                                <MovieForm/>
                            </div>
                        </div>
                    )}

                    <div className={`${isAdmin ? 'lg:col-span-2' : 'lg:col-span-3'} flex flex-col gap-6`}>
                        {movies.length === 0 ? (
                            <div className="p-20 border-2 border-dashed border-neutral-800 rounded-3xl text-center text-neutral-600 italic">
                                No hay películas en cartelera actualmente.
                            </div>
                        ) : (
                            movies.map((movie) => {
                                const hasSchedule = movie.schedules && movie.schedules.length > 0;
                                const scheduleId = hasSchedule ? movie.schedules[0].id : null;

                                return (
                                    <div
                                        key={movie.id}
                                        className="group bg-neutral-900 p-8 rounded-3xl border border-neutral-800 shadow-xl hover:border-amber-500/40 transition-all duration-300"
                                    >
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="space-y-3">
                                                <h4 className="text-2xl font-black text-white italic uppercase tracking-tighter group-hover:text-amber-500 transition-colors">
                                                    {movie.title}
                                                </h4>

                                                <div className="flex gap-3 text-[10px] font-bold uppercase">
                                                    <span className="flex items-center gap-1.5 bg-neutral-800 px-3 py-1.5 rounded-lg text-neutral-400">
                                                        <Clock size={14} className="text-amber-500"/>
                                                        {movie.duration} MIN
                                                    </span>
                                                    <span className="flex items-center gap-1.5 bg-neutral-800 px-3 py-1.5 rounded-lg text-neutral-400">
                                                        <Tag size={14} className="text-amber-500"/>
                                                        {movie.classification}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* BOTÓN DINÁMICO SEGÚN ROL */}
                                            {hasSchedule ? (
                                                isAdmin ? (
                                                    <Link
                                                        href={`/dashboard/asientos?scheduleId=${scheduleId}&role=admin`}
                                                        className="bg-neutral-800 text-white px-6 py-3 rounded-xl font-black text-[11px] uppercase hover:bg-neutral-700 transition-all shadow-lg flex items-center gap-2"
                                                    >
                                                        <LayoutDashboard size={16}/> Ver Estado de Sala
                                                    </Link>
                                                ) : (
                                                    <Link
                                                        href={`/dashboard/compra?scheduleId=${scheduleId}&role=client`}
                                                        className="bg-amber-500 text-black px-6 py-3 rounded-xl font-black text-[11px] uppercase hover:bg-white transition-all shadow-lg shadow-amber-500/10 flex items-center gap-2"
                                                    >
                                                        <Ticket size={16}/> Reservar Tickets
                                                    </Link>
                                                )
                                            ) : (
                                                <div className="bg-neutral-800 text-neutral-500 px-6 py-3 rounded-xl font-black text-[10px] uppercase border border-neutral-700 cursor-not-allowed">
                                                    Sin funciones próximas
                                                </div>
                                            )}
                                        </div>

                                        <div className="border-t border-neutral-800/50 pt-5">
                                            <p className="text-neutral-400 text-sm leading-relaxed line-clamp-3 group-hover:line-clamp-none transition-all">
                                                {movie.synopsis || "Esta película aún no cuenta con una sinopsis oficial."}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}