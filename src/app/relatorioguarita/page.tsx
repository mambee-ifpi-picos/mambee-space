"use client";
import { useState } from "react";
import React, { useEffect } from 'react';

type UsuarioInfo = {
    nome: string;
    email:string;
};

type SalaInfo = {
    nomeSala: string;
};

type EspacoInfo = {
    codigoEspaco: string;
    Sala: SalaInfo;
};

type RelatorioItem = {
  idReserva: number,
  motivo: string,
  horaInicio: string,
  horaFim: string,
  situacao: string,
  Usuario?: UsuarioInfo;
  Espaco?: EspacoInfo
};

function formatarHora(dataIso: string) {
  if (!dataIso) return "--:--";
  try {
    const data = new Date(dataIso);
    if (Number.isNaN(data.getTime())) {
      return dataIso.split(" ")[1]?.substring(0, 5) ?? "";
    }
    return data.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "--:--";
  }
}

function formatarData(dataIso: string) {
  if (!dataIso) return "--/--/----";
  try {
    const data = new Date(dataIso);
    if (Number.isNaN(data.getTime())) {
      return dataIso.split(" ")[0] ?? "";
    }
    return data.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return "--/--/----";
  }
}

export default function RelatorioPage() {
  const [dados, setDados] = useState<RelatorioItem[]>([]);
  const [carregando, setCarregando] = useState(false);

  async function buscarRelatorio() {
    setCarregando(true);
    try {

      const res = await fetch(`/api/relatorioguarita`); 
      const json = await res.json();

      if (json.success) {
        setDados(json.reservas ?? []); 
      } else {
        setDados([]);
      }
    } catch (err) {
      console.error("Falha ao buscar relatório:", err);
      setDados([]);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    buscarRelatorio();
  }, []); // O array vazio [] garante que a função seja executada apenas na montagem


  return (
    <div className="min-h-screen bg-white p-8 font-sans text-gray-700">
      <h1 className="text-4xl font-serif font-bold mb-8 text-black uppercase">
        Relatório
      </h1>

      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <div className="flex flex-col">
            <label
              htmlFor="sala-input"
              className="mb-1 text-sm font-medium text-gray-600"
            >
              Sala
            </label>
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="espaco-input"
              className="mb-1 text-sm font-medium text-gray-600"
            >
              Espaço
            </label>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          

      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-y-4 text-sm">
          <thead>
            <tr className="text-left text-gray-600">
              <th className="p-2 font-normal pl-6">Sala</th>
              <th className="p-2 font-normal">Espaço</th>
              <th className="p-2 font-normal text-center">Horário</th>
              <th className="p-2 font-normal text-center">Data</th>
              <th className="p-2 font-normal text-right pr-6">Status</th>
            </tr>
          </thead>
          <tbody>
            {dados.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="text-center p-6 text-gray-500 bg-gray-50 rounded"
                >
                  Nenhum resultado encontrado
                </td>
              </tr>
            ) : (
              dados.map((item) => (
                <tr
                  key={item.idReserva}
                  className="group transition-transform hover:scale-[1.01]"
                >
                  { <td className="bg-gray-50 p-4 rounded-l-lg border-l-[6px] border-teal-500 relative">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-500">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          role="img"
                        >
                          <title>Ícone de usuário</title>
                          <path
                            fillRule="evenodd"
                            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <span className="text-gray-700 font-medium">
                        {item.Espaco?.Sala.nomeSala}
                      </span>
                    </div>
                  </td> }

                  { <td className="bg-gray-50 p-4 text-gray-600">
                    {item.Espaco?.codigoEspaco}
                  </td> }

                  <td className="bg-gray-50 p-4 text-center text-gray-600 font-medium">
                    {formatarHora(item.horaInicio)} - {formatarHora(item.horaFim)}
                  </td>

                  <td className="bg-gray-50 p-4 text-center text-gray-600">
                    {formatarData(item.horaInicio)}
                  </td>

                  <td
                    className={`bg-gray-50 p-4 text-right pr-6 rounded-r-lg font-medium
                    ${
                      item.situacao === "Finalizado"
                        ? "text-teal-400"
                        : item.situacao === "Em aberto"
                          ? "text-pink-400"
                          : "text-gray-500"
                    }`}
                  >
                    {item.situacao}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
    </div>
  );
}


