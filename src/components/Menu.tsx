"use client";

import {
  FileText,
  PlusCircle,
  User,
  X,
  LayoutDashboard,
  CalendarCheck,
  CalendarDays,
  PanelTopBottomDashed,
  Building,
  FolderKanban,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";

type MenuProps = {
  isOpen: boolean;
  isAdmin: boolean;
  onClose: () => void;
  mobileClose: () => void;
};

export function Menu({ isOpen, isAdmin, onClose, mobileClose }: MenuProps) {
  const pathname = usePathname();

  const links = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard size={18} />,
    },
    {
      href: "/reservas",
      label: "Minhas Reservas",
      icon: <CalendarCheck size={18} />,
    },
    {
      href: "/projetos",
      label: "Projetos",
      icon: <FolderKanban size={18} />,
    },
    {
      href: "/salas",
      label: "Salas",
      icon: <Building size={18} />,
      adminOnly: true,
    },
    {
      href: "/agendamentos",
      label: "Agendamentos",
      icon: <CalendarDays size={18} />,
    },
    { href: "/relatorio", label: "Relatório", icon: <FileText size={18} /> },
    { href: "/perfil", label: "Perfil", icon: <User size={18} /> },
  ];

  const visibleLinks = links.filter((link) => !link.adminOnly || isAdmin);

  return (
    <>
      {isOpen && <div className="fixed inset-0 z-40 bg-black/40 overlay-mobile" onClick={onClose} />}

      <aside
        className={`
          md:sticky top-0 left-0 z-50
          w-64 h-screen
          bg-[#f3f3f3] p-4 flex flex-col
          transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full hidden"}
        `}
      >
        <div className="flex items-center justify-between px-2 py-2 mb-4">
          <Image src="/logo-mambee.png" alt="Mambee Logo" width={96} height={40} className="w-24" priority />

          <button type="button" onClick={onClose} className="p-1 rounded hover:bg-gray-200 btn-close ">
            <X size={22} />
          </button>
        </div>

        <nav className="flex flex-col gap-1 flex-1">
          {visibleLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={mobileClose}
              className={`flex items-center gap-2 px-3 py-2 rounded transition
                ${pathname === link.href ? "bg-gray-300 font-semibold" : "hover:bg-gray-200"}`}
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          ))}

          <div className="mt-5">
            <Link
              href="/reservar"
              onClick={mobileClose}
              className="flex items-center gap-2 px-3 py-2 rounded bg-teal-500 text-white hover:bg-teal-600 transition"
            >
              <PlusCircle size={18} />
              <span>Nova Reserva</span>
            </Link>
          </div>
        </nav>

        {/* Rodapé do Menu */}
        <div className="flex flex-col items-start gap-4 mt-auto pt-6 pb-2 border-t border-gray-200">
          <LogoutButton />
          <span className="text-xs text-gray-400 font-medium">Versão 2.0</span>
        </div>
      </aside>
    </>
  );
}
