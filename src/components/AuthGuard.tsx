"use client";

import { createBrowserClient } from "@supabase/ssr";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  useEffect(() => {
    async function checkAuth() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const user = session?.user ?? null;
      const publicRoutes = ["/", "/login"];

      if (!user && !publicRoutes.includes(pathname)) {
        // not logged in -> redirect to login
        router.replace("/login");
      } else if (user && publicRoutes.includes(pathname)) {
        // logged in but visiting public route -> redirect to dashboard
        router.replace("/dashboard");
      }

      setLoading(false);
    }

    checkAuth();

    // listen for real-time auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => checkAuth());

    return () => subscription.unsubscribe();
  }, [pathname, router, supabase]);

  if (loading) return null; // or a spinner

  return <>{children}</>;
}
