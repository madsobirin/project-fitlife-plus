import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ArtikelSchema } from "@/lib/definition";
import { Prisma } from "@/generated/prisma/client";
import { getAuthUser } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const kategori = searchParams.get("kategori");
    const featured = searchParams.get("featured") === "true";
    const id = searchParams.get("id") || undefined;
    const slug = searchParams.get("slug") || undefined;

    // Pagination — opsional
    const pageParam = searchParams.get("page");
    const limitParam = searchParams.get("limit");
    const isPaginated = pageParam !== null || limitParam !== null;
    const page = parseInt(pageParam || "1");
    const limit = parseInt(limitParam || "10");
    const offset = (page - 1) * limit;

    const idParsed = id ? parseInt(id) : undefined;
    const finalId = idParsed && !isNaN(idParsed) ? idParsed : undefined;

    const where = {
      id: finalId,
      slug: slug || undefined,
      kategori: kategori || undefined,
      is_featured: searchParams.has("featured") ? featured : undefined,
    };

    if (isPaginated) {
      const [artikels, total] = await Promise.all([
        prisma.artikel.findMany({
          where,
          orderBy: { created_at: "desc" },
          skip: offset,
          take: limit,
        }),
        prisma.artikel.count({ where }),
      ]);

      return NextResponse.json({
        data: artikels,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
          hasNextPage: page * limit < total,
          hasPrevPage: page > 1,
        },
      });
    }

    // Tanpa pagination — backward compatible
    const artikels = await prisma.artikel.findMany({
      where,
      orderBy: { created_at: "desc" },
    });

    return NextResponse.json(artikels);
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
      { message: "Gagal mengambil artikel" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const auth = await getAuthUser(request);
    if (!auth)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    if (auth.role !== "admin")
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    const body = await request.json();
    const validated = ArtikelSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { errors: validated.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const slug = validated.data.judul
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");

    const newArtikel = await prisma.artikel.create({
      data: {
        ...validated.data,
        slug: `${slug}-${Date.now()}`,
      },
    });

    return NextResponse.json(newArtikel, { status: 201 });
  } catch (error: unknown) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return NextResponse.json(
        { message: "Gagal membuat artikel." },
        { status: 404 },
      );
    }
    return NextResponse.json(
      { message: "Gagal membuat artikel" },
      { status: 500 },
    );
  }
}
