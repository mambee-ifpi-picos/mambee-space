"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabaseClient";

export default function HomePage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Erro ao buscar usuário:", error.message);
        return;
      }

      if (data?.user) {
        setUser(data.user);

        const { id, email, user_metadata } = data.user;
        const nome =
          user_metadata?.full_name || user_metadata?.name || "Usuário sem nome";
        const foto =
          user_metadata?.avatar_url || user_metadata?.picture || null;

        const { error: dbError } = await supabase.from("usuarios").upsert(
          {
            id,
            nome,
            email,
            foto,
          },
          { onConflict: "id" },
        );

        if (dbError) console.error("Erro ao salvar no banco:", dbError.message);
        else console.log("Usuário salvo com sucesso");
      } else {
        if (typeof window !== "undefined") window.location.href = "/login";
      }
    };

    fetchUser();
  }, []);

  if (!user) return <p>Carregando...</p>;

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
          <strong>Nome:</strong> {user.user_metadata?.full_name}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>

        <button
          type="button"
          onClick={async () => {
            await supabase.auth.signOut();
            window.location.href = "/login";
          }}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Sair
        </button>
      </div>
    </main>
  );
}
