"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, User, FileText, PlusCircle, ClipboardList } from "lucide-react";
import Image from "next/image";

export function Menu({ isOpen }: { isOpen: boolean }) {
  const pathname = usePathname();

  const links = [
    { href: "/dashboard", label: "Dashboard", icon: <Home size={18} /> },
    {
      href: "/reservas",
      label: "Minhas Reservas",
      icon: <ClipboardList size={18} />,
    },
    { href: "/relatorio", label: "Relatório", icon: <FileText size={18} /> },
    {
      href: "/relatorioguarita",
      label: "Relatorio Guarita",
      icon: <FileText size={18} />,
    },
    { href: "/perfil", label: "Perfil", icon: <User size={18} /> },
  ];

  return (
    <aside
      className={`h-screen w-64 bg-[#f3f3f3] flex flex-col p-4 transition-all duration-300 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="flex items-center gap-2 px-2 py-4 mb-4">
        <Image
          src="/logo-mambee.png"
          alt="Mambee Logo"
          width={96}
          height={40}
          className="w-24"
        />
      </div>

      <nav className="flex flex-col gap-1">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-2 px-3 py-2 rounded transition ${
              pathname === link.href
                ? "bg-gray-300 font-semibold"
                : "hover:bg-gray-200"
            }`}
          >
            {link.icon}
            <span>{link.label}</span>
          </Link>
        ))}

        <Link
          href="/reservar"
          className="mt-4 flex items-center gap-2 px-3 py-2 rounded bg-teal-500 text-white hover:bg-teal-600 transition"
        >
          <PlusCircle size={18} />
          <span>Nova Reserva</span>
        </Link>
      </nav>
    </aside>
  );
}
