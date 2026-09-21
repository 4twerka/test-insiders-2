import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { adminDb } from "@/lib/firebase/admin";
import { sendExchangeResponseEmail } from "@/lib/email/sendExchangeResponseEmail";
import type { Book } from "@/types/book";
import type { ExchangeRequest } from "@/types/exchangeRequest";

export async function PATCH(
  request: NextRequest,
  ctx: RouteContext<"/api/exchange-request/[id]">,
) {
  const sessionUser = await getSessionUser();
  if (!sessionUser) {
    return NextResponse.json({ error: "Потрібно увійти в акаунт" }, { status: 401 });
  }

  const { status } = await request.json();
  if (status !== "accepted" && status !== "declined") {
    return NextResponse.json({ error: "Некоректний статус" }, { status: 400 });
  }

  const { id } = await ctx.params;
  const requestRef = adminDb.collection("exchangeRequests").doc(id);
  const snapshot = await requestRef.get();
  if (!snapshot.exists) {
    return NextResponse.json({ error: "Запит не знайдено" }, { status: 404 });
  }

  const exchangeRequest = {
    status: "pending",
    id: snapshot.id,
    ...snapshot.data(),
  } as ExchangeRequest;

  if (exchangeRequest.bookOwnerId !== sessionUser.uid) {
    return NextResponse.json({ error: "Доступ заборонено" }, { status: 403 });
  }

  if (exchangeRequest.status !== "pending") {
    return NextResponse.json({ error: "Запит уже опрацьовано" }, { status: 400 });
  }

  if (status === "accepted") {
    const bookRef = adminDb.collection("books").doc(exchangeRequest.bookId);
    const bookSnapshot = await bookRef.get();
    if (!bookSnapshot.exists) {
      return NextResponse.json({ error: "Книгу вже видалено" }, { status: 409 });
    }

    const book = bookSnapshot.data() as Book;
    if (book.ownerId !== sessionUser.uid) {
      return NextResponse.json(
        { error: "Ви більше не власник цієї книги — її вже передано за іншим запитом" },
        { status: 409 },
      );
    }

    const batch = adminDb.batch();
    batch.update(requestRef, { status });
    batch.update(bookRef, {
      ownerId: exchangeRequest.requesterId,
      ownerName: exchangeRequest.requesterName,
      ownerEmail: exchangeRequest.requesterEmail,
    });
    await batch.commit();
  } else {
    await requestRef.update({ status });
  }

  try {
    await sendExchangeResponseEmail({
      requesterEmail: exchangeRequest.requesterEmail,
      requesterName: exchangeRequest.requesterName,
      bookName: exchangeRequest.bookName,
      ownerName: sessionUser.name,
      ownerEmail: sessionUser.email,
      status,
    });
  } catch {}

  return NextResponse.json({ ok: true });
}
