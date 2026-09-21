"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase/client";
import { getAuthErrorMessage } from "@/lib/firebase/errors";
import { now } from "@/lib/time";
import { registerSchema, type RegisterInput } from "@/lib/validation/schemas";

export default function RegisterPage() {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (data: RegisterInput) => {
    setFormError(null);
    try {
      const credential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      await updateProfile(credential.user, { displayName: data.name });
      await setDoc(doc(db, "users", credential.user.uid), {
        uid: credential.user.uid,
        name: data.name,
        email: data.email,
        role: "user",
        createdAt: now(),
      });

      const idToken = await credential.user.getIdToken();
      await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      router.push("/books");
      router.refresh();
    } catch (error) {
      setFormError(getAuthErrorMessage(error));
    }
  };

  return (
    <div className="mx-auto flex max-w-sm flex-col gap-6">
      <h1 className="text-2xl font-semibold">Реєстрація</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
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

        {formError && <p className="text-sm text-red-600">{formError}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-black px-4 py-2 text-white disabled:opacity-50 dark:bg-white dark:text-black"
        >
          {isSubmitting ? "Зачекайте..." : "Зареєструватися"}
        </button>
      </form>

      <p className="text-sm">
        Вже маєте акаунт?{" "}
        <Link href="/login" className="underline">
          Увійти
        </Link>
      </p>
    </div>
  );
}
