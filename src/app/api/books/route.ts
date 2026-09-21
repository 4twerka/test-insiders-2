import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import type { Book } from "@/types/book";

const DEFAULT_PAGE_SIZE = 8;
const MAX_PAGE_SIZE = 50;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const q = searchParams.get("q")?.trim().toLowerCase() ?? "";
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const pageSize = Math.min(
    MAX_PAGE_SIZE,
    Math.max(1, Number(searchParams.get("pageSize")) || DEFAULT_PAGE_SIZE),
  );

  const snapshot = await adminDb.collection("books").orderBy("nameLower").get();
  const allBooks = snapshot.docs.map(
    (docSnapshot) => ({ id: docSnapshot.id, ...docSnapshot.data() }) as Book,
  );

  const filtered = q
    ? allBooks.filter((book) => book.nameLower.includes(q) || book.authorLower.includes(q))
    : allBooks;

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = (page - 1) * pageSize;
  const items = filtered.slice(start, start + pageSize);

  return NextResponse.json({ items, page, pageSize, total, totalPages });
}
