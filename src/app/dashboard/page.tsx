"use client";

import { useEffect, useState } from "react";

/** Tipos inline (sem criar arquivo extra) */
type TopUsuario = {
  nome: string;
  email: string;
  total: number;
};

type DashboardData = {
  espacoMaisUtilizado: string;
  percentualOcupacao: number;
  salaMaisUsada: string;
  totalUsuariosSala: number;
  espacosUtilizados: {
    mensal: number;
    semanal: number;
    diario: number;
  };
  horarioMaisUsado: string;
  frequenciaDias: Record<string, number>; // ex: { DOM: 2, SEG: 5, ... }
  totalInatividade: number;
  topMes: TopUsuario[];
  topSemana: TopUsuario[];
};

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => {
        if (!r.ok) throw new Error("Erro ao carregar dashboard");
        return r.json();
      })
      .then((json: DashboardData) => setData(json))
      .catch((e) => {
        console.error(e);
        setError("Falha ao carregar dados");
      });
  }, []);

  if (error) return <p className="p-4 text-red-600">{error}</p>;
  if (!data) return <p className="p-4">Carregando...</p>;

  const {
    espacoMaisUtilizado,
    percentualOcupacao,
    salaMaisUsada,
    totalUsuariosSala,
    espacosUtilizados,
    horarioMaisUsado,
    frequenciaDias,
    totalInatividade,
    topMes,
    topSemana,
  } = data;

  // --- Correção do problema: garantir que Object.entries seja [string, number][] ---
  // Aqui explicitamente forçamos o tipo para o que sabemos que o backend retorna.
  const freqEntries = Object.entries(frequenciaDias) as [string, number][];

  return (
    <div className="grid grid-cols-3 gap-4 p-6">
      {/* Espaço mais utilizado */}
      <div className="p-4 bg-teal-500 text-white rounded shadow col-span-1">
        <p className="text-xs">ESPAÇO MAIS UTILIZADO</p>
        <p className="text-4xl font-bold">{percentualOcupacao}%</p>
        <p className="font-semibold">{espacoMaisUtilizado}</p>
      </div>

      {/* Sala mais utilizada */}
      <div className="p-4 bg-white rounded shadow col-span-1">
        <p className="text-xs">SALA MAIS UTILIZADA</p>
        <p className="text-xl font-bold">{salaMaisUsada}</p>
        <p className="text-sm">{totalUsuariosSala} usuários</p>
      </div>

      {/* Espaços utilizados - mensal/semanal/diario */}
      <div className="p-4 bg-white rounded shadow col-span-1 flex justify-around">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full border-4 border-teal-400 flex items-center justify-center text-xl font-bold">
            {espacosUtilizados?.mensal ?? 0}
          </div>
          <p className="text-xs mt-1">Mensal</p>
        </div>

        <div className="text-center">
          <div className="w-16 h-16 rounded-full border-4 border-yellow-400 flex items-center justify-center text-xl font-bold">
            {espacosUtilizados?.semanal ?? 0}
          </div>
          <p className="text-xs mt-1">Semanal</p>
        </div>

        <div className="text-center">
          <div className="w-16 h-16 rounded-full border-4 border-red-400 flex items-center justify-center text-xl font-bold">
            {espacosUtilizados?.diario ?? 0}
          </div>
          <p className="text-xs mt-1">Diário</p>
        </div>
      </div>

      {/* Horário mais usado */}
      <div className="p-4 bg-white rounded shadow col-span-1">
        <p className="text-xs">HORÁRIO MAIS UTILIZADO</p>
        <p className="text-3xl font-bold">{horarioMaisUsado}</p>
      </div>

      {/* Frequência por dia */}
      <div className="p-4 bg-white rounded shadow col-span-2">
        <p className="text-xs mb-2">FREQUÊNCIA POR DIA DA SEMANA</p>

        <div className="grid grid-cols-7 gap-2 items-end h-28">
          {freqEntries.map(([dia, val]) => {
            // val já é number aqui — dá pra usar sem erro
            const height = Math.max(6, val * 10); // evita barra zero invisível
            return (
              <div key={dia} className="text-center">
                <div
                  className="mx-auto w-8 rounded bg-teal-300"
                  style={{ height: `${height}px` }}
                  role="img"
                  aria-label={`Barra do dia ${dia} com valor ${val}`}
                />

                <p className="text-xs mt-1">{dia}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Inatividade */}
      <div className="p-4 bg-white rounded shadow col-span-1">
        <p className="text-xs">INATIVIDADE</p>
        <p className="text-xl font-bold">{totalInatividade}</p>
      </div>

      {/* Top mês */}
      <div className="p-4 bg-white rounded shadow col-span-1">
        <p className="text-xs mb-2">TOP FREQUENTADORES DO MÊS</p>
        <ul className="text-sm">
          {topMes.map((u) => (
            <li key={u.email}>
              {u.nome} ({u.email}) - {u.total}
            </li>
          ))}
        </ul>
      </div>

      {/* Top semana */}
      <div className="p-4 bg-white rounded shadow col-span-1">
        <p className="text-xs mb-2">TOP FREQUENTADORES DA SEMANA</p>
        <ul className="text-sm">
          {topSemana.map((u) => (
            <li key={u.email}>
              {u.nome} ({u.email}) - {u.total}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
