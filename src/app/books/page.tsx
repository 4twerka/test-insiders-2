"use client";

import { Suspense, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { BookCard } from "@/components/books/BookCard";
import { SearchIcon } from "@/components/icons";
import type { Book } from "@/types/book";

type BooksResponse = {
  items: Book[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export default function BooksPage() {
  return (
    <Suspense fallback={<p className="text-sm text-foreground/60">Завантаження...</p>}>
      <BooksPageContent />
    </Suspense>
  );
}

function BooksPageContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const q = searchParams.get("q") ?? "";
  const page = Number(searchParams.get("page")) || 1;

  const [data, setData] = useState<BooksResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(q);

  useEffect(() => {
    let cancelled = false;

    async function loadBooks() {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      params.set("page", String(page));

      const response = await fetch(`/api/books?${params.toString()}`);
      const json: BooksResponse = await response.json();
      if (!cancelled) {
        setData(json);
        setIsLoading(false);
      }
    }

    loadBooks();

    return () => {
      cancelled = true;
    };
  }, [q, page]);

  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (searchInput) params.set("q", searchInput);
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  const goToPage = (nextPage: number) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    params.set("page", String(nextPage));
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">Книги</h1>

      <form onSubmit={submitSearch} className="flex gap-2">
        <div className="relative flex-1">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
          <input
            type="text"
            placeholder="Пошук за назвою або автором"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            className="w-full rounded-lg border border-line bg-surface py-2 pl-9 pr-3 text-sm outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/20"
          />
        </div>
        <button
          type="submit"
          className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground shadow-sm transition-colors hover:bg-accent/90"
        >
          Знайти
        </button>
      </form>

      {isLoading ? (
        <p className="text-sm text-foreground/60">Завантаження...</p>
      ) : !data || data.items.length === 0 ? (
        <p className="text-sm text-foreground/60">Нічого не знайдено.</p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {data.items.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>

          {data.totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 text-sm">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => goToPage(page - 1)}
                className="rounded-lg border border-line px-3 py-1.5 transition-colors hover:bg-surface-muted disabled:opacity-40 disabled:hover:bg-transparent"
              >
                Назад
              </button>
              <span className="text-foreground/70">
                {page} / {data.totalPages}
              </span>
              <button
                type="button"
                disabled={page >= data.totalPages}
                onClick={() => goToPage(page + 1)}
                className="rounded-lg border border-line px-3 py-1.5 transition-colors hover:bg-surface-muted disabled:opacity-40 disabled:hover:bg-transparent"
              >
                Далі
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
