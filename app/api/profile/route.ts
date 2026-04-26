import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function GET(request: Request) {
  const auth = await getAuthUser(request);
  if (!auth) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.account.findUnique({
    where: { id: auth.userId },
    select: {
      id: true,
      name: true,
      username: true,
      email: true,
      role: true,
      phone: true,
      birthdate: true,
      weight: true,
      height: true,
      photo: true,
      google_avatar: true,
      created_at: true,
      last_login_at: true,
      password: true,
    },
  });

  if (!user) {
    return NextResponse.json(
      { message: "User tidak ditemukan" },
      { status: 404 },
    );
  }

  return NextResponse.json({ user }, { status: 200 });
}

export async function PATCH(request: Request) {
  const auth = await getAuthUser(request);
  if (!auth) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { name, username, phone, birthdate, weight, height } = body;

  if (username) {
    const existing = await prisma.account.findFirst({
      where: { username, NOT: { id: auth.userId } },
    });
    if (existing) {
      return NextResponse.json(
        { message: "Username sudah digunakan" },
        { status: 409 },
      );
    }
  }

  const updated = await prisma.account.update({
    where: { id: auth.userId },
    data: {
      name: name || undefined,
      username: username || undefined,
      phone: phone || undefined,
      birthdate: birthdate ? new Date(birthdate) : undefined,
      weight: weight ? parseInt(weight) : undefined,
      height: height ? parseInt(height) : undefined,
      updated_at: new Date(),
    },
    select: {
      id: true,
      name: true,
      username: true,
      email: true,
      role: true,
      phone: true,
      birthdate: true,
      weight: true,
      height: true,
      photo: true,
      google_avatar: true,
    },
  });

  return NextResponse.json({ message: "Profil diperbarui", user: updated });
}
