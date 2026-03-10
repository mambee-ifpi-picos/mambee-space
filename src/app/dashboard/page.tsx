"use client";

import { TopUsuario } from "@/utils/tipos";
import { useEffect, useState } from "react";
import { FaSyncAlt } from "react-icons/fa";
import { LoadingError } from "@/components/dashboard/LoadingError";
import { CardTotalReservas } from "@/components/dashboard/CardTotalReservas";
import { CardInfoCinza } from "@/components/dashboard/CardInfoCinza";
import { GraficoHorarios } from "@/components/dashboard/GraficoHorarios";
import { GraficoFrequencia } from "@/components/dashboard/GraficoFrequencia";
import { CardInatividade } from "@/components/dashboard/CardInatividade";
import { CardAtividade } from "@/components/dashboard/CardAtividade";
import { TopFrequentadores } from "@/components/dashboard/TopFrequentadores";

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
  totalAtividade: number;
  topMes: TopUsuario[];
  topSemana: TopUsuario[];
  totalReservas: number;
};

let cacheDados: DashboardData | null = null;

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(cacheDados);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(!cacheDados);
  const [ultimaAtualizacao, setUltimaAtualizacao] = useState<string | null>(null);

  const carregarDados = () => {
    setLoading(true);
    setError(null);

    fetch("/api/dashboard")
      .then((r) => {
        if (r.status === 401) throw new Error("Não autorizado (Faça login novamente)");
        if (!r.ok) throw new Error("Erro ao carregar dashboard");
        return r.json();
      })
      .then((json: DashboardData) => {
        cacheDados = json;
        setData(json);
        setUltimaAtualizacao(new Date().toLocaleTimeString("pt-BR"));
        setLoading(false);
      })
      .catch(() => {
        setError("Falha ao carregar dados. Verifique seu login.");
        setLoading(false);
      });
  };

  useEffect(() => {
    if (!cacheDados) {
      carregarDados();
    }
  }, []);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <LoadingError error={error} loading={false} />
        <button
          onClick={carregarDados}
          className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition"
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  if (loading) {
    return <LoadingError error={null} loading={true} />;
  }

  if (!data) return null;

  const { graficos, frequenciaDias, totalInatividade, totalAtividade, totalReservas, topMes, topSemana } = data;

  const manhaData = graficos?.manha.map((v, i) => ({
    hora: `${6 + i}h`,
    valor: v,
  }));

  const tardeData = graficos?.tarde.map((v, i) => ({
    hora: `${13 + i}h`,
    valor: v,
  }));

  const ordemDias = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

  const freqData = ordemDias.map((dia) => ({
    dia,
    valor: frequenciaDias[dia] ?? 0,
  }));

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-end items-center gap-4 mb-6">
        {ultimaAtualizacao && (
          <p className="text-sm text-gray-500 font-medium">Última atualização: {ultimaAtualizacao}</p>
        )}
        <button
          onClick={carregarDados}
          className="flex items-center gap-2 bg-white text-gray-700 px-4 py-2 rounded-lg shadow-sm border border-gray-200 hover:bg-gray-50 hover:text-pink-600 transition-all font-medium text-sm"
        >
          <FaSyncAlt className={loading ? "animate-spin" : ""} />
          Atualizar Dados
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <CardTotalReservas totalReservas={totalReservas} />
        <CardInfoCinza />
        <CardInatividade totalInatividade={totalInatividade} />
        <CardAtividade totalAtividade={totalAtividade} />
        <GraficoHorarios periodo="manha" data={manhaData} />
        <GraficoHorarios periodo="tarde" data={tardeData} />
        <GraficoFrequencia data={freqData} />
        <TopFrequentadores titulo="TOP FREQUENTADORES DO MÊS" usuarios={topMes} periodo="mês" />
        <TopFrequentadores titulo="TOP FREQUENTADORES DA SEMANA" usuarios={topSemana} periodo="semana" />
      </div>
    </div>
  );
}
