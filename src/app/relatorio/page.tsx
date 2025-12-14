"use client";
import { useState } from "react";
import Image from "next/image";

type RelatorioItem = {
  id: number;
  motivo: string;
  inicio: string;
  fim: string;
  usuario: string;
  email: string;
  sala: string;
  espaco: string;
  foto?: string | null;
};

// Formata data ISO para hora (HH:mm)
function formatarHora(dataIso: string) {
  if (!dataIso) return "--:--";
  try {
    const data = new Date(dataIso);
    if (Number.isNaN(data.getTime()))
      return dataIso.split(" ")[1]?.substring(0, 5) ?? "";
    return data.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "--:--";
  }
}

// Formata data ISO para data (DD/MM/AAAA)
function formatarData(dataIso: string) {
  if (!dataIso) return "--/--/----";
  try {
    const data = new Date(dataIso);
    if (Number.isNaN(data.getTime())) return dataIso.split(" ")[0] ?? "";
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
  const [usuario, setUsuario] = useState("");

  const [dados, setDados] = useState<RelatorioItem[]>([]);
  const [carregando, setCarregando] = useState(false);

  // Estado para o erro
  const [erro, setErro] = useState("");

  async function buscarRelatorio() {
    // Validação simples e direta
    if (!dataInicio || !dataFim) {
      setErro("Preencha as datas para buscar o relatório.");
      setTimeout(() => setErro(""), 3000); // Some depois de 3s
      return;
    }

    setErro("");
    setCarregando(true);
    setDados([]);

    try {
      const params = new URLSearchParams();
      params.append("inicio", dataInicio);
      params.append("fim", dataFim);
      if (sala) params.append("sala", sala);
      if (espaco) params.append("espaco", espaco);
      if (usuario) params.append("usuario", usuario);

      const res = await fetch(`/api/relatorio?${params.toString()}`);
      const json = await res.json();

      if (json.success) {
        setDados(json.reservas ?? []);
      } else {
        console.error("Erro API:", json.error);
        setErro("Erro ao buscar dados. Tente novamente.");
      }
    } catch (error) {
      console.error("Erro fetch:", error);
      setErro("Erro de conexão.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="min-h-screen bg-white p-8 font-sans text-gray-700">
      <h1 className="text-4xl font-serif font-bold mb-6 text-black uppercase">
        Relatório
      </h1>

      {/* ALERT VERMELHO SIMPLES */}
      {erro && (
        <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {erro}
        </div>
      )}

      {/* ÁREA DE FILTROS */}
      <div className="mb-8 bg-gray-50 p-6 rounded-lg border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
          {/* Campo Usuário */}
          <div className="flex flex-col">
            <label
              htmlFor="filtro-usuario"
              className="mb-1 text-sm font-medium text-gray-600"
            >
              Usuário
            </label>
            <input
              id="filtro-usuario"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              type="text"
              // SEM PLACEHOLDER
              className="bg-white border border-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Campo Sala */}
          <div className="flex flex-col">
            <label
              htmlFor="filtro-sala"
              className="mb-1 text-sm font-medium text-gray-600"
            >
              Sala
            </label>
            <input
              id="filtro-sala"
              value={sala}
              onChange={(e) => setSala(e.target.value)}
              type="text"
              // SEM PLACEHOLDER
              className="bg-white border border-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Campo Espaço */}
          <div className="flex flex-col">
            <label
              htmlFor="filtro-espaco"
              className="mb-1 text-sm font-medium text-gray-600"
            >
              Espaço
            </label>
            <input
              id="filtro-espaco"
              value={espaco}
              onChange={(e) => setEspaco(e.target.value)}
              type="text"
              // SEM PLACEHOLDER
              className="bg-white border border-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Data Inicial */}
          <div className="flex flex-col">
            <label
              htmlFor="data-inicio"
              className="mb-1 text-sm font-medium text-gray-600"
            >
              Data Inicial <span className="text-red-500 font-bold">*</span>
            </label>
            <input
              id="data-inicio"
              value={dataInicio}
              onChange={(e) => {
                setDataInicio(e.target.value);
                if (erro) setErro("");
              }}
              type="date"
              className={`bg-white border rounded p-3 focus:outline-none focus:ring-2 focus:ring-teal-500 ${erro && !dataInicio ? "border-red-500 ring-1 ring-red-500" : "border-gray-300"}`}
            />
          </div>

          {/* Data Final */}
          <div className="flex flex-col">
            <label
              htmlFor="data-fim"
              className="mb-1 text-sm font-medium text-gray-600"
            >
              Data Final <span className="text-red-500 font-bold">*</span>
            </label>
            <input
              id="data-fim"
              value={dataFim}
              onChange={(e) => {
                setDataFim(e.target.value);
                if (erro) setErro("");
              }}
              type="date"
              className={`bg-white border rounded p-3 focus:outline-none focus:ring-2 focus:ring-teal-500 ${erro && !dataFim ? "border-red-500 ring-1 ring-red-500" : "border-gray-300"}`}
            />
          </div>

          <div className="flex items-end">
            <button
              type="button"
              onClick={buscarRelatorio}
              disabled={carregando}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white p-3 rounded font-medium transition disabled:opacity-70"
            >
              {carregando ? "Buscando..." : "Buscar Relatório"}
            </button>
          </div>
        </div>
      </div>

      {/* TABELA DE RESULTADOS */}
      <div className="overflow-x-auto shadow-sm rounded-lg border border-gray-200">
        <table className="min-w-full border-separate border-spacing-0 text-sm">
          <thead className="bg-gray-100">
            <tr className="text-left text-gray-700">
              <th className="p-4 pl-6 font-semibold border-b border-gray-200">
                Usuário
              </th>
              <th className="p-4 font-semibold border-b border-gray-200">
                Sala
              </th>
              <th className="p-4 font-semibold border-b border-gray-200">
                Espaço
              </th>
              <th className="p-4 font-semibold text-center border-b border-gray-200">
                Horário
              </th>
              <th className="p-4 font-semibold text-center border-b border-gray-200">
                Data
              </th>
            </tr>
          </thead>

          <tbody className="bg-white">
            {dados.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center p-8 text-gray-500">
                  {carregando
                    ? "Carregando..."
                    : "Nenhum resultado encontrado."}
                </td>
              </tr>
            ) : (
              dados.map((item, index) => {
                const avatarSrc =
                  item.foto && item.foto.length > 5
                    ? item.foto
                    : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        item.usuario,
                      )}&background=0d9488&color=fff&size=128`;

                return (
                  <tr
                    key={item.id}
                    className={`hover:bg-gray-50 transition ${
                      index !== dados.length - 1
                        ? "border-b border-gray-100"
                        : ""
                    }`}
                  >
                    <td className="p-4 pl-6 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 shrink-0">
                          <Image
                            src={avatarSrc}
                            alt={item.usuario}
                            fill
                            unoptimized={true}
                            className="rounded-full object-cover border border-gray-200"
                          />
                        </div>
                        <div className="flex flex-col justify-center">
                          <span className="text-gray-900 font-medium text-base">
                            {item.usuario}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 text-gray-700 border-b border-gray-100">
                      {item.sala}
                    </td>

                    <td className="p-4 border-b border-gray-100">
                      <span className="inline-block px-2 py-1 bg-teal-50 text-teal-700 rounded text-xs font-semibold">
                        {item.espaco}
                      </span>
                    </td>

                    <td className="p-4 text-center text-gray-700 border-b border-gray-100 font-medium">
                      {formatarHora(item.inicio)} - {formatarHora(item.fim)}
                    </td>

                    <td className="p-4 text-center text-gray-700 border-b border-gray-100">
                      {formatarData(item.inicio)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
