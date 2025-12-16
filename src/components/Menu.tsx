"use client";

import {
  ClipboardList,
  FileText,
  Home,
  PlusCircle,
  User,
  LayoutGrid,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "./LogoutButton";

type MenuProps = {
  isOpen: boolean;
  isAdmin: boolean;
  onClose: () => void;
};

export function Menu({ isOpen, isAdmin, onClose }: MenuProps) {
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
      href: "/relatorio_guarita",
      label: "Relatório Guarita",
      icon: <FileText size={18} />,
    },
    { href: "/perfil", label: "Perfil", icon: <User size={18} /> },
  ];

  return (
    <>
      {/* Overlay (mobile + desktop) */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black/40" onClick={onClose} />
      )}

      <aside
        className={`
          fixed top-0 left-0 z-50
          h-screen w-64
          bg-[#f3f3f3] p-4 flex flex-col
          transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Topo */}
        <div className="flex items-center justify-between px-2 py-2 mb-4">
          <Image
            src="/logo-mambee.png"
            alt="Mambee Logo"
            width={96}
            height={40}
            className="w-24"
            priority
          />

          {/* X aparece em TODAS as telas */}
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded hover:bg-gray-200"
          >
            <X size={22} />
          </button>
        </div>

        <nav className="flex flex-col gap-1 flex-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className={`flex items-center gap-2 px-3 py-2 rounded transition
                ${
                  pathname === link.href
                    ? "bg-gray-300 font-semibold"
                    : "hover:bg-gray-200"
                }`}
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          ))}

          {isAdmin && (
            <Link
              href="/sala_espaco"
              onClick={onClose}
              className={`flex items-center gap-2 px-3 py-2 rounded transition
                ${
                  pathname === "/sala_espaco"
                    ? "bg-gray-300 font-semibold"
                    : "hover:bg-gray-200"
                }`}
            >
              <LayoutGrid size={18} />
              <span>Criar Sala e Espaço</span>
            </Link>
          )}

          <Link
            href="/reservar"
            onClick={onClose}
            className="mt-4 flex items-center gap-2 px-3 py-2 rounded bg-teal-500 text-white hover:bg-teal-600 transition"
          >
            <PlusCircle size={18} />
            <span>Nova Reserva</span>
          </Link>

          <div className="mt-5"></div>
        </nav>
        <LogoutButton />
      </aside>
    </>
  );
}
