"use client";
import { useState } from "react";
import React, { useEffect } from 'react';
import Image from "next/image";

type UsuarioInfo = {
    nome: string;
    email:string;
    foto?: string;
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

      const res = await fetch(`/api/relatorio_guarita`); 
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
      <div className="overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-y-4 text-sm">
          <thead>
            <tr className="text-left text-gray-600">
              <th className="p-2 font-normal pl-6">Usuário</th>
              <th className="p-2 font-normal">Sala</th>
              <th className="p-2 font-normal">Espaço</th>
              <th className="p-2 font-normal text-center">Horário</th>
              <th className="p-2 font-normal text-center">Data</th>
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
                  <td className="bg-gray-50 p-4 rounded-l-lg border-l-[6px] border-teal-500 relative">
                    <div className="flex items-center gap-3">
                      {item.Usuario?.foto ? (
                        <Image
                          src={item.Usuario?.foto}
                          alt={item.Usuario?.nome}
                          width={40}
                          height={40}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <Image
                          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                            item.Usuario?.nome ?? "Usuário",
                          )}&background=0c9488&color=fff&size=64`}
                          alt={item.Usuario?.nome || "—"}
                          width={40}
                          height={40}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      )}

                      <div>
                        <div className="text-gray-700 font-medium">
                          {item.Usuario?.nome || "—"}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="bg-gray-50 p-4 text-gray-600">
                    {item.Espaco?.Sala.nomeSala || "—"}
                  </td>

                  <td className="bg-gray-50 p-4 text-gray-600">
                    {item.Espaco?.codigoEspaco || "—"}
                  </td>

                  <td className="bg-gray-50 p-4 text-center text-gray-600 font-medium">
                    {formatarHora(item.horaInicio)} - {formatarHora(item.horaFim)}
                  </td>

                  <td className="bg-gray-50 p-4 text-center text-gray-600 rounded-r-lg">
                    {formatarData(item.horaInicio) || "—"}
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


