import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { google } from "@/utils/arctic";
import { prisma } from "@/utils/prisma";

export async function GET(request) {
  const query = request.nextUrl.searchParams;
  const code = query.get("code");

  const cookieStore = await cookies();
  // get codeVerifier
  const codeVerifier = cookieStore.get("codeVerifier")?.value;

  // validate tokens
  const tokens = await google.validateAuthorizationCode(code, codeVerifier);
  const accessToken = tokens.accessToken();

  const response = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const data = await response.json();

  const existingUser = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (!existingUser) {
    // create newUser
    const newUser = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
      },
    });

    // create newSession
    const newSession = await prisma.session.create({
      data: {
        userId: newUser.id,
        expiredAt: new Date(Date.now() + 60 * 60 * 1000), // 60 menit
      },
    });

    // set CookieStore

    cookieStore.set("sessionId", newSession.id, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      expires: newSession.expiredAt,
    });

    redirect("/dashboard");
  }

  const newSession = await prisma.session.create({
    data: {
      userId: existingUser.id,
      expiredAt: new Date(Date.now() + 60 * 60 * 1000), // 60 menit
    },
  });

  // set CookieStore

  cookieStore.set("sessionId", newSession.id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    expires: newSession.expiredAt,
  });

  redirect("/dashboard");
}
