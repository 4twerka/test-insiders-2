import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";
import { adminDb } from "@/lib/firebase/admin";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { ExchangeRequestsList } from "@/components/profile/ExchangeRequestsList";
import type { ExchangeRequest } from "@/types/exchangeRequest";

export default async function ProfilePage() {
  const sessionUser = await getSessionUser();
  if (!sessionUser) {
    redirect("/login");
  }

  const [booksCountSnapshot, requestsSnapshot] = await Promise.all([
    adminDb.collection("books").where("ownerId", "==", sessionUser.uid).count().get(),
    adminDb.collection("exchangeRequests").where("bookOwnerId", "==", sessionUser.uid).get(),
  ]);

  const requests = requestsSnapshot.docs
    .map(
      (docSnapshot) =>
        ({ status: "pending", id: docSnapshot.id, ...docSnapshot.data() }) as ExchangeRequest,
    )
    .sort((a, b) => b.createdAt - a.createdAt);

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-2xl font-semibold tracking-tight">Профіль</h1>
      <ProfileForm />

      <div className="flex flex-col gap-1 rounded-2xl border border-line bg-surface p-6 shadow-sm">
        <h2 className="text-lg font-medium tracking-tight">Кількість книг</h2>
        <p className="text-2xl font-semibold text-accent">{booksCountSnapshot.data().count}</p>
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-lg font-medium tracking-tight">Запити на обмін</h2>
        <ExchangeRequestsList initialRequests={requests} />
      </div>
    </div>
  );
}
