"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";

type Espaco = {
  codigoEspaco: string;
  idSalaPertence: number;
  idEspaco?: number;
  id?: number;
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

export default function ReservasPage() {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [usuarios, setUsuarios] = useState<Record<number, Usuario>>({});
  const [usuariosPorEmail, setUsuariosPorEmail] = useState<
    Record<string, Usuario>
  >({});
  const [busca, setBusca] = useState("");
  const [buscaAtiva, setBuscaAtiva] = useState("");
  const [pagina, setPagina] = useState(1);
  const [totalReservas, setTotalReservas] = useState(0);
  const [loading, setLoading] = useState(false);
  const [defaultEspacoId, setDefaultEspacoId] = useState<number | null>(null);
  const [usuarioLogado, setUsuarioLogado] = useState<{
    idUsuario: number;
    admin: boolean;
    email: string;
  } | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const debugFetch = useCallback(
    async (input: RequestInfo | URL, init?: RequestInit) => {
      const res = await fetch(input, init);
      const text = await res.text();
      return { ok: res.ok, status: res.status, text };
    },
    []
  );

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
          const id =
            espaco.idEspaco ??
            espaco.id ??
            (espaco as { idSala?: number }).idSala ??
            null;
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
        const idsClean = (opts.ids ?? []).filter(
          (i) => Number.isFinite(i) && i > 0
        );
        const emailsClean = (opts.emails ?? [])
          .map((e) => String(e).trim().toLowerCase())
          .filter((e) => e.length > 0);

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
          const url = `/api/usuarios?emails=${encodeURIComponent(
            uniqueEmails.join(",")
          )}`;
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
    [debugFetch]
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
          console.error(
            "❌ [carregarReservas] Erro HTTP. Status:",
            r.status,
            "Corpo:",
            r.text
          );
          throw new Error(`HTTP ${r.status}`);
        }

        const data = safeParseApiResponse(r.text);
        if (!data || !data.success)
          throw new Error(data?.error ?? "Erro ao carregar reservas");

        if (data.usuarioLogado) {
          setUsuarioLogado(data.usuarioLogado);
        }

        const reservasTipadas: Reserva[] = data.reservas ?? [];
        setReservas(reservasTipadas);
        setTotalReservas(data.total ?? reservasTipadas.length ?? 0);
        setPagina(pageToRequest);

        const emailsParaBuscar: string[] = [];
        const idsParaBuscar: number[] = [];

        reservasTipadas.forEach((r) => {
          const email =
            r.criador?.email ??
            (r.criador as { emailAddress?: string })?.emailAddress ??
            null;
          if (email && typeof email === "string" && email.trim().length > 0) {
            const e = email.trim().toLowerCase();
            if (!usuariosPorEmail[e]) emailsParaBuscar.push(e);
            return;
          }

          const maybeId =
            (r as { idUsuarioCriador?: number }).idUsuarioCriador ??
            (r as { idCriador?: number }).idCriador ??
            r.criador?.idUsuario;
          if (
            typeof maybeId === "number" &&
            Number.isFinite(maybeId) &&
            maybeId > 0
          ) {
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
    [
      buscaAtiva, 
      carregarUsuarios,
      debugFetch,
      defaultEspacoId,
      carregarSalas,
      usuarios,
      usuariosPorEmail,
    ]
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

  const cancelarReserva = async (idReserva: number) => {
    if (!usuarioLogado) {
      alert("Você precisa estar logado para cancelar uma reserva");
      return;
    }

    if (!confirm("Tem certeza que deseja cancelar esta reserva?")) {
      return;
    }

    setDeletingId(idReserva);
    try {
      const url = `/api/reservas?idReserva=${idReserva}&idUsuario=${usuarioLogado.idUsuario}`;
      const response = await fetch(url, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Erro ao cancelar reserva");
      }

      if (result.success) {
        carregarReservas(pagina, buscaAtiva);
        alert("Reserva cancelada com sucesso!");
      } else {
        throw new Error(result.error || "Erro ao cancelar reserva");
      }
    } catch (error) {
      console.error("Erro ao cancelar reserva:", error);
      alert(
        error instanceof Error ? error.message : "Erro ao cancelar reserva"
      );
    } finally {
      setDeletingId(null);
    }
  };

  const podeCancelarReserva = (reserva: Reserva) => {
    if (!usuarioLogado) return false;

    if (usuarioLogado.admin) return true;

    const reservaCriadorId =
      reserva.idUsuarioCriador ??
      reserva.criador?.idUsuario ??
      reserva.idCriador;

    return reservaCriadorId === usuarioLogado.idUsuario;
  };

  const totalPaginas = Math.max(1, Math.ceil(totalReservas / itensPorPagina));
  const estaNaUltimaPagina = pagina >= totalPaginas;

  function formatarHoraData(inicioStr: string, fimStr: string) {
    const inicio = new Date(inicioStr);
    const fim = new Date(fimStr);
    const h1 = inicio.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const h2 = fim.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const data = inicio.toLocaleDateString("pt-BR");
    return `${h1} - ${h2} - ${data}`;
  }

  return (
    <main className="max-w-6xl mx-auto px-8 py-8 space-y-6">
      <section className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label htmlFor="search" className="sr-only">
          Buscar pelo motivo
        </label>
        <div className="flex-1 flex items-center border rounded-md overflow-hidden bg-white">
          <div className="px-3 text-gray-400 text-sm">🔍</div>
          <input
            id="search"
            type="text"
            placeholder="Buscar pelo motivo..."
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
          Reservas{" "}
          {usuarioLogado?.admin
            ? "(Todas as reservas - Admin)"
            : "(Minhas reservas)"}
        </h2>
        {buscaAtiva && (
          <div className="text-sm text-gray-600">
            Buscando por: "{buscaAtiva}" • {totalReservas} resultado
            {totalReservas !== 1 ? "s" : ""}
          </div>
        )}
      </div>

      {loading && reservas.length === 0 && (
        <p className="text-sm text-gray-500">Carregando reservas...</p>
      )}
      {reservas.length === 0 && !loading && (
        <p className="text-sm text-gray-500">
          {buscaAtiva
            ? `Nenhuma reserva encontrada para "${buscaAtiva}"`
            : "Nenhuma reserva encontrada."}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 auto-rows-[10rem] items-stretch">
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

          const displayName =
            user?.nome ??
            (creatorEmail
              ? getLocalPart(creatorEmail)
              : `Usuário ${creatorId}`);
          const displayEmail = user?.email ?? creatorEmail ?? null;
          const avatarFoto = user?.foto ?? null;
          const initials = initialsFromNameOrEmail(
            user?.nome ?? displayEmail,
            displayEmail
          );

          const podeCancelar = podeCancelarReserva(reserva);

          return (
            <article
              key={reserva.idReserva}
              className="flex rounded-xl shadow-sm bg-[#F5F5F5] overflow-hidden h-full relative group hover:shadow-md transition-shadow"
            >
              <div className="w-2 bg-teal-500" />
              <div className="flex-1 px-4 py-3 flex flex-col justify-between h-full">
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
                      <Image
                        src={avatarFoto}
                        alt={`Foto de ${displayName}`}
                        width={32}
                        height={32}
                        className="rounded-full border border-gray-300 object-cover"
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

                  <div className="flex flex-col text-sm text-gray-800">
                    <span className="font-semibold leading-tight">
                      {displayName}
                    </span>
                    {displayEmail && (
                      <span className="text-xs text-gray-500 leading-tight">
                        {displayEmail}
                      </span>
                    )}
                  </div>
                </div>

                <p
                  className="text-sm text-gray-800 mb-1 overflow-hidden"
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {reserva.motivo}
                </p>

                <p className="text-xs text-gray-600 mb-3">
                  {formatarHoraData(reserva.horaInicio, reserva.horaFim)}
                </p>

                {podeCancelar && (
                  <div className="absolute bottom-2 right-2">
                    <button
                      type="button"
                      onClick={() => cancelarReserva(reserva.idReserva)}
                      disabled={
                        deletingId === reserva.idReserva || !podeCancelar
                      }
                      className={`
                        px-3 py-1 text-xs font-medium rounded
                        transition-all duration-200
                        ${
                          deletingId === reserva.idReserva
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-red-500 hover:bg-red-600 text-white shadow-sm"
                        }
                        flex items-center gap-1
                      `}
                      title="Cancelar esta reserva"
                    >
                      {deletingId === reserva.idReserva ? (
                        <>
                          <span className="animate-spin h-3 w-3 border-2 border-white border-t-transparent rounded-full"></span>
                          Cancelando...
                        </>
                      ) : (
                        <>
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-label="Ícone de cancelar"
                          >
                            <title>Cancelar</title>
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                          Cancelar
                        </>
                      )}
                    </button>
                  </div>
                )}

                {!podeCancelar && usuarioLogado && (
                  <div className="absolute bottom-2 right-2">
                    <span
                      className="px-2 py-1 text-xs text-gray-500 bg-gray-100 rounded"
                      title="Apenas o criador da reserva ou um administrador pode cancelar"
                    >
                      Não pode cancelar
                    </span>
                  </div>
                )}
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
                if (!estaNaUltimaPagina)
                  carregarReservas(pagina + 1, buscaAtiva);
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
  );
}
