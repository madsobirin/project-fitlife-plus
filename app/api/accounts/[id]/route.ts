import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);

    if (isNaN(id)) {
      return NextResponse.json({ message: "ID tidak valid" }, { status: 400 });
    }

    const currentAccount = await prisma.account.findUnique({
      where: { id },
      select: { is_active: true },
    });

    if (!currentAccount) {
      return NextResponse.json(
        { message: "Akun tidak ditemukan" },
        { status: 404 },
      );
    }

    const updatedAccount = await prisma.account.update({
      where: { id },
      data: { is_active: !currentAccount.is_active },
    });

    return NextResponse.json({
      message: `Status berhasil diubah menjadi ${updatedAccount.is_active ? "Aktif" : "Nonaktif"}`,
      is_active: updatedAccount.is_active,
    });
  } catch (error) {
    console.error("PATCH_ACCOUNT_ERROR:", error);
    return NextResponse.json(
      { message: "Gagal mengubah status" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);

    if (isNaN(id)) {
      return NextResponse.json({ message: "ID tidak valid" }, { status: 400 });
    }

    await prisma.account.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Akun berhasil dihapus" });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json(
          { message: "Akun tidak ditemukan" },
          { status: 404 },
        );
      }
    }
    return NextResponse.json(
      { message: "Gagal menghapus akun" },
      { status: 500 },
    );
  }
}
