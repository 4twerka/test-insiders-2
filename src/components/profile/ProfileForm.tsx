"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { doc, updateDoc } from "firebase/firestore";
import { verifyBeforeUpdateEmail } from "firebase/auth";
import { auth, db } from "@/lib/firebase/client";
import { getAuthErrorMessage } from "@/lib/firebase/errors";
import { useAuthStore } from "@/store/useAuthStore";
import { PhotoPicker } from "@/components/common/PhotoPicker";
import { profileSchema, type ProfileInput } from "@/lib/validation/schemas";

export function ProfileForm() {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl ?? "");
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.name ?? "", email: user?.email ?? "" },
  });

  if (!user) return null;

  const submit = async (data: ProfileInput) => {
    setFormError(null);
    setSuccessMessage(null);

    const emailChanged = data.email !== user.email;
    if (emailChanged) {
      if (!auth.currentUser) return;
      try {
        await verifyBeforeUpdateEmail(auth.currentUser, data.email);
      } catch (error) {
        setFormError(getAuthErrorMessage(error));
        return;
      }
    }

    try {
      await updateDoc(doc(db, "users", user.uid), {
        name: data.name,
        avatarUrl: avatarUrl.trim(),
      });
      setUser({ ...user, name: data.name, avatarUrl: avatarUrl.trim() || undefined });
      setSuccessMessage(
        emailChanged
          ? `Профіль оновлено. Перевірте ${data.email} і підтвердіть нову адресу за посиланням у листі`
          : "Профіль оновлено",
      );
    } catch {
      setFormError("Не вдалося оновити профіль. Спробуйте ще раз");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(submit)}
      className="flex flex-col gap-4 rounded-2xl border border-line bg-surface p-6 shadow-sm"
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

      <PhotoPicker value={avatarUrl} onChange={setAvatarUrl} onError={setFormError} label="Аватар" />

      {formError && <p className="text-sm text-red-600">{formError}</p>}
      {successMessage && <p className="text-sm text-green-600">{successMessage}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="self-start rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground shadow-sm transition-colors hover:bg-accent/90 disabled:opacity-50"
      >
        {isSubmitting ? "Зберігаємо..." : "Зберегти"}
      </button>
    </form>
  );
}
