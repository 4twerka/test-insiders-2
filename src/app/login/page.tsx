"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { getAuthErrorMessage } from "@/lib/firebase/errors";
import { loginSchema, type LoginInput } from "@/lib/validation/schemas";

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginInput) => {
    setFormError(null);
    try {
      const credential = await signInWithEmailAndPassword(auth, data.email, data.password);
      const idToken = await credential.user.getIdToken();
      await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      router.push(searchParams.get("redirect") ?? "/books");
      router.refresh();
    } catch (error) {
      setFormError(getAuthErrorMessage(error));
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-8 rounded-2xl border border-line bg-surface p-10 shadow-sm">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Вхід</h1>
        <p className="mt-1 text-sm text-foreground/60">Раді бачити вас знову</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm font-medium text-foreground/80">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="rounded-lg border border-line bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/20"
            {...register("email")}
          />
          {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className="text-sm font-medium text-foreground/80">
            Пароль
          </label>
          <input
            id="password"
            type="password"
            className="rounded-lg border border-line bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/20"
            {...register("password")}
          />
          {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
        </div>

        <Link href="/forgot-password" className="self-start text-sm text-accent hover:underline">
          Забули пароль?
        </Link>

        {formError && <p className="text-sm text-red-600">{formError}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-accent-foreground shadow-sm transition-colors hover:bg-accent/90 disabled:opacity-50"
        >
          {isSubmitting ? "Зачекайте..." : "Увійти"}
        </button>
      </form>

      <p className="text-sm text-foreground/70">
        Немає акаунта?{" "}
        <Link href="/register" className="font-medium text-accent hover:underline">
          Зареєструватися
        </Link>
      </p>
    </div>
  );
}
