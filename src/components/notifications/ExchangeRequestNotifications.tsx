"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { useAuthStore } from "@/store/useAuthStore";
import type { ExchangeRequest } from "@/types/exchangeRequest";

const TOAST_DURATION_MS = 8000;

type Toast = {
  id: string;
  bookName: string;
  requesterName: string;
};

export function ExchangeRequestNotifications() {
  const uid = useAuthStore((state) => state.user?.uid ?? null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  useEffect(() => {
    if (!uid) return;

    const knownIds = new Set<string>();
    let hasBaseline = false;

    const exchangeRequestsQuery = query(
      collection(db, "exchangeRequests"),
      where("bookOwnerId", "==", uid),
      where("status", "==", "pending"),
    );

    const unsubscribe = onSnapshot(exchangeRequestsQuery, (snapshot) => {
      if (!hasBaseline) {
        snapshot.docs.forEach((docSnapshot) => knownIds.add(docSnapshot.id));
        hasBaseline = true;
        return;
      }

      snapshot.docChanges().forEach((change) => {
        if (change.type !== "added" || knownIds.has(change.doc.id)) return;
        knownIds.add(change.doc.id);

        const data = change.doc.data() as ExchangeRequest;
        setToasts((prev) => [
          ...prev,
          { id: change.doc.id, bookName: data.bookName, requesterName: data.requesterName },
        ]);
        setTimeout(() => dismiss(change.doc.id), TOAST_DURATION_MS);
      });
    });

    return () => {
      unsubscribe();
      setToasts([]);
    };
  }, [uid]);

  if (toasts.length === 0) return null;

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-50 flex flex-col items-end gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="status"
          className="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border border-line bg-surface p-4 shadow-lg"
        >
          <div className="flex-1 text-sm">
            <p className="font-medium">Новий запит на обмін</p>
            <p className="mt-0.5 text-foreground/60">
              {toast.requesterName} хоче обміняти «{toast.bookName}»
            </p>
            <Link
              href="/profile"
              className="mt-2 inline-block text-xs font-medium text-accent hover:underline"
              onClick={() => dismiss(toast.id)}
            >
              Переглянути запит
            </Link>
          </div>
          <button
            type="button"
            onClick={() => dismiss(toast.id)}
            aria-label="Закрити сповіщення"
            className="text-foreground/40 transition-colors hover:text-foreground"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
