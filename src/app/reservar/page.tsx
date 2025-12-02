"use client";

import { useEffect, useState } from "react";

// Tipos
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
  criador: { nome?: string; email?: string | null };
}

// Interface para resposta de salas
interface SalaResponse {
  espacos?: Espaco[];
}

function formatNameFromEmail(email?: string | null) {
  if (!email) return "Usuário";
  const local = email.split("@")[0];
  const parts = local.split(/[._-]+/).filter(Boolean);
  return (
    parts.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join(" ") || local
  );
}

function formatTimeRange(startIso: string, endIso: string) {
  try {
    const start = new Date(startIso);
    const end = new Date(endIso);
    const h1 = start.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const h2 = end.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${h1} — ${h2}`;
  } catch {
    return "";
  }
}

export default function ReservarPage() {
  const [espacos, setEspacos] = useState<Espaco[]>([]);
  const [loadingEspacos, setLoadingEspacos] = useState(true);
  const [loadingReservas, setLoadingReservas] = useState(false);
  const [selectedEspaco, setSelectedEspaco] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFim, setHoraFim] = useState("");
  const [motivo, setMotivo] = useState("");
  const [erroReservas, setErroReservas] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // Pega o ID do usuário logado apenas no client
  useEffect(() => {
    const storedId = localStorage.getItem("userId");
    if (storedId) setUserId(storedId);
  }, []);

  // Buscar todos os espaços do banco
  useEffect(() => {
    setLoadingEspacos(true);
    fetch("/api/salas")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.salas) {
          const todosEspacos: Espaco[] = data.salas
            .flatMap((sala: SalaResponse) => sala.espacos || [])
            .map((e: Espaco) => ({
              idEspaco: e.idEspaco,
              codigoEspaco: e.codigoEspaco,
            }));

          setEspacos(todosEspacos);

          if (!selectedDate) {
            setSelectedDate(new Date().toISOString().split("T")[0]);
          }
        } else if (data.error) {
          console.error("Erro ao carregar espaços:", data.error);
        }
      })
      .catch((e) => console.error("Erro de rede ao carregar espaços:", e))
      .finally(() => setLoadingEspacos(false));
  }, [selectedDate]);

  // Buscar reservas quando espaço ou data mudar
  useEffect(() => {
    if (!selectedEspaco || !selectedDate) {
      setReservas([]);
      setErroReservas(null);
      return;
    }

    setLoadingReservas(true);
    setErroReservas(null);

    const apiCallUrl = `/api/reservas?data=${selectedDate}&idEspaco=${selectedEspaco}`;
    console.log("Chamando API para Cronograma:", apiCallUrl);

    fetch(apiCallUrl)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.reservas) {
          setReservas(data.reservas);
        } else {
          setReservas([]);
          setErroReservas(data.error || "Falha ao carregar o cronograma.");
        }
      })
      .catch((e) => {
        console.error("Erro de rede ao carregar cronograma:", e);
        setErroReservas("Erro de conexão ao carregar o cronograma.");
      })
      .finally(() => setLoadingReservas(false));
  }, [selectedEspaco, selectedDate]);

  async function handleSalvarReserva() {
    if (!userId) {
      alert("Usuário não logado!");
      return;
    }

    try {
      const response = await fetch("/api/reservas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idEspaco: selectedEspaco,
          data: selectedDate,
          inicio: horaInicio,
          fim: horaFim,
          motivo,
          idCriador: userId,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert("Reserva criada com sucesso!");
        // Atualiza cronograma
        setHoraInicio("");
        setHoraFim("");
        setMotivo("");
      } else {
        alert("Erro ao criar reserva: " + (data.error ?? "Desconhecido"));
      }
    } catch (err) {
      console.error("Erro ao salvar reserva:", err);
      alert("Erro ao criar reserva.");
    }
  }

  const nomeEspacoSelecionado =
    espacos.find((e) => e.idEspaco === selectedEspaco)?.codigoEspaco ||
    "Não Selecionado";

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-8">
      <div className="max-w-5xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-teal-500 flex items-center justify-center text-white font-bold text-lg">
              R
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">
                Nova Reserva de Espaço
              </h1>
              <p className="text-sm text-gray-500">
                Usuário ID: {userId ?? "Não logado"}
              </p>
            </div>
          </div>
        </header>

        <main className="grid grid-cols-12 gap-6">
          {/* Formulário de reserva */}
          <section className="col-span-12 lg:col-span-5">
            <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-5 shadow-lg">
              <h2 className="text-xl font-bold mb-4">Detalhes da Reserva</h2>

              {/* Seleção do Espaço */}
              <div>
                <label
                  htmlFor="espaco"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Espaço
                </label>
                <select
                  id="espaco"
                  value={selectedEspaco ?? ""}
                  onChange={(e) => setSelectedEspaco(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg p-2 bg-white focus:ring-teal-500 focus:border-teal-500"
                  disabled={loadingEspacos}
                >
                  <option value="">
                    {loadingEspacos ? "Carregando..." : "Selecione um espaço"}
                  </option>
                  {espacos.map((e) => (
                    <option key={e.idEspaco} value={e.idEspaco}>
                      {e.codigoEspaco}
                    </option>
                  ))}
                </select>
              </div>

              {/* Seleção da Data */}
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
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2 bg-white focus:ring-teal-500 focus:border-teal-500"
                  max={
                    new Date(new Date().setDate(new Date().getDate() + 30))
                      .toISOString()
                      .split("T")[0]
                  }
                />
              </div>

              {/* Hora início e fim */}
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

              {/* Motivo */}
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

              {/* Botões */}
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
                  onClick={handleSalvarReserva}
                  disabled={
                    !selectedEspaco ||
                    !selectedDate ||
                    !horaInicio ||
                    !horaFim ||
                    !motivo ||
                    !userId
                  }
                >
                  Reservar
                </button>
              </div>
            </div>
          </section>

          {/* Cronograma */}
          <section className="col-span-12 lg:col-span-7">
            <h2 className="text-xl font-semibold mb-3 text-gray-800">
              Cronograma do Dia:{" "}
              {selectedDate
                ? new Date(`${selectedDate}T00:00:00`).toLocaleDateString(
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
              {loadingReservas ? (
                <div className="text-sm text-gray-500 p-4 bg-white rounded-lg shadow-sm">
                  Carregando cronograma...
                </div>
              ) : reservas.length === 0 ? (
                <div className="text-sm text-gray-500 p-4 bg-white rounded-lg shadow-sm">
                  {selectedEspaco && selectedDate
                    ? `Nenhuma reserva encontrada para ${nomeEspacoSelecionado} em ${selectedDate}.`
                    : "Selecione um espaço e uma data para ver o cronograma."}
                </div>
              ) : (
                reservas.map((r) => {
                  const ownerName =
                    r.criador?.nome && r.criador.nome.trim().length > 0
                      ? r.criador.nome
                      : formatNameFromEmail(r.criador?.email ?? null);
                  return (
                    <div
                      key={r.idReserva}
                      className="flex items-center gap-4 bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:border-teal-400 transition"
                    >
                      <div className="shrink-0 w-2 h-full min-h-10 rounded-full bg-teal-500" />

                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-800">
                          {ownerName}
                        </div>
                        <div className="text-xs text-gray-600 truncate">
                          {r.motivo}
                        </div>
                      </div>

                      <div className="shrink-0 text-sm font-semibold text-gray-700 text-right w-32">
                        {formatTimeRange(r.horaInicio, r.horaFim)}
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
