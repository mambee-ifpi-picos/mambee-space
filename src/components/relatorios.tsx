"use client";

import { FaMapPin } from "react-icons/fa";

export default function RelatoriosPage() {
  const relatorios = [
    { nome: "Relatório1", cor: "text-red-500" },
    { nome: "Relatório2", cor: "text-blue-500" },
    { nome: "Relatório3", cor: "text-green-500" },
    { nome: "Relatório4", cor: "text-yellow-500" },
    { nome: "Relatório5", cor: "text-cyan-500" },
    { nome: "Relatório6", cor: "text-purple-500" },
    { nome: "Relatório7", cor: "text-pink-500" },
    { nome: "Relatório8", cor: "text-lime-500" },
  ];

  const col1 = relatorios.slice(0, 4);
  const col2 = relatorios.slice(4, 8);

  return (
    <section className="min-h-screen flex flex-col items-center justify-start pt-24 bg-white text-center">
      <h1 style={{ fontSize: "50px" }} className="font-extrabold text-gray-800 mb-12">
        Relatórios
      </h1>

      <div className="grid grid-cols-2 gap-x-80">
        <div className="space-y-5">
          {col1.map((r, i) => (
            <div key={i} className="flex items-center space-x-3 text-blue-700">
              <FaMapPin className={`${r.cor} text-5xl`} />
              <span className="text-xl font-medium hover:underline cursor-pointer">
                {r.nome}
              </span>
            </div>
          ))}
        </div>

        <div className="space-y-5">
          {col2.map((r, i) => (
            <div key={i} className="flex items-center space-x-5 text-blue-700">
              <FaMapPin className={`${r.cor} text-5xl`} />
              <span className="text-xl font-medium hover:underline cursor-pointer">
                {r.nome}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
