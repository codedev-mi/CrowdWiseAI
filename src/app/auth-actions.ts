"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const AUTH_EMAIL = process.env.AUTH_EMAIL;
const AUTH_PASSWORD = process.env.AUTH_PASSWORD;

export async function login(formData: FormData) {
  const email = (formData.get("email") as string)?.trim();
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  if (!AUTH_EMAIL || !AUTH_PASSWORD) {
    return {
      error: "Authentication is not configured. Set AUTH_EMAIL and AUTH_PASSWORD in your environment.",
    };
  }

  if (email !== AUTH_EMAIL || password !== AUTH_PASSWORD) {
    return { error: "Invalid email or password." };
  }

  const cookieStore = await cookies();
  const userData = { email, name: email.split("@")[0] };
  cookieStore.set("session", JSON.stringify(userData), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: "/",
  });
  return { success: true };
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
  redirect("/login");
}
