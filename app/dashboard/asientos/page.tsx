import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import SeatMapManager from "@/components/SeatMapManager";
import { prisma } from "@/lib/prisma";
import { getOccupiedSeats } from "@/lib/actions";

export default async function AsientosPage({
                                               searchParams
                                           }: {
    searchParams: Promise<{ role: string, scheduleId?: string }>
}) {
    const params = await searchParams;
    const role = params.role || 'admin';
    const scheduleId = params.scheduleId;

    // Si alguien entra aquí sin elegir una película primero:
    if (!scheduleId) {
        return (
            <main className="min-h-screen bg-neutral-950 text-white p-8 flex flex-col items-center justify-center">
                <h1 className="text-xl font-bold uppercase italic opacity-50">Selecciona una función desde la cartelera</h1>
                <Link href={`/dashboard/movies?role=${role}`} className="text-amber-500 mt-4 underline font-bold">
                    Ir a Cartelera
                </Link>
            </main>
        );
    }

    const occupiedSeats = await getOccupiedSeats(scheduleId);
    const currentSchedule = await prisma.schedule.findUnique({
        where: { id: scheduleId },
        include: { sala: true, movie: true }
    });

    if (!currentSchedule) return <div className="text-white p-10">Error: Horario no encontrado.</div>;

    return (
        <main className="min-h-screen bg-neutral-950 text-white p-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-black italic tracking-tighter uppercase inline-block border-b-2 border-amber-500 pb-2">
                        Estado de <span className="text-amber-500">Aforo</span>
                    </h1>
                </div>

                <SeatMapManager
                    salaConfig={currentSchedule.sala}
                    movieTitle={currentSchedule.movie.title}
                    startTime={currentSchedule.startTime}
                    occupiedSeats={occupiedSeats}
                    scheduleId={scheduleId}
                    role={role}
                />
            </div>
        </main>
    );
}