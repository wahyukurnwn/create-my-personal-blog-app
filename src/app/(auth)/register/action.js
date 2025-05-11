"use server";

import { prisma } from "@/utils/prisma";
import bcrypt from "bcrypt";

export default async function doRegisterAction(_, formData) {
  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");

  // check all fields must be filled!
  if (!name || !email || !password) {
    return {
      status: false,
      message: "All fields must be required!!",
    };
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  // check email has been registered?
  if (existingUser) {
    return {
      status: false,
      message: "Email has been used!!",
    };
  }

  // check length password
  if (password.length < 8) {
    return {
      status: false,
      message: "Password must be at least 8 characters!!",
    };
  }

  // hashedPassword
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create new user
  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  return {
    status: true,
    message: "Registered Successfully!!",
  };
}
