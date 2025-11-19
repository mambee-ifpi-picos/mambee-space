"use client";

import React, { useCallback, useEffect, useState } from "react";

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

type ApiResponse = {
  success: boolean;
  reservas?: Reserva[];
  error?: string;
};

const ID_USUARIO = 1;
const USUARIO_E_ADMIN = true;

export default function MinhasReservasPage() {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [busca, setBusca] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const [showSuccessCancel, setShowSuccessCancel] = useState(false);
  const [pagina, setPagina] = useState(1);
  const itensPorPagina = 9;
  const carregarReservas = useCallback(async (searchTerm?: string) => {
    setLoading(true);
    setErro(null);

    try {
      let url = `/api/reservas?idUsuario=${ID_USUARIO}`;

      if (searchTerm && searchTerm.trim() !== "") {
        url += `&search=${encodeURIComponent(searchTerm.trim())}`;
      }

      const res = await fetch(url, { cache: "no-store" });
      const json: ApiResponse = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || "Erro ao carregar reservas.");
      }

      const todas = json.reservas || [];
      const filtradas = USUARIO_E_ADMIN
        ? todas
        : todas.filter((r) => r.idUsuarioCriador === ID_USUARIO);

      setReservas(filtradas);
      setPagina(1);
    } catch (err: any) {
      setErro(err.message || "Erro ao carregar reservas.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarReservas();
  }, [carregarReservas]);

  async function handleCancelar(reserva: Reserva) {
    try {
      const res = await fetch(
        `/api/reservas?idReserva=${reserva.idReserva}&idUsuario=${ID_USUARIO}`,
        { method: "DELETE" }
      );

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || "Erro ao cancelar reserva.");
      }

      setReservas((prev) => {
        const novoArray = prev.filter((r) => r.idReserva !== reserva.idReserva);

        if (novoArray.length === 0) {
          setPagina(1);
        } else {
          const maxPaginas = Math.max(
            1,
            Math.ceil(novoArray.length / itensPorPagina)
          );
          setPagina((p) => Math.min(p, maxPaginas));
        }

        return novoArray;
      });

      setShowSuccessCancel(true);
    } catch (err: any) {
      alert(err.message || "Erro ao cancelar reserva.");
    }
  }

  function formatarHoraData(inicioStr: string, fimStr: string) {
    const inicio = new Date(inicioStr);
    const fim = new Date(fimStr);

    const horaInicio = inicio.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const horaFim = fim.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const data = inicio.toLocaleDateString("pt-BR");

    return `${horaInicio} - ${horaFim} - ${data}`;
  }

  const inicio = (pagina - 1) * itensPorPagina;
  const fim = inicio + itensPorPagina;
  const reservasPaginadas = reservas.slice(inicio, fim);
  const totalPaginas =
    reservas.length === 0 ? 1 : Math.ceil(reservas.length / itensPorPagina);
  const estaNaUltimaPagina = pagina === totalPaginas;
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
          onClick={() => carregarReservas(busca)}
          disabled={loading}
          className="px-5 py-2 text-sm font-medium rounded-md bg-teal-500 text-white shadow-sm disabled:opacity-60"
        >
          {loading ? "Buscando..." : "Buscar"}
        </button>
      </section>

      <h2 className="text-lg font-semibold">Minhas Reservas</h2>

      {erro && (
        <div className="border border-red-300 bg-red-50 text-red-700 px-4 py-2 rounded-md text-sm">
          {erro}
        </div>
      )}

      {loading && reservas.length === 0 ? (
        <p className="text-sm text-gray-500">Carregando reservas...</p>
      ) : reservas.length === 0 ? (
        <p className="text-sm text-gray-500">Nenhuma reserva encontrada.</p>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 auto-rows-[10rem]">
            {reservasPaginadas.map((reserva) => (
              <article
                key={reserva.idReserva}
                className="flex rounded-xl shadow-sm bg-[#F5F5F5] overflow-hidden h-full"
              >
                <div className="w-2 bg-teal-500" />

                <div className="flex-1 px-4 py-3 flex flex-col justify-between h-full">
                  {/* Usuário / avatar */}
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-xs">
                      👤
                    </div>
                    <div className="text-sm font-semibold text-gray-800">
                      Usuário{" "}
                      {String(reserva.idUsuarioCriador).padStart(3, "0")}
                    </div>
                  </div>

                  <p className="text-sm text-gray-800 mb-1">{reserva.motivo}</p>

                  <p className="text-xs text-gray-600 mb-3">
                    {formatarHoraData(reserva.horaInicio, reserva.horaFim)}
                  </p>

                  <div className="flex justify-end mt-auto">
                    <button
                      type="button"
                      onClick={() => handleCancelar(reserva)}
                      className="px-4 py-1 text-xs font-semibold rounded-full bg-pink-400 text-white hover:bg-pink-500"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {reservas.length > 0 && (
            <div className="flex flex-col items-center gap-2 mt-6">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setPagina((p) => Math.max(1, p - 1))}
                  disabled={pagina === 1}
                  className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 text-sm"
                >
                  ◀ Anterior
                </button>

                <span className="text-sm font-medium">
                  Página {pagina} de {totalPaginas}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setPagina((p) => Math.min(totalPaginas, p + 1))
                  }
                  disabled={estaNaUltimaPagina}
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
        </>
      )}

      {showSuccessCancel && (
        <div className="fixed left-1/2 bottom-10 -translate-x-1/2 w-[min(480px,90%)] z-20">
          <div className="flex items-center justify-between bg-pink-500 text-white rounded-md px-6 py-3 shadow-lg">
            <div className="flex items-center gap-3">
              <span className="border border-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                ✓
              </span>
              <span>Reserva cancelada com sucesso.</span>
            </div>
            <button
              type="button"
              onClick={() => setShowSuccessCancel(false)}
              className="text-lg leading-none px-1"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
