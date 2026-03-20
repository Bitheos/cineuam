import { getSalas } from "@/lib/actions";
import { Monitor, Users, Layers } from "lucide-react";

export default async function SalasTable() {
    const salas = await getSalas();

    return (
        <div className="bg-neutral-900 p-6 rounded-2xl border border-neutral-800 overflow-hidden">
        <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-white">
        <Layers size={20} className="text-amber-500" /> Salas Registradas
    </h3>

    {salas.length === 0 ? (
        <p className="text-neutral-500 italic text-center py-10">No hay salas registradas aún.</p>
    ) : (
        <div className="space-y-4">
            {salas.map((sala) => (
                    <div key={sala.id} className="flex items-center justify-between p-4 bg-neutral-800/50 rounded-xl border border-neutral-700/50 hover:border-amber-500/30 transition-all">
                <div className="flex items-center gap-4">
                <div className="p-3 bg-amber-500/10 rounded-lg">
                <Monitor size={20} className="text-amber-500" />
                </div>
                <div>
                <h4 className="font-bold text-white">{sala.nombre}</h4>
                    <span className="text-xs text-neutral-400 uppercase tracking-wider">{sala.tipo}</span>
                    </div>
                    </div>
                    <div className="flex items-center gap-2 text-neutral-300 bg-neutral-900 px-3 py-1 rounded-full border border-neutral-700">
                <Users size={14} className="text-amber-500" />
                <span className="text-sm font-medium">{sala.capacidad}</span>
                    </div>
                    </div>
    ))}
        </div>
    )}
    </div>
);
}