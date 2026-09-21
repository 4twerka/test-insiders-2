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
      <div className="mx-auto flex max-w-sm flex-col gap-4 text-center">
        <h1 className="text-2xl font-semibold">Перевірте пошту</h1>
        <p className="text-sm text-black/60 dark:text-white/60">
          Якщо акаунт з такою email адресою існує, ми надіслали лист із посиланням для скидання
          паролю.
        </p>
        <Link href="/login" className="underline">
          Повернутися до входу
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-sm flex-col gap-6">
      <h1 className="text-2xl font-semibold">Відновлення паролю</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
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

        {formError && <p className="text-sm text-red-600">{formError}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-black px-4 py-2 text-white disabled:opacity-50 dark:bg-white dark:text-black"
        >
          {isSubmitting ? "Надсилаємо..." : "Надіслати лист"}
        </button>
      </form>

      <p className="text-sm">
        Згадали пароль?{" "}
        <Link href="/login" className="underline">
          Увійти
        </Link>
      </p>
    </div>
  );
}
