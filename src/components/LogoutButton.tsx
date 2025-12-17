"use client";

import { supabase } from "@/lib/supabase/browser/supabaseClient";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  async function handleLogout() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Erro ao sair:", error.message);
      return;
    }
    router.replace("/login"); // redirect after logout
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="flex items-center gap-2 text-red-500 font-bold hover:text-red-700 transition-colors cursor-pointer"
      title="Sair da conta"
    >
      <LogOut size={20} />
      Sair
    </button>
  );
}
