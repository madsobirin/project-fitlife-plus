import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function PATCH(request: Request) {
  try {
    const auth = await getAuthUser(request);
    if (!auth) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { message: "Password lama dan baru wajib diisi" },
        { status: 400 },
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { message: "Password baru minimal 8 karakter" },
        { status: 400 },
      );
    }

    const user = await prisma.account.findUnique({
      where: { id: auth.userId },
      select: { id: true, password: true },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User tidak ditemukan" },
        { status: 404 },
      );
    }

    // User Google login tidak punya password
    if (!user.password) {
      return NextResponse.json(
        { message: "Akun Google tidak bisa mengubah password" },
        { status: 400 },
      );
    }

    // Verifikasi password lama
    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      return NextResponse.json(
        { message: "Password saat ini tidak sesuai" },
        { status: 400 },
      );
    }

    // Hash password baru
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await prisma.account.update({
      where: { id: auth.userId },
      data: { password: hashedPassword },
    });

    return NextResponse.json({ message: "Password berhasil diubah" });
  } catch (error) {
    console.error("CHANGE_PASSWORD_ERROR:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
