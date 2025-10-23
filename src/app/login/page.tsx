"use client";

import { FaApple } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function LoginPage() {
  const supabase = createClientComponentClient();

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`, // ✅ CORRIGIDO
      },
    });
    if (error) console.error("Erro no login:", error.message);
  };

  const handleAppleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "apple",
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`, // ✅ idem
      },
    });
    if (error) console.error("Erro no login com Apple:", error.message);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg text-center w-80">
        <h1 className="text-2xl font-semibold mb-6">Login 🔐</h1>

        {/* Botão Google */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition w-full mb-4"
        >
          <FcGoogle className="w-6 h-6 bg-white rounded-full p-1" />
          Entrar com Google
        </button>

        {/* Botão Apple */}
        <button
          type="button"
          onClick={handleAppleLogin}
          className="flex items-center justify-center gap-2 bg-black hover:bg-gray-900 text-white px-6 py-2 rounded transition w-full"
        >
          <FaApple className="w-5 h-5" />
          Entrar com Apple
        </button>
      </div>
    </main>
  );
}
