import Link from "next/link";
import { ArrowLeft, Monitor, Users } from "lucide-react";
import SalaForm from "@/components/SalaForm";
import SalasTable from "@/components/SalasTable";

export default async function SalasPage({ searchParams }: { searchParams: Promise<{ role: string }> }) {
    const params = await searchParams;
    const role = params.role || 'client';
    const isAdmin = role === 'admin';
    return (
        <main className="min-h-screen bg-neutral-950 text-white p-8">
            {/* Encabezado estilo CINEUAM */}
            <header className="max-w-7xl mx-auto mb-10">
                <div className="flex items-center justify-between mb-4">
                    <Link href={`/dashboard?role=${role}`} className="flex items-center gap-2 text-neutral-500 hover:text-amber-500 mb-6 transition-colors">
                        <ArrowLeft size={18} /> Volver al panel
                    </Link>
                    <span className="text-orange-500 font-bold text-sm tracking-widest uppercase">
                        Sesión iniciada como: ADMIN
                    </span>
                </div>

                <h1 className="text-3xl font-bold italic tracking-tighter uppercase">
                    Gestión de <span className="text-orange-500">Salas</span>
                </h1>
                <p className="text-neutral-400 text-sm mt-1">Registra salas y edita la configuración de aforo.</p>
            </header>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Columna Formulario (Más angosta para seguir el estilo) */}
                <div className="lg:col-span-5">
                    <div className="border-l-2 border-orange-500 pl-6">
                        <SalaForm />
                    </div>
                </div>

                {/* Columna Tabla */}
                <div className="lg:col-span-7">
                    <SalasTable />
                </div>
            </div>
        </main>
    );
}