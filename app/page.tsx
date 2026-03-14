import Link from 'next/link';

export default function LoginPage() {
    return (
        <main className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-6">
            <h1 className="text-5xl font-bold text-gold-500 mb-12 tracking-tighter text-amber-500">CINEUAM</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
                <Link href="/dashboard?role=admin" className="group border border-neutral-800 p-10 rounded-2xl bg-neutral-900 hover:border-amber-500 transition-all text-center">
                    <h2 className="text-2xl font-semibold text-white group-hover:text-amber-500">Administrador</h2>
                    <p className="text-neutral-400 mt-2">Gestionar cartelera y salas</p>
                </Link>
                <Link href="/dashboard?role=client" className="group border border-neutral-800 p-10 rounded-2xl bg-neutral-900 hover:border-amber-500 transition-all text-center">
                    <h2 className="text-2xl font-semibold text-white group-hover:text-amber-500">Cliente</h2>
                    <p className="text-neutral-400 mt-2">Explorar películas y comprar</p>
                </Link>
            </div>
        </main>
    );
}