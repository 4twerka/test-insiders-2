import Link from "next/link";
import type { Book } from "@/types/book";

type BookCardProps = {
  book: Book;
  onDelete?: (id: string) => void;
};

export function BookCard({ book, onDelete }: BookCardProps) {
  return (
    <div className="flex gap-4 rounded-lg border border-black/10 p-4 dark:border-white/10">
      <div className="h-24 w-16 shrink-0 overflow-hidden rounded-md bg-black/5 dark:bg-white/10">
        {book.photoUrl && (
          <img src={book.photoUrl} alt={book.name} className="h-full w-full object-cover" />
        )}
      </div>
      <div className="flex flex-1 flex-col justify-between">
        <div>
          <Link href={`/books/${book.id}`} className="font-medium hover:underline">
            {book.name}
          </Link>
          <p className="text-sm text-black/60 dark:text-white/60">{book.author}</p>
        </div>
        {onDelete && (
          <button
            type="button"
            onClick={() => onDelete(book.id)}
            className="self-start text-sm text-red-600 hover:underline"
          >
            Видалити
          </button>
        )}
      </div>
    </div>
  );
}
