"use server"
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createMovie(prevState: any, formData: FormData) {
  const title = formData.get("title") as string;
  const duration = parseInt(formData.get("duration") as string);
  const classification = formData.get("classification") as string;
  const synopsis = formData.get("synopsis") as string;

  try {
    await prisma.movie.create({
      data: { title, duration, classification, synopsis },
    });
    revalidatePath("/dashboard/movies");
    return { message: "success" }; // Éxito
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { message: "error", error: "¡Esta película ya está registrada!" };
    }
    return { message: "error", error: "Hubo un problema al guardar." };
  }
}
// --- ACCIÓN PARA REGISTRAR SALAS (HU-02) ---

export async function createSala(prevState: any, formData: FormData) {
  const nombre = formData.get("nombre") as string;
  const tipo = formData.get("tipo") as string;
  const capacidad = parseInt(formData.get("capacidad") as string);

  // Validación básica del lado del servidor
  if (!nombre || !tipo || isNaN(capacidad)) {
    return { message: "error", error: "Todos los campos son obligatorios." };
  }

  try {
    await prisma.sala.create({
      data: {
        nombre,
        tipo,
        capacidad
      },
    });

    // Revalidamos la ruta donde se listan las salas para que aparezca la nueva
    revalidatePath("/dashboard/salas");

    return { message: "success" };
  } catch (error: any) {
    // P2002 es el código de error de Prisma para violación de restricción única (@unique)
    if (error.code === 'P2002') {
      return { message: "error", error: "¡El identificador de la sala ya existe!" };
    }
    return { message: "error", error: "Error al registrar la sala. Inténtalo de nuevo." };
  }
}
export async function getSalas() {
  try {
    return await prisma.sala.findMany({
      orderBy: { nombre: 'asc' }, // Las ordena por nombre de la A a la Z
    });
  } catch (error) {
    return [];
  }
}