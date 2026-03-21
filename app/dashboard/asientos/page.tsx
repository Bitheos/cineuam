import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Asientos from "@/components/SeatMapManager";
import { prisma } from "@/lib/prisma";

export default async function AsientosPage({ searchParams }: { searchParams: Promise<{ role: string }> }) {
    const params = await searchParams;
    const role = params.role || 'client';
    const isAdmin = role === 'admin';
    // Obtenemos las salas desde MySQL
    const salasRaw = await prisma.sala.findMany({
        orderBy: { nombre: 'asc' }
    });

    // Limpiamos para evitar errores de serialización
    const salas = salasRaw.map(sala => ({
        id: sala.id,
        nombre: sala.nombre,
        capacidad: sala.capacidad,
        tipo: sala.tipo
    }));

    return (
        <main className="min-h-screen bg-neutral-950 text-white p-8">
            <header className="max-w-7xl mx-auto mb-10">
                <div className="flex items-center justify-between mb-4">
                    <Link href={`/dashboard?role=${role}`} className="flex items-center gap-2 text-neutral-500 hover:text-amber-500 mb-6 transition-colors">
                        <ArrowLeft size={18} /> Volver al panel
                    </Link>
                    <span className="text-amber-500 font-bold text-sm tracking-widest uppercase">
                        Admin: Gestión de Aforo
                    </span>
                </div>

                <h1 className="text-3xl font-bold italic tracking-tighter uppercase">
                    Mapeo de <span className="text-amber-500">Asientos</span>
                </h1>
                <p className="text-neutral-400 text-sm mt-1">
                    Visualización automática de butacas según la capacidad de sala.
                </p>
            </header>

            <div className="max-w-3xl mx-auto">
                <div className="border-l-2 border-amber-500 pl-6">
                    {/* El componente recibe la lista de salas */}
                    <Asientos salas={salas} />
                </div>
            </div>
        </main>
    );
}
