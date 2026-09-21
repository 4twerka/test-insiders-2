"use client";

import Link from "next/link";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { useAuthStore } from "@/store/useAuthStore";

export function Navbar() {
  const user = useAuthStore((state) => state.user);
  const status = useAuthStore((state) => state.status);

  const handleLogout = async () => {
    await signOut(auth);
    await fetch("/api/session", { method: "DELETE" });
  };

  return (
    <header className="border-b border-black/10 dark:border-white/10">
      <nav className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3">
        <Link href="/books" className="font-semibold">
          Книгообмін
        </Link>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
          <Link href="/books">Книги</Link>
          {status === "authenticated" && user ? (
            <>
              <Link href="/me/books">Мої книги</Link>
              <Link href="/profile">Профіль</Link>
              {user.role === "admin" && <Link href="/admin">Адмін</Link>}
              <button onClick={handleLogout} type="button">
                Вийти
              </button>
            </>
          ) : status === "unauthenticated" ? (
            <>
              <Link href="/login">Увійти</Link>
              <Link href="/register">Реєстрація</Link>
            </>
          ) : null}
        </div>
      </nav>
    </header>
  );
}
