import Link from 'next/link';
import { Film, Monitor } from 'lucide-react';

export default function DashboardPage() {
	return (
		<div className="p-8">
			<h1 className="text-3xl font-bold mb-8 text-white italic">PANEL DE ADMINISTRACIÓN</h1>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{/* TARJETA DE TU COMPAÑERO */}
				<Link href="/dashboard/movies" className="bg-neutral-900 border border-neutral-800 p-8 rounded-2xl hover:border-amber-500 transition-all group">
					<Film className="text-amber-500 mb-4 group-hover:scale-110 transition-transform" size={40} />
					<h2 className="text-2xl font-bold text-white">Gestión de Películas</h2>
					<p className="text-neutral-400 mt-2">Registra títulos, duraciones y sinopsis.</p>
				</Link>

				{/* TU TARJETA (HU-02) */}
				<Link href="/dashboard/salas" className="bg-neutral-900 border border-neutral-800 p-8 rounded-2xl hover:border-amber-500 transition-all group">
					<Monitor className="text-amber-500 mb-4 group-hover:scale-110 transition-transform" size={40} />
					<h2 className="text-2xl font-bold text-white">Gestión de Salas</h2>
					<p className="text-neutral-400 mt-2">Configura identificadores, tipos y capacidad total.</p>
				</Link>

				{/* TU TARJETA (HU-03) */}
				<Link href="/dashboard/asientos" className="bg-neutral-900 border border-neutral-800 p-8 rounded-2xl hover:border-amber-500 transition-all group">
					<Monitor className="text-amber-500 mb-4 group-hover:scale-110 transition-transform" size={40} />
					<h2 className="text-2xl font-bold text-white">Gestión de Asientos</h2>
					<p className="text-neutral-400 mt-2">Registrar mapeo de asientos</p>
				</Link>
			</div>
		</div>
	);
}