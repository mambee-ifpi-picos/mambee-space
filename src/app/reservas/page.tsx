"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";

type Espaco = {
  codigoEspaco: string;
  idSalaPertence: number;
};

type Reserva = {
  idReserva: number;
  motivo: string;
  horaInicio: string;
  horaFim: string;
  situacao: string;
  idUsuarioCriador: number;
  idEspacoReservado: number;
  Espaco: Espaco | null;
};

type Usuario = {
  idUsuario: number;
  nome: string;
  email: string | null;
  foto?: string | null;
};

type ApiResponse = {
  success: boolean;
  reservas?: Reserva[];
  total?: number;
  error?: string;
  usuarios?: Usuario[];
};

const ID_USUARIO = 1; // ID do usuário logado
const USUARIO_E_ADMIN = true; // true se for admin

export default function ReservasPage() {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [usuarios, setUsuarios] = useState<Record<number, Usuario>>({});
  const [busca, setBusca] = useState("");
  const [pagina, setPagina] = useState(1);
  const [totalReservas, setTotalReservas] = useState(0);
  const [loading, setLoading] = useState(false);
  const itensPorPagina = 9;

  const debugFetch = useCallback(
    async (input: RequestInfo | URL, init?: RequestInit) => {
      try {
        const res = await fetch(input, init);
        const text = await res.text();
        return { ok: res.ok, status: res.status, text };
      } catch (err) {
        console.error("[debugFetch] erro:", err);
        throw err;
      }
    },
    []
  );

  const carregarUsuarios = useCallback(
    async (ids: number[]) => {
      if (ids.length === 0) return;
      try {
        const url = `/api/usuarios?ids=${ids.join(",")}`;
        const r = await debugFetch(url, { cache: "no-store" });
        if (!r.ok) return;

        const parsed: ApiResponse = JSON.parse(r.text);
        if (!parsed.usuarios) return;

        const mapa: Record<number, Usuario> = {};
        parsed.usuarios.forEach((u) => {
          mapa[u.idUsuario] = {
            idUsuario: u.idUsuario,
            nome: u.nome?.trim() || u.email?.split("@")[0] || "Usuário",
            email: u.email ?? null,
            foto: u.foto ?? null,
          };
        });

        setUsuarios((prev) => ({ ...prev, ...mapa }));
      } catch (err) {
        console.error("[carregarUsuarios] erro", err);
      }
    },
    [debugFetch]
  );

  const carregarReservas = useCallback(
    async (paginaAtual = 1, searchTerm = busca) => {
      setLoading(true);

      try {
        // ✨ CORREÇÃO FRONT-END: Sempre enviamos idUsuario e isAdmin para evitar o erro 400
        const url = `/api/reservas?pagina=${paginaAtual}&itensPorPagina=${itensPorPagina}&idUsuario=${ID_USUARIO}&isAdmin=${USUARIO_E_ADMIN}${
          searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : ""
        }`;

        // 🟢 LOG DA URL
        console.log("➡️ [carregarReservas] Chamando URL:", url);

        const r = await debugFetch(url, { cache: "no-store" });
        if (!r.ok) {
          // 🔴 LOG DO CORPO DO ERRO
          console.error(
            "❌ [carregarReservas] Erro HTTP. Status:",
            r.status,
            "Corpo da Resposta (r.text):",
            r.text
          );
          throw new Error(`Erro HTTP ${r.status}`);
        }

        const data: ApiResponse = JSON.parse(r.text);
        if (!data.success)
          throw new Error(data.error || "Erro ao carregar reservas");

        // ⚠️ Nota: O front-end espera 'reservas' e 'total' diretamente em 'data'
        const reservasTipadas: Reserva[] = data.reservas || [];
        setReservas(reservasTipadas);
        setTotalReservas(data.total || 0);
        setPagina(paginaAtual);

        const idsUsuarios = [
          ...new Set(reservasTipadas.map((r) => r.idUsuarioCriador)),
        ];
        carregarUsuarios(idsUsuarios);
      } catch (err: unknown) {
        console.error("[carregarReservas] erro", err);
      } finally {
        setLoading(false);
      }
    },
    [busca, carregarUsuarios, debugFetch]
  );

  useEffect(() => {
    carregarReservas();
  }, [carregarReservas]);

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
        <div className="flex-1 flex items-center border rounded-md overflow-hidden bg-white">
          <div className="px-3 text-gray-400 text-sm">🔍</div>
          <input
            type="text"
            placeholder="Buscar pelo motivo..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="flex-1 px-2 py-2 text-sm outline-none"
          />
        </div>
        <button
          type="button"
          onClick={() => carregarReservas(1, busca)}
          disabled={loading}
          className="px-5 py-2 text-sm font-medium rounded-md bg-teal-500 text-white shadow-sm disabled:opacity-60"
        >
          {loading ? "Buscando..." : "Buscar"}
        </button>
      </section>

      <h2 className="text-lg font-semibold">
        {USUARIO_E_ADMIN ? "Todas as Reservas" : "Minhas Reservas"}
      </h2>

      {loading && reservas.length === 0 && (
        <p className="text-sm text-gray-500">Carregando reservas...</p>
      )}
      {reservas.length === 0 && !loading && (
        <p className="text-sm text-gray-500">Nenhuma reserva encontrada.</p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 auto-rows-[10rem] items-stretch">
        {reservas.map((reserva) => {
          const user = usuarios[reserva.idUsuarioCriador];
          return (
            <article
              key={reserva.idReserva}
              className="flex rounded-xl shadow-sm bg-[#F5F5F5] overflow-hidden h-full"
            >
              <div className="w-2 bg-teal-500" />
              <div className="flex-1 px-4 py-3 flex flex-col justify-between h-full">
                <div className="flex items-center gap-2 mb-2">
                  <Image
                    src={user?.foto || "/default-user.png"}
                    alt={`Foto de ${user?.nome || "Usuário"}`}
                    width={32}
                    height={32}
                    className="rounded-full border border-gray-300"
                  />
                  <div className="flex flex-col text-sm text-gray-800">
                    <span className="font-semibold">
                      {user?.nome || `Usuário ${reserva.idUsuarioCriador}`}
                    </span>
                    {user?.email && (
                      <span className="text-xs text-gray-500">
                        {user.email}
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
              onClick={() => carregarReservas(pagina - 1)}
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
              onClick={() => carregarReservas(pagina + 1)}
              disabled={estaNaUltimaPagina || loading}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 text-sm"
            >
              Próxima ▶
            </button>
          </div>

          {estaNaUltimaPagina && (
            <span className="text-xs text-gray-500">
              Você já está vendo todas as reservas.
            </span>
          )}
        </div>
      )}
    </main>
  );
}
