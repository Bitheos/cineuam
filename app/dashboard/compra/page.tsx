import { prisma } from "@/lib/prisma";
import SeatMapManager from "@/components/SeatMapManager";
import { redirect } from "next/navigation";

export default async function CompraPage({
                                             searchParams
                                         }: {
    searchParams: Promise<{ scheduleId?: string, role?: string }>
}) {
    const sParams = await searchParams;
    const scheduleId = sParams.scheduleId;
    const role = sParams.role || 'client';

    // Si no hay un ID de horario, redirigimos a la cartelera para evitar errores
    if (!scheduleId) {
        redirect(`/dashboard?role=${role}`);
    }

    // 1. Buscamos la función específica y traemos la configuración de su sala
    const currentSchedule = await prisma.schedule.findUnique({
        where: { id: scheduleId },
        include: {
            movie: true,
            sala: true // Esto nos dice si es Normal (50), 3D (40) o VIP (30)
        }
    });

    if (!currentSchedule) {
        return <div className="text-white p-10 font-black uppercase tracking-widest text-center">Función no encontrada</div>;
    }

    // 2. FILTRO CRÍTICO: Buscamos tickets SOLO para este scheduleId
    const tickets = await prisma.ticket.findMany({
        where: { scheduleId: scheduleId },
        select: { seatNumber: true } // Cambia 'asiento' por 'seatNumber'
    });

// Cambia el mapeo también:
    const occupiedSeats = tickets.map(t => t.seatNumber);
    return (
        <div className="min-h-screen bg-neutral-950 p-4 md:p-10">
            <SeatMapManager
                // Pasamos los datos de la sala vinculada a este horario
                salaConfig={currentSchedule.sala}
                movieTitle={currentSchedule.movie.title}
                startTime={currentSchedule.startTime}
                occupiedSeats={occupiedSeats}
                scheduleId={scheduleId}
            />
        </div>
    );
}