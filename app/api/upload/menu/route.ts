import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { getAuthUser } from "@/lib/auth";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  try {
    const auth = await getAuthUser(request);
    if (!auth)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "fitlife/menus";

    if (!file)
      return NextResponse.json(
        { message: "File tidak ditemukan" },
        { status: 400 },
      );

    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowed.includes(file.type))
      return NextResponse.json(
        { message: "Tipe file tidak didukung" },
        { status: 400 },
      );
    if (file.size > 3 * 1024 * 1024)
      return NextResponse.json(
        { message: "Ukuran file maksimal 3MB" },
        { status: 400 },
      );

    const bytes = await file.arrayBuffer();
    const base64 = `data:${file.type};base64,${Buffer.from(bytes).toString("base64")}`;

    const result = await cloudinary.uploader.upload(base64, {
      folder,
      transformation: [
        { width: 800, height: 600, crop: "fill" },
        { quality: "auto", fetch_format: "auto" },
      ],
    });

    return NextResponse.json({ url: result.secure_url }, { status: 200 });
  } catch (error) {
    console.error("MENU_UPLOAD_ERROR:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
