"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Inria_Serif } from "next/font/google";
import { supabase } from "@/lib/supabase/browser/supabaseClient";

const inriaSerif700 = Inria_Serif({ subsets: ["latin"], weight: ["700"] });

type Solicitacao = {
  idParticipa: number;
  motivo: string;
  usuario: {
    nome: string;
    email: string;
    foto: string | null;
  };
  projeto: {
    nome: string;
  };
};

export default function GerenciarSolicitacoes() {
  // ESTADOS
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [processandoId, setProcessandoId] = useState<number | null>(null);

  // AUTH
  const [isAdmin, setIsAdmin] = useState(false);

  // MODAL DE RECUSA
  const [modalRecusaAberto, setModalRecusaAberto] = useState(false);
  const [idParaNegar, setIdParaNegar] = useState<number | null>(null);
  const [motivoRecusa, setMotivoRecusa] = useState("");

  // TOAST
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "success",
  });

  const showToast = useCallback((msg: string, type = "success") => {
    setToast({ visible: true, message: msg, type: type as string });
    setTimeout(
      () => setToast({ visible: false, message: "", type: "success" }),
      3500,
    );
  }, []);

  // 1. CARREGAR DADOS
  const fetchSolicitacoes = useCallback(async () => {
    setLoading(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        setLoading(false);
        return;
      }
      setIsAdmin(true);

      const res = await fetch("/api/admin/solicitacoes");
      if (res.ok) {
        const data = await res.json();
        setSolicitacoes(data);
      } else {
        setIsAdmin(false);
      }
    } catch (e) {
      console.error("Erro", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSolicitacoes();
  }, [fetchSolicitacoes]);

  // 2. AÇÃO: APROVAR
  const handleAprovar = async (id: number) => {
    setProcessandoId(id);
    try {
      const res = await fetch("/api/admin/solicitacoes", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idParticipa: id,
          novaSituacao: "Autorizado",
        }),
      });

      if (res.ok) {
        showToast("Solicitação Aprovada!", "success");
        setSolicitacoes((prev) => prev.filter((s) => s.idParticipa !== id));
      } else {
        showToast("Erro ao aprovar.", "error");
      }
    } catch {
      showToast("Erro de conexão.", "error");
    } finally {
      setProcessandoId(null);
    }
  };

  // 3. AÇÃO: NEGAR (Abre Modal)
  const abrirModalNegar = (id: number) => {
    setIdParaNegar(id);
    setMotivoRecusa("");
    setModalRecusaAberto(true);
  };

  const confirmarNegacao = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idParaNegar) return;

    setProcessandoId(idParaNegar);

    try {
      const res = await fetch("/api/admin/solicitacoes", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idParticipa: idParaNegar,
          novaSituacao: "Negado",
          motivoSituacao: motivoRecusa,
        }),
      });

      if (res.ok) {
        showToast("Solicitação Negada.", "success");
        setSolicitacoes((prev) =>
          prev.filter((s) => s.idParticipa !== idParaNegar),
        );
        setModalRecusaAberto(false);
      } else {
        showToast("Erro ao negar.", "error");
      }
    } catch {
      showToast("Erro de conexão.", "error");
    } finally {
      setProcessandoId(null);
    }
  };

  // Helper de Imagem
  const tratarAvatar = (path: string | null) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${path}`;
  };

  return (
    <>
      {/* TOAST */}
      {toast.visible && (
        <div
          className={`fixed top-4 left-1/2 -translate-x-1/2 px-6 py-3 rounded-md shadow-lg z-[60] border ${toast.type === "success" ? "bg-teal-500 border-teal-300 text-white" : "bg-red-500 border-red-500 text-white"}`}
        >
          {toast.message}
        </div>
      )}

      {/* MODAL DE RECUSA */}
      {modalRecusaAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 animate-in zoom-in-95">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Motivo da Recusa
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Informe ao aluno por que a solicitação foi negada (ex: Turma
              cheia, falta de pré-requisitos).
            </p>

            <form onSubmit={confirmarNegacao}>
              <textarea
                required
                className="w-full border border-gray-300 rounded p-2 mb-4 h-24 resize-none focus:ring-2 focus:ring-red-500 outline-none"
                placeholder="Escreva o motivo aqui..."
                value={motivoRecusa}
                onChange={(e) => setMotivoRecusa(e.target.value)}
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalRecusaAberto(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={processandoId !== null}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 font-bold"
                >
                  {processandoId ? "Salvando..." : "Confirmar Recusa"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONTEÚDO */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="mb-8 border-b border-gray-200 pb-4">
          <h1 className={`${inriaSerif700.className} text-3xl text-gray-900`}>
            SOLICITAÇÕES PENDENTES
          </h1>
          <p className="text-gray-600 mt-1">
            Gerencie os pedidos de entrada nos projetos acadêmicos.
          </p>
        </div>

        {!isAdmin && !loading ? (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
            Você não tem permissão para acessar esta área.
          </div>
        ) : loading ? (
          <div className="flex justify-center py-20">
            <span className="text-gray-400 animate-pulse text-lg">
              Carregando solicitações...
            </span>
          </div>
        ) : solicitacoes.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl">
            <p className="text-gray-500 text-lg">
              Nenhuma solicitação pendente no momento.
            </p>
            <p className="text-gray-400 text-sm">Tudo limpo por aqui! 🎉</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {solicitacoes.map((sol) => (
              <div
                key={sol.idParticipa}
                className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow"
              >
                {/* Cabeçalho do Card: Info do Projeto */}
                <div className="bg-gray-50 p-4 border-b border-gray-100">
                  <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">
                    Projeto
                  </span>
                  <h3
                    className="font-bold text-gray-800 text-lg truncate"
                    title={sol.projeto.nome}
                  >
                    {sol.projeto.nome}
                  </h3>
                </div>

                {/* Corpo: Info do Aluno */}
                <div className="p-4 flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="relative w-12 h-12 shrink-0">
                      {tratarAvatar(sol.usuario.foto) ? (
                        <Image
                          src={tratarAvatar(sol.usuario.foto)!}
                          alt={sol.usuario.nome}
                          fill
                          className="rounded-full object-cover border border-gray-200"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center font-bold text-xl">
                          {sol.usuario.nome.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="overflow-hidden">
                      <p className="font-bold text-gray-900 truncate">
                        {sol.usuario.nome}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {sol.usuario.email}
                      </p>
                    </div>
                  </div>

                  <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100">
                    <p className="text-xs font-bold text-yellow-800 mb-1">
                      Motivo do Aluno:
                    </p>
                    <p className="text-sm text-gray-700 italic line-clamp-3">
                      "{sol.motivo}"
                    </p>
                  </div>
                </div>

                {/* Rodapé: Ações */}
                <div className="p-4 border-t border-gray-100 flex gap-3">
                  <button
                    type="button"
                    onClick={() => abrirModalNegar(sol.idParticipa)}
                    disabled={processandoId === sol.idParticipa}
                    className="flex-1 py-2 bg-white border border-red-200 text-red-600 rounded hover:bg-red-50 font-bold transition-colors disabled:opacity-50"
                  >
                    Negar
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAprovar(sol.idParticipa)}
                    disabled={processandoId === sol.idParticipa}
                    className="flex-1 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 font-bold transition-colors shadow-sm disabled:opacity-50"
                  >
                    {processandoId === sol.idParticipa ? "..." : "Aprovar"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
