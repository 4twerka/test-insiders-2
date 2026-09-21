import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center gap-4 py-24 text-center">
      <h1 className="text-2xl font-semibold">Сторінку не знайдено</h1>
      <p className="text-black/60 dark:text-white/60">
        Можливо, книгу вже видалили або посилання застаріло.
      </p>
      <Link href="/books" className="underline">
        Повернутися до книг
      </Link>
    </div>
  );
}
