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
    <div className="flex flex-col items-center gap-4 py-24 text-center">
      <h1 className="text-2xl font-semibold">Щось пішло не так</h1>
      <p className="text-black/60 dark:text-white/60">Спробуйте оновити сторінку.</p>
      <button
        type="button"
        onClick={reset}
        className="rounded-md bg-black px-4 py-2 text-sm text-white dark:bg-white dark:text-black"
      >
        Спробувати ще раз
      </button>
    </div>
  );
}
