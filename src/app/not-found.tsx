import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-line bg-surface py-24 text-center shadow-sm">
      <h1 className="text-2xl font-semibold tracking-tight">Сторінку не знайдено</h1>
      <p className="text-foreground/60">Можливо, книгу вже видалили або посилання застаріло.</p>
      <Link href="/books" className="font-medium text-accent hover:underline">
        Повернутися до книг
      </Link>
    </div>
  );
}
