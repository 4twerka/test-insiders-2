"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { getAuthErrorMessage } from "@/lib/firebase/errors";
import { forgotPasswordSchema, type ForgotPasswordInput } from "@/lib/validation/schemas";

export default function ForgotPasswordPage() {
  const [formError, setFormError] = useState<string | null>(null);
  const [isSent, setIsSent] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({ resolver: zodResolver(forgotPasswordSchema) });

  const onSubmit = async (data: ForgotPasswordInput) => {
    setFormError(null);
    try {
      await sendPasswordResetEmail(auth, data.email);
      setIsSent(true);
    } catch (error) {
      setFormError(getAuthErrorMessage(error));
    }
  };

  if (isSent) {
    return (
      <div className="mx-auto flex w-full max-w-md flex-col gap-4 rounded-2xl border border-line bg-surface p-10 text-center shadow-sm">
        <h1 className="text-3xl font-semibold tracking-tight">Перевірте пошту</h1>
        <p className="text-sm text-foreground/60">
          Якщо акаунт з такою email адресою існує, ми надіслали лист із посиланням для скидання
          паролю.
        </p>
        <Link href="/login" className="text-sm font-medium text-accent hover:underline">
          Повернутися до входу
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-8 rounded-2xl border border-line bg-surface p-10 shadow-sm">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Відновлення паролю</h1>
        <p className="mt-1 text-sm text-foreground/60">
          Введіть email, і ми надішлемо посилання для скидання паролю
        </p>
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

        {formError && <p className="text-sm text-red-600">{formError}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-accent-foreground shadow-sm transition-colors hover:bg-accent/90 disabled:opacity-50"
        >
          {isSubmitting ? "Надсилаємо..." : "Надіслати лист"}
        </button>
      </form>

      <p className="text-sm text-foreground/70">
        Згадали пароль?{" "}
        <Link href="/login" className="font-medium text-accent hover:underline">
          Увійти
        </Link>
      </p>
    </div>
  );
}
