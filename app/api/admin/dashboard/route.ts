import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [
      totalPengguna,
      penggunaAktif,
      totalMenu,
      totalArtikel,
      menuTerbaru,
      penggunaTerbaru,
    ] = await Promise.all([
      prisma.account.count({ where: { role: "user" } }),
      prisma.account.count({ where: { role: "user", is_active: true } }),
      prisma.menu.count(),
      prisma.artikel.count(),
      prisma.menu.findMany({
        orderBy: { dibaca: "desc" },
        take: 5,
        select: { id: true, nama_menu: true, dibaca: true },
      }),
      prisma.account.findMany({
        where: { role: "user" },
        orderBy: { created_at: "desc" },
        take: 5,
        select: {
          id: true,
          name: true,
          email: true,
          is_active: true,
          last_login_at: true,
        },
      }),
    ]);

    return NextResponse.json({
      stats: {
        totalPengguna,
        penggunaAktif,
        totalMenu,
        totalArtikel,
      },
      menuTerbaru,
      penggunaTerbaru,
    });
  } catch (error) {
    console.error("DASHBOARD_ERROR:", error);
    return NextResponse.json(
      { message: "Gagal mengambil data dashboard" },
      { status: 500 },
    );
  }
}
