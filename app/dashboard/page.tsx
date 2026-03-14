import Link from 'next/link';
import { Film, Ticket, Users, LogOut } from 'lucide-react';

export default async function DashboardPage({ 
	searchParams 
}: { 
	searchParams: Promise<{ role: string }> 
}) {
	const params = await searchParams;
	const role = params.role || 'client';
	const isAdmin = role === 'admin';

	return(
		<div className="min-h-screen bg-neutral-950 text-white flex">
			{/* Sidebar */}
			<aside className="w-64 border-r border-neutral-800 p-6 flex flex-col justify-between">
				<div>
					<h2 className="text-amber-500 font-bold text-2xl mb-10 tracking-tighter">CINEUAM</h2>
					<nav className="space-y-6">
						<Link href={`/dashboard/movies?role=${role}`} className="flex items-center gap-3 text-neutral-400 hover:text-amber-500 transition-colors">
						<Film size={20} /> Cartelera
						</Link>
					</nav>
				</div>
				<Link href="/" className="flex items-center gap-3 text-red-500 hover:text-red-400 text-sm font-medium">
				<LogOut size={18} /> Cerrar Sesión
				</Link>
			</aside>

			<main className="flex-1 p-10">
				<header className="mb-12">
					<h1 className="text-4xl font-bold italic uppercase tracking-tight">
						{isAdmin ? 'Panel de Administración' : 'Portal de Cliente'}
					</h1>
					<p className="text-neutral-500 mt-2">
						Sesión iniciada como: <span className="text-amber-500 font-semibold uppercase">{role}</span>
					</p>
				</header>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<Link href={`/dashboard/movies?role=${role}`} className="bg-neutral-900 border border-neutral-800 p-8 rounded-3xl hover:border-amber-500 transition-all group relative">
						<h3 className="text-xl font-bold">{isAdmin ? 'Gestión de Películas' : 'Ver Cartelera'}</h3>
						<p className="text-neutral-500 mt-2">{isAdmin ? 'Registra títulos y edita.' : 'Explora estrenos.'}</p>
					</Link>
				</div>
			</main>
		</div>
	);
}