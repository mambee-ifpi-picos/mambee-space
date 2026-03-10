"use client";
import { useState, useEffect } from "react";

type UsuarioInfo = {
  nome: string;
  email: string;
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
  idReserva: number;
  motivo: string;
  horaInicio: string;
  horaFim: string;
  situacao: string;
  Usuario?: UsuarioInfo;
  Espaco?: EspacoInfo;
};


function formatarHora(dataIso: string) {
  if (!dataIso) return "--:--";
  try {
    const data = new Date(dataIso);
    if (Number.isNaN(data.getTime())) return dataIso.split(/[ T]/)[1]?.substring(0, 5) ?? "";
    return data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  } catch { return "--:--"; }
}

function formatarData(dataIso: string) {
  if (!dataIso) return "--/--/----";
  try {
    const data = new Date(dataIso);
    if (Number.isNaN(data.getTime())) return dataIso.split(/[ T]/)[0]?.split("-").reverse().join("/") ?? "";
    return data.toLocaleDateString("pt-BR");
  } catch { return "--/--/----"; }
}

export default function RelatorioGuaritaPage() {
  const [dados, setDados] = useState<RelatorioItem[]>([]);
  const [carregando, setCarregando] = useState(false);

  async function buscarRelatorio() {
    setCarregando(true);
    try {
      const res = await fetch(`/api/relatorio_guarita`);
      const json = await res.json();
      if (json.success) setDados(json.reservas ?? []);
    } catch (err) {
      console.error("Falha ao buscar relatório:", err);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    buscarRelatorio();
  }, []);

  return (
    <div className="min-h-screen bg-white p-4 md:p-8 font-sans text-gray-700">
      <h1 className="text-3xl md:text-4xl font-serif font-bold mb-8 text-black uppercase tracking-tight">
        Relatório Guarita
      </h1>

      <div className="w-full">
        <div className="block md:hidden space-y-4 pb-10">
          {dados.map((item, index) => {
            const nomeExibido = item.Usuario?.nome || item.Usuario?.email?.split('@')[0] || "Usuário";
            const avatarSrc = item.Usuario?.foto && item.Usuario?.foto.length > 5 
              ? item.Usuario?.foto 
              : `https://ui-avatars.com/api/?name=${encodeURIComponent(nomeExibido)}&background=0d9488&color=fff`;
            
            return (
              <div key={item.idReserva || index} className="relative bg-white rounded-xl p-4 pl-6 shadow-sm border border-gray-200 flex items-center gap-4">
                <div className="absolute left-0 top-3 bottom-3 w-[5px] bg-[#3BB1A8] rounded-r-md"></div>
                <div className="shrink-0 w-14 h-14 rounded-full bg-gray-100 overflow-hidden border border-gray-100">
                  <img src={avatarSrc} alt="" className="w-full h-full object-cover"/>
                </div>
                <div className="flex-1 overflow-hidden">
                  <h3 className="text-[#3BB1A8] font-bold text-lg truncate">{nomeExibido}</h3>
                  <p className="text-xs text-gray-500 font-bold uppercase">{item.Espaco?.Sala?.nomeSala || "N/A"}</p>
                  <span className="inline-block bg-teal-50 text-teal-700 text-[10px] font-bold px-2 py-0.5 rounded my-1 border border-teal-100">
                    {item.Espaco?.codigoEspaco}
                  </span>
                  <p className="text-xs text-gray-500 font-medium">
                    {formatarData(item.horaInicio)} • {formatarHora(item.horaInicio)} - {formatarHora(item.horaFim)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="hidden md:!block overflow-x-auto my-6">
          <table className="min-w-full border-separate border-spacing-y-4">
            <thead>
              <tr className="text-left text-gray-500 uppercase text-xs tracking-widest">
                <th className="p-2 pb-0 pl-6 font-bold">Usuário</th>
                <th className="p-2 pb-0 font-bold">Sala</th>
                <th className="p-2 pb-0 font-bold">Espaço</th>
                <th className="p-2 pb-0 font-bold text-center">Horário</th>
                <th className="p-2 pb-0 font-bold text-center">Data</th>
              </tr>
            </thead>
            <tbody className="divide-y-0">
              {dados.map((item, index) => {
                const nomeExibido = item.Usuario?.nome || "Usuário";
                const avatarSrc = item.Usuario?.foto && item.Usuario?.foto.length > 5 
                  ? item.Usuario?.foto 
                  : `https://ui-avatars.com/api/?name=${encodeURIComponent(nomeExibido)}&background=0d9488&color=fff`;

                return (
                  <tr key={item.idReserva || index} className="group transition-transform hover:scale-[1.01]">
                    <td className="bg-gray-50 p-4 rounded-l-lg border-l-[6px] !border-l-[#3BB1A8] relative">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden shrink-0 border border-gray-200">
                          <img 
                            src={avatarSrc} 
                            alt={nomeExibido} 
                            className="w-full h-full object-cover"
                            onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(nomeExibido)}&background=0d9488&color=fff`; }}
                          />
                        </div>
                        <span className="font-semibold text-gray-800 text-sm truncate max-w-[200px]" title={nomeExibido}>
                          {nomeExibido}
                        </span>
                      </div>
                    </td>

                    <td className="bg-gray-50 p-4 text-sm text-gray-600">
                      {item.Espaco?.Sala?.nomeSala || "—"}
                    </td>

                    
                    <td className="bg-gray-50 p-4">
                      <span className="inline-block bg-[#E0F2F1] text-[#00695C] px-3 py-1 rounded text-xs font-bold border border-[#B2DFDB]">
                        {item.Espaco?.codigoEspaco || "—"}
                      </span>
                    </td>

                    
                    <td className="bg-gray-50 p-4 text-center text-sm text-gray-600 font-medium">
                      {formatarHora(item.horaInicio)} - {formatarHora(item.horaFim)}
                    </td>

                   
                    <td className="bg-gray-50 p-4 text-center text-sm text-gray-600 rounded-r-lg">
                      {formatarData(item.horaInicio)}
                    </td>
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