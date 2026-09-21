"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type DeleteBookButtonProps = {
  bookId: string;
};

export function DeleteBookButton({ bookId }: DeleteBookButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!confirm("Видалити цю книгу?")) return;
    setIsDeleting(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/books/${bookId}`, { method: "DELETE" });
      if (!response.ok) {
        const json = await response.json();
        setError(json.error ?? "Не вдалося видалити книгу");
        return;
      }
      router.push("/books");
      router.refresh();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <button
        type="button"
        onClick={handleDelete}
        disabled={isDeleting}
        className="self-start text-sm text-red-600 hover:underline disabled:opacity-50"
      >
        {isDeleting ? "Видаляємо..." : "Видалити книгу (адмін)"}
      </button>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
