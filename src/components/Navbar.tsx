"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Navbar() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full bg-white shadow-md z-50"
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo-mambee.png"
            alt="Logo Mambee"
            width={40}
            height={40}
            className="object-contain w-12"
          />
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
            <span className="text-[#C76E88]">Mambee</span> Space
          </h1>
        </Link>

        <div className="hidden md:flex space-x-6">
          <a
            href="#sobre"
            className="text-gray-700 hover:text-[#C76E88] font-medium transition-colors"
          >
            Sobre
          </a>
          <a
            href="#relatorios"
            className="text-gray-700 hover:text-[#C76E88] font-medium transition-colors"
          >
            Relatórios
          </a>
        </div>
      </div>
    </motion.nav>
  );
}
