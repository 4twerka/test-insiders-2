export type UserRole = "user" | "admin";

export type UserProfile = {
  uid: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: UserRole;
  createdAt: number;
};

export type AuthUser = Pick<
  UserProfile,
  "uid" | "name" | "email" | "role" | "avatarUrl"
>;
