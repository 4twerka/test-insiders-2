"use client";

import { useEffect, useState } from "react";
import { addDoc, collection, deleteDoc, doc, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { now } from "@/lib/time";
import { useAuthStore } from "@/store/useAuthStore";
import { BookForm } from "@/components/books/BookForm";
import { BookCard } from "@/components/books/BookCard";
import type { Book } from "@/types/book";

export default function MyBooksPage() {
  const user = useAuthStore((state) => state.user);
  const status = useAuthStore((state) => state.status);
  const [books, setBooks] = useState<Book[]>([]);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const booksQuery = query(collection(db, "books"), where("ownerId", "==", user.uid));

    return onSnapshot(booksQuery, (snapshot) => {
      const ownBooks = snapshot.docs.map(
        (docSnapshot) => ({ id: docSnapshot.id, ...docSnapshot.data() }) as Book,
      );
      ownBooks.sort((a, b) => b.createdAt - a.createdAt);
      setBooks(ownBooks);
    });
  }, [user]);

  const handleAdd = async (input: { name: string; author: string; photoUrl: string }) => {
    if (!user) return;

    await addDoc(collection(db, "books"), {
      name: input.name,
      nameLower: input.name.toLowerCase(),
      author: input.author,
      authorLower: input.author.toLowerCase(),
      photoUrl: input.photoUrl,
      ownerId: user.uid,
      ownerName: user.name,
      ownerEmail: user.email,
      createdAt: now(),
    });
  };

  const handleDelete = async (bookId: string) => {
    setDeleteError(null);
    try {
      await deleteDoc(doc(db, "books", bookId));
    } catch {
      setDeleteError("Не вдалося видалити книгу. Спробуйте ще раз");
    }
  };

  if (status === "loading") {
    return <p className="text-sm text-black/60 dark:text-white/60">Завантаження...</p>;
  }

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-2xl font-semibold">Мої книги</h1>
      <BookForm onSubmit={handleAdd} />
      {deleteError && <p className="text-sm text-red-600">{deleteError}</p>}
      <div className="flex flex-col gap-3">
        {books.length === 0 ? (
          <p className="text-sm text-black/60 dark:text-white/60">Ви ще не додали жодної книги.</p>
        ) : (
          books.map((book) => <BookCard key={book.id} book={book} onDelete={handleDelete} />)
        )}
      </div>
    </div>
  );
}
