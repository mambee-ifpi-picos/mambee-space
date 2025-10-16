"use client";

import { motion } from "framer-motion";
import Sobre from "@/components/sobre";
import Relatorios from "@/components/relatorios";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <>
        <section className="flex flex-col justify-center min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 px-6 sm:px-12 md:px-20 lg:px-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-pink-100 via-white to-transparent opacity-60"></div>

        <div className="relative w-full max-w-5xl mx-auto text-center md:text-left z-10">
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6"
          >
            O que é o{" "}
            <span className="text-[#C76E88] drop-shadow-sm">Mambee</span>{" "}
            <span className="text-[#4B4B4B]">Space?</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-gray-700 text-lg sm:text-xl leading-relaxed text-justify"
          >
            O <strong>Mambee Space</strong> é um sistema online inovador para o{" "}
            <strong>agendamento de salas e espaços</strong>. A primeira unidade
            a utilizá-lo é a <strong>Mambee</strong> — Fábrica e Escola de
            Software do <strong>Instituto Federal do Piauí (IFPI)</strong>.
            Desenvolvido com foco em praticidade e transparência, o sistema
            permite visualizar espaços disponíveis, realizar e cancelar reservas
            e gerar relatórios completos. Tudo isso de forma{" "}
            <strong>simples, rápida e segura</strong>, proporcionando um ambiente
            ideal para estudos, reuniões e projetos colaborativos.
          </motion.p>
        </div>
      </section>

      <div className="w-full overflow-hidden leading-[0] rotate-180">
        <svg
          className="relative block w-[calc(120%+1.3px)] h-[80px]"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M321.39 56.44C197.52 76.24 94.57 107.33 0 120V0h1200v27.35c-98.62 36.88-185.91 68.5-287.63 77.3-106.21 9.21-221.08-1.74-325.33-16.15C464.09 73.76 378.82 47.72 321.39 56.44z"
            className="fill-[#C76E88]"
          ></path>
        </svg>
      </div>

      <section id="sobre">
        <Sobre />
      </section>

      <section id="relatorios">
        <Relatorios />
      </section>
    </>
    
  );
  
}
