import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { adminAuth, adminDb } from "@/lib/firebase/admin";

export async function PATCH(request: NextRequest, ctx: RouteContext<"/api/admin/users/[uid]">) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Доступ заборонено" }, { status: 403 });
  }

  const { uid } = await ctx.params;
  if (uid === admin.uid) {
    return NextResponse.json({ error: "Не можна змінити свою роль" }, { status: 400 });
  }

  const body = await request.json();
  const updates: Record<string, string> = {};
  if (body.role === "user" || body.role === "admin") updates.role = body.role;
  if (typeof body.name === "string" && body.name.trim()) updates.name = body.name.trim();

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "Немає що оновлювати" }, { status: 400 });
  }

  await adminDb.collection("users").doc(uid).update(updates);
  return NextResponse.json({ ok: true });
}

export async function DELETE(_request: NextRequest, ctx: RouteContext<"/api/admin/users/[uid]">) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Доступ заборонено" }, { status: 403 });
  }

  const { uid } = await ctx.params;
  if (uid === admin.uid) {
    return NextResponse.json({ error: "Не можна видалити свій акаунт" }, { status: 400 });
  }

  await adminAuth.deleteUser(uid).catch(() => null);
  await adminDb.collection("users").doc(uid).delete();
  return NextResponse.json({ ok: true });
}
