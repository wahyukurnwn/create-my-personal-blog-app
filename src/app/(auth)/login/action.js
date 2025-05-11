"use server";

import { prisma } from "@/utils/prisma";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function doLoginAction(_, formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  // check all fields must required
  if (!email || !password) {
    return {
      status: false,
      message: "All fields must be required!",
    };
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  // isUserFound?
  if (!existingUser) {
    return {
      status: false,
      message: "User not be found!!",
    };
  }

  const validatedPassword = await bcrypt.compare(password, existingUser.password);

  // isValidPassword?
  if (!validatedPassword) {
    return {
      status: false,
      message: "Invalid Password!!",
    };
  }

  // create session
  const session = await prisma.session.create({
    data: {
      userId: existingUser.id,
      expiredAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
    },
  });

  // set cookies
  const cookieStore = await cookies();
  cookieStore.set("sessionId", session.id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    expires: session.expiredAt,
  });

  redirect("/dashboard");
}
