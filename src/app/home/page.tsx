"use client";
import type { User } from "@supabase/supabase-js";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function HomePage() {
  const supabase = createClientComponentClient();
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        console.error("Erro ao buscar usuário:", error.message);
        router.push("/login");
        return;
      }

      if (data?.user) setUser(data.user);
      else router.push("/login");
    };

    fetchUser();
  }, [supabase, router]);

  if (!user) return <p className="text-center mt-10">Carregando...</p>;

  const nome =
    user.user_metadata?.full_name || user.user_metadata?.name || "Sem nome";

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-md rounded p-6 text-center">
        <h1 className="text-2xl mb-3">Bem-vindo!</h1>

        <div className="flex justify-center mb-3">
          <Image
            src={user.user_metadata?.avatar_url || "/default-avatar.png"}
            alt="Foto de perfil"
            width={96}
            height={96}
            className="rounded-full"
          />
        </div>

        <p>
          <strong>Nome:</strong> {nome}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>

        <button
          type="button"
          onClick={async () => {
            await supabase.auth.signOut();
            router.push("/login");
          }}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Sair
        </button>
      </div>
    </main>
  );
}
