import Link from "next/link";
import { ChevronLeft, Monitor, Users } from "lucide-react";
import SalaForm from "@/components/SalaForm";
import SalasTable from "@/components/SalasTable";

export default function SalasPage() {
    return (
        <main className="min-h-screen bg-neutral-950 text-white p-8">
            {/* Encabezado estilo CINEUAM */}
            <header className="max-w-7xl mx-auto mb-10">
                <div className="flex items-center justify-between mb-4">
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-2 text-neutral-500 hover:text-orange-500 transition-colors text-sm font-bold uppercase tracking-widest"
                    >
                        <ChevronLeft size={18} />
                        Volver
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