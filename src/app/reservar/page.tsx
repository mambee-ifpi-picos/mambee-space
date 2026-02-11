"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Inria_Serif } from "next/font/google";
import { supabase } from "@/lib/supabase/browser/supabaseClient";

const inriaSerif700 = Inria_Serif({ subsets: ["latin"], weight: ["700"] });

type Sala = { idSala: number; nomeSala: string; mapa?: string | null };
type Espaco = { idEspaco: number; codigoEspaco: string };
type CronogramaItem = {
  idReserva: number;
  horaInicio: string;
  horaFim: string;
  motivo: string;
  criador: { nome: string; foto: string | null };
};

export default function ReservarEspaco() {
  const [salas, setSalas] = useState<Sala[]>([]);
  const [espacos, setEspacos] = useState<Espaco[]>([]);
  const [cronograma, setCronograma] = useState<CronogramaItem[]>([]);
  const [salaSelecionada, setSalaSelecionada] = useState<Sala | null>(null);
  const [mapaAtual, setMapaAtual] = useState<string | null>(null);
  const [carregandoMapa, setCarregandoMapa] = useState(false);
  const [loading, setLoading] = useState(false);
  const [idEspaco, setIdEspaco] = useState("");
  const [data, setData] = useState("");
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFim, setHoraFim] = useState("");
  const [motivo, setMotivo] = useState("");
  const [idUsuarioAuth, setIdUsuarioAuth] = useState<string | null>(null);
  const [emailUsuario, setEmailUsuario] = useState<string>("");
  const [authLoading, setAuthLoading] = useState(true);

  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "success",
  });

  const showToast = useCallback((msg: string, type = "success") => {
    setToast({ visible: true, message: msg, type: type as string });
    setTimeout(() => setToast({ visible: false, message: "", type: "success" }), 3500);
  }, []);

  useEffect(() => {
    const setupAuth = async () => {
      setAuthLoading(true);

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        setIdUsuarioAuth(session.user.id);
        setEmailUsuario(session.user.email || "");
      }
      setAuthLoading(false);

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setIdUsuarioAuth(session.user.id);
          setEmailUsuario(session.user.email || "");
        } else {
          setIdUsuarioAuth(null);
          setEmailUsuario("");
        }
        setAuthLoading(false);
      });

      return () => subscription.unsubscribe();
    };

    setupAuth();
  }, []);

  useEffect(() => {
    fetch("/api/reservar?tipo=salas")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setSalas(data);
      })
      .catch((e) => console.error("Erro ao buscar salas:", e));
  }, []);

  const handleSalaChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = Number(e.target.value);
    const sala = salas.find((s) => s.idSala === id) || null;

    setSalaSelecionada(sala);
    setMapaAtual(null);
    setIdEspaco("");
    setCronograma([]);
    setEspacos([]);

    if (sala) {
      fetch(`/api/reservar?tipo=espacos&idSala=${id}`)
        .then((res) => res.json())
        .then((d) => Array.isArray(d) && setEspacos(d));

      setCarregandoMapa(true);
      fetch(`/api/reservar?tipo=sala_mapa&idSala=${id}`)
        .then((res) => res.json())
        .then((d) => {
          console.log("O QUE VEIO DO BANCO:", d);

          if (d?.mapa) {
            setMapaAtual(d.mapa);
          } else {
            setMapaAtual(null);
          }
        })
        .finally(() => setCarregandoMapa(false));
    }
  };

  useEffect(() => {
    if (idEspaco && data) {
      fetch(`/api/reservar?idEspaco=${idEspaco}&data=${data}`)
        .then((res) => res.json())
        .then((d) => Array.isArray(d) && setCronograma(d));
    }
  }, [idEspaco, data]);

  const tratarCaminhoImagem = (caminho: string | null) => {
    if (!caminho || caminho === "sem_mapa") return "";
    const limpo = caminho.trim().replace(/[\n\r\s]/g, "");
    if (limpo.startsWith("http") || limpo.startsWith("data:")) {
      return limpo;
    }
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const nomeDoBucket = "mapas_salas";
    return `${supabaseUrl}/storage/v1/object/public/${nomeDoBucket}/${limpo}`;
  };

  const formatarDataBonita = (dataStr: string) => {
    if (!dataStr) return "";
    const parts = dataStr.split("-");
    return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2])).toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "2-digit",
      month: "2-digit",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const dtParts = data.split("-");
    const dtObj = new Date(Number(dtParts[0]), Number(dtParts[1]) - 1, Number(dtParts[2]));
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    if (dtObj < hoje) {
      showToast("Data passada não pode!", "error");
      setLoading(false);
      return;
    }
    if (horaFim <= horaInicio) {
      showToast("Hora inválida.", "error");
      setLoading(false);
      return;
    }

    let finalId = idUsuarioAuth;
    let finalEmail = emailUsuario;

    if (!finalId) {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        finalId = session.user.id;
        finalEmail = session.user.email || "";
      } else {
        showToast("Você precisa estar logado!", "error");
        setLoading(false);
        return;
      }
    }

    try {
      const res = await fetch("/api/reservar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idEspaco,
          data,
          horaInicio,
          horaFim,
          motivo,
          idUsuarioSupabase: finalId,
          emailUsuario: finalEmail,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        showToast(res.status === 404 ? "Usuário não cadastrado." : `Erro: ${json.error}`, "error");
      } else {
        showToast("Reserva realizada!", "success");
        fetch(`/api/reservar?idEspaco=${idEspaco}&data=${data}`)
          .then((r) => r.json())
          .then(setCronograma);
        setMotivo("");
      }
    } catch {
      showToast("Erro de conexão.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {toast.visible && (
        <div
          className={`fixed top-4 left-1/2 -translate-x-1/2 px-6 py-3 rounded-md shadow-lg z-50 border ${toast.type === "success" ? "bg-teal-500 border-teal-300 text-white" : "bg-red-500 border-red-500 text-white"}`}
        >
          {toast.message}
        </div>
      )}

      <div className="flex justify-center items-start mt-5 pb-10 w-full px-4">
        <div className="bg-white shadow-md rounded-xl w-full max-w-6xl border border-gray-300 flex flex-col lg:flex-row overflow-hidden">
          {/* ESQUERDA */}
          <div className="w-full lg:w-[35%] p-6 border-b lg:border-b-0 lg:border-r border-gray-300">
            <div className="mb-6">
              <h1 className={`${inriaSerif700.className} text-3xl text-gray-900`}>RESERVAR ESPAÇO</h1>
              <div className="text-sm font-bold mt-1 min-h-5">
                {authLoading ? (
                  <span className="text-gray-400 animate-pulse">Verificando usuário...</span>
                ) : emailUsuario ? (
                  <span className="text-teal-600">Logado: {emailUsuario}</span>
                ) : (
                  <span className="text-red-400">Não logado (Faça login)</span>
                )}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <p className="mb-1 text-gray-700 font-medium">Sala: *</p>
                <select
                  required
                  className="w-full h-10 border border-gray-300 rounded p-2 bg-white"
                  onChange={handleSalaChange}
                  value={salaSelecionada?.idSala || ""}
                >
                  <option value="" disabled>
                    Selecione...
                  </option>
                  {salas.map((s) => (
                    <option key={s.idSala} value={s.idSala}>
                      {s.nomeSala}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <p className="mb-1 text-gray-700 font-medium">Espaço: *</p>
                <select
                  required
                  className="w-full h-10 border border-gray-300 rounded p-2 bg-white disabled:bg-gray-100"
                  value={idEspaco}
                  onChange={(e) => setIdEspaco(e.target.value)}
                  disabled={!salaSelecionada}
                >
                  <option value="" disabled>
                    Selecione...
                  </option>
                  {espacos.map((e) => (
                    <option key={e.idEspaco} value={e.idEspaco}>
                      {e.codigoEspaco}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <p className="mb-1 text-gray-700 font-medium">Data: *</p>
                <input
                  required
                  type="date"
                  className="w-full h-10 border border-gray-300 rounded p-2"
                  onChange={(e) => setData(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <div className="w-1/2">
                  <p className="mb-1 text-gray-700 font-medium">Início *</p>
                  <input
                    required
                    type="time"
                    className="w-full h-10 border border-gray-300 rounded p-2"
                    onChange={(e) => setHoraInicio(e.target.value)}
                  />
                </div>
                <div className="w-1/2">
                  <p className="mb-1 text-gray-700 font-medium">Fim *</p>
                  <input
                    required
                    type="time"
                    className="w-full h-10 border border-gray-300 rounded p-2"
                    onChange={(e) => setHoraFim(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <p className="mb-1 text-gray-700 font-medium">Motivo: *</p>
                <textarea
                  required
                  rows={3}
                  className="w-full border border-gray-300 rounded p-2 resize-none"
                  value={motivo}
                  onChange={(e) => setMotivo(e.target.value)}
                />
              </div>

              <div className="flex justify-center gap-3 pt-2">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 text-gray-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 disabled:opacity-50"
                >
                  {loading ? "Salvando..." : "✓ Salvar"}
                </button>
              </div>
            </form>
          </div>

          {/* DIREITA - MAPA */}
          <div className="flex-1 p-6 bg-gray-50 flex flex-col gap-6">
            <div className="w-full h-[300px] bg-white border border-gray-300 rounded relative flex items-center justify-center overflow-hidden">
              {carregandoMapa ? (
                <span className="text-teal-600 font-bold animate-pulse">Carregando mapa...</span>
              ) : mapaAtual ? (
                <Image
                  src={tratarCaminhoImagem(mapaAtual)}
                  alt="Mapa"
                  fill
                  className="object-contain p-2"
                  unoptimized={true}
                />
              ) : (
                <div className="text-gray-400 flex flex-col items-center">
                  <span className="text-3xl"></span>
                  <span className="text-sm mt-1">{salaSelecionada ? "Sem mapa disponível" : "Selecione uma sala"}</span>
                </div>
              )}
            </div>

            {/* CRONOGRAMA */}
            <div className="flex-1 border border-gray-300 rounded p-4 bg-white overflow-y-auto custom-scrollbar min-h-[250px]">
              <div className="flex items-center justify-between border-b border-gray-200 pb-2 mb-3">
                <h3 className={`${inriaSerif700.className} text-gray-800 text-lg`}>Cronograma</h3>
                {data && (
                  <span className="text-xs font-bold text-teal-600 bg-teal-50 px-2 py-1 rounded uppercase">
                    {formatarDataBonita(data)}
                  </span>
                )}
              </div>
              {!idEspaco || !data ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                  <p className="text-sm italic">Selecione espaço e data...</p>
                </div>
              ) : cronograma.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center">
                  <p className="text-green-600 font-bold">Todos os horários estão livres!</p>
                  <p className="text-xs text-gray-500">Nenhuma reserva para hoje.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {cronograma.map((res) => {
                    const hIni = new Date(res.horaInicio).toLocaleTimeString("pt-BR", {
                      timeZone: "UTC",
                      hour: "2-digit",
                      minute: "2-digit",
                    });
                    const hFim = new Date(res.horaFim).toLocaleTimeString("pt-BR", {
                      timeZone: "UTC",
                      hour: "2-digit",
                      minute: "2-digit",
                    });
                    return (
                      <div
                        key={res.idReserva}
                        className="bg-white border-l-4 border-teal-500 p-2 shadow-sm text-sm flex gap-3 items-start hover:bg-gray-50 transition"
                      >
                        {/* CORREÇÃO 2: shrink-0 */}
                        <div className="shrink-0">
                          {res.criador.foto ? (
                            <Image
                              src={tratarCaminhoImagem(res.criador.foto)}
                              alt="Avatar"
                              width={40}
                              height={40}
                              className="w-10 h-10 rounded-full object-cover border border-gray-200"
                              unoptimized={true}
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold border border-gray-300">
                              {res.criador.nome.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between font-bold text-gray-800">
                            <span>{res.criador.nome}</span>
                            <span className="text-xs font-normal bg-gray-100 px-1 rounded">
                              {hIni} - {hFim}
                            </span>
                          </div>
                          <p className="text-gray-500 text-xs mt-1 truncate">"{res.motivo}"</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
