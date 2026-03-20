import Link from 'next/link';

export default function WelcomePage() {
    return (
        <main className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-6">
            {/* LOGO CENTRAL */}
            <h1 className="text-6xl font-black italic text-orange-500 tracking-tighter uppercase mb-16">
                CINEUAM
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
                {/* BOTÓN ADMINISTRADOR */}
                <Link
                    href="/dashboard?role=admin"
                    className="group bg-neutral-900/40 border border-neutral-800 p-12 rounded-3xl hover:border-orange-500 transition-all text-center"
                >
                    <h2 className="text-3xl font-bold text-white mb-2">Administrador</h2>
                    <p className="text-neutral-500 font-medium">Gestionar cartelera y salas</p>
                </Link>

                {/* BOTÓN CLIENTE */}
                <Link
                    href="/dashboard?role=client"
                    className="group bg-neutral-900/40 border border-neutral-800 p-12 rounded-3xl hover:border-neutral-400 transition-all text-center"
                >
                    <h2 className="text-3xl font-bold text-white mb-2">Cliente</h2>
                    <p className="text-neutral-500 font-medium">Explorar películas y comprar</p>
                </Link>
            </div>
        </main>
    );
}