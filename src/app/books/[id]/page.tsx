import { notFound } from "next/navigation";
import { adminDb } from "@/lib/firebase/admin";
import { getSessionUser } from "@/lib/auth/session";
import { ExchangeRequestButton } from "@/components/books/ExchangeRequestButton";
import { DeleteBookButton } from "@/components/books/DeleteBookButton";
import type { Book } from "@/types/book";

export default async function BookDetailPage(props: PageProps<"/books/[id]">) {
  const { id } = await props.params;
  const [snapshot, sessionUser] = await Promise.all([
    adminDb.collection("books").doc(id).get(),
    getSessionUser(),
  ]);

  if (!snapshot.exists) {
    notFound();
  }

  const book = { id: snapshot.id, ...snapshot.data() } as Book;

  return (
    <div className="flex flex-col gap-6 sm:flex-row">
      <div className="h-72 w-48 shrink-0 overflow-hidden rounded-lg bg-black/5 dark:bg-white/10">
        {book.photoUrl && (
          <img src={book.photoUrl} alt={book.name} className="h-full w-full object-cover" />
        )}
      </div>
      <div className="flex flex-col gap-3">
        <h1 className="text-2xl font-semibold">{book.name}</h1>
        <p className="text-black/60 dark:text-white/60">{book.author}</p>
        <p className="text-sm text-black/60 dark:text-white/60">Власник: {book.ownerName}</p>
        <ExchangeRequestButton book={book} />
        {sessionUser?.role === "admin" && <DeleteBookButton bookId={book.id} />}
      </div>
    </div>
  );
}
