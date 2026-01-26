"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Inria_Serif } from "next/font/google";
import { supabase } from "@/lib/supabase/browser/supabaseClient";
import Link from "next/link";

const inriaSerif700 = Inria_Serif({ subsets: ["latin"], weight: ["700"] });

type Projeto = {
  idProjeto: number;
  nome: string;
  resumo: string;
  dataInicio: string;
  dataFim: string | null;
  situacao: string;
  criador: { nome: string };
  anexos: string[];
};

type Participacao = {
  idProjeto: number;
  situacao: string;
};

type Usuario = {
  idUsuario: number;
  nome: string;
  email: string;
  foto?: string;
  admin: boolean;
};

type SolicitacaoProjeto = {
  idParticipa: number;
  situacao: string;
  motivo: string;
  motivoSituacao?: string;
  usuario: {
    nome: string;
    email: string;
    foto?: string;
  };
  projeto: {
    nome: string;
  };
};

export default function DetalhesProjeto() {
  const params = useParams();
  const router = useRouter();
  const idProjeto = Number(params.id);

  // ESTADOS
  const [projeto, setProjeto] = useState<Projeto | null>(null);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [participacoes, setParticipacoes] = useState<Participacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalSolicitacao, setModalSolicitacao] = useState(false);
  const [motivoSolicitacao, setMotivoSolicitacao] = useState("");
  const [debugInfo, setDebugInfo] = useState<string>("");

  // ESTADOS PARA ADMIN - SOLICITAÇÕES DESTE PROJETO
  const [solicitacoesProjeto, setSolicitacoesProjeto] = useState<SolicitacaoProjeto[]>([]);
  const [modalAprovarNegar, setModalAprovarNegar] = useState(false);
  const [solicitacaoSelecionada, setSolicitacaoSelecionada] = useState<SolicitacaoProjeto | null>(null);
  const [motivoDecisao, setMotivoDecisao] = useState("");
  const [decisao, setDecisao] = useState<"Autorizado" | "Negado">("Autorizado");
  const [loadingSolicitacoes, setLoadingSolicitacoes] = useState(false);

  // TOAST
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "success" as "success" | "error",
  });

  const showToast = useCallback((msg: string, type: "success" | "error" = "success") => {
    setToast({ visible: true, message: msg, type });
    setTimeout(() => setToast({ visible: false, message: "", type: "success" }), 3500);
  }, []);

  // 1. Carregar dados
  useEffect(() => {
    const carregarDados = async () => {
      setLoading(true);
      try {
        console.log("Carregando projeto ID:", idProjeto);

        // Carregar projeto
        const resProj = await fetch(`/api/projetos/${idProjeto}`);
        if (resProj.ok) {
          const dadosProj = await resProj.json();
          setProjeto(dadosProj);
          console.log("Projeto carregado:", dadosProj.nome);
        } else {
          console.error("Erro ao carregar projeto");
          router.push("/projetos");
          return;
        }

        // Verificar autenticação
        const {
          data: { session },
        } = await supabase.auth.getSession();

        console.log("Sessão encontrada:", !!session?.user);

        if (session?.user) {
          // Buscar dados do usuário
          const resUsuario = await fetch("/api/usuarios/me");
          if (resUsuario.ok) {
            const usuarioData = await resUsuario.json();
            setUsuario(usuarioData);
            console.log("Usuário carregado:", usuarioData.nome, "Admin:", usuarioData.admin);

            // Se for admin, carrega as solicitações deste projeto
            if (usuarioData.admin) {
              carregarSolicitacoesProjeto();
            }
          } else {
            console.error("Erro ao carregar dados do usuário");
          }

          // Buscar participações do usuário
          const resPart = await fetch("/api/solicitar_participacao");
          const dadosPart = await resPart.json();
          if (Array.isArray(dadosPart)) {
            setParticipacoes(dadosPart);
            console.log("Participações do usuário:", dadosPart.length);
          }
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        setDebugInfo(`Erro: ${error instanceof Error ? error.message : "Erro desconhecido"}`);
        showToast("Erro ao carregar dados do projeto", "error");
      } finally {
        setLoading(false);
      }
    };

    if (idProjeto) {
      carregarDados();
    }
  }, [idProjeto, router, showToast]);

  // 2. Carregar solicitações deste projeto específico (apenas admin)
  // 2. Carregar solicitações deste projeto específico (apenas admin)
  const carregarSolicitacoesProjeto = async () => {
    if (!usuario?.admin || !projeto) {
      console.log("Não é admin ou projeto não carregado");
      return;
    }

    setLoadingSolicitacoes(true);
    try {
      console.log("Carregando solicitações do projeto:", idProjeto);

      // URL CORRETA: /api/solicitacoes/projeto/[idProjeto]
      const res = await fetch(`/api/solicitacoes/projeto/${idProjeto}`, {
        cache: "no-store", // Para evitar cache
      });

      console.log("Resposta da API:", res.status, res.statusText);

      if (res.ok) {
        const dados = await res.json();
        console.log("Solicitações carregadas:", dados);
        setSolicitacoesProjeto(dados);
        setDebugInfo(`Solicitações carregadas: ${dados.length}`);
      } else {
        const errorData = await res.json().catch(() => ({ error: "Erro desconhecido" }));
        console.error("Erro na API:", errorData);
        setDebugInfo(`Erro API: ${res.status} - ${errorData.error || "Erro desconhecido"}`);
      }
    } catch (error) {
      console.error("Erro ao carregar solicitações do projeto:", error);
      setDebugInfo(`Erro conexão: ${error instanceof Error ? error.message : "Erro desconhecido"}`);
    } finally {
      setLoadingSolicitacoes(false);
    }
  };

  // 3. Enviar solicitação
  const enviarSolicitacao = async () => {
    if (!projeto || !motivoSolicitacao.trim()) {
      showToast("Por favor, informe o motivo", "error");
      return;
    }

    try {
      const res = await fetch("/api/solicitar_participacao", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idProjeto: projeto.idProjeto,
          motivo: motivoSolicitacao,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        showToast("Solicitação enviada com sucesso!", "success");
        setModalSolicitacao(false);

        // Atualizar participações localmente
        setParticipacoes((prev) => [
          ...prev,
          {
            idProjeto: projeto.idProjeto,
            situacao: "Solicitado",
          },
        ]);

        // Se for admin, recarrega as solicitações
        if (usuario?.admin) {
          carregarSolicitacoesProjeto();
        }
      } else {
        showToast(data.error || "Erro ao enviar solicitação", "error");
      }
    } catch (error) {
      showToast("Erro de conexão", "error");
    }
  };

  // 4. Processar solicitação (aprove/negar) - ADMIN
  const processarSolicitacao = async () => {
    if (!solicitacaoSelecionada) return;

    try {
      const res = await fetch("/api/solicitacoes", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idParticipa: solicitacaoSelecionada.idParticipa,
          novaSituacao: decisao,
          motivoSituacao: decisao === "Negado" ? motivoDecisao : null,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        showToast(`Solicitação ${decisao === "Autorizado" ? "aprovada" : "negada"}!`, "success");
        setModalAprovarNegar(false);

        // Atualiza lista local
        setSolicitacoesProjeto((prev) => prev.filter((s) => s.idParticipa !== solicitacaoSelecionada.idParticipa));
      } else {
        showToast(data.error || "Erro ao processar solicitação", "error");
      }
    } catch (error) {
      showToast("Erro de conexão", "error");
    }
  };

  // 5. Formatar data
  const formatarData = (dataStr: string) => {
    return new Date(dataStr).toLocaleDateString("pt-BR", { timeZone: "UTC" });
  };

  // 6. Verificar status da participação
  const getStatusParticipacao = () => {
    if (!usuario || !projeto) return null;
    const participacao = participacoes.find((p) => p.idProjeto === projeto.idProjeto);
    return participacao ? participacao.situacao : null;
  };

  // 7. Fazer login
  const fazerLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?redirect=/projetos/${idProjeto}`,
      },
    });

    if (error) {
      showToast("Erro ao fazer login", "error");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando detalhes do projeto...</p>
        </div>
      </div>
    );
  }

  if (!projeto) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Projeto não encontrado</h1>
          <p className="text-gray-600 mb-6">O projeto que você está procurando não existe.</p>
          <Link
            href="/projetos"
            className="px-6 py-3 bg-teal-500 text-white font-bold rounded-xl hover:bg-teal-600 transition-colors"
          >
            Voltar para Projetos
          </Link>
        </div>
      </div>
    );
  }

  const statusParticipacao = getStatusParticipacao();
  const solicitacoesPendentes = solicitacoesProjeto.filter((s) => s.situacao === "Solicitado").length;

  return (
    <>
      {/* TOAST */}
      {toast.visible && (
        <div
          className={`fixed top-4 left-1/2 -translate-x-1/2 px-6 py-3 rounded-md shadow-lg z-[100] border ${
            toast.type === "success" ? "bg-teal-500 border-teal-300 text-white" : "bg-red-500 border-red-500 text-white"
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* MODAL SOLICITAR PARTICIPAÇÃO */}
      {modalSolicitacao && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className={`${inriaSerif700.className} text-xl text-gray-900 mb-2`}>Solicitar Participação</h3>
                <p className="text-sm text-gray-600">Projeto: {projeto.nome}</p>
              </div>
              <button onClick={() => setModalSolicitacao(false)} className="text-gray-400 hover:text-gray-600 text-xl">
                ✕
              </button>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Por que você deseja participar deste projeto? *
              </label>
              <textarea
                value={motivoSolicitacao}
                onChange={(e) => setMotivoSolicitacao(e.target.value)}
                rows={4}
                className="w-full border border-gray-300 rounded-lg p-3 text-gray-800 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none resize-none"
                placeholder="Descreva seu interesse e como você pode contribuir..."
                required
                autoFocus
              />
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setModalSolicitacao(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={enviarSolicitacao}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-bold transition-colors"
              >
                Enviar Solicitação
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL APROVAR/NEGAR SOLICITAÇÃO (ADMIN) */}
      {modalAprovarNegar && solicitacaoSelecionada && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className={`${inriaSerif700.className} text-xl text-gray-900 mb-2`}>Decidir Solicitação</h3>
                <p className="text-sm text-gray-600">
                  {solicitacaoSelecionada.usuario.nome} - {solicitacaoSelecionada.projeto.nome}
                </p>
              </div>
              <button onClick={() => setModalAprovarNegar(false)} className="text-gray-400 hover:text-gray-600 text-xl">
                ✕
              </button>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">Qual é a sua decisão?</label>
              <div className="flex gap-3 mb-4">
                <button
                  onClick={() => setDecisao("Autorizado")}
                  className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                    decisao === "Autorizado"
                      ? "bg-green-100 text-green-700 border-2 border-green-300"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  ✅ Aprovar
                </button>
                <button
                  onClick={() => setDecisao("Negado")}
                  className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                    decisao === "Negado"
                      ? "bg-red-100 text-red-700 border-2 border-red-300"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  ❌ Negar
                </button>
              </div>

              {decisao === "Negado" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Motivo da recusa (Opcional)</label>
                  <textarea
                    value={motivoDecisao}
                    onChange={(e) => setMotivoDecisao(e.target.value)}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg p-3 text-gray-800 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none resize-none"
                    placeholder="Explique brevemente o motivo da recusa..."
                  />
                </div>
              )}
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setModalAprovarNegar(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={processarSolicitacao}
                className={`px-4 py-2 rounded-lg font-bold text-white transition-colors ${
                  decisao === "Autorizado" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {decisao === "Autorizado" ? "Aprovar Solicitação" : "Negar Solicitação"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONTEÚDO PRINCIPAL */}
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* CABEÇALHO */}
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <Link
                  href="/projetos"
                  className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 font-medium mb-3 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                  Voltar para Projetos
                </Link>
                <div className="flex items-center gap-4">
                  <h1 className={`${inriaSerif700.className} text-3xl md:text-4xl text-gray-900`}>{projeto.nome}</h1>
                  <span
                    className={`text-sm font-bold px-3 py-1.5 rounded-full ${
                      projeto.situacao === "Ativo"
                        ? "bg-green-100 text-green-800 border border-green-200"
                        : projeto.situacao === "Inativo"
                          ? "bg-red-100 text-red-800 border border-red-200"
                          : "bg-yellow-100 text-yellow-800 border border-yellow-200"
                    }`}
                  >
                    {projeto.situacao}
                  </span>
                </div>
              </div>

              {usuario ? (
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{usuario.nome}</p>
                    {usuario.admin && (
                      <div className="flex items-center gap-2 mt-1">
                        <span className="inline-block px-3 py-1 text-sm font-bold bg-teal-500 text-white rounded-lg">
                          ADMIN
                        </span>
                        {solicitacoesPendentes > 0 && (
                          <button
                            onClick={carregarSolicitacoesProjeto}
                            className="relative px-3 py-1 bg-amber-500 text-white text-sm font-bold rounded-lg hover:bg-amber-600 transition-colors"
                          >
                            <span className="flex items-center gap-2">
                              <span>📋</span>
                              <span>Solicitações</span>
                              <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                                {solicitacoesPendentes}
                              </span>
                            </span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <button
                  onClick={fazerLogin}
                  className="px-5 py-2.5 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-bold rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <span>🔐</span>
                  <span>Fazer Login</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* CONTEÚDO */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* DEBUG INFO (apenas para desenvolvimento) */}
          {process.env.NODE_ENV === "development" && debugInfo && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-700 font-mono">Debug: {debugInfo}</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* COLUNA PRINCIPAL */}
            <div className="lg:col-span-2">
              {/* CARD DO PROJETO */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8">
                {/* INFORMAÇÕES DO PROJETO */}
                <div className="flex flex-wrap items-center gap-4 mb-8 pb-6 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
                      <span className="text-2xl text-teal-600">👤</span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Criado por</p>
                      <p className="font-bold text-gray-900 text-lg">{projeto.criador?.nome}</p>
                    </div>
                  </div>
                </div>

                {/* SE FOR ADMIN - MOSTRA TODAS AS INFORMAÇÕES */}
                {usuario?.admin ? (
                  <div className="space-y-8">
                    {/* DATAS */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gradient-to-br from-teal-50 to-white rounded-xl p-6 border border-teal-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-12 h-12 bg-teal-500/10 rounded-xl flex items-center justify-center">
                            <span className="text-2xl text-teal-600">📅</span>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-700">Data de Início</h4>
                            <p className="text-gray-900 font-bold text-xl">{formatarData(projeto.dataInicio)}</p>
                          </div>
                        </div>
                      </div>
                      {projeto.dataFim && (
                        <div className="bg-gradient-to-br from-amber-50 to-white rounded-xl p-6 border border-amber-100 shadow-sm">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center">
                              <span className="text-2xl text-amber-600">🏁</span>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-700">Data de Término</h4>
                              <p className="text-gray-900 font-bold text-xl">{formatarData(projeto.dataFim)}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* RESUMO */}
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                          <span className="text-xl text-blue-600">📋</span>
                        </div>
                        Descrição do Projeto
                      </h3>
                      <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-8 border border-gray-200 shadow-sm">
                        <p className="text-gray-700 leading-relaxed whitespace-pre-line text-lg">{projeto.resumo}</p>
                      </div>
                    </div>

                    {/* ANEXOS (se houver) */}
                    {projeto.anexos && projeto.anexos.length > 0 && (
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                          <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                            <span className="text-xl text-purple-600">📎</span>
                          </div>
                          Anexos
                        </h3>
                        <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200 shadow-sm">
                          <ul className="space-y-3">
                            {projeto.anexos.map((anexo, index) => (
                              <li
                                key={index}
                                className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 hover:border-teal-300 transition-colors"
                              >
                                <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                                  <span className="text-teal-600 text-lg">📄</span>
                                </div>
                                <span className="text-gray-800 font-medium">{anexo}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}

                    {/* SOLICITAÇÕES DESTE PROJETO (APENAS ADMIN) */}
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                          <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                            <span className="text-xl text-amber-600">📋</span>
                          </div>
                          Solicitações de Participação
                          {solicitacoesPendentes > 0 && (
                            <span className="ml-3 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                              {solicitacoesPendentes} pendente(s)
                            </span>
                          )}
                        </h3>
                        <button
                          onClick={carregarSolicitacoesProjeto}
                          disabled={loadingSolicitacoes}
                          className="px-4 py-2 bg-teal-100 text-teal-700 font-medium rounded-lg hover:bg-teal-200 transition-colors disabled:opacity-50"
                        >
                          {loadingSolicitacoes ? "Atualizando..." : "🔄 Atualizar"}
                        </button>
                      </div>

                      {solicitacoesProjeto.length > 0 ? (
                        <div className="space-y-4">
                          {solicitacoesProjeto.map((solicitacao) => (
                            <div
                              key={solicitacao.idParticipa}
                              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
                            >
                              <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl flex items-center justify-center">
                                    <span className="text-2xl text-blue-600">👤</span>
                                    {/* <span className="text-2xl text-blue-600">{solicitacao.usuario.foto}</span> */}
                                  </div>
                                  <div>
                                    <h4 className="font-bold text-gray-900 text-lg">{solicitacao.usuario.nome}</h4>
                                    <p className="text-sm text-gray-600">{solicitacao.usuario.email}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span
                                    className={`px-3 py-1.5 text-sm font-bold rounded-lg ${
                                      solicitacao.situacao === "Solicitado"
                                        ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                                        : solicitacao.situacao === "Autorizado"
                                          ? "bg-green-100 text-green-800 border border-green-200"
                                          : "bg-red-100 text-red-800 border border-red-200"
                                    }`}
                                  >
                                    {solicitacao.situacao}
                                  </span>
                                  {solicitacao.situacao === "Solicitado" && (
                                    <button
                                      onClick={() => {
                                        setSolicitacaoSelecionada(solicitacao);
                                        setModalAprovarNegar(true);
                                      }}
                                      className="px-4 py-2 bg-teal-500 text-white font-medium rounded-lg hover:bg-teal-600 transition-colors"
                                    >
                                      Decidir
                                    </button>
                                  )}
                                </div>
                              </div>

                              <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg p-4 border border-gray-100">
                                <h5 className="text-sm font-medium text-gray-700 mb-2">📝 Motivo da solicitação:</h5>
                                <p className="text-gray-800">{solicitacao.motivo}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-white rounded-2xl border-2 border-dashed border-gray-300">
                          <div className="text-5xl mb-4">🎉</div>
                          <p className="text-gray-500 text-lg">Não há solicitações de participação neste projeto</p>
                          <p className="text-gray-400 text-sm mt-2">
                            As solicitações aparecerão aqui quando usuários solicitarem participação
                          </p>
                        </div>
                      )}
                    </div>

                    {/* BOTÕES DO ADMIN */}
                    <div className="flex gap-4 pt-8 border-t border-gray-200">
                      <button
                        onClick={() => router.push(`/projetos/editar/${projeto.idProjeto}`)}
                        className="px-6 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold rounded-xl hover:shadow-lg transition-all flex items-center gap-3"
                      >
                        <span className="text-xl">✏️</span>
                        <span>Editar Projeto</span>
                      </button>
                      <Link
                        href="/projetos"
                        className="px-6 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl transition-colors flex items-center gap-3"
                      >
                        <span>←</span>
                        <span>Voltar para Projetos</span>
                      </Link>
                    </div>
                  </div>
                ) : (
                  /* SE FOR USUÁRIO COMUM - APENAS RESUMO */
                  <div className="space-y-8">
                    {/* RESUMO */}
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                          <span className="text-xl text-blue-600">📋</span>
                        </div>
                        Sobre o Projeto
                      </h3>
                      <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-8 border border-gray-200 shadow-sm">
                        <p className="text-gray-700 leading-relaxed whitespace-pre-line text-lg">{projeto.resumo}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* COLUNA LATERAL */}
            <div>
              {/* CARD DE PARTICIPAÇÃO (APENAS PARA NÃO-ADMINS) */}
              {!usuario?.admin && (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center">
                      <span className="text-xl text-teal-600">🎯</span>
                    </div>
                    Participar do Projeto
                  </h3>

                  {projeto.situacao !== "Ativo" ? (
                    <div className="bg-gradient-to-br from-gray-100 to-gray-50 rounded-xl p-6 text-center border border-gray-200">
                      <div className="text-4xl mb-4">🔒</div>
                      <p className="text-gray-600 font-medium">Este projeto não está aceitando novas participações</p>
                    </div>
                  ) : (
                    <div>
                      {(() => {
                        if (statusParticipacao === "Solicitado") {
                          return (
                            <div className="bg-gradient-to-br from-yellow-50 to-white rounded-xl p-6 text-center border-2 border-yellow-200">
                              <div className="text-4xl mb-4">⏳</div>
                              <div className="text-yellow-600 font-bold text-xl mb-3">SOLICITAÇÃO ENVIADA</div>
                              <p className="text-yellow-700">Aguardando aprovação do administrador</p>
                            </div>
                          );
                        }

                        if (statusParticipacao === "Autorizado") {
                          return (
                            <div className="bg-gradient-to-br from-green-50 to-white rounded-xl p-6 text-center border-2 border-green-200">
                              <div className="text-4xl mb-4">✅</div>
                              <div className="text-green-600 font-bold text-xl mb-3">PARTICIPAÇÃO AUTORIZADA</div>
                              <p className="text-green-700">Sua participação foi aprovada!</p>
                            </div>
                          );
                        }

                        if (statusParticipacao === "Negado") {
                          return (
                            <div className="bg-gradient-to-br from-red-50 to-white rounded-xl p-6 text-center border-2 border-red-200">
                              <div className="text-4xl mb-4">❌</div>
                              <div className="text-red-600 font-bold text-xl mb-3">PARTICIPAÇÃO NEGADA</div>
                              <p className="text-red-700">Sua solicitação não foi aprovada</p>
                            </div>
                          );
                        }

                        return (
                          <div>
                            {usuario ? (
                              <div className="space-y-6">
                                <p className="text-gray-600 text-center">
                                  Interessado em participar deste projeto? Envie uma solicitação explicando seu
                                  interesse.
                                </p>
                                <button
                                  onClick={() => setModalSolicitacao(true)}
                                  className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 hover:shadow-lg shadow-md"
                                >
                                  <span className="flex items-center justify-center gap-3">
                                    <span className="text-xl">📝</span>
                                    <span className="text-lg">SOLICITAR PARTICIPAÇÃO</span>
                                  </span>
                                </button>
                              </div>
                            ) : (
                              <div className="text-center">
                                <div className="text-5xl mb-4">🔐</div>
                                <p className="text-gray-600 mb-6 text-lg">
                                  Faça login para solicitar participação neste projeto
                                </p>
                                <button
                                  onClick={fazerLogin}
                                  className="w-full bg-gradient-to-r from-teal-500 to-teal-600 text-white font-bold py-3.5 px-6 rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-3"
                                >
                                  <span className="text-xl">🔐</span>
                                  <span>Fazer Login com Google</span>
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </div>
              )}

              {/* CARD DE INFORMAÇÕES */}
              <div className="bg-gradient-to-br from-teal-50 to-white rounded-2xl shadow-lg border border-teal-200 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center">
                    <span className="text-xl text-teal-600">ℹ️</span>
                  </div>
                  Informações
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-center gap-4 p-3 bg-white rounded-xl border border-gray-100">
                    <div className="w-12 h-12 bg-gradient-to-br from-teal-100 to-teal-50 rounded-lg flex items-center justify-center">
                      <span className="text-xl text-teal-600">📊</span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Status</p>
                      <p className="font-bold text-gray-900 text-lg">{projeto.situacao}</p>
                    </div>
                  </li>
                  <li className="flex items-center gap-4 p-3 bg-white rounded-xl border border-gray-100">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg flex items-center justify-center">
                      <span className="text-xl text-blue-600">👤</span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Criador</p>
                      <p className="font-bold text-gray-900 text-lg">{projeto.criador?.nome}</p>
                    </div>
                  </li>
                  <li className="flex items-center gap-4 p-3 bg-white rounded-xl border border-gray-100">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-amber-50 rounded-lg flex items-center justify-center">
                      <span className="text-xl text-amber-600">📅</span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Iniciado em</p>
                      <p className="font-bold text-gray-900 text-lg">{formatarData(projeto.dataInicio)}</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
