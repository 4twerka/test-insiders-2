"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bookSchema, type BookInput } from "@/lib/validation/schemas";
import { PhotoPicker } from "@/components/common/PhotoPicker";

type BookFormProps = {
  onSubmit: (input: { name: string; author: string; photoUrl: string }) => Promise<void>;
};

export function BookForm({ onSubmit }: BookFormProps) {
  const [photoUrl, setPhotoUrl] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BookInput>({ resolver: zodResolver(bookSchema) });

  const submit = async (data: BookInput) => {
    setFormError(null);
    const trimmedPhotoUrl = photoUrl.trim();
    if (!trimmedPhotoUrl) {
      setFormError("Додайте фото книги");
      return;
    }

    try {
      await onSubmit({ name: data.name, author: data.author, photoUrl: trimmedPhotoUrl });
      reset();
      setPhotoUrl("");
    } catch {
      setFormError("Не вдалося додати книгу. Спробуйте ще раз");
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
          Назва книги
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
        <label htmlFor="author" className="text-sm font-medium">
          Автор
        </label>
        <input
          id="author"
          type="text"
          className="rounded-md border border-black/15 px-3 py-2 dark:border-white/20"
          {...register("author")}
        />
        {errors.author && <p className="text-sm text-red-600">{errors.author.message}</p>}
      </div>

      <PhotoPicker value={photoUrl} onChange={setPhotoUrl} onError={setFormError} />

      {formError && <p className="text-sm text-red-600">{formError}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="self-start rounded-md bg-black px-4 py-2 text-sm text-white disabled:opacity-50 dark:bg-white dark:text-black"
      >
        {isSubmitting ? "Додаємо..." : "Додати книгу"}
      </button>
    </form>
  );
}
