"use client";

import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

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
      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded cursor-pointer"
    >
      Sair
    </button>
  );
}
