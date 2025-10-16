"use client";

import { motion } from "framer-motion";
import { FaMapPin } from "react-icons/fa";

export default function RelatoriosPage() {
  const relatorios = [
    { nome: "Reservas Realizadas", cor: "text-blue-500" },
    { nome: "Cancelamentos", cor: "text-red-500" },
    { nome: "Ocupação Semanal", cor: "text-green-500" },
    { nome: "Usuários Ativos", cor: "text-yellow-500" },
    { nome: "Agendamentos por Horário", cor: "text-purple-500" },
    { nome: "Relatório Mensal", cor: "text-cyan-500" },
    { nome: "Comparativo de Uso", cor: "text-pink-500" },
    { nome: "Disponibilidade", cor: "text-lime-500" },
  ];

  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-100 py-20 px-8 text-center">
      <motion.h1
  initial={{ opacity: 0, y: -40 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
  viewport={{ once: true, amount: 0.3 }}
  className="text-4xl sm:text-5xl font-extrabold text-gray-800 mb-12"
>

        Relatórios
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: true }}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-10 md:gap-x-32"
      >
        {relatorios.map((r, idx) => (
          <div
            key={idx}
            className="flex items-center justify-center md:justify-start space-x-4 hover:scale-105 transition-transform duration-300"
          >
            <FaMapPin className={`${r.cor} text-4xl`} />
            <span className="text-lg sm:text-xl font-medium text-gray-800 hover:underline cursor-pointer">
              {r.nome}
            </span>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
