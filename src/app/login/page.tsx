"use client";

import { supabase } from "@/lib/supabaseClient";
import { FaApple } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

export default function LoginPage() {
  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });
  };

  const handleAppleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "apple",
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });
  };

  return (
    <>
      <div className="fixed inset-0 bg-gradient-to-br from-[#36B8B6] via-[#36B8B6] to-[#36B8B6]" />

      <main className="relative min-h-screen flex items-center justify-center px-6 font-sans">
        <div className="w-full max-w-xl bg-white rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.25)] p-12">
          <div className="flex justify-center mb-10">
            <img src="/logoMambee2.png" alt="Mambee" className="w-90" />
          </div>

          <h1 className="text-4xl font-semibold text-center text-gray-800 mb-12">
            Entrar no sistema
          </h1>

          {/* Google */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-5 border-2 border-gray-300 py-5 rounded-2xl text-xl font-semibold text-gray-800 hover:bg-gray-50 transition mb-6"
          >
            <FcGoogle className="w-8 h-8" />
            Entrar com Google
          </button>

          {/* Apple */}
          <button
            type="button"
            onClick={handleAppleLogin}
            className="w-full flex items-center justify-center gap-5 bg-black text-white py-5 rounded-2xl text-xl font-semibold hover:bg-gray-900 transition"
          >
            <FaApple className="w-7 h-7" />
            Entrar com Apple
          </button>
        </div>
      </main>
    </>
  );
}
