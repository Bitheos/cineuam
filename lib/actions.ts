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