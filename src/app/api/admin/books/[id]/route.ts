import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { adminDb } from "@/lib/firebase/admin";

export async function DELETE(_request: NextRequest, ctx: RouteContext<"/api/admin/books/[id]">) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Доступ заборонено" }, { status: 403 });
  }

  const { id } = await ctx.params;
  await adminDb.collection("books").doc(id).delete();
  return NextResponse.json({ ok: true });
}
