import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import { MenuSchema } from "@/lib/definition";
import { getAuthUser } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;

    const menu = await prisma.menu.findUnique({
      where: { slug },
    });

    if (!menu) {
      return NextResponse.json(
        { message: "Menu tidak ditemukan" },
        { status: 404 },
      );
    }

    // Increment dibaca
    const updated = await prisma.menu.update({
      where: { slug },
      data: { dibaca: { increment: 1 } },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("GET_MENU_ERROR:", err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const auth = await getAuthUser(request);
    if (!auth)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    if (auth.role !== "admin")
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    const { slug } = await params;

    const body = await request.json();
    const validatedFields = MenuSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json(
        { errors: validatedFields.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    // Regenerate slug kalau nama_menu berubah
    const newSlug =
      validatedFields.data.nama_menu
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "") + `-${Date.now()}`;

    const updatedMenu = await prisma.menu.update({
      where: { slug },
      data: {
        ...validatedFields.data,
        slug: newSlug,
      },
    });

    return NextResponse.json({
      message: "Berhasil diperbarui",
      data: updatedMenu,
    });
  } catch (error: unknown) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return NextResponse.json(
        { message: "Menu tidak ditemukan" },
        { status: 404 },
      );
    }
    return NextResponse.json(
      { message: "Gagal memperbarui menu" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const auth = await getAuthUser(request);
    if (!auth)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    if (auth.role !== "admin")
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    const { slug } = await params;

    await prisma.menu.delete({ where: { slug } });

    return NextResponse.json({ message: "Menu berhasil dihapus" });
  } catch (error: unknown) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return NextResponse.json(
        { message: "Menu sudah tidak ada" },
        { status: 404 },
      );
    }
    return NextResponse.json(
      { message: "Gagal menghapus menu" },
      { status: 500 },
    );
  }
}
