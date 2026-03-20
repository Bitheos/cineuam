import Link from 'next/link';
import { Film, Monitor, LogOut, User } from 'lucide-react';

export default function DashboardLayout({
                                            children,
                                        }: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-neutral-950 text-white font-sans">
            {/* SIDEBAR IZQUIERDO (DISEÑO CINEUAM) */}
            <aside className="w-72 border-r border-neutral-900 p-8 flex flex-col gap-10 sticky top-0 h-screen bg-neutral-950/50 backdrop-blur-xl">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black italic text-orange-500 uppercase tracking-tighter leading-none">
                        CINEUAM
                    </h1>
                </div>

                <nav className="flex flex-col gap-4">
                    <Link href="/dashboard/movies" className="flex items-center gap-3 text-neutral-400 hover:text-white transition-all group p-2 rounded-lg hover:bg-neutral-900">
                        <Film size={20} className="group-hover:text-orange-500" />
                        <span className="font-bold uppercase text-[11px] tracking-[0.2em]">Cartelera</span>
                    </Link>

                    <Link href="/dashboard/salas" className="flex items-center gap-3 text-neutral-400 hover:text-white transition-all group p-2 rounded-lg hover:bg-neutral-900">
                        <Monitor size={20} className="group-hover:text-orange-500" />
                        <span className="font-bold uppercase text-[11px] tracking-[0.2em]">Salas</span>
                    </Link>

                    <Link href="/" className="flex items-center gap-3 text-red-600 hover:text-red-500 transition-all p-2 mt-4">
                        <LogOut size={20} />
                        <span className="font-bold uppercase text-[11px] tracking-[0.2em]">Cerrar Sesión</span>
                    </Link>
                </nav>
            </aside>

            {/* CONTENIDO DERECHO */}
            <div className="flex-1 flex flex-col">
                {/* BARRA SUPERIOR DE ESTADO (IMPORTANTE) */}
                <header className="h-20 border-b border-neutral-900 flex items-center justify-end px-12 bg-neutral-950/30">
                    <div className="flex items-center gap-3">
                        <div className="text-right">
                            <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Sesión iniciada como</p>
                            <p className="text-sm font-black text-orange-500 italic uppercase">ADMINISTRADOR</p>
                        </div>
                        <div className="p-2 bg-orange-500/10 rounded-full border border-orange-500/20">
                            <User size={20} className="text-orange-500" />
                        </div>
                    </div>
                </header>

                {/* TU PÁGINA (SALAS O PELÍCULAS) */}
                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}