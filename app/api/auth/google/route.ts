import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { SignJWT } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Support access_token (web) dan id_token (Flutter)
    const accessToken = body.token;
    const idToken = body.id_token;

    let payload: { email: string; name: string; picture: string; sub: string };

    if (accessToken) {
      // Web flow — verify via Google userinfo
      const googleRes = await fetch(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );
      if (!googleRes.ok) {
        return NextResponse.json(
          { message: "Token Google tidak valid" },
          { status: 401 },
        );
      }
      payload = await googleRes.json();
    } else if (idToken) {
      // Flutter flow — verify id_token via tokeninfo
      const verifyRes = await fetch(
        `https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`,
      );
      if (!verifyRes.ok) {
        return NextResponse.json(
          { message: "ID Token tidak valid" },
          { status: 401 },
        );
      }
      const tokenData = await verifyRes.json();
      if (tokenData.error) {
        return NextResponse.json(
          { message: "ID Token tidak valid" },
          { status: 401 },
        );
      }
      payload = {
        email: tokenData.email,
        name: tokenData.name,
        picture: tokenData.picture,
        sub: tokenData.sub,
      };
    } else {
      return NextResponse.json(
        { message: "Token tidak ditemukan" },
        { status: 400 },
      );
    }

    if (!payload?.email) {
      return NextResponse.json(
        { message: "Data user Google tidak valid" },
        { status: 400 },
      );
    }

    const { email, name, picture, sub: googleId } = payload;

    // Cari atau buat user
    let user = await prisma.account.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        google_id: true,
      },
    });

    if (!user) {
      user = await prisma.account.create({
        data: {
          email,
          name,
          google_avatar: picture,
          google_id: googleId,
          password: null,
          is_active: true,
        },
      });
    } else if (!user.google_id) {
      user = await prisma.account.update({
        where: { id: user.id },
        data: { google_id: googleId, google_avatar: picture },
      });
    }

    await prisma.account.update({
      where: { id: user.id },
      data: { last_login_at: new Date() },
    });

    // Buat JWT
    const jwtToken = await new SignJWT({
      userId: user.id,
      role: user.role,
      email: user.email,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(secret);

    // Set cookie untuk web
    const cookieStore = await cookies();
    cookieStore.set("token", jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    cookieStore.delete("userId");
    cookieStore.delete("role");

    return NextResponse.json({
      message: "Login Berhasil",
      token: jwtToken,
      role: user.role,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("GOOGLE_LOGIN_ERROR:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan internal" },
      { status: 500 },
    );
  }
}
