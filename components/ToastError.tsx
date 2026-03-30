"use client";
import { useEffect } from "react";
import { AlertCircle } from "lucide-react";

interface ToastProps {
    message: string;
    action?: () => void; // Prop opcional
}

export default function ToastError({ message, action }: ToastProps) {
    useEffect(() => {
        if (!action) return;
        const timer = setTimeout(() => {
            action();
        }, 5000);
        return () => clearTimeout(timer);
    }, [action]);

    return (
        <div className="relative bg-red-950/30 border border-red-500/50 text-red-500 p-4 rounded-xl mb-6 overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="flex items-center gap-3">
                <AlertCircle size={20} className="shrink-0" />
                <span className="font-medium text-sm">{message}</span>
            </div>
            <div
                className="absolute bottom-0 left-0 h-[3px] bg-red-500"
                style={{ animation: 'shrinkBar 5s linear forwards' }}
            />
            <style jsx>{`
                @keyframes shrinkBar {
                    from { width: 100%; }
                    to { width: 0%; }
                }
            `}</style>
        </div>
    );
}