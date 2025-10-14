"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const linkClasses = (href: string) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      pathname === href
        ? "bg-gray-700 text-white"
        : "text-gray-700 hover:bg-blue-100"
    }`;

  return (
    <nav className="bg-white shadow-md w-full">
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2 flex-shrink-0">
          <Link href={"/"}>
            <Image
              src="/logo-mambee.png"
              alt="Logo Mambee"
              width={40}
              height={40}
              className="object-contain w-14 ml-2"
            />
          </Link>
          <h1 className="text-lg sm:text-xl font-bold">
            <span className="text-[#C76E88]">Mambee</span> Space
          </h1>
        </div>
        <div className="flex flex-wrap gap-2 mt-3 sm:mt-0">
          <Link href="/sobre" className={linkClasses("/sobre")}>
            Sobre
          </Link>
          <Link href="/usuarios" className={linkClasses("/usuarios")}>
            Usuários
          </Link>
        </div>
      </div>
    </nav>
  );
}
