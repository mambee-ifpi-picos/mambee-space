/** biome-ignore-all lint/a11y/useAriaPropsSupportedByRole: <explanation> */
"use client";

import { TopUsuario } from "@/utils/tipos";
import { useEffect, useState } from "react";
import { LoadingError } from "./LoadingError";
import { CardTotalReservas } from "./CardTotalReservas";
import { CardInfoCinza } from "./CardInfoCinza";
//import { CardUsoEspacos } from "./CardUsoEspacos";
import { GraficoHorarios } from "./GraficoHorarios";
//import { GraficoFrequencia } from "./GraficoFrequencia";
//import { CardInatividade } from "./CardMinhasReservas";
import { TopFrequentadores } from "./TopFrequentadores";

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
  totalReservas: number;
};

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => {
        if (!r.ok) throw new Error("Erro ao carregar dashboard");
        return r.json();
      })
      .then((json: DashboardData) => {
        setData(json);
        setLoading(false);
      })
      .catch(() => {
        setError("Falha ao carregar dados");
        setLoading(false);
      });
  }, []);

  if (error || loading) {
    return <LoadingError error={error} loading={loading} />;
  }

  if (!data) return null;

  const { espacosUtilizados, graficos, frequenciaDias, totalInatividade, totalReservas, topMes, topSemana } = data;

  const manhaData = graficos?.manha.map((v, i) => ({
    hora: `${6 + i}h`,
    valor: v,
  }));

  const tardeData = graficos?.tarde.map((v, i) => ({
    hora: `${13 + i}h`,
    valor: v,
  }));

  const freqData = Object.entries(frequenciaDias ? frequenciaDias : []).map(([dia, valor]) => ({
    dia,
    valor,
  }));

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="grid grid-cols-4 gap-4">
        <CardTotalReservas totalReservas={totalReservas} />

        <CardInfoCinza />

        <GraficoHorarios periodo="manha" data={manhaData} />

        <GraficoHorarios periodo="tarde" data={tardeData} />

        <TopFrequentadores titulo="TOP FREQUENTADORES DO MÊS" usuarios={topMes} periodo="mês" />

        <TopFrequentadores titulo="TOP FREQUENTADORES DA SEMANA" usuarios={topSemana} periodo="semana" />
      </div>
    </div>
  );
}