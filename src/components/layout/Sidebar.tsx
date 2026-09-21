"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { useAuthStore } from "@/store/useAuthStore";
import { NAV_LINKS } from "@/components/layout/navLinks";
import { LogoutIcon } from "@/components/icons";

export function Sidebar() {
  const user = useAuthStore((state) => state.user);
  const status = useAuthStore((state) => state.status);
  const pathname = usePathname();

  const handleLogout = async () => {
    await signOut(auth);
    await fetch("/api/session", { method: "DELETE" });
  };

  return (
    <aside className="hidden w-64 shrink-0 flex-col bg-sidebar px-4 py-6 text-sidebar-foreground md:flex">
      <Link href="/books" className="px-2 text-lg font-semibold tracking-tight text-white">
        Книгообмін
      </Link>

      {status === "authenticated" && user ? (
        <>
          <nav className="mt-8 flex flex-1 flex-col gap-1">
            {NAV_LINKS.filter((link) => !link.adminOnly || user.role === "admin").map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                    isActive
                      ? "bg-accent/15 text-accent"
                      : "text-sidebar-foreground hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto flex items-center gap-3 border-t border-white/10 pt-4">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="h-9 w-9 rounded-full object-cover"
              />
            ) : (
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-sm font-medium text-white">
                {user.name.charAt(0).toUpperCase()}
              </span>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">{user.name}</p>
              <p className="truncate text-xs text-sidebar-foreground/70">{user.email}</p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              title="Вийти"
              className="rounded-lg p-2 text-sidebar-foreground/70 transition-colors hover:bg-white/5 hover:text-white"
            >
              <LogoutIcon className="h-5 w-5" />
            </button>
          </div>
        </>
      ) : status === "unauthenticated" ? (
        <nav className="mt-8 flex flex-col gap-1">
          <Link
            href="/login"
            className="rounded-lg px-3 py-2 text-sm text-sidebar-foreground hover:bg-white/5 hover:text-white"
          >
            Увійти
          </Link>
          <Link
            href="/register"
            className="rounded-lg px-3 py-2 text-sm text-sidebar-foreground hover:bg-white/5 hover:text-white"
          >
            Реєстрація
          </Link>
        </nav>
      ) : null}
    </aside>
  );
}
