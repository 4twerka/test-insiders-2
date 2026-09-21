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
    <div className="flex flex-col gap-8 rounded-2xl border border-line bg-surface p-6 shadow-sm sm:flex-row sm:p-8">
      <div className="aspect-[2/3] w-full max-w-[220px] shrink-0 overflow-hidden rounded-xl bg-surface-muted shadow-md">
        {book.photoUrl && (
          <img src={book.photoUrl} alt={book.name} className="h-full w-full object-cover" />
        )}
      </div>
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">{book.name}</h1>
          <p className="mt-1 text-lg text-foreground/60">{book.author}</p>
        </div>
        <p className="text-sm text-foreground/50">Власник: {book.ownerName}</p>
        <div className="flex flex-col gap-3">
          <ExchangeRequestButton book={book} />
          {sessionUser?.role === "admin" && <DeleteBookButton bookId={book.id} />}
        </div>
      </div>
    </div>
  );
}
