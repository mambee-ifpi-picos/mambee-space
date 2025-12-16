"use client";

import { Menu } from "@/components/Menu";
import Navbar from "@/components/Navbar";
import { Menu as MenuIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { supabase } from "@/lib/supabaseClient";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const [open, setOpen] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    if (window.innerWidth < 768) {
      // if mobile
      setOpen(false);
    }

    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();

      if (!data?.user) {
        setIsAdmin(false);
        return;
      }

      const { data: usuario } = await supabase
        .from("Usuario")
        .select("admin")
        .eq("idAuth", data.user.id)
        .single();

      setIsAdmin(usuario?.admin ?? false);
    };

    loadUser();
  }, []);

  const hiddenMenuRoutes = ["/", "/login"];
  const isMenuHidden = hiddenMenuRoutes.includes(pathname);

  return (
    <>
      {pathname === "/" && <Navbar />}

      <div className="min-h-screen">
        {!isMenuHidden && isAdmin !== null && (
          <>
            <Menu
              isOpen={open}
              isAdmin={isAdmin}
              onClose={() => setOpen(false)}
            />

            {!open && (
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="p-3 absolute"
              >
                <MenuIcon size={24} />
              </button>
            )}
          </>
        )}

        <main className="p-4">{children}</main>
      </div>
    </>
  );
}
