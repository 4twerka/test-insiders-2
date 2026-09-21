import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { adminDb } from "@/lib/firebase/admin";
import { sendExchangeRequestEmail } from "@/lib/email/sendExchangeRequestEmail";
import { now } from "@/lib/time";
import type { Book } from "@/types/book";

export async function POST(request: NextRequest) {
  const sessionUser = await getSessionUser();
  if (!sessionUser) {
    return NextResponse.json({ error: "Потрібно увійти в акаунт" }, { status: 401 });
  }

  const { bookId } = await request.json();
  if (!bookId) {
    return NextResponse.json({ error: "Не вказано книгу" }, { status: 400 });
  }

  const bookSnapshot = await adminDb.collection("books").doc(bookId).get();
  if (!bookSnapshot.exists) {
    return NextResponse.json({ error: "Книгу не знайдено" }, { status: 404 });
  }

  const book = { id: bookSnapshot.id, ...bookSnapshot.data() } as Book;

  if (book.ownerId === sessionUser.uid) {
    return NextResponse.json(
      { error: "Не можна запросити обмін на свою книгу" },
      { status: 400 },
    );
  }

  const existingRequestSnapshot = await adminDb
    .collection("exchangeRequests")
    .where("bookId", "==", book.id)
    .where("requesterId", "==", sessionUser.uid)
    .where("status", "==", "pending")
    .limit(1)
    .get();
  if (!existingRequestSnapshot.empty) {
    return NextResponse.json(
      { error: "Ви вже надсилали запит на обмін цією книгою" },
      { status: 409 },
    );
  }

  const offeredBooksSnapshot = await adminDb
    .collection("books")
    .where("ownerId", "==", sessionUser.uid)
    .get();
  const offeredBooks = offeredBooksSnapshot.docs.map(
    (docSnapshot) => ({ id: docSnapshot.id, ...docSnapshot.data() }) as Book,
  );

  await adminDb.collection("exchangeRequests").add({
    bookId: book.id,
    bookName: book.name,
    bookOwnerId: book.ownerId,
    requesterId: sessionUser.uid,
    requesterName: sessionUser.name,
    requesterEmail: sessionUser.email,
    status: "pending",
    createdAt: now(),
  });

  try {
    await sendExchangeRequestEmail({
      ownerEmail: book.ownerEmail,
      ownerName: book.ownerName,
      requesterName: sessionUser.name,
      requesterEmail: sessionUser.email,
      requestedBook: book,
      offeredBooks,
    });
  } catch {}

  return NextResponse.json({ ok: true });
}
