"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Menu } from "@/components/Menu";
import { Menu as MenuIcon, X } from "lucide-react";
import "./globals.css";

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <html lang="pt-BR">
        <body>
          <Navbar />
          <main>{children}</main>
        </body>
      </html>
    );
  }

  const isLanding = pathname === "/";

  return (
    <html lang="pt-BR">
      <body>
        <Navbar />

        <div className="flex min-h-[calc(100vh-160px)]">
          {!isLanding && (
            <div
              className={`transition-all duration-300 ${
                open ? "w-64" : "w-0"
              } overflow-hidden`}
            >
              <Menu isOpen={open} />
            </div>
          )}

          <div className="flex-1 transition-all duration-300">
            {!isLanding && (
              <button
                type="button"
                onClick={() => setOpen(!open)}
                className="p-3"
              >
                {open ? <X size={24} /> : <MenuIcon size={24} />}
              </button>
            )}

            <main className="flex flex-col min-h-[calc(100vh-120px)]">
              {children}
            </main>
          </div>
        </div>

        <footer className="row-start-3 flex flex-wrap items-center justify-center gap-6 bg-gray-700 p-4 text-white">
          Mambee2025
        </footer>
      </body>
    </html>
  );
}
