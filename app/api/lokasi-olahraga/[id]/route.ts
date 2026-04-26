import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { z } from "zod";

const LokasiSchema = z.object({
  name: z.string().min(3).max(200).trim(),
  address: z.string().max(500).trim().optional().nullable(),
  latitude: z.number().min(-90).max(90).optional().nullable(),
  longitude: z.number().min(-180).max(180).optional().nullable(),
});

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await getAuthUser(request);
    if (!auth || auth.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const locationId = parseInt(id, 10);
    if (isNaN(locationId)) {
      return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
    }

    const body = await request.json();
    const validated = LokasiSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        { errors: validated.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const updated = await prisma.lokasiOlahraga.update({
      where: { id: locationId },
      data: validated.data,
    });

    return NextResponse.json(
      { message: "Lokasi berhasil diperbarui", data: updated },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error("PUT_LOKASI_ERROR:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan pada server" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await getAuthUser(request);
    if (!auth || auth.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const locationId = parseInt(id, 10);
    if (isNaN(locationId)) {
      return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
    }

    await prisma.lokasiOlahraga.delete({ where: { id: locationId } });

    return NextResponse.json(
      { message: "Lokasi berhasil dihapus" },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error("DELETE_LOKASI_ERROR:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan pada server" },
      { status: 500 },
    );
  }
}
