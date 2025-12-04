"use client";

import { useCallback, useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

interface Espaco {
  idEspaco: number;
  codigoEspaco: string;
}
interface Reserva {
  idReserva: number;
  motivo: string;
  horaInicio: string;
  horaFim: string;
  espaco: Espaco | null;
  criador: { nome?: string; email?: string | null } | null;
}
interface SalaResposta {
  espacos?: Espaco[];
}

type LinhaIdUsuario = { idUsuario?: number };

function obterUrlApi(caminho: string) {
  if (typeof window === "undefined" || !("location" in globalThis))
    return caminho;
  return `${window.location.origin}${caminho}`;
}

export default function ReservarPage() {
  const supabase = createClientComponentClient();

  const [idUsuario, setIdUsuario] = useState<number | null>(null);
  const [uuidSupabase, setUuidSupabase] = useState<string | null>(null);
  const [emailUsuario, setEmailUsuario] = useState<string | null>(null);
  const [carregandoUsuario, setCarregandoUsuario] = useState<boolean>(true);

  const [listaEspacos, setListaEspacos] = useState<Espaco[]>([]);
  const [carregandoEspacos, setCarregandoEspacos] = useState(true);

  const [espacoSelecionado, setEspacoSelecionado] = useState<number | null>(
    null
  );
  const [dataSelecionada, setDataSelecionada] = useState<string>("");
  const [listaReservas, setListaReservas] = useState<Reserva[]>([]);
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFim, setHoraFim] = useState("");
  const [motivo, setMotivo] = useState("");
  const [carregandoReservas, setCarregandoReservas] = useState(false);
  const [erroReservas, setErroReservas] = useState<string | null>(null);

  const buscarIdUsuario = useCallback(async () => {
    setCarregandoUsuario(true);
    setIdUsuario(null);
    setUuidSupabase(null);
    setEmailUsuario(null);
    try {
      const { data } = await supabase.auth.getUser();
      const usuarioAuth = data?.user ?? null;
      if (!usuarioAuth) {
        setCarregandoUsuario(false);
        return;
      }
      const uuid = usuarioAuth.id;
      const email = (usuarioAuth.email ?? "").trim();
      setUuidSupabase(uuid);
      setEmailUsuario(email || null);

      if (email) {
        try {
          const resEmailRaw = await supabase
            .from("Usuario")
            .select("idUsuario")
            .ilike("email", email)
            .maybeSingle();

          const resEmail = resEmailRaw as {
            data?: LinhaIdUsuario | null;
            error?: unknown;
          };
          if (
            !resEmail.error &&
            resEmail.data &&
            typeof resEmail.data.idUsuario === "number"
          ) {
            setIdUsuario(resEmail.data.idUsuario);
            setCarregandoUsuario(false);
            return;
          }
        } catch (_erroLookupEmail) {
          console.warn("Lookup por email falhou (não fatal).");
        }
      }

      const colunasPossiveis = [
        "auth_id",
        "supabase_uuid",
        "supabase_id",
        "id_supabase",
        "idSupabase",
      ];

      for (const coluna of colunasPossiveis) {
        try {
          const resRaw = await supabase
            .from("Usuario")
            .select("idUsuario")
            .eq(coluna, uuid)
            .maybeSingle();

          const res = resRaw as {
            data?: LinhaIdUsuario | null;
            error?: unknown;
          };
          if (
            !res.error &&
            res.data &&
            typeof res.data.idUsuario === "number"
          ) {
            setIdUsuario(res.data.idUsuario);
            setCarregandoUsuario(false);
            return;
          }
        } catch {}
      }

      setIdUsuario(null);
      setCarregandoUsuario(false);
    } catch (erroBuscar) {
      console.error("Erro buscarIdUsuario:", erroBuscar);
      setIdUsuario(null);
      setCarregandoUsuario(false);
    }
  }, [supabase]);

  useEffect(() => {
    buscarIdUsuario();
    const inscricao = supabase.auth.onAuthStateChange((_evento, sessao) => {
      if (sessao?.user) buscarIdUsuario();
      else {
        setIdUsuario(null);
        setUuidSupabase(null);
        setEmailUsuario(null);
        setCarregandoUsuario(false);
      }
    });

    return () => {
      try {
        const inscricaoUnknown = inscricao as unknown;

        if (inscricaoUnknown && typeof inscricaoUnknown === "object") {
          const maybeWithData = inscricaoUnknown as {
            data?: { subscription?: { unsubscribe?: () => void } };
          };
          if (maybeWithData?.data?.subscription?.unsubscribe) {
            maybeWithData.data.subscription.unsubscribe();
            return;
          }

          const maybeWithUnsubscribe = inscricaoUnknown as {
            unsubscribe?: unknown;
          };
          if (typeof maybeWithUnsubscribe.unsubscribe === "function") {
            (maybeWithUnsubscribe.unsubscribe as () => void)();
            return;
          }
        }

        if (typeof inscricao === "function") {
          (inscricao as unknown as () => void)();
        }
      } catch {}
    };
  }, [buscarIdUsuario, supabase]);

  const buscarReservas = useCallback(
    async (espacoId: number | null, data: string) => {
      if (espacoId == null || !data) {
        setListaReservas([]);
        setErroReservas(null);
        return;
      }
      setCarregandoReservas(true);
      setErroReservas(null);
      try {
        const url = obterUrlApi(
          `/api/reservas?data=${encodeURIComponent(
            data
          )}&idEspaco=${encodeURIComponent(String(espacoId))}`
        );
        const res = await fetch(url);

        let json: unknown = null;
        try {
          json = await res.json();
        } catch {
          const texto = await res.text().catch(() => null);
          json = texto ? { success: false, error: texto } : null;
        }

        if (
          res.ok &&
          json &&
          typeof json === "object" &&
          "success" in json &&
          (json as { success?: unknown }).success === true &&
          Array.isArray((json as { reservas?: unknown }).reservas)
        ) {
          setListaReservas((json as { reservas?: Reserva[] }).reservas ?? []);
        } else {
          setListaReservas([]);
          const errMsg =
            json && typeof json === "object" && "error" in json
              ? String((json as { error?: unknown }).error)
              : `HTTP ${res.status}`;
          setErroReservas(String(errMsg));
        }
      } catch (erro) {
        const mensagem = erro instanceof Error ? erro.message : String(erro);
        console.error("Erro buscarReservas:", erro);
        setListaReservas([]);
        setErroReservas(`Erro de conexão: ${mensagem}`);
      } finally {
        setCarregandoReservas(false);
      }
    },
    []
  );

  useEffect(() => {
    const buscarEspacos = async () => {
      setCarregandoEspacos(true);
      try {
        const url = obterUrlApi("/api/salas");
        const res = await fetch(url);

        let json: unknown = null;
        try {
          json = await res.json();
        } catch {
          const txt = await res.text().catch(() => null);
          json = txt ? { success: false, error: txt } : null;
        }

        if (
          json &&
          typeof json === "object" &&
          "success" in json &&
          (json as { success?: unknown }).success === true &&
          Array.isArray((json as { salas?: unknown }).salas)
        ) {
          const salasRaw = (json as { salas?: SalaResposta[] }).salas ?? [];
          const todos = salasRaw.flatMap((s) => s.espacos ?? []);
          setListaEspacos(todos);

          const hoje = new Date().toISOString().split("T")[0];
          const novaData = dataSelecionada || hoje;
          const novoEspaco =
            espacoSelecionado ?? (todos.length > 0 ? todos[0].idEspaco : null);

          setDataSelecionada(novaData);
          setEspacoSelecionado(novoEspaco);

          if (novoEspaco != null && novaData) {
            buscarReservas(novoEspaco, novaData);
          }
        } else {
          console.warn("/api/salas retornou formato inesperado:", json);
        }
      } catch (erro) {
        console.error("Erro ao buscar salas:", erro);
      } finally {
        setCarregandoEspacos(false);
      }
    };
    buscarEspacos();
  }, [buscarReservas, dataSelecionada, espacoSelecionado]);

  const handleChangeEspaco = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const novoId = e.target.value === "" ? null : Number(e.target.value);
    setEspacoSelecionado(novoId);
    if (novoId != null && dataSelecionada) {
      buscarReservas(novoId, dataSelecionada);
    }
  };

  const handleChangeData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const novaData = e.target.value;
    setDataSelecionada(novaData);
    if (espacoSelecionado != null && novaData) {
      buscarReservas(espacoSelecionado, novaData);
    }
  };

  const salvarReserva = useCallback(async () => {
    if (
      !espacoSelecionado ||
      !dataSelecionada ||
      !horaInicio ||
      !horaFim ||
      !motivo
    ) {
      alert("Todos os campos do formulário são obrigatórios.");
      return;
    }

    try {
      const payload: Record<string, unknown> = {
        idEspaco: espacoSelecionado,
        data: dataSelecionada,
        inicio: horaInicio,
        fim: horaFim,
        motivo: motivo.trim(),
      };

      if (idUsuario) {
        payload.idUsuario = idUsuario;
        payload.idCriador = idUsuario;
      } else if (uuidSupabase) {
        payload.auth_id = uuidSupabase;
        payload.supabase_uuid = uuidSupabase;
      } else {
        payload.idUsuario = null;
      }

      const url = obterUrlApi("/api/reservas");
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      let parsed: unknown = null;
      try {
        parsed = await res.json();
      } catch {
        const texto = await res.text().catch(() => null);
        parsed = texto ?? null;
      }

      if (!res.ok) {
        const errMsg =
          parsed && typeof parsed === "object" && "error" in parsed
            ? String((parsed as { error?: unknown }).error)
            : typeof parsed === "string"
            ? parsed
            : `Status ${res.status}`;
        alert(`Erro do servidor: ${String(errMsg)}`);
        return;
      }

      if (
        parsed &&
        typeof parsed === "object" &&
        "success" in parsed &&
        (parsed as { success?: unknown }).success === true
      ) {
        alert("Reserva criada com sucesso!");
        setHoraInicio("");
        setHoraFim("");
        setMotivo("");
        if (espacoSelecionado != null && dataSelecionada) {
          buscarReservas(espacoSelecionado, dataSelecionada);
        }
      } else {
        const errMsg =
          parsed && typeof parsed === "object" && "error" in parsed
            ? String((parsed as { error?: unknown }).error)
            : "Erro desconhecido ao criar reserva.";
        alert(`Erro ao criar reserva: ${String(errMsg)}`);
      }
    } catch (erroSalvar) {
      console.error("Erro ao salvar reserva:", erroSalvar);
      alert(
        "Erro ao criar reserva (falha de conexão). Veja o console para detalhes."
      );
    }
  }, [
    espacoSelecionado,
    dataSelecionada,
    horaInicio,
    horaFim,
    motivo,
    idUsuario,
    uuidSupabase,
    buscarReservas,
  ]);

  const nomeEspacoSelecionado =
    listaEspacos.find((e) => e.idEspaco === espacoSelecionado)?.codigoEspaco ??
    "Não Selecionado";

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-8">
      <div className="max-w-5xl mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">
            Nova Reserva de Espaço
          </h1>
          <div className="text-sm text-gray-500 mt-2">
            {carregandoUsuario ? (
              "Carregando autenticação..."
            ) : idUsuario ? (
              <span>
                Usuário ID:{" "}
                <span className="font-medium text-teal-600">{idUsuario}</span>
              </span>
            ) : uuidSupabase ? (
              <span>
                Autenticado (UUID):{" "}
                <span className="font-medium">{uuidSupabase}</span>
                {emailUsuario ? ` — ${emailUsuario}` : ""}
              </span>
            ) : (
              <span>Não autenticado</span>
            )}
          </div>
        </header>

        <main className="grid grid-cols-12 gap-6">
          <section className="col-span-12 lg:col-span-5">
            <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-5 shadow-lg">
              <h2 className="text-xl font-bold mb-4">Detalhes da Reserva</h2>

              <div>
                <label
                  htmlFor="espaco"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Espaço
                </label>
                <select
                  id="espaco"
                  value={espacoSelecionado ?? ""}
                  onChange={handleChangeEspaco}
                  className="w-full border border-gray-300 rounded-lg p-2 bg-white focus:ring-teal-500 focus:border-teal-500"
                  disabled={carregandoEspacos}
                >
                  <option value="">
                    {carregandoEspacos
                      ? "Carregando..."
                      : "Selecione um espaço"}
                  </option>
                  {listaEspacos.map((e) => (
                    <option key={e.idEspaco} value={e.idEspaco}>
                      {e.codigoEspaco}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="data"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Data
                </label>
                <input
                  id="data"
                  type="date"
                  value={dataSelecionada}
                  onChange={handleChangeData}
                  className="w-full border border-gray-300 rounded-lg p-2 bg-white focus:ring-teal-500 focus:border-teal-500"
                  max={
                    new Date(new Date().setDate(new Date().getDate() + 30))
                      .toISOString()
                      .split("T")[0]
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="horaInicio"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Hora Início
                  </label>
                  <input
                    id="horaInicio"
                    type="time"
                    value={horaInicio}
                    onChange={(e) => setHoraInicio(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2 bg-white focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="horaFim"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Hora Fim
                  </label>
                  <input
                    id="horaFim"
                    type="time"
                    value={horaFim}
                    onChange={(e) => setHoraFim(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2 bg-white focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="motivo"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Motivo
                </label>
                <textarea
                  id="motivo"
                  rows={3}
                  value={motivo}
                  onChange={(e) => setMotivo(e.target.value)}
                  placeholder="Descreva brevemente o motivo da reserva..."
                  className="w-full border border-gray-300 rounded-lg p-2 bg-white focus:ring-teal-500 focus:border-teal-500 resize-none"
                />
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  className="px-5 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                  onClick={() => {
                    setHoraInicio("");
                    setHoraFim("");
                    setMotivo("");
                  }}
                >
                  Limpar Campos
                </button>

                <button
                  type="button"
                  className="px-5 py-2 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition disabled:opacity-50"
                  onClick={salvarReserva}
                  disabled={
                    carregandoEspacos ||
                    !espacoSelecionado ||
                    !dataSelecionada ||
                    !horaInicio ||
                    !horaFim ||
                    !motivo
                  }
                >
                  Reservar
                </button>
              </div>
            </div>
          </section>

          <section className="col-span-12 lg:col-span-7">
            <h2 className="text-xl font-semibold mb-3 text-gray-800">
              Cronograma do Dia:{" "}
              {dataSelecionada
                ? new Date(`${dataSelecionada}T00:00:00`).toLocaleDateString(
                    "pt-BR",
                    { weekday: "long", day: "2-digit", month: "short" }
                  )
                : "Selecione uma data"}
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              Visualizando reservas para o espaço{" "}
              <span className="font-medium text-teal-600">
                {nomeEspacoSelecionado}
              </span>
            </p>

            <div className="grid grid-cols-1 gap-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {erroReservas && (
                <div className="text-sm text-red-700 p-4 bg-red-50 rounded-lg shadow-sm border border-red-200">
                  Erro: {erroReservas}
                </div>
              )}
              {carregandoReservas ? (
                <div className="text-sm text-gray-500 p-4 bg-white rounded-lg shadow-sm">
                  Carregando cronograma...
                </div>
              ) : listaReservas.length === 0 ? (
                <div className="text-sm text-gray-500 p-4 bg-white rounded-lg shadow-sm">
                  {espacoSelecionado && dataSelecionada
                    ? `Nenhuma reserva encontrada para ${nomeEspacoSelecionado} em ${dataSelecionada}.`
                    : "Selecione um espaço e uma data para ver o cronograma."}
                </div>
              ) : (
                listaReservas.map((r) => {
                  const nomeProprietario =
                    r.criador?.nome && r.criador.nome.trim().length > 0
                      ? r.criador.nome
                      : formatarNomeAPartirDoEmail(r.criador?.email ?? null);
                  return (
                    <div
                      key={r.idReserva}
                      className="flex items-center gap-4 bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:border-teal-400 transition"
                    >
                      <div className="shrink-0 w-2 h-full min-h-10 rounded-full bg-teal-500" />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-800">
                          {nomeProprietario}
                        </div>
                        <div className="text-xs text-gray-600 truncate">
                          {r.motivo}
                        </div>
                      </div>
                      <div className="shrink-0 text-sm font-semibold text-gray-700 text-right w-32">
                        {formatarIntervaloHorario(r.horaInicio, r.horaFim)}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

function formatarNomeAPartirDoEmail(email?: string | null) {
  if (!email) return "Usuário";
  const local = email.split("@")[0];
  const partes = local.split(/[._-]+/).filter(Boolean);
  return (
    partes.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join(" ") || local
  );
}
function formatarIntervaloHorario(inicioIso: string, fimIso: string) {
  try {
    const inicio = new Date(inicioIso);
    const fim = new Date(fimIso);
    const h1 = inicio.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const h2 = fim.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${h1} — ${h2}`;
  } catch {
    return "";
  }
}
