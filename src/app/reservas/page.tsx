"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";

type Espaco = {
  codigoEspaco: string;
  idSalaPertence: number;
  idEspaco?: number;
  id?: number;
  sala?: { nomeSala: string } | null;
  Sala?: { nomeSala: string } | null;
};
type Reserva = {
  idReserva: number;
  motivo: string;
  horaInicio: string;
  horaFim: string;
  situacao: string;
  idUsuarioCriador?: number;
  idEspacoReservado?: number;
  Espaco?: Espaco | null;
  espaco?: Espaco | null;
  criador?: { nome?: string; email?: string; idUsuario?: number } | null;
  idCriador?: number;
};
type Usuario = {
  idUsuario: number;
  nome: string;
  email: string | null;
  foto?: string | null;
  admin?: boolean;
};
type ApiResponse = {
  success?: boolean;
  reservas?: Reserva[];
  total?: number;
  totalUsuarioLogado?: number;
  error?: string;
  usuarios?: Usuario[];
  salas?: unknown[];
  usuarioLogado?: {
    idUsuario: number;
    admin: boolean;
    email: string;
  } | null;
};

const itensPorPagina = 9;

function safeParseApiResponse(text: string | null): ApiResponse | null {
  if (!text) return null;
  try {
    return JSON.parse(text) as ApiResponse;
  } catch {
    return null;
  }
}

function getLocalPart(email?: string | null) {
  if (!email) return null;
  return String(email).split("@")[0] || null;
}

function initialsFromNameOrEmail(name?: string | null, email?: string | null) {
  if (name && name.trim().length > 0) {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  const local = getLocalPart(email);
  if (local) return local.slice(0, 2).toUpperCase();
  return "US";
}

function obterAgoraLocalAsUtc() {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  const parts = formatter.formatToParts(new Date());
  const getVal = (type: string) => parts.find((p) => p.type === type)?.value;

  return new Date(
    `${getVal("year")}-${getVal("month")}-${getVal("day")}T${getVal("hour")}:${getVal("minute")}:${getVal("second")}.000Z`
  );
}

function reservaJaFinalizada(reserva: Reserva) {
  const fim = new Date(reserva.horaFim);
  const agora = obterAgoraLocalAsUtc();

  return fim.getTime() <= agora.getTime();
}

function cancelada(reserva: Reserva) {
  if (reserva.situacao === "CANCELADA") {
    return true;
  }
  return false;
}

export default function ReservasPage() {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [usuarios, setUsuarios] = useState<Record<number, Usuario>>({});
  const [usuariosPorEmail, setUsuariosPorEmail] = useState<Record<string, Usuario>>({});
  const [busca, setBusca] = useState("");
  const [buscaAtiva, setBuscaAtiva] = useState("");
  const [pagina, setPagina] = useState(1);
  const [totalReservas, setTotalReservas] = useState(0);
  const [totalUsuarioLogado, setTotalUsuarioLogado] = useState(0);
  const [loading, setLoading] = useState(false);
  const [defaultEspacoId, setDefaultEspacoId] = useState<number | null>(null);
  const [usuarioLogado, setUsuarioLogado] = useState<{
    idUsuario: number;
    admin: boolean;
    email: string;
  } | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [modalConfirmacao, setModalConfirmacao] = useState<{
    visible: boolean;
    idReserva: number | null;
  }>({ visible: false, idReserva: null });

  const [toast, setToast] = useState<{
    visible: boolean;
    message: string;
    type: "success" | "error";
  }>({ visible: false, message: "", type: "success" });

  const showToast = useCallback((message: string, type: "success" | "error" = "success") => {
    setToast({ visible: true, message, type });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 4000);
  }, []);

  const debugFetch = useCallback(async (input: RequestInfo | URL, init?: RequestInit) => {
    const res = await fetch(input, init);
    const text = await res.text();
    return { ok: res.ok, status: res.status, text };
  }, []);

  const carregarSalas = useCallback(async () => {
    try {
      const r = await debugFetch("/api/salas", { cache: "no-store" });
      if (!r.ok) return;
      const parsed = safeParseApiResponse(r.text);
      const salas = parsed?.salas ?? [];
      if (Array.isArray(salas) && salas.length > 0) {
        const first = salas[0] as { espacos?: Espaco[] };
        const espacos = Array.isArray(first.espacos) ? first.espacos : [];
        if (espacos.length > 0) {
          const espaco = espacos[0];
          const id = espaco.idEspaco ?? espaco.id ?? (espaco as { idSala?: number }).idSala ?? null;
          setDefaultEspacoId(id ? Number(id) : null);
        }
      }
    } catch (err) {
      console.error("[carregarSalas]", err);
    }
  }, [debugFetch]);

  useEffect(() => {
    carregarSalas();
  }, [carregarSalas]);

  const carregarUsuarios = useCallback(
    async (opts: { ids?: number[]; emails?: string[] }) => {
      try {
        const idsClean = (opts.ids ?? []).filter((i) => Number.isFinite(i) && i > 0);
        const emailsClean = (opts.emails ?? []).map((e) => String(e).trim().toLowerCase()).filter((e) => e.length > 0);

        if (idsClean.length > 0) {
          const uniqueIds = [...new Set(idsClean)];
          const url = `/api/usuarios?ids=${uniqueIds.join(",")}`;
          const r = await debugFetch(url, { cache: "no-store" });
          if (r.ok) {
            const parsed = safeParseApiResponse(r.text);
            const mapa: Record<number, Usuario> = {};
            (parsed?.usuarios ?? []).forEach((u) => {
              mapa[u.idUsuario] = {
                idUsuario: u.idUsuario,
                nome: u.nome?.trim() || u.email?.split("@")[0] || "Usuário",
                email: u.email ?? null,
                foto: u.foto ?? null,
                admin: u.admin ?? false,
              };
            });
            setUsuarios((prev) => ({ ...prev, ...mapa }));
          }
        }

        if (emailsClean.length > 0) {
          const uniqueEmails = [...new Set(emailsClean)];
          const url = `/api/usuarios?emails=${encodeURIComponent(uniqueEmails.join(","))}`;
          const r = await debugFetch(url, { cache: "no-store" });
          if (r.ok) {
            const parsed = safeParseApiResponse(r.text);
            const mapaEmail: Record<string, Usuario> = {};
            (parsed?.usuarios ?? []).forEach((u) => {
              if (u.email) {
                mapaEmail[u.email.toLowerCase()] = {
                  idUsuario: u.idUsuario,
                  nome: u.nome?.trim() || u.email?.split("@")[0] || "Usuário",
                  email: u.email ?? null,
                  foto: u.foto ?? null,
                  admin: u.admin ?? false,
                };
              }
            });
            setUsuariosPorEmail((prev) => ({ ...prev, ...mapaEmail }));
          }
        }
      } catch (err) {
        console.error("[carregarUsuarios] erro", err);
      }
    },
    [debugFetch],
  );

  const carregarReservas = useCallback(
    async (paginaAtual = 1, searchTerm = buscaAtiva) => {
      const pageToRequest = Math.max(1, paginaAtual);
      setLoading(true);
      try {
        const url = `/api/reservas?page=${pageToRequest}&pageSize=${itensPorPagina}${
          searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : ""
        }`;
        let r = await debugFetch(url, { cache: "no-store" });

        if (
          !r.ok &&
          r.status === 400 &&
          typeof r.text === "string" &&
          r.text.includes("Parâmetros 'data' e 'idEspaco'")
        ) {
          if (!defaultEspacoId) await carregarSalas();
          if (defaultEspacoId) {
            const today = new Date().toISOString().split("T")[0];
            const fallbackUrl = `/api/reservas?data=${today}&idEspaco=${defaultEspacoId}`;
            r = await debugFetch(fallbackUrl, { cache: "no-store" });
          }
        }

        if (!r.ok) {
          console.error("❌ [carregarReservas] Erro HTTP. Status:", r.status, "Corpo:", r.text);
          throw new Error(`HTTP ${r.status}`);
        }

        const data = safeParseApiResponse(r.text);
        if (!data || !data.success) throw new Error(data?.error ?? "Erro ao carregar reservas");

        if (data.usuarioLogado) {
          setUsuarioLogado(data.usuarioLogado);
        }

        const reservasTipadas: Reserva[] = data.reservas ?? [];
        setReservas(reservasTipadas);
        setTotalReservas(data.total ?? reservasTipadas.length ?? 0);
        setTotalUsuarioLogado(data.totalUsuarioLogado ?? 0);
        setPagina(pageToRequest);

        const emailsParaBuscar: string[] = [];
        const idsParaBuscar: number[] = [];

        reservasTipadas.forEach((r) => {
          const email = r.criador?.email ?? (r.criador as { emailAddress?: string })?.emailAddress ?? null;
          if (email && typeof email === "string" && email.trim().length > 0) {
            const e = email.trim().toLowerCase();
            if (!usuariosPorEmail[e]) emailsParaBuscar.push(e);
            return;
          }

          const maybeId =
            (r as { idUsuarioCriador?: number }).idUsuarioCriador ??
            (r as { idCriador?: number }).idCriador ??
            r.criador?.idUsuario;
          if (typeof maybeId === "number" && Number.isFinite(maybeId) && maybeId > 0) {
            if (!usuarios[maybeId]) idsParaBuscar.push(maybeId);
          }
        });

        if (emailsParaBuscar.length > 0 || idsParaBuscar.length > 0) {
          await carregarUsuarios({
            ids: idsParaBuscar,
            emails: emailsParaBuscar,
          });
        }
      } catch (err) {
        console.error("[carregarReservas] erro", err);
      } finally {
        setLoading(false);
      }
    },
    [buscaAtiva, carregarUsuarios, debugFetch, defaultEspacoId, carregarSalas, usuarios, usuariosPorEmail],
  );

  useEffect(() => {
    carregarReservas();
  }, [carregarReservas]);

  const executarBusca = useCallback(() => {
    setBuscaAtiva(busca);
    setPagina(1);
  }, [busca]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      executarBusca();
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (busca !== buscaAtiva) {
        executarBusca();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [busca, buscaAtiva, executarBusca]);

  const cancelarReserva = (idReserva: number) => {
    if (!usuarioLogado) {
      showToast("Você precisa estar logado para cancelar uma reserva", "error");
      return;
    }

    setModalConfirmacao({ visible: true, idReserva });
  };

  const confirmarCancelamento = async (idReserva: number) => {
    setDeletingId(idReserva);
    try {
      const url = `/api/reservas?idReserva=${idReserva}&idUsuario=${usuarioLogado!.idUsuario}`;
      const response = await fetch(url, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Erro ao cancelar reserva");
      }

      if (result.success) {
        carregarReservas(pagina, buscaAtiva);
        showToast("Reserva cancelada com sucesso!", "success");
      } else {
        throw new Error(result.error || "Erro ao cancelar reserva");
      }
    } catch (error) {
      console.error("Erro ao cancelar reserva:", error);
      showToast(error instanceof Error ? error.message : "Erro ao cancelar reserva", "error");
    } finally {
      setDeletingId(null);
    }
  };

  const podeCancelarReserva = (reserva: Reserva) => {
    if (!usuarioLogado) return false;

    if (reserva.situacao === "CANCELADA") return false;

    // Adjusting agora to match UTC stored times or correct browser TZ
    const agora = obterAgoraLocalAsUtc().getTime();
    const fim = new Date(reserva.horaFim).getTime();

    // Admin can cancel anything that hasn't finished yet
    if (usuarioLogado.admin && fim > agora) return true;

    // Normal user logic - can cancel BEFORE or DURING the event
    if (fim < agora) return false;

    const reservaCriadorId = reserva.idUsuarioCriador ?? reserva.criador?.idUsuario ?? reserva.idCriador;
    return reservaCriadorId === usuarioLogado.idUsuario;
  };

  const totalPaginas = Math.max(1, Math.ceil(totalReservas / itensPorPagina));
  const estaNaUltimaPagina = pagina >= totalPaginas;

  function formatarReservaHora(inicioIso: string, fimIso: string) {
    if (!inicioIso || !fimIso) return "";

    const horaInicio = inicioIso.substring(11, 16);
    const horaFim = fimIso.substring(11, 16);
    const data = fimIso.substring(0, 10).split("-").reverse().join("/");

    return `${horaInicio} - ${horaFim} : ${data}`;
  }

  return (
    <>
      {toast.visible && (
        <div
          className={`fixed top-4 left-1/2 -translate-x-1/2 px-6 py-3 rounded-md shadow-lg z-50 border transition-all duration-300 ${
            toast.type === "success"
              ? "bg-teal-500 border-teal-300 text-white"
              : "bg-red-500 border-red-500 text-white"
          }`}
        >
          {toast.message}
        </div>
      )}

      {modalConfirmacao.visible && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 border border-gray-200 transform scale-100 transition-all">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Cancelar Reserva</h3>
            <p className="text-gray-600 text-sm mb-6">
              Tem certeza que deseja cancelar esta reserva? Esta ação não pode ser desfeita.
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setModalConfirmacao({ visible: false, idReserva: null })}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 text-gray-700 text-sm font-semibold transition-colors"
              >
                Voltar
              </button>
              <button
                type="button"
                onClick={async () => {
                  const id = modalConfirmacao.idReserva;
                  setModalConfirmacao({ visible: false, idReserva: null });
                  if (id !== null) {
                    await confirmarCancelamento(id);
                  }
                }}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-6xl mx-auto px-8 py-8 space-y-6">
      <section className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label htmlFor="search" className="sr-only">
          Buscar pelo usuário
        </label>
        <div className="flex-1 flex items-center border rounded-md overflow-hidden bg-white">
          <div className="px-3 text-gray-400 text-sm">🔍</div>
          <input
            id="search"
            type="text"
            placeholder="Buscar por usuário..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="flex-1 px-2 py-2 text-sm outline-none"
            onKeyDown={handleKeyDown}
          />
        </div>

        <button
          type="button"
          onClick={executarBusca}
          disabled={loading}
          className="px-5 py-2 text-sm font-medium rounded-md bg-teal-500 text-white shadow-sm disabled:opacity-60"
        >
          {loading ? "Buscando..." : "Buscar"}
        </button>
      </section>

      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">
          Reservas {usuarioLogado?.admin ? "(Todas as reservas - Admin)" : "(Minhas reservas)"}
        </h2>
        {buscaAtiva && (
          <div className="text-sm text-gray-600">
            Buscando por: "{buscaAtiva}" • {totalReservas} resultado
            {totalReservas !== 1 ? "s" : ""}
          </div>
        )}
        {!loading && usuarioLogado && (
          <div className="text-sm text-gray-600">
            Seu total de reservas: <span className="font-medium">{totalUsuarioLogado}</span>
          </div>
        )}
      </div>

      {loading && reservas.length === 0 && <p className="text-sm text-gray-500">Carregando reservas...</p>}
      {reservas.length === 0 && !loading && (
        <p className="text-sm text-gray-500">
          {buscaAtiva ? `Nenhuma reserva encontrada para "${buscaAtiva}"` : "Nenhuma reserva encontrada."}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
        {reservas.map((reserva) => {
          const creatorId =
            reserva.idUsuarioCriador ??
            (reserva as { idCriador?: number }).idCriador ??
            reserva.criador?.idUsuario ??
            0;
          const creatorEmail = reserva.criador?.email ?? null;

          const userById = creatorId ? usuarios[creatorId] : undefined;
          const userByEmail =
            creatorEmail && usuariosPorEmail[creatorEmail.toLowerCase()]
              ? usuariosPorEmail[creatorEmail.toLowerCase()]
              : undefined;
          const user = userByEmail ?? userById;

          const displayName = user?.nome ?? reserva.criador?.nome ?? (creatorEmail ? getLocalPart(creatorEmail) : `Usuário ${creatorId}`);
          const displayEmail = user?.email ?? creatorEmail ?? null;
          const avatarFoto = user?.foto ?? reserva.criador?.foto ?? null;
          const initials = initialsFromNameOrEmail(user?.nome ?? displayEmail, displayEmail);

          const podeCancelar = podeCancelarReserva(reserva);
          const espacoObj = reserva.Espaco || reserva.espaco;
          const salaObj = espacoObj?.Sala || espacoObj?.sala;

          return (
            <article
              key={reserva.idReserva}
              className="flex rounded-xl shadow-sm bg-[#F5F5F5] overflow-hidden relative group hover:shadow-md transition-shadow border border-gray-200"
            >
              {reservaJaFinalizada(reserva) && (
                <span className="absolute top-2 right-2 text-[10px] font-bold uppercase bg-gray-300 text-gray-700 px-2 py-0.5 rounded z-10">
                  Finalizada
                </span>
              )}

              <div className="w-2 bg-teal-500 shrink-0" />
              <div className="flex-1 px-4 py-3 flex flex-col justify-between min-h-[11rem]">
                <div className="flex items-center gap-3 mb-2">
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      minWidth: 32,
                      minHeight: 32,
                    }}
                  >
                    {avatarFoto ? (
                      <img
                        src={avatarFoto}
                        alt={`Foto de ${displayName}`}
                        className="w-full h-full rounded-full border border-gray-300 object-cover"
                      />
                    ) : (
                      <div
                        className="rounded-full flex items-center justify-center text-xs font-semibold border border-gray-300"
                        style={{
                          width: 32,
                          height: 32,
                          backgroundColor: "#E6E6E6",
                          color: "#333",
                        }}
                      >
                        {initials}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col text-sm text-gray-800 overflow-hidden">
                    <span className="font-semibold leading-tight truncate max-w-[150px]">{displayName}</span>
                    {displayEmail && <span className="text-xs text-gray-500 leading-tight truncate max-w-[150px]">{displayEmail}</span>}
                  </div>
                </div>

                <p className="text-sm text-gray-800 mb-2 line-clamp-2 font-medium">
                  {reserva.motivo}
                </p>

                {/* Badges de Sala e Espaço */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {salaObj?.nomeSala ? (
                    <span className="bg-teal-50 border border-teal-200 text-teal-700 text-[10px] font-bold px-2 py-0.5 rounded">
                      {salaObj.nomeSala}
                    </span>
                  ) : null}
                  <span className="bg-[#E0F2F1] border border-[#B2DFDB] text-[#00695C] text-[10px] font-bold px-2 py-0.5 rounded">
                    Espaço {espacoObj?.codigoEspaco || "—"}
                  </span>
                </div>

                {/* Rodapé: Data/Hora e Ações (Empilhados: botão abaixo da hora e data) */}
                <div className="flex flex-col gap-2 pt-2 border-t border-gray-200/60 mt-auto">
                  <p className="text-xs text-gray-600 font-medium whitespace-nowrap">
                    {formatarReservaHora(reserva.horaInicio, reserva.horaFim)}
                  </p>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {reserva.situacao !== "CANCELADA" && (() => {
                      const agoraMs = obterAgoraLocalAsUtc().getTime();
                      return new Date(reserva.horaInicio).getTime() <= agoraMs &&
                             new Date(reserva.horaFim).getTime() > agoraMs;
                    })() && (
                        <span className="px-2 py-0.5 text-[10px] text-white bg-blue-500 rounded font-semibold shadow-sm animate-pulse whitespace-nowrap">
                          Em Andamento
                        </span>
                      )}

                    {podeCancelar ? (
                      <button
                        type="button"
                        onClick={() => cancelarReserva(reserva.idReserva)}
                        disabled={deletingId === reserva.idReserva || !podeCancelar}
                        className={`
                          px-2 py-1 text-[10px] font-bold rounded
                          transition-all duration-200
                          ${
                            deletingId === reserva.idReserva
                              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                              : "bg-red-500 hover:bg-red-600 text-white shadow-sm"
                          }
                          flex items-center gap-1 whitespace-nowrap
                        `}
                        title="Cancelar esta reserva"
                      >
                        {deletingId === reserva.idReserva ? (
                          <>
                            <span className="animate-spin h-2.5 w-2.5 border-2 border-white border-t-transparent rounded-full"></span>
                            ...
                          </>
                        ) : (
                          <>
                            <svg
                              className="w-2.5 h-2.5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                              aria-label="Ícone de cancelar"
                            >
                              <title>Cancelar</title>
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Cancelar
                          </>
                        )}
                      </button>
                    ) : (
                      usuarioLogado && (
                        <span
                          className="px-2 py-0.5 text-[10px] text-gray-500 bg-gray-200/80 rounded whitespace-nowrap"
                          title="Apenas o criador da reserva ou um administrador pode cancelar"
                        >
                          {reserva.situacao === "CANCELADA" ? "Cancelada" : "Bloqueada"}
                        </span>
                      )
                    )}
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {reservas.length > 0 && (
        <div className="flex flex-col items-center gap-2 mt-6">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => {
                if (pagina > 1) carregarReservas(pagina - 1, buscaAtiva);
              }}
              disabled={pagina === 1 || loading}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 text-sm"
            >
              ◀ Anterior
            </button>
            <span className="text-sm font-medium">
              Página {pagina} de {totalPaginas}
            </span>
            <button
              type="button"
              onClick={() => {
                if (!estaNaUltimaPagina) carregarReservas(pagina + 1, buscaAtiva);
              }}
              disabled={estaNaUltimaPagina || loading}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 text-sm"
            >
              Próxima ▶
            </button>
          </div>

          {estaNaUltimaPagina && (
            <span className="text-xs text-gray-500">
              {buscaAtiva
                ? "Você já está vendo todos os resultados da busca."
                : "Você já está vendo todas as reservas."}
            </span>
          )}
        </div>
      )}
    </main>
    </>
  );
}
