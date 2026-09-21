"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";
import type { Book } from "@/types/book";

type ExchangeRequestButtonProps = {
  book: Book;
};

type Feedback = {
  type: "success" | "error";
  text: string;
};

export function ExchangeRequestButton({ book }: ExchangeRequestButtonProps) {
  const user = useAuthStore((state) => state.user);
  const status = useAuthStore((state) => state.status);
  const [isSending, setIsSending] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const isSendingRef = useRef(false);

  if (status === "loading") return null;

  if (!user) {
    return (
      <p className="text-sm text-foreground/60">
        <Link href="/login" className="text-accent underline">
          Увійдіть
        </Link>
        , щоб запросити обмін.
      </p>
    );
  }

  if (user.uid === book.ownerId) return null;

  const handleClick = async () => {
    if (isSendingRef.current) return;
    isSendingRef.current = true;
    setIsSending(true);
    setFeedback(null);
    try {
      const response = await fetch("/api/exchange-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId: book.id }),
      });
      const json = await response.json();
      if (!response.ok) {
        setFeedback({ type: "error", text: json.error ?? "Не вдалося надіслати запит" });
        return;
      }
      setFeedback({ type: "success", text: "Запит надіслано власнику книги" });
    } catch {
      setFeedback({ type: "error", text: "Не вдалося надіслати запит" });
    } finally {
      isSendingRef.current = false;
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={isSending}
        className="self-start rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground shadow-sm transition-colors hover:bg-accent/90 disabled:opacity-50"
      >
        {isSending ? "Надсилаємо..." : "Запросити обмін"}
      </button>
      {feedback && (
        <p className={`text-sm ${feedback.type === "success" ? "text-green-600" : "text-red-600"}`}>
          {feedback.text}
        </p>
      )}
    </div>
  );
}
