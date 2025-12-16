"use client";

import { supabase } from "@/lib/supabaseClient";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        const user = session?.user ?? null;
        const login = "/login";
        const publicRoutes = ["/", "/login", "/agendamentos"];

        if (!user && !publicRoutes.includes(pathname)) {
          // not logged in -> redirect to login
          router.replace("/login");
        } else if (user && login === pathname) {
          // logged in but visiting public route -> redirect to dashboard
          router.replace("/reservar");
        }

        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    }

    checkAuth();

    // listen for real-time auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => checkAuth());

    return () => subscription.unsubscribe();
  }, [pathname, router]);

  if (loading) return null; // or a spinner

  return <>{children}</>;
}
