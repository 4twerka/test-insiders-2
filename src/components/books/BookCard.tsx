import Link from "next/link";
import type { Book } from "@/types/book";

type BookCardProps = {
  book: Book;
  onEdit?: (book: Book) => void;
  onDelete?: (id: string) => void;
};

export function BookCard({ book, onEdit, onDelete }: BookCardProps) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-line bg-surface shadow-sm transition-shadow hover:shadow-md">
      <Link
        href={`/books/${book.id}`}
        className="block aspect-[2/3] w-full overflow-hidden bg-surface-muted"
      >
        {book.photoUrl && (
          <img
            src={book.photoUrl}
            alt={book.name}
            className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.03]"
          />
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <Link
          href={`/books/${book.id}`}
          className="line-clamp-2 text-sm font-medium leading-snug hover:text-accent"
        >
          {book.name}
        </Link>
        <p className="line-clamp-1 text-xs text-foreground/60">{book.author}</p>
        {(onEdit || onDelete) && (
          <div className="mt-2 flex gap-3 text-xs">
            {onEdit && (
              <button
                type="button"
                onClick={() => onEdit(book)}
                className="text-foreground/60 hover:text-accent hover:underline"
              >
                Редагувати
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={() => onDelete(book.id)}
                className="text-red-600 hover:underline"
              >
                Видалити
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
