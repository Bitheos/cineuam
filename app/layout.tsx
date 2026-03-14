import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Cine Prestige - Gestión de Cartelera",
	description: "Sistema de gestión cinematográfica profesional",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="es">
			<body className={`${inter.className} bg-neutral-950 text-neutral-100 antialiased`}>
				{children}
			</body>
		</html>
	);
}