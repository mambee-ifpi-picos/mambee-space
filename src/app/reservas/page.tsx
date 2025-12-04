"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

type Reserva = {
  idReserva: number;
  motivo: string;
  horaInicio: string;
  horaFim: string;
  idUsuarioCriador?: number;
  criador?: {
    idUsuario?: number;
    email?: string;
    nome?: string;
    foto?: string;
  };
};

type UsuarioLogado = {
  idUsuario: number;
  email: string;
  admin: boolean;
};

export default function ReservasPage() {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [busca, setBusca] = useState("");
  const [loading, setLoading] = useState(false);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [usuarioLogado, setUsuarioLogado] = useState<UsuarioLogado | null>(
    null
  );

  const initialsFromNameOrEmail = (nome?: string, email?: string) => {
    if (nome) return nome[0].toUpperCase();
    if (email) return email[0].toUpperCase();
    return "?";
  };

  const formatarHoraData = (inicio?: string, fim?: string) => {
    if (!inicio) return "";
    const start = new Date(inicio);
    const end = fim ? new Date(fim) : null;
    return end
      ? `${start.toLocaleString()} - ${end.toLocaleTimeString()}`
      : start.toLocaleString();
  };

  const carregarReservas = useCallback(
    async (paginaReq = 1, termoBusca = "") => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/reservas?page=${paginaReq}&search=${termoBusca}`
        );
        const data = await res.json();

        let lista: Reserva[] = [];
        if (Array.isArray(data.reservas)) {
          lista = data.reservas;
        }

        setReservas(lista);
        setPagina(paginaReq);
        setTotalPaginas(
          Math.ceil((data.total || 0) / (data.pageSize || 50)) || 1
        );
        setUsuarioLogado(data.usuarioLogado);
      } catch (err) {
        console.error("Erro ao carregar reservas:", err);
        setReservas([]);
        setUsuarioLogado(null);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const handleCancelReservation = async (idReserva: number) => {
    if (!usuarioLogado?.idUsuario) {
      alert("Erro de autenticação: ID de usuário não encontrado.");
      return;
    }

    if (!window.confirm("Tem certeza que deseja CANCELAR esta reserva?")) {
      return;
    }

    setLoading(true);
    try {
      const userId = usuarioLogado.idUsuario;
      const res = await fetch(
        `/api/reservas?idReserva=${idReserva}&idUsuario=${userId}`,
        { method: "DELETE" }
      );

      const data = await res.json();

      if (res.ok && data.success) {
        await carregarReservas(pagina, busca);
        alert("Reserva cancelada com sucesso!");
      } else {
        alert(`Falha ao cancelar reserva: ${data.error || res.statusText}`);
      }
    } catch (err) {
      console.error("Erro ao cancelar reserva:", err);
      alert("Erro de conexão ao tentar cancelar a reserva.");
    } finally {
      setLoading(false);
    }
  };

  const estaNaUltimaPagina = pagina >= totalPaginas;
  const reservasRender = reservas;

  const handleSearch = () => {
    setPagina(1);
    if (pagina === 1) {
      carregarReservas(1, busca);
    }
  };

  useEffect(() => {
    carregarReservas(pagina, busca);
  }, [carregarReservas, pagina, busca]); 

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
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
          />
        </div>

        <button
          type="button"
          onClick={handleSearch}
          disabled={loading}
          className="px-5 py-2 text-sm font-medium rounded-md bg-teal-500 text-white shadow-sm disabled:opacity-60"
        >
          {loading ? "Buscando..." : "Buscar"}
        </button>
      </section>

      <h2 className="text-lg font-semibold">
        {usuarioLogado?.admin ? "Todas as Reservas" : "Minhas Reservas"}
      </h2>

      {loading && reservas.length === 0 && (
        <p className="text-sm text-gray-500">Carregando reservas...</p>
      )}
      {reservas.length === 0 && !loading && (
        <p className="text-sm text-gray-500">Nenhuma reserva encontrada.</p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 auto-rows-[10rem] items-stretch">
        {reservasRender.map((reserva) => {
          const criador = reserva.criador;

          const displayName =
            criador?.nome && criador.nome.trim().length > 0
              ? criador.nome
              : criador?.email
              ? criador.email.split("@")[0]
              : `Usuário #${criador?.idUsuario}`;
          const displayEmail = criador?.email ?? null;
          const avatarFoto = criador?.foto ?? null;
          const initials = initialsFromNameOrEmail(
            criador?.nome,
            criador?.email
          );

          const isCriador = usuarioLogado?.idUsuario === criador?.idUsuario;
          const podeCancelar = usuarioLogado?.admin || isCriador;

          return (
            <article
              key={reserva.idReserva}
              className="flex rounded-xl shadow-sm bg-[#F5F5F5] overflow-hidden h-full"
            >
              <div className="w-2 bg-teal-500" />
              <div className="flex-1 px-4 py-3 flex flex-col justify-between h-full">
                <div>
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
                </div>

                <div className="flex justify-between items-center mt-2">
                  <p className="text-xs text-gray-600">
                    {formatarHoraData(reserva.horaInicio, reserva.horaFim)}
                  </p>

                  {podeCancelar && (
                    <button
                      type="button"
                      onClick={() => handleCancelReservation(reserva.idReserva)}
                      disabled={loading}
                      className="px-1.5 py-0.5 text-[10px] rounded-md bg-red-500 text-white shadow-md hover:bg-red-600 transition disabled:opacity-50"
                      title="Cancelar Reserva"
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {reservasRender.length > 0 && (
        <div className="flex flex-col items-center gap-2 mt-6">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => pagina > 1 && setPagina(pagina - 1)}
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
              onClick={() => !estaNaUltimaPagina && setPagina(pagina + 1)}
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
