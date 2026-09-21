"use client";

import { useEffect } from "react";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-line bg-surface py-24 text-center shadow-sm">
      <h1 className="text-2xl font-semibold tracking-tight">Щось пішло не так</h1>
      <p className="text-foreground/60">Спробуйте оновити сторінку.</p>
      <button
        type="button"
        onClick={reset}
        className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground shadow-sm transition-colors hover:bg-accent/90"
      >
        Спробувати ще раз
      </button>
    </div>
  );
}
