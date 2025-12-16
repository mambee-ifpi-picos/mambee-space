"use client";

import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Erro ao sair:", error.message);
      return;
    }
    console.log("saindoooo");
    router.replace("/login"); // redirect after logout
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded cursor-pointer flex items-center gap-2 "
    >
      Sair
    </button>
  );
}
