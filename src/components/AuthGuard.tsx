"use client";

import { supabase } from "@/lib/supabase/browser/supabaseClient";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  const handleAuth = useCallback((session: any) => {
    const user = session?.user ?? null;
    const publicRoutes = ["/", "/login", "/agendamentos"];
    const isPublicRoute = publicRoutes.includes(pathname);

    if (!user && !isPublicRoute) {
      router.replace("/login");
    } else if (user && pathname === "/login") {
      router.replace("/reservar");
    }

    setLoading(false);
  }, [pathname, router]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('session works')
      handleAuth(session);
    }).catch((err) => {
      console.error("Session fetch error:", err);
      setLoading(false);
    });

    // 2. Listen for changes (this handles logins/logouts)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      handleAuth(session);
    });

    return () => subscription.unsubscribe();
  }, [handleAuth]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-300 border-solid"></div>
      </div>
    );
  }

  return <>{children}</>;
}
