"use client";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";

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

function formatarHora(dataIso: string) {
  if (!dataIso) return "--:--";
  try {
    const data = new Date(dataIso);
    if (Number.isNaN(data.getTime())) return dataIso.split(/[ T]/)[1]?.substring(0, 5) ?? "";
    return data.getHours().toString().padStart(2, "0") + ":" + data.getMinutes().toString().padStart(2, "0");
  } catch {
    return "--:--";
  }
}

function formatarData(dataIso: string) {
  if (!dataIso) return "--/--";
  try {
    const data = new Date(dataIso);
    if (Number.isNaN(data.getTime())) return dataIso.split(/[ T]/)[0] ?? "";
    return data.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
  } catch {
    return "--/--";
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
  const [erro, setErro] = useState("");
  const [buscou, setBuscou] = useState(false);

  async function buscarRelatorio() {
    if (!dataInicio || !dataFim) {
      setErro("Preencha as datas para buscar.");
      setTimeout(() => setErro(""), 3000);
      return;
    }
    setErro("");
    setCarregando(true);
    setBuscou(true);
    setDados([]);

    try {
      const params = new URLSearchParams();
      params.append("inicio", dataInicio);
      params.append("fim", dataFim);
      if (sala) params.append("sala", sala);
      if (espaco) params.append("espaco", espaco);
      if (usuario) params.append("usuario", usuario);

      const res = await fetch(`/api/relatorio?${params.toString()}`);
      if (!res.ok) throw new Error(`Erro API: ${res.status}`);
      const json = await res.json();

      if (json.success) {
        setDados(json.reservas ?? []);
      } else {
        setErro("Erro ao buscar dados.");
      }
    } catch (error) {
      console.error(error);
      setErro("Erro interno. Verifique conexão.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="min-h-screen bg-white p-4 md:p-8 font-serif text-gray-800">
      <div className="mb-6 md:mb-8">
        <h1 className="text-3xl font-bold text-black uppercase tracking-wide text-center md:text-left">Relatório</h1>
      </div>

      {erro && (
        <div className="mb-6 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 text-center rounded">{erro}</div>
      )}

      <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-100 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
          <div>
            <label className="block text-sm font-bold mb-1 text-gray-600">Nome</label>
            <input
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-[#3BB1A8]"
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1 text-gray-600">Sala</label>
            <input
              value={sala}
              onChange={(e) => setSala(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-[#3BB1A8]"
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1 text-gray-600">Espaço</label>
            <input
              value={espaco}
              onChange={(e) => setEspaco(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-[#3BB1A8]"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
          <div>
            <label className="block text-sm font-bold mb-1 text-gray-600">Início</label>
            <input
              type="date"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded p-3 uppercase text-sm focus:outline-none focus:ring-2 focus:ring-[#3BB1A8]"
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1 text-gray-600">Fim</label>
            <input
              type="date"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded p-3 uppercase text-sm focus:outline-none focus:ring-2 focus:ring-[#3BB1A8]"
            />
          </div>
          <div className="hidden md:block"></div>
          <button
            onClick={buscarRelatorio}
            disabled={carregando}
            className="w-full bg-[#3BB1A8] hover:bg-teal-600 text-white p-3 rounded font-bold uppercase transition flex items-center justify-center gap-2 shadow-sm"
          >
            <FaSearch /> {carregando ? "..." : "BUSCAR"}
          </button>
        </div>
      </div>

      <div className="mb-4 text-center md:text-left text-sm text-gray-500 font-medium">
        {!buscou
          ? "Selecione as datas e clique em buscar."
          : dados.length > 0
            ? `Encontrados ${dados.length} registros.`
            : "Nenhum registro encontrado para o período."}
      </div>

      <div className="block md:hidden space-y-4 pb-10">
        {dados.map((item, index) => {
          const nomeExibido = item.usuario || item.email?.split("@")[0] || "Usuário";
          const avatarSrc =
            item.foto && item.foto.length > 5
              ? item.foto
              : `https://ui-avatars.com/api/?name=${encodeURIComponent(nomeExibido)}&background=0d9488&color=fff`;

          return (
            <div
              key={item.id || index}
              className="relative bg-white rounded-xl p-4 pl-6 shadow-sm border border-gray-200 flex items-center gap-4"
            >
              <div className="absolute left-0 top-3 bottom-3 w-[5px] bg-[#3BB1A8] rounded-r-md"></div>
              <div className="shrink-0 w-14 h-14 rounded-full bg-gray-100 overflow-hidden border border-gray-100">
                <img src={avatarSrc} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 overflow-hidden">
                <h3 className="text-[#3BB1A8] font-bold text-lg truncate">{nomeExibido}</h3>
                <p className="text-xs text-gray-500 font-bold uppercase">{item.sala || "N/A"}</p>
                <span className="inline-block bg-teal-50 text-teal-700 text-[10px] font-bold px-2 py-0.5 rounded my-1 border border-teal-100">
                  {item.espaco}
                </span>
                <p className="text-xs text-gray-500 font-medium">
                  {formatarData(item.inicio)} • {formatarHora(item.inicio)} - {formatarHora(item.fim)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="hidden md:!block w-full mb-10">
        <div className="overflow-x-auto my-6 border border-gray-200 rounded-lg shadow-sm">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Usuário
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Sala</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Espaço</th>
                <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Horário
                </th>
                <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Data</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {dados.map((item, index) => {
                const nomeExibido = item.usuario || item.email?.split("@")[0] || "Usuário";
                const avatarSrc =
                  item.foto && item.foto.length > 5
                    ? item.foto
                    : `https://ui-avatars.com/api/?name=${encodeURIComponent(nomeExibido)}&background=0d9488&color=fff`;

                return (
                  <tr key={item.id || index} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden shrink-0 border border-gray-200">
                          <img
                            src={avatarSrc}
                            alt={nomeExibido}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                `https://ui-avatars.com/api/?name=${encodeURIComponent(nomeExibido)}&background=0d9488&color=fff`;
                            }}
                          />
                        </div>
                        <span
                          className="font-semibold text-gray-800 text-sm truncate max-w-[200px]"
                          title={nomeExibido}
                        >
                          {nomeExibido}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-6 text-sm text-gray-600">{item.sala || "N/A"}</td>
                    <td className="py-3 px-6">
                      <span className="inline-block bg-[#E0F2F1] text-[#00695C] px-3 py-1 rounded text-xs font-bold border border-[#B2DFDB]">
                        {item.espaco}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-center text-sm text-gray-600 font-medium">
                      {formatarHora(item.inicio)} - {formatarHora(item.fim)}
                    </td>
                    <td className="py-3 px-6 text-center text-sm text-gray-500">{formatarData(item.inicio)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
