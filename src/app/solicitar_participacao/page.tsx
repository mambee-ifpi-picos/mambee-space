"use client";

import { useState, useEffect, useCallback } from "react";
import { Inria_Serif } from "next/font/google";
import { supabase } from "@/lib/supabase/browser/supabaseClient";

const inriaSerif700 = Inria_Serif({ subsets: ["latin"], weight: ["700"] });

type Projeto = {
  idProjeto: number;
  nome: string;
  resumo: string;
  dataInicio: string;
  dataFim: string | null;
  situacao: string;
  criador: { nome: string };
};

type MinhaParticipacao = {
  idProjeto: number;
  situacao: string;
};

export default function ListaProjetos() {
  // ESTADOS
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [minhasParticipacoes, setMinhasParticipacoes] = useState<
    MinhaParticipacao[]
  >([]);
  const [loading, setLoading] = useState(true);

  // AUTH
  const [usuarioLogado, setUsuarioLogado] = useState(false);

  // MODAL DE PARTICIPAÇÃO
  const [modalAberto, setModalAberto] = useState(false);
  const [projetoSelecionado, setProjetoSelecionado] = useState<number | null>(
    null,
  );
  const [motivo, setMotivo] = useState("");
  const [enviando, setEnviando] = useState(false);

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

  // 1. Carrega Projetos e Status do Usuário
  useEffect(() => {
    const carregarDados = async () => {
      setLoading(true);
      try {
        // Busca projetos (Público)
        const resProj = await fetch("/api/projetos");
        const dadosProj = await resProj.json();
        if (Array.isArray(dadosProj)) setProjetos(dadosProj);

        // Verifica sessão
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session?.user) {
          setUsuarioLogado(true);
          // Busca participações do usuário (Minhas solicitações)
          const resPart = await fetch("/api/participar");
          const dadosPart = await resPart.json();
          if (Array.isArray(dadosPart)) setMinhasParticipacoes(dadosPart);
        }
      } catch (error) {
        console.error("Erro ao carregar", error);
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, []);

  // 2. Lógica do Modal
  const abrirModal = (idProjeto: number) => {
    if (!usuarioLogado) {
      showToast("Você precisa fazer login para participar.", "error");
      return;
    }
    setProjetoSelecionado(idProjeto);
    setMotivo("");
    setModalAberto(true);
  };

  const enviarSolicitacao = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);

    try {
      const res = await fetch("/api/participar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idProjeto: projetoSelecionado, motivo }),
      });

      const json = await res.json();

      if (res.ok) {
        showToast("Solicitação enviada com sucesso!", "success");
        setModalAberto(false);
        // Atualiza a lista localmente para mudar o botão imediatamente
        setMinhasParticipacoes((prev) => [
          ...prev,
          { idProjeto: Number(projetoSelecionado), situacao: "Solicitado" },
        ]);
      } else {
        showToast(json.error || "Erro ao solicitar.", "error");
      }
    } catch {
      showToast("Erro de conexão.", "error");
    } finally {
      setEnviando(false);
    }
  };

  // 3. Renderiza o status do botão
  const renderBotaoAcao = (proj: Projeto) => {
    const participacao = minhasParticipacoes.find(
      (p) => p.idProjeto === proj.idProjeto,
    );

    if (proj.situacao !== "Ativo") {
      return (
        <span className="text-gray-400 font-bold text-sm bg-gray-100 px-3 py-2 rounded block text-center">
          Encerrado / Inativo
        </span>
      );
    }

    if (participacao) {
      const cores: any = {
        Solicitado: "bg-yellow-100 text-yellow-700 border-yellow-200",
        Autorizado: "bg-green-100 text-green-700 border-green-200",
        Negado: "bg-red-100 text-red-700 border-red-200",
      };
      return (
        <div
          className={`w-full text-center py-2 rounded border font-bold text-sm ${cores[participacao.situacao] || "bg-gray-100"}`}
        >
          {participacao.situacao.toUpperCase()}
        </div>
      );
    }

    return (
      <button
        type="button"
        onClick={() => abrirModal(proj.idProjeto)}
        className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded transition-colors"
      >
        Solicitar Participação
      </button>
    );
  };

  const formatarData = (dataStr: string) => {
    return new Date(dataStr).toLocaleDateString("pt-BR", { timeZone: "UTC" });
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

      {/* MODAL DE MOTIVO */}
      {modalAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-md p-6 animate-in zoom-in-95 duration-200">
            <h3
              className={`${inriaSerif700.className} text-xl text-gray-900 mb-2`}
            >
              Por que deseja participar?
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Explique brevemente seu interesse para que o administrador possa
              avaliar seu pedido.
            </p>

            <form onSubmit={enviarSolicitacao}>
              <textarea
                required
                autoFocus
                rows={4}
                className="w-full border border-gray-300 rounded p-3 text-gray-800 focus:ring-2 focus:ring-teal-500 outline-none resize-none"
                placeholder="Ex: Tenho interesse na área e gostaria de aprender mais sobre..."
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
              />

              <div className="flex gap-3 mt-4 justify-end">
                <button
                  type="button"
                  onClick={() => setModalAberto(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={enviando}
                  className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 font-bold disabled:opacity-50"
                >
                  {enviando ? "Enviando..." : "Confirmar Solicitação"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONTEÚDO PRINCIPAL */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="mb-8 text-center lg:text-left">
          <h1
            className={`${inriaSerif700.className} text-3xl md:text-4xl text-gray-900 mb-2`}
          >
            PROJETOS DISPONÍVEIS
          </h1>
          <p className="text-gray-600">
            Confira os projetos acadêmicos abertos e solicite sua participação.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-64 bg-gray-200 rounded-xl animate-pulse"
              ></div>
            ))}
          </div>
        ) : projetos.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300">
            <p className="text-gray-500 text-lg">
              Nenhum projeto cadastrado no momento.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projetos.map((proj) => (
              <div
                key={proj.idProjeto}
                className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full"
              >
                {/* Cabeçalho do Card */}
                <div className="p-6 flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-teal-600 bg-teal-50 px-2 py-1 rounded uppercase tracking-wide">
                      {proj.situacao}
                    </span>
                    <span className="text-xs text-gray-400">
                      Criado por: {proj.criador?.nome}
                    </span>
                  </div>

                  <h3
                    className={`${inriaSerif700.className} text-xl text-gray-900 mb-3`}
                  >
                    {proj.nome}
                  </h3>

                  <p className="text-gray-600 text-sm line-clamp-4 mb-4">
                    {proj.resumo}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-gray-500 border-t border-gray-100 pt-3">
                    <div className="flex items-center gap-1">
                      <span>📅 Início:</span>
                      <span className="font-medium text-gray-700">
                        {formatarData(proj.dataInicio)}
                      </span>
                    </div>
                    {proj.dataFim && (
                      <div className="flex items-center gap-1">
                        <span>🏁 Fim:</span>
                        <span className="font-medium text-gray-700">
                          {formatarData(proj.dataFim)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Rodapé com Botão */}
                <div className="p-4 bg-gray-50 border-t border-gray-200">
                  {renderBotaoAcao(proj)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
