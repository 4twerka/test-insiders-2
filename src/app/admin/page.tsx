import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";
import { adminDb } from "@/lib/firebase/admin";
import { UsersTable } from "@/components/admin/UsersTable";
import type { UserProfile } from "@/types/user";

export default async function AdminPage() {
  const sessionUser = await getSessionUser();
  if (!sessionUser || sessionUser.role !== "admin") {
    redirect("/books");
  }

  const snapshot = await adminDb.collection("users").orderBy("createdAt", "asc").get();
  const users = snapshot.docs.map((docSnapshot) => docSnapshot.data() as UserProfile);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">Користувачі</h1>
      <UsersTable initialUsers={users} currentUid={sessionUser.uid} />
    </div>
  );
}
