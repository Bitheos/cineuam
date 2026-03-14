import { prisma } from "./../../../lib/prisma";
import { Clock, Tag, ArrowLeft } from "lucide-react";
import Link from "next/link";
import MovieForm from "@/components/MovieForm";

export default async function MoviesPage({ searchParams }: { searchParams: Promise<{ role: string }> }) {
    const params = await searchParams;
    const role = params.role || 'client';
    const isAdmin = role === 'admin';
    type Movie = {
        id: string;
        title: string;
        duration: number;
        classification: string;
        synopsis: string;
    };

    const movies: Movie[] = await prisma.movie.findMany({ orderBy: { createdAt: 'desc' } });

    return(
        <div className="min-h-screen bg-neutral-950 text-white p-10">
            <div className="max-w-6xl mx-auto">
                <Link href={`/dashboard?role=${role}`} className="flex items-center gap-2 text-neutral-500 hover:text-amber-500 mb-6 transition-colors">
                <ArrowLeft size={18} /> Volver al panel
                </Link>

                <h2 className="text-3xl font-bold mb-10 border-l-4 border-amber-500 pl-4 italic uppercase">Cartelera</h2>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {isAdmin && (
                        <div className="lg:col-span-1">
                            <MovieForm />
                        </div>
                    )}

                    <div className={`${isAdmin ? 'lg:col-span-2' : 'lg:col-span-3'} grid grid-cols-1 gap-4`}>
                        {movies.map((movie: Movie) => (
                            <div key={movie.id} className="bg-neutral-900 p-6 rounded-2xl border border-neutral-800 flex flex-col gap-2 shadow-xl">
                                <h4 className="text-xl font-bold text-amber-500 italic uppercase">{movie.title}</h4>
                                <div className="flex gap-4 text-xs text-neutral-500">
                                <span className="flex items-center gap-1"><Clock size={14}/> {movie.duration} min</span>
                                <span className="flex items-center gap-1"><Tag size={14}/> {movie.classification}</span>
                                </div>
                                <p className="text-neutral-400 text-sm leading-relaxed mt-2">{movie.synopsis}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}