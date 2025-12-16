/** biome-ignore-all lint/a11y/useAriaPropsSupportedByRole: <explanation> */
"use client";

import { TopUsuario } from "@/utils/tipos";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type DashboardData = {
  espacoMaisUtilizado: string;
  percentualOcupacao: number;
  espacosUtilizados: {
    mensal: number;
    semanal: number;
    diario: number;
  };
  graficos: {
    manha: number[];
    tarde: number[];
  };
  frequenciaDias: Record<string, number>;
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
      .catch(() => setError("Falha ao carregar dados"));
  }, []);

  if (error) return <p className="p-4 text-red-600">{error}</p>;
  if (!data) return <p className="p-4">Carregando...</p>;

  const {
    espacoMaisUtilizado,
    percentualOcupacao,
    espacosUtilizados,
    graficos,
    frequenciaDias,
    totalInatividade,
    totalReservas,
    topMes,
    topSemana,
  } = data;

  console.log("data", data);

  const manhaData = graficos?.manha.map((v, i) => ({
    hora: `${6 + i}h`,
    valor: v,
  }));

  const tardeData = graficos?.tarde.map((v, i) => ({
    hora: `${13 + i}h`,
    valor: v,
  }));

  const freqData = Object.entries(frequenciaDias ? frequenciaDias : []).map(
    ([dia, valor]) => ({
      dia,
      valor,
    }),
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="grid grid-cols-4 gap-4">
        <div
          className="col-span-1 bg-teal-500 text-white p-5 rounded-lg shadow flex flex-col"
          aria-label="Card espaço mais utilizado"
        >
          <p className="text-xs font-semibold">Total de reservas</p>
          <p className="text-5xl font-extrabold mt-2">{totalReservas}</p>
          {/*<p className="text-xl font-semibold mt-2">{espacoMaisUtilizado}</p>*/}
        </div>

        <div
          className="col-span-2 bg-gray-300 p-5 rounded-lg shadow"
          aria-label="Card informativo cinza"
        />

        <div
          className="col-span-1 bg-white p-5 rounded-lg shadow"
          aria-label="Uso dos espaços"
        >
          <p className="text-xs font-semibold">USO DOS ESPAÇOS (%)</p>

          <div className="mt-4 flex justify-between">
            <div className="text-center" aria-label="Uso mensal">
              <div className="w-16 h-16 rounded-full border-4 border-teal-400 flex items-center justify-center font-bold text-teal-600 text-xl">
                {espacosUtilizados?.mensal}%
              </div>
              <p className="text-xs mt-1">Mensal</p>
            </div>

            <div className="text-center" aria-label="Uso semanal">
              <div className="w-16 h-16 rounded-full border-4 border-yellow-400 flex items-center justify-center font-bold text-yellow-600 text-xl">
                {espacosUtilizados?.semanal}%
              </div>
              <p className="text-xs mt-1">Semanal</p>
            </div>

            <div className="text-center" aria-label="Uso diário">
              <div className="w-16 h-16 rounded-full border-4 border-red-400 flex items-center justify-center font-bold text-red-600 text-xl">
                {espacosUtilizados?.diario}%
              </div>
              <p className="text-xs mt-1">Diário</p>
            </div>
          </div>
        </div>

        <div
          className="col-span-1 bg-white p-4 rounded-lg shadow"
          aria-label="Gráfico da manhã"
        >
          <p className="text-xs font-semibold mb-2">
            HORÁRIOS MAIS UTILIZADO MANHÃ
          </p>
          <div className="w-full h-40">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={manhaData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="hora" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="valor"
                  stroke="#000"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div
          className="col-span-1 bg-white p-4 rounded-lg shadow"
          aria-label="Gráfico da tarde"
        >
          <p className="text-xs font-semibold mb-2">
            HORÁRIOS MAIS UTILIZADO TARDE
          </p>
          <div className="w-full h-40">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={tardeData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="hora" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="valor"
                  stroke="#000"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div
          className="col-span-2 bg-white p-5 rounded-lg shadow"
          aria-label="Frequência por dia da semana"
        >
          <p className="text-xs font-semibold mb-2">
            FREQUÊNCIA POR DIA DA SEMANA
          </p>

          <div className="w-full h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={freqData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="dia" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="valor" fill="#14b8a6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div
          className="col-span-1 bg-white p-5 rounded-lg shadow flex flex-col justify-between"
          aria-label="Card de inatividade"
        >
          <p className="text-xs font-semibold">INATIVIDADE</p>
          <p className="text-5xl font-bold">{totalInatividade}</p>
          <p className="text-xs text-gray-500">
            Não frequentaram nenhum dia na última semana.
          </p>
        </div>

        <div
          className="col-span-2 bg-white p-5 rounded-lg shadow"
          aria-label="Top do mês"
        >
          <p className="text-xs font-semibold mb-3">
            TOP FREQUENTADORES DO MÊS
          </p>

          {topMes?.length === 0 && (
            <p className="text-xs text-gray-500">Sem dados</p>
          )}

          {topMes?.map((u, i) => (
            <div
              key={u.nome}
              className={`flex justify-between items-center py-2 border-b last:border-b-0
              ${i === 0 ? "text-xl font-bold text-yellow-600" : ""}
              ${i === 1 ? "text-lg font-semibold text-gray-700" : ""}
              ${i === 2 ? "text-base font-medium text-gray-600" : ""}`}
            >
              <span>
                {i === 0 && "🥇 "}
                {i === 1 && "🥈 "}
                {i === 2 && "🥉 "}
                {i + 1}° — {u.nome}
              </span>
              <span>{u.total} visitas</span>
            </div>
          ))}
        </div>

        <div
          className="col-span-2 bg-white p-5 rounded-lg shadow"
          aria-label="Top da semana"
        >
          <p className="text-xs font-semibold mb-3">
            TOP FREQUENTADORES DA SEMANA
          </p>

          {topSemana?.length === 0 && (
            <p className="text-xs text-gray-500">Sem dados</p>
          )}

          {topSemana?.map((u, i) => (
            <div
              key={u.nome}
              className={`flex justify-between items-center py-2 border-b last:border-b-0
              ${i === 0 ? "text-xl font-bold text-yellow-600" : ""}
              ${i === 1 ? "text-lg font-semibold text-gray-700" : ""}
              ${i === 2 ? "text-base font-medium text-gray-600" : ""}`}
            >
              <span>
                {i === 0 && "🥇 "}
                {i === 1 && "🥈 "}
                {i === 2 && "🥉 "}
                {i + 1}° — {u.nome}
              </span>
              <span>{u.total} visitas</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
