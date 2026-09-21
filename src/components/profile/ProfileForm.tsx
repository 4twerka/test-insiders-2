"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
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
    defaultValues: { name: user?.name ?? "" },
  });

  if (!user) return null;

  const submit = async (data: ProfileInput) => {
    setFormError(null);
    setSuccessMessage(null);
    try {
      await updateDoc(doc(db, "users", user.uid), {
        name: data.name,
        avatarUrl: avatarUrl.trim(),
      });
      setUser({ ...user, name: data.name, avatarUrl: avatarUrl.trim() || undefined });
      setSuccessMessage("Профіль оновлено");
    } catch {
      setFormError("Не вдалося оновити профіль. Спробуйте ще раз");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(submit)}
      className="flex flex-col gap-4 rounded-lg border border-black/10 p-4 dark:border-white/10"
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
        <span className="text-sm font-medium">Email</span>
        <p className="text-sm text-black/60 dark:text-white/60">{user.email}</p>
      </div>

      <PhotoPicker value={avatarUrl} onChange={setAvatarUrl} onError={setFormError} label="Аватар" />

      {formError && <p className="text-sm text-red-600">{formError}</p>}
      {successMessage && <p className="text-sm text-green-600">{successMessage}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="self-start rounded-md bg-black px-4 py-2 text-sm text-white disabled:opacity-50 dark:bg-white dark:text-black"
      >
        {isSubmitting ? "Зберігаємо..." : "Зберегти"}
      </button>
    </form>
  );
}
