import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookieStore = await cookies();

    cookieStore.delete("token");
    cookieStore.delete("userId");
    cookieStore.delete("role");

    return NextResponse.json({ message: "Logout berhasil" }, { status: 200 });
  } catch (error) {
    console.error("LOGOUT_ERROR:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
