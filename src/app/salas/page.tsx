"use client";
export const dynamic = "force-dynamic";

import React, {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Espaco = {
  idEspaco: number;
  codigoEspaco: string;
  idSalaPertence: number;
};

type Sala = {
  idSala: number;
  nomeSala: string;
  mapa?: string;
  ativa?: boolean;
  limiteHorasReserva?: number;
  Espaco?: Espaco[];
};

export default function Page() {
  return (
    <Suspense fallback={<div>Carregando salas...</div>}>
      <ListaSalasPage />
    </Suspense>
  );
}

function ListaSalasPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [salas, setSalas] = useState<Sala[]>([]);
  const [busca, setBusca] = useState("");
  const [termoAtivo, setTermoAtivo] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [mostrarModalAcessoNegado, setMostrarModalAcessoNegado] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setIsAdmin(user.admin === true);
      } catch (error) {
        console.error("Erro ao verificar permissões:", error);
      }
    }
  }, []);

  const ModalAcessoNegado = () => {
    if (!mostrarModalAcessoNegado) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
        <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md mx-4">
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <svg 
                  className="w-5 h-5 text-red-600" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <title>Ícone de alerta</title>
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                Acesso Restrito
              </h3>
            </div>
            <button
            type="button"
              onClick={() => setMostrarModalAcessoNegado(false)}
              className="p-1 rounded-lg hover:bg-gray-100 transition"
            >
              <svg
                className="w-6 h-6 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <title>Fechar modal</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="p-6">
            <div className="mb-6">
              <p className="text-gray-700 mb-3">
                Esta funcionalidade está disponível apenas para administradores do sistema.
              </p>
              <p className="text-gray-600 text-sm">
                Para criar ou editar salas, entre em contato com um administrador.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-medium">Permissões necessárias:</span>
              </p>
              <ul className="text-sm text-gray-600 space-y-1 ml-4 list-disc">
                <li>Conta de administrador ativa</li>
                <li>Privilégios de gerenciamento de salas</li>
                <li>Autorização para modificar configurações do sistema</li>
              </ul>
            </div>

            <div className="flex justify-end">
              <button
              type="button"
                onClick={() => setMostrarModalAcessoNegado(false)}
                className="px-6 py-2.5 bg-teal-500 text-white font-medium rounded-lg hover:bg-teal-600 transition"
              >
                Entendi
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const carregarSalas = useCallback(async (searchTerm?: string) => {
    setLoading(true);
    setErro(null);
    try {
      let url = "/api/salas";
      if (searchTerm?.trim())
        url += `?search=${encodeURIComponent(searchTerm)}`;
      const res = await fetch(url, { cache: "no-store" });
      const json = await res.json();

      if (!res.ok || !json.success)
        throw new Error(json.error || "Erro ao carregar salas.");
      setSalas(json.salas || []);
    } catch (e: unknown) {
      setErro(e instanceof Error ? e.message : "Erro ao carregar salas.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarSalas();

    const listener = (e: StorageEvent) => {
      if (e.key === "salas_atualizadas") {
        carregarSalas();
      }
    };
    window.addEventListener("storage", listener);

    return () => window.removeEventListener("storage", listener);
  }, [carregarSalas]);

  useEffect(() => {
    if (searchParams.get("created") === "1") setShowSuccess(true);
  }, [searchParams]);

  const salasFiltradas = useMemo(() => {
    if (!termoAtivo.trim()) return salas;
    const termo = termoAtivo.toLowerCase();
    return salas.filter(
      (sala) =>
        sala.nomeSala?.toLowerCase().includes(termo) ||
        (sala.Espaco || []).some((e) =>
          e.codigoEspaco?.toLowerCase().includes(termo),
        ),
    );
  }, [termoAtivo, salas]);

  const handleBuscar = () => {
    setTermoAtivo(busca);
    carregarSalas(busca);
  };

  return (
    <>
      <ModalAcessoNegado />
      <main className="px-4 py-6 md:px-8 md:py-10">
        <div className="max-w-6xl mx-auto space-y-8">
          <section className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex-1 flex items-center border rounded-md overflow-hidden bg-white min-w-0">
              <div className="px-3 text-gray-400 text-sm">🔍</div>
              <input
                type="text"
                placeholder="search..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="flex-1 px-2 py-2 text-sm outline-none min-w-0"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <button
                type="button"
                onClick={handleBuscar}
                disabled={loading}
                className="px-4 sm:px-5 py-2 text-sm font-medium rounded-md bg-teal-500 text-white shadow-sm disabled:opacity-60 whitespace-nowrap"
              >
                {loading ? "Buscando..." : "Buscar"}
              </button>
              <button
                type="button"
                onClick={() => {
                  if (isAdmin) {
                    router.push("/sala_espaco");
                  } else {
                    setMostrarModalAcessoNegado(true);
                  }
                }}
                className={`px-4 sm:px-5 py-2 text-sm font-medium rounded-md shadow-sm text-center whitespace-nowrap ${
                  isAdmin 
                    ? "bg-teal-500 text-white hover:bg-teal-600" 
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
                title={!isAdmin ? "Apenas administradores podem criar salas" : ""}
              >
                Nova Sala
              </button>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold tracking-wide">SALAS CRIADAS</h2>
            {erro && (
              <div className="border border-red-200 text-red-700 bg-red-50 rounded-md px-4 py-2 text-sm mb-2">
                {erro}
              </div>
            )}
            
            <div className="border border-gray-200 rounded-md overflow-hidden bg-white">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm min-w-[600px]">
                  <thead className="bg-gray-100 text-xs font-semibold text-gray-500">
                    <tr>
                      <th className="px-4 py-3 text-left w-[80px]">Código</th>
                      <th className="px-4 py-3 text-left min-w-[180px] sm:min-w-[220px]">Nome</th>
                      <th className="px-4 py-3 text-left min-w-[140px] sm:min-w-[180px]">Imagem</th>
                      <th className="px-4 py-3 text-left w-[100px] sm:w-[120px]">Situação</th>
                      <th className="px-4 py-3 text-center w-[80px] sm:w-[90px]">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading && salasFiltradas.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-4 py-4 text-sm text-gray-500 text-center"
                        >
                          Carregando salas...
                        </td>
                      </tr>
                    ) : salasFiltradas.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-4 py-4 text-sm text-gray-500 text-center"
                        >
                          Nenhuma sala encontrada.
                        </td>
                      </tr>
                    ) : (
                      salasFiltradas.map((sala, index) => (
                        <tr
                          key={sala.idSala}
                          className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                        >
                          <td className="px-4 py-3 align-middle whitespace-nowrap">
                            {sala.idSala}
                          </td>
                          <td className="px-4 py-3 align-middle min-w-[180px] sm:min-w-[220px]">
                            <div className="truncate max-w-[180px] sm:max-w-[220px]">
                              {sala.nomeSala}
                            </div>
                          </td>
                          <td className="px-4 py-3 align-middle min-w-[140px] sm:min-w-[180px]">
                            <div className="truncate max-w-[140px] sm:max-w-[180px] text-xs text-gray-600">
                              {sala.mapa || "-"}
                            </div>
                          </td>
                          <td className="px-4 py-3 align-middle whitespace-nowrap">
                            <span
                              className={`text-xs font-medium ${
                                sala.ativa === false
                                  ? "text-red-500"
                                  : "text-teal-500"
                              }`}
                            >
                              {sala.ativa === false ? "Inativa" : "Ativa"}
                            </span>
                          </td>
                          <td className="px-4 py-3 align-middle whitespace-nowrap">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                type="button"
                                className="p-1 rounded hover:bg-gray-200"
                                onClick={() => {
                                  if (isAdmin) {
                                    router.push(`/sala_espaco?idSala=${sala.idSala}`);
                                  } else {
                                    setMostrarModalAcessoNegado(true);
                                  }
                                }}
                              >
                                ✏️
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="lg:hidden text-xs text-gray-500 text-center mt-2">
              <p>← Deslize horizontalmente para ver mais informações →</p>
            </div>
          </section>

          {showSuccess && (
            <div className="fixed left-1/2 bottom-6 md:bottom-10 -translate-x-1/2 w-[min(480px,90%)]">
              <div className="flex items-center justify-between bg-teal-500 text-white rounded-md px-4 md:px-6 py-3 text-sm shadow-lg">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center justify-center rounded-full border border-white w-5 h-5 text-xs">
                    ✓
                  </span>
                  <span>Sala criada com sucesso.</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowSuccess(false)}
                  className="text-lg leading-none px-1"
                >
                  ×
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}