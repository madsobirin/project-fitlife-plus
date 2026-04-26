import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  try {
    const auth = await getAuthUser(request);
    if (!auth) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // const userId = auth.userId;

    const formData = await request.formData();
    const file = formData.get("photo") as File | null;
    if (!file)
      return NextResponse.json(
        { message: "File tidak ditemukan" },
        { status: 400 },
      );

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { message: "Tipe file tidak didukung" },
        { status: 400 },
      );
    }
    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json(
        { message: "Ukuran file maksimal 2MB" },
        { status: 400 },
      );
    }

    // Convert file ke base64
    const bytes = await file.arrayBuffer();
    const base64 = `data:${file.type};base64,${Buffer.from(bytes).toString("base64")}`;

    // Upload ke Cloudinary
    const result = await cloudinary.uploader.upload(base64, {
      folder: "fitlife/avatars",
      public_id: `avatar_${auth.userId}`, // overwrite foto lama otomatis
      overwrite: true,
      transformation: [
        { width: 400, height: 400, crop: "fill", gravity: "face" }, // crop fokus ke wajah
        { quality: "auto", fetch_format: "auto" }, // compress otomatis
      ],
    });

    const updated = await prisma.account.update({
      where: { id: auth.userId },
      data: { photo: result.secure_url, updated_at: new Date() },
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

    return NextResponse.json(
      { message: "Foto berhasil diupload", user: updated },
      { status: 200 },
    );
  } catch (error) {
    console.error("UPLOAD_ERROR:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
