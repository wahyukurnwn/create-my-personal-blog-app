"use server";
import * as arctic from "arctic";

import { google } from "@/utils/arctic";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function continueWithGoogle(_, formData) {
  const cookieStore = await cookies();
  const state = arctic.generateState(); // generate state
  const codeVerifier = arctic.generateCodeVerifier(); // generateCodeVerifier
  const scopes = ["openid", "profile", "email"];

  cookieStore.set("codeVerifier", codeVerifier, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
  const url = google.createAuthorizationURL(state, codeVerifier, scopes);

  redirect(url.href);
}
