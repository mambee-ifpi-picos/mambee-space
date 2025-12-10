"use client";
import { useState } from "react";

type RelatorioItem = {
  id: number;
  motivo: string;
  inicio: string;
  fim: string;
  situacao: string;
  usuario: string;
  email: string;
  sala: string;
  espaco: string;
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
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [sala, setSala] = useState("");
  const [espaco, setEspaco] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dados, setDados] = useState<RelatorioItem[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [usuario, setUsuario] = useState("");

  async function buscarRelatorio() {
    setCarregando(true);
    try {
      const params = new URLSearchParams();
      if (dataInicio) params.append("inicio", dataInicio);
      if (dataFim) params.append("fim", dataFim);
      if (sala) params.append("sala", sala);
      if (espaco) params.append("espaco", espaco);
      if (usuario) params.append("usuario", usuario);

      const res = await fetch(`/api/relatorio?${params.toString()}`);
      const json = await res.json();

      if (!dataInicio || !dataFim) {
        alert("Preencha a data de início e a data de fim antes de buscar.");
        return;
      }

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

  return (
    <div className="min-h-screen bg-white p-8 font-sans text-gray-700">
      <h1 className="text-4xl font-serif font-bold mb-8 text-black uppercase">
        Relatório
      </h1>

      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <div className="flex flex-col">
            <label
              htmlFor="usuario-input"
              className="mb-1 text-sm font-medium text-gray-600"
            >
              Usuário
            </label>
            <input
              id="usuario-input"
              type="text"
              className="bg-gray-200 border border-gray-300 rounded p-3 outline-none focus:ring-2 focus:ring-teal-400"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
            />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="sala-input"
              className="mb-1 text-sm font-medium text-gray-600"
            >
              Sala
            </label>
            <input
              id="sala-input"
              type="text"
              className="bg-gray-200 border border-gray-300 rounded p-3 outline-none focus:ring-2 focus:ring-teal-400"
              value={sala}
              onChange={(e) => setSala(e.target.value)}
            />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="espaco-input"
              className="mb-1 text-sm font-medium text-gray-600"
            >
              Espaço
            </label>
            <input
              id="espaco-input"
              type="text"
              className="bg-gray-200 border border-gray-300 rounded p-3 outline-none focus:ring-2 focus:ring-teal-400"
              value={espaco}
              onChange={(e) => setEspaco(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="flex flex-col">
            <label
              htmlFor="data-inicio"
              className="mb-1 text-sm font-medium text-gray-600"
            >
              Data inicial
            </label>
            <input
              id="data-inicio"
              type="date"
              className="bg-gray-200 border border-gray-300 rounded p-3 outline-none focus:ring-2 focus:ring-teal-400 text-gray-600"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
            />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="data-fim"
              className="mb-1 text-sm font-medium text-gray-600"
            >
              Data final
            </label>
            <input
              id="data-fim"
              type="date"
              className="bg-gray-200 border border-gray-300 rounded p-3 outline-none focus:ring-2 focus:ring-teal-400 text-gray-600"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
            />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="status-input"
              className="mb-1 text-sm font-medium text-gray-600"
            >
              Status
            </label>
            <input
              id="status-input"
              type="text"
              className="bg-gray-200 border border-gray-300 rounded p-3 outline-none focus:ring-2 focus:ring-teal-400"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 items-center">
          <button
            type="button"
            onClick={buscarRelatorio}
            disabled={carregando}
            className="flex items-center gap-2 bg-teal-500 text-white px-8 py-3 rounded shadow-md hover:bg-teal-600 transition font-medium uppercase text-sm tracking-wide"
          >
            {carregando ? (
              "..."
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  role="img"
                >
                  <title>Buscar</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                Buscar
              </>
            )}
          </button>

          <button
            type="button"
            className="bg-gray-300 text-teal-600 px-8 py-3 rounded shadow-sm hover:bg-gray-400 transition font-medium uppercase text-sm tracking-wide"
          >
            Baixar
          </button>
        </div>
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
                  key={item.id}
                  className="group transition-transform hover:scale-[1.01]"
                >
                  <td className="bg-gray-50 p-4 rounded-l-lg border-l-[6px] border-teal-500 relative">
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
                        {item.sala}
                      </span>
                    </div>
                  </td>

                  <td className="bg-gray-50 p-4 text-gray-600">
                    {item.espaco}
                  </td>

                  <td className="bg-gray-50 p-4 text-center text-gray-600 font-medium">
                    {formatarHora(item.inicio)} - {formatarHora(item.fim)}
                  </td>

                  <td className="bg-gray-50 p-4 text-center text-gray-600">
                    {formatarData(item.inicio)}
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
  );
}
