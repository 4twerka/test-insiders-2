"use client";

import { useState } from "react";
import { fileToCompressedDataUrl } from "@/lib/image";

type PhotoMode = "url" | "file";

const MAX_FILE_SIZE = 8 * 1024 * 1024;

type PhotoPickerProps = {
  value: string;
  onChange: (value: string) => void;
  onError: (message: string | null) => void;
  label?: string;
};

export function PhotoPicker({ value, onChange, onError, label = "Фото" }: PhotoPickerProps) {
  const [mode, setMode] = useState<PhotoMode>("url");

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    if (!file) return;
    if (file.size > MAX_FILE_SIZE) {
      onError("Файл занадто великий (максимум 8 МБ)");
      return;
    }
    try {
      onChange(await fileToCompressedDataUrl(file));
      onError(null);
    } catch {
      onError("Не вдалося обробити зображення");
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-foreground/80">{label}</span>

      <div className="inline-flex w-fit rounded-lg border border-line bg-surface-muted p-0.5 text-sm">
        <button
          type="button"
          onClick={() => setMode("url")}
          className={`rounded-md px-3 py-1.5 transition-colors ${
            mode === "url" ? "bg-surface font-medium shadow-sm" : "text-foreground/60"
          }`}
        >
          Посилання
        </button>
        <button
          type="button"
          onClick={() => setMode("file")}
          className={`rounded-md px-3 py-1.5 transition-colors ${
            mode === "file" ? "bg-surface font-medium shadow-sm" : "text-foreground/60"
          }`}
        >
          Файл
        </button>
      </div>

      {mode === "url" ? (
        <input
          type="url"
          placeholder="https://..."
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="rounded-lg border border-line bg-surface px-3 py-2 text-sm outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/20"
        />
      ) : (
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="text-sm text-foreground/70 file:mr-3 file:rounded-lg file:border-0 file:bg-accent file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-accent-foreground file:transition-colors hover:file:bg-accent/90"
        />
      )}
    </div>
  );
}
