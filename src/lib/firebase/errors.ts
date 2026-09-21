const MESSAGES: Record<string, string> = {
  "auth/email-already-in-use": "Ця email адреса вже зареєстрована",
  "auth/invalid-credential": "Невірний email або пароль",
  "auth/invalid-email": "Некоректна email адреса",
  "auth/weak-password": "Пароль занадто простий",
  "auth/too-many-requests": "Забагато спроб. Спробуйте пізніше",
};

export function getAuthErrorMessage(error: unknown): string {
  const code =
    typeof error === "object" && error !== null && "code" in error
      ? String((error as { code: unknown }).code)
      : "";
  return MESSAGES[code] ?? "Щось пішло не так. Спробуйте ще раз";
}
