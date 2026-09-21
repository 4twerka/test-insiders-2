import "server-only";
import { cookies } from "next/headers";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { SESSION_COOKIE_NAME } from "@/lib/auth/constants";
import type { UserProfile } from "@/types/user";

export async function getSessionUser(): Promise<UserProfile | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!sessionCookie) return null;

  try {
    const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);
    const snapshot = await adminDb.collection("users").doc(decoded.uid).get();
    return snapshot.exists ? (snapshot.data() as UserProfile) : null;
  } catch {
    return null;
  }
}

export async function requireAdmin(): Promise<UserProfile | null> {
  const user = await getSessionUser();
  return user?.role === "admin" ? user : null;
}
