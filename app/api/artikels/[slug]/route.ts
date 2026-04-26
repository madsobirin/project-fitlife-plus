import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ArtikelSchema } from "@/lib/definition";
import { Prisma } from "@/generated/prisma/client";
import { getAuthUser } from "@/lib/auth";

// GET by slug — auto increment dibaca
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;

    const artikel = await prisma.artikel.findUnique({
      where: { slug },
    });

    if (!artikel) {
      return NextResponse.json(
        { message: "Artikel tidak ditemukan" },
        { status: 404 },
      );
    }

    // Increment dibaca
    const updated = await prisma.artikel.update({
      where: { slug },
      data: { dibaca: { increment: 1 } },
    });

    return NextResponse.json(updated);
  } catch (error: unknown) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return NextResponse.json(
        { message: "Artikel tidak ditemukan." },
        { status: 404 },
      );
    }
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

// PUT by slug
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
    const validated = ArtikelSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { errors: validated.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const updated = await prisma.artikel.update({
      where: { slug },
      data: validated.data,
    });

    return NextResponse.json(updated);
  } catch (error: unknown) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return NextResponse.json(
        { message: "Artikel tidak ditemukan." },
        { status: 404 },
      );
    }
    return NextResponse.json(
      { message: "Gagal update artikel" },
      { status: 500 },
    );
  }
}

// DELETE by slug
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

    await prisma.artikel.delete({ where: { slug } });

    return NextResponse.json({ message: "Artikel berhasil dihapus" });
  } catch (error: unknown) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return NextResponse.json(
        { message: "Artikel tidak ditemukan." },
        { status: 404 },
      );
    }
    return NextResponse.json(
      { message: "Gagal menghapus artikel" },
      { status: 500 },
    );
  }
}
