"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { useAuthStore } from "@/store/useAuthStore";
import { NAV_LINKS } from "@/components/layout/navLinks";

export function TopBar() {
  const user = useAuthStore((state) => state.user);
  const status = useAuthStore((state) => state.status);
  const pathname = usePathname();

  const handleLogout = async () => {
    await signOut(auth);
    await fetch("/api/session", { method: "DELETE" });
  };

  return (
    <header className="border-b border-line bg-surface px-4 py-3 md:hidden">
      <div className="flex items-center justify-between gap-3">
        <Link href="/books" className="text-base font-semibold tracking-tight">
          Книгообмін
        </Link>
        {status === "authenticated" && user && (
          <button
            type="button"
            onClick={handleLogout}
            className="text-sm text-foreground/60 hover:text-foreground"
          >
            Вийти
          </button>
        )}
      </div>

      {status === "authenticated" && user ? (
        <nav className="mt-3 flex gap-1 overflow-x-auto">
          {NAV_LINKS.filter((link) => !link.adminOnly || user.role === "admin").map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`shrink-0 rounded-full px-3 py-1.5 text-sm transition-colors ${
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-foreground/70 hover:bg-surface-muted"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      ) : status === "unauthenticated" ? (
        <nav className="mt-3 flex gap-4 text-sm">
          <Link href="/login">Увійти</Link>
          <Link href="/register">Реєстрація</Link>
        </nav>
      ) : null}
    </header>
  );
}
