"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bookSchema, type BookInput } from "@/lib/validation/schemas";
import { PhotoPicker } from "@/components/common/PhotoPicker";

type BookFormProps = {
  initialValues?: { name: string; author: string; photoUrl: string };
  submitLabel?: string;
  onSubmit: (input: { name: string; author: string; photoUrl: string }) => Promise<void>;
  onCancel?: () => void;
};

export function BookForm({ initialValues, submitLabel, onSubmit, onCancel }: BookFormProps) {
  const [photoUrl, setPhotoUrl] = useState(initialValues?.photoUrl ?? "");
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BookInput>({ resolver: zodResolver(bookSchema), defaultValues: initialValues });

  const submit = async (data: BookInput) => {
    setFormError(null);
    const trimmedPhotoUrl = photoUrl.trim();
    if (!trimmedPhotoUrl) {
      setFormError("Додайте фото книги");
      return;
    }

    try {
      await onSubmit({ name: data.name, author: data.author, photoUrl: trimmedPhotoUrl });
      if (!initialValues) {
        reset();
        setPhotoUrl("");
      }
    } catch {
      setFormError("Не вдалося зберегти книгу. Спробуйте ще раз");
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
          Назва книги
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
        <label htmlFor="author" className="text-sm font-medium text-foreground/80">
          Автор
        </label>
        <input
          id="author"
          type="text"
          className="rounded-lg border border-line bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/20"
          {...register("author")}
        />
        {errors.author && <p className="text-sm text-red-600">{errors.author.message}</p>}
      </div>

      <PhotoPicker value={photoUrl} onChange={setPhotoUrl} onError={setFormError} />

      {formError && <p className="text-sm text-red-600">{formError}</p>}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground shadow-sm transition-colors hover:bg-accent/90 disabled:opacity-50"
        >
          {isSubmitting ? "Зберігаємо..." : (submitLabel ?? "Додати книгу")}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-line px-4 py-2 text-sm font-medium text-foreground/70 transition-colors hover:bg-surface-muted"
          >
            Скасувати
          </button>
        )}
      </div>
    </form>
  );
}
