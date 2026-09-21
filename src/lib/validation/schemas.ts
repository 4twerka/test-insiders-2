import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Ім'я має містити щонайменше 2 символи"),
  email: z.email("Некоректна email адреса"),
  password: z.string().min(6, "Пароль має містити щонайменше 6 символів"),
});

export const loginSchema = z.object({
  email: z.email("Некоректна email адреса"),
  password: z.string().min(1, "Введіть пароль"),
});

export const bookSchema = z.object({
  name: z.string().min(1, "Вкажіть назву книги"),
  author: z.string().min(1, "Вкажіть автора"),
});

export const adminCreateUserSchema = z.object({
  name: z.string().min(2, "Ім'я має містити щонайменше 2 символи"),
  email: z.email("Некоректна email адреса"),
  password: z.string().min(6, "Пароль має містити щонайменше 6 символів"),
  role: z.enum(["user", "admin"]),
});

export const forgotPasswordSchema = z.object({
  email: z.email("Некоректна email адреса"),
});

export const profileSchema = z.object({
  name: z.string().min(2, "Ім'я має містити щонайменше 2 символи"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type BookInput = z.infer<typeof bookSchema>;
export type AdminCreateUserInput = z.infer<typeof adminCreateUserSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
