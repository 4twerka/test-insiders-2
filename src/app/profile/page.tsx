import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";
import { adminDb } from "@/lib/firebase/admin";
import { ProfileForm } from "@/components/profile/ProfileForm";
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
    .map((docSnapshot) => ({ id: docSnapshot.id, ...docSnapshot.data() }) as ExchangeRequest)
    .sort((a, b) => b.createdAt - a.createdAt);

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-2xl font-semibold">Профіль</h1>
      <ProfileForm />

      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-medium">Кількість книг</h2>
        <p className="text-black/60 dark:text-white/60">{booksCountSnapshot.data().count}</p>
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-lg font-medium">Запити на обмін</h2>
        {requests.length === 0 ? (
          <p className="text-sm text-black/60 dark:text-white/60">Поки що немає запитів.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {requests.map((request) => (
              <li
                key={request.id}
                className="rounded-lg border border-black/10 p-3 text-sm dark:border-white/10"
              >
                <Link href={`/books/${request.bookId}`} className="font-medium hover:underline">
                  {request.bookName}
                </Link>
                <p className="text-black/60 dark:text-white/60">
                  {request.requesterName} ({request.requesterEmail}) хоче обмінятися книгою
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
