"use client";

import { useEffect } from "react";
import { authClient } from "@/lib/auth-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export function TokenBootstrap() {
  const { data: session } = authClient.useSession();
  const userId = session?.user?.id;

  useEffect(() => {
    if (!userId) return;

    void fetch(`${API_URL}/api/v1/auth/token`, {
      method: "POST",
      credentials: "include",
    }).catch(() => undefined);
  }, [userId]);

  return null;
}
