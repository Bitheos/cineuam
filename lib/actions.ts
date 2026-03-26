"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// --- ACCIÓN PARA REGISTRAR PELÍCULAS ---
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
    return { message: "success" };
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { message: "error", error: "¡Esta película ya está registrada!" };
    }
    return { message: "error", error: "Hubo un problema al guardar." };
  }
}

// --- ACCIÓN PARA REGISTRAR SALAS ---
export async function createSala(prevState: any, formData: FormData) {
  const nombre = formData.get("nombre") as string;
  const tipo = formData.get("tipo") as string;
  const capacidad = parseInt(formData.get("capacidad") as string);

  if (!nombre || !tipo || isNaN(capacidad)) {
    return { message: "error", error: "Todos los campos son obligatorios." };
  }

  try {
    await prisma.sala.create({
      data: { nombre, tipo, capacidad },
    });
    revalidatePath("/dashboard/salas");
    return { message: "success" };
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { message: "error", error: "¡El identificador de la sala ya existe!" };
    }
    return { message: "error", error: "Error al registrar la sala." };
  }
}

// --- NUEVA ACCIÓN: GESTOR DE HORARIOS ---
export async function createSchedule(prevState: any, formData: FormData) {
  const movieId = parseInt(formData.get("movieId") as string);
  const salaId = parseInt(formData.get("salaId") as string);
  const startTimeStr = formData.get("startTime") as string;
  const repetitions = parseInt(formData.get("repetitions") as string) || 1;

  try {
    const movie = await prisma.movie.findUnique({ where: { id: movieId } });
    if (!movie) return { message: "error", error: "Película no encontrada." };

    let currentStart = new Date(startTimeStr);
    const newSchedules = [];

    for (let i = 0; i < repetitions; i++) {
      const currentEnd = new Date(currentStart.getTime() + (movie.duration + 20) * 60000);

      // Verificar conflictos para CADA repetición
      const conflict = await prisma.schedule.findFirst({
        where: {
          salaId,
          AND: [
            { startTime: { lt: currentEnd } },
            { endTime: { gt: currentStart } }
          ]
        }
      });

      if (conflict) {
        return { 
          message: "error", 
          error: `Conflicto en la función #${i + 1}. La sala se ocupa a las ${conflict.startTime.toLocaleTimeString()}.` 
        };
      }

      newSchedules.push({
        movieId,
        salaId,
        startTime: new Date(currentStart),
        endTime: currentEnd,
      });

      // La siguiente función empieza justo cuando termina la anterior (que ya incluye limpieza)
      currentStart = new Date(currentEnd);
    }

    // Insertar todos de golpe
    await prisma.schedule.createMany({ data: newSchedules });

    revalidatePath("/dashboard/schedules");
    return { message: "success" };
  } catch (error) {
    return { message: "error", error: "Error al generar la programación." };
  }
}

export async function getSalas() {
  try {
    return await prisma.sala.findMany({
      orderBy: { nombre: 'asc' },
    });
  } catch (error) {
    return [];
  }
}