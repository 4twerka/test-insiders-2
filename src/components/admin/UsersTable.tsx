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
        className="flex flex-col gap-4 rounded-lg border border-black/10 p-4 dark:border-white/10 sm:flex-row sm:flex-wrap sm:items-end"
        noValidate
      >
        <div className="flex flex-col gap-1">
          <label htmlFor="name" className="text-sm font-medium">
            Ім&apos;я
          </label>
          <input
            id="name"
            type="text"
            className="rounded-md border border-black/15 px-3 py-2 dark:border-white/20"
            {...register("name")}
          />
          {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="rounded-md border border-black/15 px-3 py-2 dark:border-white/20"
            {...register("email")}
          />
          {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="password" className="text-sm font-medium">
            Пароль
          </label>
          <input
            id="password"
            type="password"
            className="rounded-md border border-black/15 px-3 py-2 dark:border-white/20"
            {...register("password")}
          />
          {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="role" className="text-sm font-medium">
            Роль
          </label>
          <select
            id="role"
            className="rounded-md border border-black/15 px-3 py-2 dark:border-white/20"
            {...register("role")}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-black px-4 py-2 text-sm text-white disabled:opacity-50 dark:bg-white dark:text-black"
        >
          {isSubmitting ? "Додаємо..." : "Додати користувача"}
        </button>

        {formError && <p className="text-sm text-red-600">{formError}</p>}
      </form>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-black/10 dark:border-white/10">
              <th className="py-2 pr-4">Ім&apos;я</th>
              <th className="py-2 pr-4">Email</th>
              <th className="py-2 pr-4">Роль</th>
              <th className="py-2 pr-4" />
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.uid} className="border-b border-black/5 dark:border-white/5">
                <td className="py-2 pr-4">{user.name}</td>
                <td className="py-2 pr-4">{user.email}</td>
                <td className="py-2 pr-4">
                  <select
                    value={user.role}
                    onChange={(event) => changeRole(user.uid, event.target.value as UserRole)}
                    disabled={user.uid === currentUid}
                    className="rounded-md border border-black/15 px-2 py-1 disabled:opacity-40 dark:border-white/20"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="py-2 pr-4">
                  <button
                    type="button"
                    onClick={() => deleteUser(user.uid)}
                    disabled={user.uid === currentUid}
                    className="text-red-600 hover:underline disabled:opacity-40"
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
