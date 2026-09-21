"use client";

import { useState } from "react";
import Link from "next/link";
import type { ExchangeRequest, ExchangeRequestStatus } from "@/types/exchangeRequest";

type ExchangeRequestsListProps = {
  initialRequests: ExchangeRequest[];
};

const STATUS_LABEL: Record<ExchangeRequestStatus, string> = {
  pending: "Очікує рішення",
  accepted: "Прийнято",
  declined: "Відхилено",
};

const STATUS_COLOR: Record<ExchangeRequestStatus, string> = {
  pending: "text-foreground/50",
  accepted: "text-green-600",
  declined: "text-red-600",
};

export function ExchangeRequestsList({ initialRequests }: ExchangeRequestsListProps) {
  const [requests, setRequests] = useState(initialRequests);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const respond = async (id: string, status: "accepted" | "declined") => {
    setPendingId(id);
    setError(null);
    try {
      const response = await fetch(`/api/exchange-request/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const json = await response.json();
      if (!response.ok) {
        setError(json.error ?? "Не вдалося оновити запит");
        return;
      }
      setRequests((prev) =>
        prev.map((request) => (request.id === id ? { ...request, status } : request)),
      );
    } finally {
      setPendingId(null);
    }
  };

  if (requests.length === 0) {
    return <p className="text-sm text-foreground/60">Поки що немає запитів.</p>;
  }

  return (
    <div className="flex flex-col gap-2">
      {error && <p className="text-sm text-red-600">{error}</p>}
      <ul className="flex flex-col gap-2">
        {requests.map((request) => (
          <li
            key={request.id}
            className="rounded-xl border border-line bg-surface p-4 text-sm shadow-sm"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Link
                href={`/books/${request.bookId}`}
                className="font-medium hover:text-accent hover:underline"
              >
                {request.bookName}
              </Link>
              <span className={`text-xs font-medium ${STATUS_COLOR[request.status]}`}>
                {STATUS_LABEL[request.status]}
              </span>
            </div>
            <p className="mt-0.5 text-foreground/60">
              {request.requesterName} ({request.requesterEmail}) хоче обмінятися книгою
            </p>
            {request.status === "pending" && (
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => respond(request.id, "accepted")}
                  disabled={pendingId === request.id}
                  className="rounded-lg bg-accent px-3 py-1.5 text-xs font-medium text-accent-foreground shadow-sm transition-colors hover:bg-accent/90 disabled:opacity-50"
                >
                  Прийняти
                </button>
                <button
                  type="button"
                  onClick={() => respond(request.id, "declined")}
                  disabled={pendingId === request.id}
                  className="rounded-lg border border-line px-3 py-1.5 text-xs font-medium text-foreground/70 transition-colors hover:bg-surface-muted disabled:opacity-50"
                >
                  Відхилити
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
