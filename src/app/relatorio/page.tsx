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
  foto?: string;
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
  const [dados, setDados] = useState<RelatorioItem[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [usuario, setUsuario] = useState("");

  async function buscarRelatorio() {
    if (!dataInicio || !dataFim) {
      alert("Preencha a data de início e a data de fim antes de buscar.");
      return;
    }

    setCarregando(true);
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
        setDados([]);
      }
    } catch {
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
          <div className="flex flex-col">
            <label
              htmlFor="usuario"
              className="mb-1 text-sm font-medium text-gray-600"
            >
              Usuário
            </label>
            <input
              id="usuario"
              type="text"
              className="bg-gray-200 border border-gray-300 rounded p-3"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
            />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="sala"
              className="mb-1 text-sm font-medium text-gray-600"
            >
              Sala
            </label>
            <input
              id="sala"
              type="text"
              className="bg-gray-200 border border-gray-300 rounded p-3"
              value={sala}
              onChange={(e) => setSala(e.target.value)}
            />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="espaco"
              className="mb-1 text-sm font-medium text-gray-600"
            >
              Espaço
            </label>
            <input
              id="espaco"
              type="text"
              className="bg-gray-200 border border-gray-300 rounded p-3"
              value={espaco}
              onChange={(e) => setEspaco(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="flex flex-col">
            <label
              htmlFor="dataInicio"
              className="mb-1 text-sm font-medium text-gray-600"
            >
              Data inicial
            </label>
            <input
              id="dataInicio"
              type="date"
              className="bg-gray-200 border border-gray-300 rounded p-3"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
            />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="dataFim"
              className="mb-1 text-sm font-medium text-gray-600"
            >
              Data final
            </label>
            <input
              id="dataFim"
              type="date"
              className="bg-gray-200 border border-gray-300 rounded p-3"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 items-center">
          <button
            type="button"
            onClick={buscarRelatorio}
            disabled={carregando}
            className="bg-teal-500 text-white px-8 py-3 rounded"
          >
            {carregando ? "..." : "Buscar"}
          </button>

          <button
            type="button"
            onClick={() => {
              const params = new URLSearchParams();
              params.append("inicio", dataInicio);
              params.append("fim", dataFim);
              if (sala) params.append("sala", sala);
              if (espaco) params.append("espaco", espaco);
              if (usuario) params.append("usuario", usuario);

              window.open(`/api/relatorio/pdf?${params.toString()}`, "_blank");
            }}
            className="bg-gray-300 text-teal-600 px-8 py-3 rounded"
          >
            Baixar
          </button>
        </div>
      </div>

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
                <tr key={item.id} className="group">
                  <td className="bg-gray-50 p-4 rounded-l-lg border-l-[6px] border-teal-500 relative">
                    <div className="flex items-center gap-3">
                      {item.foto ? (
                        <Image
                          src={item.foto}
                          alt={item.usuario}
                          width={40}
                          height={40}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <Image
                          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                            item.usuario ?? "Usuário",
                          )}&background=0c9488&color=fff&size=64`}
                          alt={item.usuario}
                          width={40}
                          height={40}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      )}

                      <div>
                        <div className="text-gray-700 font-medium">
                          {item.usuario || "—"}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="bg-gray-50 p-4 text-gray-600">
                    {item.sala || "—"}
                  </td>

                  <td className="bg-gray-50 p-4 text-gray-600">
                    {item.espaco}
                  </td>

                  <td className="bg-gray-50 p-4 text-center text-gray-600 font-medium">
                    {formatarHora(item.inicio)} - {formatarHora(item.fim)}
                  </td>

                  <td className="bg-gray-50 p-4 text-center text-gray-600 rounded-r-lg">
                    {formatarData(item.inicio)}
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
