"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const linkClasses = (href: string) =>
    `px-4 py-2 rounded-md transition-colors ${
      pathname === href
        ? "bg-gray-700 text-white"
        : "text-gray-700 hover:bg-blue-100"
    }`;

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <h1 className="text-xl font-bold text-gray-700">Mambee Spaces</h1>
        <div className="flex gap-2">
          <Link href="/" className={linkClasses("/")}>
            Home
          </Link>
          <Link href="/sobre" className={linkClasses("/sobre")}>
            Sobre
          </Link>
          <Link href="/usuarios" className={linkClasses("/usuarios")}>
            Usuarios
          </Link>
        </div>
      </div>
    </nav>
  );
}
