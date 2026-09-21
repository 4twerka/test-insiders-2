"use client";

import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase/client";
import { useAuthStore } from "@/store/useAuthStore";
import type { UserProfile } from "@/types/user";

export function AuthListener() {
  const setUser = useAuthStore((state) => state.setUser);
  const setStatus = useAuthStore((state) => state.setStatus);

  useEffect(() => {
    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setStatus("unauthenticated");
        return;
      }

      const snapshot = await getDoc(doc(db, "users", firebaseUser.uid));
      const profile = snapshot.data() as UserProfile | undefined;

      setUser({
        uid: firebaseUser.uid,
        name: profile?.name ?? firebaseUser.email ?? "",
        email: firebaseUser.email ?? "",
        role: profile?.role ?? "user",
        avatarUrl: profile?.avatarUrl,
      });
      setStatus("authenticated");
    });
  }, [setUser, setStatus]);

  return null;
}
