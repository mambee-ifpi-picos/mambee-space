"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function RelatoriosPage() {
  const router = useRouter();

  const relatorios = [
    { nome: "Agendamentos", url: "/relatorio" },
    { nome: "Relatório", url: "/relatorioguarita" },
  ];

  return (
    <section className="min-h-screen flex items-center justify-center bg-white p-6 md:p-8">
      <div className="flex flex-col-reverse md:flex-row items-center justify-center gap-12 md:gap-40 w-full max-w-6xl">
        <div className="flex flex-col gap-5 w-full max-w-[280px]">
          {relatorios.map((r, idx) => (
            <motion.button
              key={idx}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push(r.url)}
              className="bg-white border border-pink-100 text-gray-800 text-lg md:text-xl font-light py-5 md:py-6 px-4 rounded-2xl shadow-[0_8px_20px_-5px_rgba(255,192,203,1)] hover:shadow-[0_12px_25px_-5px_rgba(255,192,203,1)] transition-all duration-300 w-full"
            >
              {r.nome}
            </motion.button>
          ))}
        </div>

        <div className="w-full max-w-xl flex flex-col items-center md:items-start">
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-6 md:mb-10 drop-shadow-md text-center md:text-left">
            Relatórios
          </h1>

          <p className="text-black text-base md:text-lg leading-relaxed text-justify">
            Gerencie o fluxo de acesso com precisão. Visualize a lista completa de pessoas agendadas para o dia de hoje
            ou consulte o histórico de visitas buscando por uma data específica.
          </p>
        </div>
      </div>
    </section>
  );
}
