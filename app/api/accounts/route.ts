import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get("role") || undefined;

    const accounts = await prisma.account.findMany({
      where: { role },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        photo: true,
        google_avatar: true,
        is_active: true,
        last_login_at: true,
        created_at: true,
      },
      orderBy: { created_at: "desc" },
    });

    return NextResponse.json(accounts);
  } catch {
    return NextResponse.json(
      { message: "Gagal mengambil data" },
      { status: 500 },
    );
  }
}
