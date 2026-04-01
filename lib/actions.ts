"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// --- GESTIÓN DE SALAS ---
export async function getSalas() {
  try {
    return await prisma.sala.findMany({
      orderBy: { nombre: 'asc' }
    });
  } catch (error) {
    console.error("Error al obtener salas:", error);
    return [];
  }
}

export async function createSala(prevState: any, formData: FormData) {
  const nombre = formData.get("nombre") as string;
  const tipo = formData.get("tipo") as string;
  const capacidad = parseInt(formData.get("capacidad") as string);
  try {
    await prisma.sala.create({ data: { nombre, tipo, capacidad } });
    revalidatePath("/dashboard/salas");
    return { message: "success" };
  } catch (e) {
    return { message: "error", error: "Error al crear sala" };
  }
}

// --- GESTIÓN DE PELÍCULAS ---
export async function createMovie(prevState: any, formData: FormData) {
  try {
    await prisma.movie.create({
      data: {
        title: formData.get("title") as string,
        duration: parseInt(formData.get("duration") as string),
        classification: formData.get("classification") as string,
        synopsis: formData.get("synopsis") as string,
      }
    });
    revalidatePath("/dashboard/movies");
    return { message: "success" };
  } catch (e) {
    return { message: "error", error: "Error al crear la película" };
  }
}

// --- GESTIÓN DE HORARIOS CORREGIDA ---
export async function createSchedule(prevState: any, formData: FormData) {
  // Convertimos a Number para solucionar el error TS2322
  const movieId = Number(formData.get("movieId"));
  const salaId = Number(formData.get("salaId"));
  const startTime = new Date(formData.get("startTime") as string);
  const ahora = new Date(); // Fecha y hora actual

  // CRITERIO DE ACEPTACIÓN: Verificar que la hora no haya pasado
  if (startTime < ahora) {
    return { 
      message: "error", 
      error: "No se puede asignar una función a una hora que ya pasó. Por favor, elige un horario futuro." 
    };
  }

  try {
    // 1. Buscamos la película
    const movie = await prisma.movie.findUnique({
      where: { id: movieId }, // Ahora sí es un número
      select: { duration: true }
    });

    if (!movie) {
      return { message: "error", error: "La película seleccionada no existe." };
    }

    // 2. Cálculo automático del fin (Inicio + Duración)
    const endTime = new Date(startTime.getTime() + movie.duration * 60000);

    // 3. Guardado en base de datos
    await prisma.schedule.create({
      data: {
        movieId: movieId, // Soluciona el error de la línea 73
        salaId: salaId,   // Soluciona el error de la línea 74
        startTime: startTime,
        endTime: endTime,
      },
    });

    revalidatePath("/dashboard/schedules");
    return { message: "success" };
  } catch (error) {
    console.error("Error al crear horario:", error);
    return { message: "error", error: "No se pudo crear el horario." };
  }
}
// --- COMPRA DE TICKETS ---
export async function getOccupiedSeats(scheduleId: string) {
  if (!scheduleId) return [];
  try {
    const tickets = await prisma.ticket.findMany({
      where: { scheduleId: scheduleId },
      select: { seatNumber: true } // Usamos seatNumber para evitar errores
    });
    return tickets.map(t => t.seatNumber);
  } catch (error) {
    return [];
  }
}

export async function createTicket(prevState: any, formData: FormData) {
  const scheduleId = formData.get("scheduleId") as string;
  const seatsJson = formData.get("seats") as string;

  if (!scheduleId || !seatsJson) {
    return { message: "error", error: "Faltan datos de selección." };
  }

  try {
    const selectedSeats = JSON.parse(seatsJson);

    if (selectedSeats.length === 0) {
      return { message: "error", error: "No has seleccionado ningún asiento." };
    }

    await prisma.$transaction(
        selectedSeats.map((seat: string) =>
            prisma.ticket.create({
              data: {
                scheduleId: scheduleId,
                seatNumber: seat // Mantenemos seatNumber por tu esquema
              }
            })
        )
    );

    revalidatePath("/dashboard/compra");
    return { message: "success" };
  } catch (error: any) {
    console.error(error);
    if (error.code === 'P2002') {
      return { message: "error", error: "Uno de los asientos ya fue ocupado." };
    }
    return { message: "error", error: "Error al procesar la reserva." };
  }
}