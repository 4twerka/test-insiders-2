"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { adminCreateUserSchema, type AdminCreateUserInput } from "@/lib/validation/schemas";
import type { UserProfile, UserRole } from "@/types/user";

type UsersTableProps = {
  initialUsers: UserProfile[];
  currentUid: string;
};

export function UsersTable({ initialUsers, currentUid }: UsersTableProps) {
  const [users, setUsers] = useState(initialUsers);
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AdminCreateUserInput>({
    resolver: zodResolver(adminCreateUserSchema),
    defaultValues: { role: "user" },
  });

  const onSubmit = async (data: AdminCreateUserInput) => {
    setFormError(null);
    const response = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await response.json();
    if (!response.ok) {
      setFormError(json.error ?? "Не вдалося створити користувача");
      return;
    }
    setUsers((prev) => [...prev, json.user as UserProfile]);
    reset();
  };

  const changeRole = async (uid: string, role: UserRole) => {
    const response = await fetch(`/api/admin/users/${uid}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    if (response.ok) {
      setUsers((prev) => prev.map((user) => (user.uid === uid ? { ...user, role } : user)));
    }
  };

  const deleteUser = async (uid: string) => {
    if (!confirm("Видалити цього користувача?")) return;
    const response = await fetch(`/api/admin/users/${uid}`, { method: "DELETE" });
    if (response.ok) {
      setUsers((prev) => prev.filter((user) => user.uid !== uid));
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 rounded-2xl border border-line bg-surface p-6 shadow-sm sm:flex-row sm:flex-wrap sm:items-end"
        noValidate
      >
        <div className="flex flex-col gap-1">
          <label htmlFor="name" className="text-sm font-medium text-foreground/80">
            Ім&apos;я
          </label>
          <input
            id="name"
            type="text"
            className="rounded-lg border border-line bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/20"
            {...register("name")}
          />
          {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="text-sm font-medium text-foreground/80">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="rounded-lg border border-line bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/20"
            {...register("email")}
          />
          {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="password" className="text-sm font-medium text-foreground/80">
            Пароль
          </label>
          <input
            id="password"
            type="password"
            className="rounded-lg border border-line bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/20"
            {...register("password")}
          />
          {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="role" className="text-sm font-medium text-foreground/80">
            Роль
          </label>
          <select
            id="role"
            className="rounded-lg border border-line bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/20"
            {...register("role")}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground shadow-sm transition-colors hover:bg-accent/90 disabled:opacity-50"
        >
          {isSubmitting ? "Додаємо..." : "Додати користувача"}
        </button>

        {formError && <p className="text-sm text-red-600">{formError}</p>}
      </form>

      <div className="overflow-x-auto rounded-2xl border border-line bg-surface shadow-sm">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-line bg-surface-muted text-foreground/60">
              <th className="px-4 py-3 font-medium">Ім&apos;я</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Роль</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.uid} className="border-b border-line last:border-0 hover:bg-surface-muted/60">
                <td className="px-4 py-3">{user.name}</td>
                <td className="px-4 py-3 text-foreground/70">{user.email}</td>
                <td className="px-4 py-3">
                  <select
                    value={user.role}
                    onChange={(event) => changeRole(user.uid, event.target.value as UserRole)}
                    disabled={user.uid === currentUid}
                    className="rounded-lg border border-line bg-background px-2 py-1 text-sm outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/20 disabled:opacity-40"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => deleteUser(user.uid)}
                    disabled={user.uid === currentUid}
                    className="font-medium text-red-600 hover:underline disabled:opacity-40"
                  >
                    Видалити
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
