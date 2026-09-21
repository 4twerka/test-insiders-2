import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { now } from "@/lib/time";
import { adminCreateUserSchema } from "@/lib/validation/schemas";

export async function POST(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Доступ заборонено" }, { status: 403 });
  }

  const body = await request.json();
  const parsed = adminCreateUserSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Некоректні дані" }, { status: 400 });
  }

  const { name, email, password, role } = parsed.data;

  try {
    const userRecord = await adminAuth.createUser({ email, password, displayName: name });
    const user = { uid: userRecord.uid, name, email, role, createdAt: now() };
    await adminDb.collection("users").doc(userRecord.uid).set(user);
    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ error: "Не вдалося створити користувача" }, { status: 400 });
  }
}
