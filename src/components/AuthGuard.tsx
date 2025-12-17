"use client";

import { supabase } from "@/lib/supabase/browser/supabaseClient";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    async function checkAuth() {
      try {
        console.log("init checkAuth...", supabase);
        const {
          data: { session },
        } = await supabase.auth.getSession();
        console.log("after get user from supabase...");

        const user = session?.user ?? null;
        const login = "/login";
        const publicRoutes = ["/", "/login", "/agendamentos"];

        if (!user && !publicRoutes.includes(pathname)) {
          router.replace("/login");
        } else if (user && login === pathname) {
          router.replace("/reservar");
        }

        setLoading(false);
      } catch (error) {
        console.error("Auth check error:", error);
      } finally {
        setLoading(false);
      }
    }

    checkAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => checkAuth());
    return () => subscription.unsubscribe();
  }, [pathname, router]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-300 border-solid"></div>
      </div>
    );

  return <>{children}</>;
}
