"use client";

import { useState, useEffect, useCallback } from "react";
import { Inria_Serif } from "next/font/google";
import { createClient, type Session } from "@supabase/supabase-js";

const inriaSerif700 = Inria_Serif({ subsets: ["latin"], weight: ["700"] });

// Configuração Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase =
  supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

// Tipos
type Sala = { idSala: number; nomeSala: string; mapa: string | null };
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
  const [idEspaco, setIdEspaco] = useState("");
  const [data, setData] = useState("");
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFim, setHoraFim] = useState("");
  const [motivo, setMotivo] = useState("");

  const [idUsuarioAuth, setIdUsuarioAuth] = useState<string | null>(null);
  const [emailUsuario, setEmailUsuario] = useState<string>("");

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "success",
  });

  const showToast = useCallback((msg: string, type = "success") => {
    setToast({ visible: true, message: msg, type });
    setTimeout(
      () => setToast({ visible: false, message: "", type: "success" }),
      3500,
    );
  }, []);

  // Gerenciamento de Sessão (Auth)
  useEffect(() => {
    if (!supabase) return;
    const handleSession = (session: Session | null) => {
      if (session?.user) {
        setIdUsuarioAuth(session.user.id);
        setEmailUsuario(session.user.email || "");
      } else {
        setIdUsuarioAuth(null);
        setEmailUsuario("");
      }
    };
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => handleSession(session));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => handleSession(session));
    return () => subscription.unsubscribe();
  }, []);

  // Carregar Salas
  useEffect(() => {
    fetch("/api/reservar?tipo=salas")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setSalas(data);
      })
      .catch((e) => console.error("Erro salas:", e));
  }, []);

  // Seleção de Sala
  const handleSalaChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = Number(e.target.value);
    const sala = salas.find((s) => s.idSala === id) || null;

    setSalaSelecionada(sala);
    setIdEspaco("");
    setCronograma([]);
    setEspacos([]);

    if (sala) {
      fetch(`/api/reservar?tipo=espacos&idSala=${id}`)
        .then((res) => res.json())
        .then((d) => Array.isArray(d) && setEspacos(d));
    }
  };

  // Carregar Cronograma
  useEffect(() => {
    if (idEspaco && data) {
      fetch(`/api/reservar?idEspaco=${idEspaco}&data=${data}`)
        .then((res) => res.json())
        .then((d) => Array.isArray(d) && setCronograma(d));
    }
  }, [idEspaco, data]);

  // Função para processar imagem
  const tratarCaminhoImagem = (caminho: string | null) => {
    if (!caminho) return "";
    const limpo = caminho.trim().replace(/[\n\r\s]/g, "");

    if (limpo.startsWith("data:") || limpo.startsWith("http")) return limpo;

    if (limpo.length > 200) return `data:image/png;base64,${limpo}`;
    return `/${encodeURIComponent(caminho)}`;
  };

  const formatarDataBonita = (dataStr: string) => {
    if (!dataStr) return "";
    const parts = dataStr.split("-");
    const date = new Date(
      Number(parts[0]),
      Number(parts[1]) - 1,
      Number(parts[2]),
    );
    return date.toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "2-digit",
      month: "2-digit",
    });
  };

  // Envio do Formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const dtParts = data.split("-");
    const dtObj = new Date(
      Number(dtParts[0]),
      Number(dtParts[1]) - 1,
      Number(dtParts[2]),
    );
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    if (dtObj < hoje) {
      showToast("Data passada não pode, boy!", "error");
      setLoading(false);
      return;
    }
    if (horaFim <= horaInicio) {
      showToast("Hora final deve ser maior que inicial.", "error");
      setLoading(false);
      return;
    }

    let finalId = idUsuarioAuth;
    let finalEmail = emailUsuario;

    if (!finalId && supabase) {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        finalId = session.user.id;
        finalEmail = session.user.email || "";
      } else {
        showToast("Faça login para reservar.", "error");
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
        showToast(
          res.status === 404 ? "Usuário sem cadastro." : `Erro: ${json.error}`,
          "error",
        );
      } else {
        showToast("Reserva feita com sucesso!", "success");
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
          {/* ESQUERDA - FORMULÁRIO */}
          <div className="w-full lg:w-[35%] p-6 border-b lg:border-b-0 lg:border-r border-gray-300">
            <div className="mb-6">
              <h1
                className={`${inriaSerif700.className} text-3xl text-gray-900`}
              >
                RESERVAR ESPAÇO
              </h1>
              <div className="text-sm font-bold mt-1">
                {emailUsuario ? (
                  <span className="text-teal-600">Logado: {emailUsuario}</span>
                ) : (
                  <span className="text-gray-400">Verificando login...</span>
                )}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <p className="mb-1 text-gray-700 font-medium">
                  Sala: <span className="text-red-500">*</span>
                </p>
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
                <p className="mb-1 text-gray-700 font-medium">
                  Espaço: <span className="text-red-500">*</span>
                </p>
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
                <p className="mb-1 text-gray-700 font-medium">
                  Data: <span className="text-red-500">*</span>
                </p>
                <input
                  required
                  type="date"
                  className="w-full h-10 border border-gray-300 rounded p-2"
                  onChange={(e) => setData(e.target.value)}
                />
              </div>

              <div className="flex gap-2">
                <div className="w-1/2">
                  <p className="mb-1 text-gray-700 font-medium">
                    Início <span className="text-red-500">*</span>
                  </p>
                  <input
                    required
                    type="time"
                    className="w-full h-10 border border-gray-300 rounded p-2"
                    onChange={(e) => setHoraInicio(e.target.value)}
                  />
                </div>
                <div className="w-1/2">
                  <p className="mb-1 text-gray-700 font-medium">
                    Fim <span className="text-red-500">*</span>
                  </p>
                  <input
                    required
                    type="time"
                    className="w-full h-10 border border-gray-300 rounded p-2"
                    onChange={(e) => setHoraFim(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <p className="mb-1 text-gray-700 font-medium">
                  Motivo: <span className="text-red-500">*</span>
                </p>
                <textarea
                  required
                  rows={3}
                  className="w-full border border-gray-300 rounded p-2 resize-none"
                  value={motivo}
                  onChange={(e) => setMotivo(e.target.value)}
                />
              </div>

              <div className="flex justify-center gap-16 pt-2">
                <button
                  type="button"
                  className="px-10 py-2 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 text-gray-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-10 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 disabled:opacity-50"
                >
                  {loading ? "Salvando..." : "✓ Salvar"}
                </button>
              </div>
            </form>
          </div>

          {/* DIREITA - MAPA E CRONOGRAMA */}
          <div className="flex-1 p-6 bg-gray-50 flex flex-col gap-6">
            {/* Exibição do Mapa */}
            <div className="w-full h-[300px] bg-white border border-gray-300 rounded relative flex items-center justify-center overflow-hidden">
              {salaSelecionada?.mapa ? (
                <img
                  key={salaSelecionada.idSala}
                  src={tratarCaminhoImagem(salaSelecionada.mapa)}
                  alt={`Mapa da ${salaSelecionada.nomeSala}`}
                  className="w-full h-full object-contain p-2"
                />
              ) : (
                <div className="text-gray-400 flex flex-col items-center">
                  <span className="text-3xl">🗺️</span>
                  <span className="text-sm mt-1">
                    {salaSelecionada
                      ? "Sala sem mapa cadastrado"
                      : "Selecione uma sala"}
                  </span>
                </div>
              )}
            </div>

            {/* Lista Cronograma */}
            <div className="flex-1 border border-gray-300 rounded p-4 bg-white overflow-y-auto custom-scrollbar min-h-[250px]">
              <div className="flex items-center justify-between border-b border-gray-200 pb-2 mb-3">
                <h3
                  className={`${inriaSerif700.className} text-gray-800 text-lg`}
                >
                  Cronograma
                </h3>
                {data && (
                  <span className="text-xs font-bold text-teal-600 bg-teal-50 px-2 py-1 rounded uppercase">
                    {formatarDataBonita(data)}
                  </span>
                )}
              </div>

              {!idEspaco || !data ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                  <p className="text-sm italic">Selecione espaço e data.</p>
                </div>
              ) : cronograma.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center">
                  <p className="text-green-600 font-bold">
                    Todos os horários estão livres!
                  </p>
                  <p className="text-xs text-gray-500">
                    Nenhuma reserva para hoje.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {cronograma.map((res) => {
                    const hIni = new Date(res.horaInicio).toLocaleTimeString(
                      "pt-BR",
                      { timeZone: "UTC", hour: "2-digit", minute: "2-digit" },
                    );
                    const hFim = new Date(res.horaFim).toLocaleTimeString(
                      "pt-BR",
                      { timeZone: "UTC", hour: "2-digit", minute: "2-digit" },
                    );
                    return (
                      <div
                        key={res.idReserva}
                        className="bg-white border-l-4 border-teal-500 p-2 shadow-sm text-sm flex gap-3 items-start hover:bg-gray-50 transition"
                      >
                        <div className="flex-shrink-0">
                          {res.criador.foto ? (
                            <img
                              src={tratarCaminhoImagem(res.criador.foto)}
                              alt="Avatar"
                              className="w-[40px] h-[40px] rounded-full object-cover border border-gray-200"
                            />
                          ) : (
                            <div className="w-[40px] h-[40px] rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold border border-gray-300">
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
                          <p className="text-gray-500 text-xs mt-1 truncate">
                            "{res.motivo}"
                          </p>
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
