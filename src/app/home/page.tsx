"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  );

  useEffect(() => {
    async function fetchUser() {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        console.error("Erro ao buscar usuário:", error?.message);
        router.push("/login");
        return;
      }

      setUser(user);
    }

    fetchUser();
  }, []);

  return (
    <div>
      <h1>Daqui a pouco vai ter uma pagina de inicio</h1>
      {user && <p>Bem-vindo, {user.email}</p>}
    </div>
  );
}
