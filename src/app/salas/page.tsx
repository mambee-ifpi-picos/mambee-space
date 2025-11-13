"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

type Espaco = {
  idEspaco: number;
  codigoEspaco: string;
  idSalaPertence: number;
};

type Sala = {
  idSala: number;
  nomeSala: string;
  mapa?: string;
  ativa?: boolean | null;
  limiteHorasReserva?: number | null;
  espacos?: Espaco[];
};

type ApiResponse = {
  success: boolean;
  salas?: Sala[];
  error?: string;
};

export default function ListaSalasPage() {
  const [salas, setSalas] = useState<Sala[]>([]);
  const [busca, setBusca] = useState("");
  const [termoAtivo, setTermoAtivo] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("created") === "1") {
      setShowSuccess(true);
    }
  }, [searchParams]);

  const carregarSalas = useCallback(async (searchTerm?: string) => {
    setLoading(true);
    setErro(null);

    try {
      let url = "/api/salas";

      const termo = searchTerm?.trim();
      if (termo && termo.length > 0) {
        url += `?search=${encodeURIComponent(termo)}`;
      }

      const res = await fetch(url, { cache: "no-store" });
      const json: ApiResponse = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || "Erro ao carregar salas.");
      }

      setSalas(json.salas || []);
    } catch (e: any) {
      setErro(e.message ?? "Erro ao carregar salas.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarSalas();
  }, [carregarSalas]);

  const salasFiltradas = useMemo(() => {
    if (!termoAtivo.trim()) return salas;

    const termo = termoAtivo.toLowerCase();

    return salas.filter((sala) => {
      const nomeSalaMatch = sala.nomeSala?.toLowerCase().includes(termo);

      const espacosMatch = (sala.espacos ?? []).some((e) =>
        e.codigoEspaco?.toLowerCase().includes(termo)
      );

      return nomeSalaMatch || espacosMatch;
    });
  }, [termoAtivo, salas]);

  function handleBuscar() {
    setTermoAtivo(busca);
    carregarSalas(busca);
  }

  return (
    <main className="max-w-6xl mx-auto px-8 py-10 space-y-8">
      <section className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex-1 flex items-center border rounded-md overflow-hidden bg-white">
          <div className="px-3 text-gray-400 text-sm">🔍</div>
          <input
            type="text"
            placeholder="search..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="flex-1 px-2 py-2 text-sm outline-none"
          />
        </div>

        <button
          type="button"
          onClick={handleBuscar}
          disabled={loading}
          className="px-5 py-2 text-sm font-medium rounded-md bg-teal-500 text-white shadow-sm disabled:opacity-60"
        >
          {loading ? "Buscando..." : "Buscar"}
        </button>

        <a
          href="/sala_espaco"
          className="px-5 py-2 text-sm font-medium rounded-md bg-teal-500 text-white shadow-sm text-center"
        >
          Nova Reserva
        </a>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold tracking-wide">SALAS CRIADAS</h2>

        {erro && (
          <div className="border border-red-200 text-red-700 bg-red-50 rounded-md px-4 py-2 text-sm mb-2">
            {erro}
          </div>
        )}

        <div className="border border-gray-200 rounded-md overflow-hidden bg-white">
          <table className="w-full border-collapse text-sm table-fixed">
            <thead className="bg-gray-100 text-xs font-semibold text-gray-500">
              <tr>
                <th className="px-4 py-3 text-left w-[80px]">Código</th>
                <th className="px-4 py-3 text-left w-[220px]">Nome</th>
                <th className="px-4 py-3 text-left w-[180px]">Imagem</th>
                <th className="px-4 py-3 text-left w-[120px]">Situação</th>
                <th className="px-4 py-3 text-center w-[90px]">Ações</th>
              </tr>
            </thead>

            <tbody>
              {loading && salasFiltradas.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-4 text-sm text-gray-500 text-center"
                  >
                    Carregando salas...
                  </td>
                </tr>
              ) : salasFiltradas.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-4 text-sm text-gray-500 text-center"
                  >
                    Nenhuma sala encontrada.
                  </td>
                </tr>
              ) : (
                salasFiltradas.map((sala, index) => {
                  const situacao = sala.ativa === false ? "Inativa" : "Ativa";

                  return (
                    <tr
                      key={sala.idSala}
                      className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                    >
                      <td className="px-4 py-3 align-middle">{sala.idSala}</td>

                      <td className="px-4 py-3 align-middle truncate">
                        {sala.nomeSala}
                      </td>

                      <td className="px-4 py-3 align-middle max-w-[180px] truncate overflow-hidden whitespace-nowrap text-xs text-gray-600">
                        {sala.mapa || "-"}
                      </td>

                      <td className="px-4 py-3 align-middle">
                        <span className="text-xs font-medium text-teal-500">
                          {situacao}
                        </span>
                      </td>

                      <td className="px-4 py-3 align-middle">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            className="p-1 rounded hover:bg-gray-200"
                          >
                            ✏️
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      {showSuccess && (
        <div className="fixed left-1/2 bottom-10 -translate-x-1/2 w-[min(480px,90%)]">
          <div className="flex items-center justify-between bg-teal-500 text-white rounded-md px-6 py-3 text-sm shadow-lg">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center justify-center rounded-full border border-white w-5 h-5 text-xs">
                ✓
              </span>
              <span>Sala criada com sucesso.</span>
            </div>

            <button
              type="button"
              onClick={() => setShowSuccess(false)}
              className="text-lg leading-none px-1"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
