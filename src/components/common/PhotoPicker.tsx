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
      <span className="text-sm font-medium">{label}</span>
      <div className="flex gap-4 text-sm">
        <label className="flex items-center gap-1">
          <input
            type="radio"
            name="photoMode"
            checked={mode === "url"}
            onChange={() => setMode("url")}
          />
          Посилання
        </label>
        <label className="flex items-center gap-1">
          <input
            type="radio"
            name="photoMode"
            checked={mode === "file"}
            onChange={() => setMode("file")}
          />
          Файл
        </label>
      </div>

      {mode === "url" ? (
        <input
          type="url"
          placeholder="https://..."
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="rounded-md border border-black/15 px-3 py-2 dark:border-white/20"
        />
      ) : (
        <input type="file" accept="image/*" onChange={handleFileChange} className="text-sm" />
      )}
    </div>
  );
}
