"use client";

import { useState, useEffect, useCallback } from "react";
import { Inria_Serif } from "next/font/google";
import { supabase } from "@/lib/supabase/browser/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Bell } from "lucide-react";

const inriaSerif700 = Inria_Serif({ subsets: ["latin"], weight: ["700"] });

type Projeto = {
  idProjeto: number;
  nome: string;
  resumo: string;
  dataInicio: string;
  dataFim: string | null;
  situacao: string;
  criador: { nome: string };
  anexos?: string;
  participacoes?: any[];
};

type Notificacao = {
  id: string; // Composite ID to dismiss
  tipo: "admin_request" | "user_approved" | "user_denied";
  mensagem: string;
  link: string;
};

export default function ListaProjetos() {
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [loading, setLoading] = useState(true);
  const [usuarioLogado, setUsuarioLogado] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [usuarioId, setUsuarioId] = useState<number | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [termoBusca, setTermoBusca] = useState("");
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
  const [mostrarNotificacoes, setMostrarNotificacoes] = useState(false);

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

  useEffect(() => {
    const verificarAutenticacao = async () => {
      setLoadingAuth(true);
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user?.id) {
        setUsuarioLogado(true);
        const resUsuario = await fetch(`/api/usuarios/me?idAuth=${session.user.id}`);
        if (resUsuario.ok) {
          const usuarioData = await resUsuario.json();
          setUsuarioId(usuarioData.idUsuario);
          setIsAdmin(usuarioData.admin);
        }
      } else {
        setUsuarioLogado(false);
      }
      setLoadingAuth(false);
    };

    verificarAutenticacao();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user?.id) {
        setUsuarioLogado(true);
        const resUsuario = await fetch(`/api/usuarios/me?idAuth=${session.user.id}`);
        if (resUsuario.ok) {
          const usuarioData = await resUsuario.json();
          setUsuarioId(usuarioData.idUsuario);
          setIsAdmin(usuarioData.admin);
        }
      } else {
        setUsuarioLogado(false);
        setUsuarioId(null);
        setIsAdmin(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const carregarProjetos = async () => {
      setLoading(true);
      try {
        const resProj = await fetch("/api/projetos");
        if (resProj.ok) {
          const dadosProj = await resProj.json();
          if (Array.isArray(dadosProj)) {
            setProjetos(dadosProj);

            // Build Notificacoes System here instead of useEffect
            const {
              data: { session },
            } = await supabase.auth.getSession();
            if (session?.user?.id) {
              const resUser = await fetch(`/api/usuarios/me?idAuth=${session.user.id}`);
              if (resUser.ok) {
                const userData = await resUser.json();
                let newNotificacoes: Notificacao[] = [];
                const dismissed = JSON.parse(localStorage.getItem("@mambee/dismissed_notifs") || "[]");

                if (userData.admin) {
                  dadosProj.forEach((p) => {
                    if (Array.isArray(p.participacoes)) {
                      const solicitacoesPendentes = p.participacoes.filter(
                        (part: any) => part.situacao === "Solicitado",
                      );
                      if (solicitacoesPendentes.length > 0) {
                        const notifId = `admin_req_${p.idProjeto}`;
                        if (!dismissed.includes(notifId)) {
                          newNotificacoes.push({
                            id: notifId,
                            tipo: "admin_request",
                            mensagem: `O projeto "${p.nome}" possui ${solicitacoesPendentes.length} nova(s) solicitação(ões) de entrada.`,
                            link: `/projetos/${p.idProjeto}`,
                          });
                        }
                      }
                    }
                  });
                } else {
                  dadosProj.forEach((p) => {
                    if (Array.isArray(p.participacoes)) {
                      const minhaPart = p.participacoes.find((part: any) => part.idUsuario === userData.idUsuario);
                      if (minhaPart && (minhaPart.situacao === "Autorizado" || minhaPart.situacao === "Negado")) {
                        const notifId = `user_${minhaPart.situacao.toLowerCase()}_${p.idProjeto}`;
                        if (!dismissed.includes(notifId)) {
                          newNotificacoes.push({
                            id: notifId,
                            tipo: minhaPart.situacao === "Autorizado" ? "user_approved" : "user_denied",
                            mensagem: `Sua solicitação de participação no projeto "${p.nome}" foi ${minhaPart.situacao.toUpperCase()}.`,
                            link: `/projetos/${p.idProjeto}`,
                          });
                        }
                      }
                    }
                  });
                }
                setNotificacoes(newNotificacoes);
              }
            }
          }
        }
      } catch (error) {
        console.error("Erro ao carregar projetos:", error);
        showToast("Erro ao carregar projetos", "error");
      } finally {
        setLoading(false);
      }
    };

    carregarProjetos();
  }, [showToast]);

  const fazerLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) showToast("Erro ao fazer login", "error");
  };

  return (
    <>
      {}
      {toast.visible && (
        <div
          className={`fixed top-4 left-1/2 -translate-x-1/2 px-6 py-3 rounded-md shadow-lg z-[100] border ${
            toast.type === "success" ? "bg-teal-500 border-teal-300 text-white" : "bg-red-500 border-red-500 text-white"
          }`}
        >
          {toast.message}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-12">
          <div className="flex flex-col gap-6">
            {/* Linha Superior: Título e Notificações */}
            <div className="flex items-center justify-between">
              <h1 className={`${inriaSerif700.className} text-4xl md:text-5xl text-gray-900`}>
                PROJETOS
              </h1>
              
              {usuarioLogado && (
                <div className="relative">
                  <button
                    onClick={() => setMostrarNotificacoes(!mostrarNotificacoes)}
                    className="relative p-3 bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition transform hover:scale-105 shadow-sm"
                  >
                    <Bell size={20} className="text-gray-600" />
                    {notificacoes.length > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-bounce shadow-sm">
                        {notificacoes.length}
                      </span>
                    )}
                  </button>

                  {mostrarNotificacoes && (
                    <div className="absolute top-14 right-0 w-80 bg-white border border-gray-200 shadow-2xl rounded-xl z-50 overflow-hidden transform origin-top-right transition-all">
                      <div className="p-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="font-bold text-gray-800">Notificações</h3>
                        <span className="text-xs font-medium text-gray-500">{notificacoes.length} não lidas</span>
                      </div>
                      <div className="max-h-[300px] overflow-y-auto">
                        {notificacoes.length === 0 ? (
                          <div className="p-6 text-center text-gray-500 text-sm">Nenhuma notificação nova.</div>
                        ) : (
                          notificacoes.map((notif) => (
                            <div
                              key={notif.id}
                              className="p-4 border-b border-gray-50 hover:bg-gray-50 transition flex flex-col gap-2"
                            >
                              <p className="text-sm text-gray-700">{notif.mensagem}</p>
                              <div className="flex gap-2 mt-1">
                                <Link
                                  onClick={() => setMostrarNotificacoes(false)}
                                  href={notif.link}
                                  className="text-xs font-bold text-teal-600 hover:text-teal-700 hover:underline"
                                >
                                  Ver Projeto
                                </Link>
                                <button
                                  onClick={() => {
                                    const dismissed = JSON.parse(
                                      localStorage.getItem("@mambee/dismissed_notifs") || "[]",
                                    );
                                    dismissed.push(notif.id);
                                    localStorage.setItem("@mambee/dismissed_notifs", JSON.stringify(dismissed));
                                    setNotificacoes((prev) => prev.filter((n) => n.id !== notif.id));
                                  }}
                                  className="text-xs font-bold text-gray-400 hover:text-gray-600 ml-auto"
                                >
                                  OK
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Descrição */}
            <p className="text-gray-600 text-lg max-w-3xl leading-relaxed">
              Conheça os projetos em desenvolvimento, fale com o coordenador da mambee para saber como participar ou
              criar o seu projeto
            </p>

            {/* Ações: Busca e Novo Projeto */}
            <div className="flex flex-row flex-wrap items-center gap-3 mt-2">
              <div className="relative group flex-1 min-w-[280px] max-w-2xl">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-teal-500 transition-colors">
                  🔍
                </span>
                <input
                  type="text"
                  placeholder="Buscar projetos pelo nome ou resumo..."
                  value={termoBusca}
                  onChange={(e) => setTermoBusca(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all shadow-sm text-gray-700"
                />
              </div>

              {isAdmin && (
                <Link
                  href="/cadastro_projetos"
                  className="px-6 py-3.5 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-bold rounded-2xl hover:shadow-lg transition-all flex items-center justify-center gap-2 whitespace-nowrap shadow-sm"
                >
                  <span className="text-xl">+</span>
                  <span>Novo Projeto</span>
                </Link>
              )}

              {!loadingAuth && !usuarioLogado && (
                <button
                  type="button"
                  onClick={fazerLogin}
                  className="px-6 py-3.5 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-bold rounded-2xl hover:shadow-lg transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <span>🔐</span>
                  <span>Fazer Login</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-56 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : (
          (() => {
            let projetosVisiveis = projetos;

            if (!isAdmin) {
              projetosVisiveis = projetosVisiveis.filter((p) => p.situacao !== "Inativo");
            }

            projetosVisiveis = projetosVisiveis.filter(
              (p) =>
                p.nome.toLowerCase().includes(termoBusca.toLowerCase()) ||
                p.resumo.toLowerCase().includes(termoBusca.toLowerCase()),
            );

            const meusProjetos = (projetosVisiveis || []).filter((p) => {
              if (!usuarioId) return false;
              // Check participações
              const isAutorizado =
                Array.isArray((p as any).participacoes) &&
                (p as any).participacoes.some(
                  (part: any) => part.idUsuario === usuarioId && part.situacao === "Autorizado",
                );
              return p.criador?.nome || isAutorizado; // Simplification, relies on fetching participation correctly via API later
            });

            // For agora, para não quebrar e mostrar layout reativo de "Meus Projetos"
            const isParticipant = (p: any) =>
              Array.isArray(p.participacoes) &&
              p.participacoes.some((part: any) => part.idUsuario === usuarioId && part.situacao === "Autorizado");
            const meusProjReal = projetosVisiveis.filter(
              (p) => isParticipant(p) || (p as any).criador?.idUsuario === usuarioId,
            );
            const outrosProj = projetosVisiveis.filter((p) => !meusProjReal.includes(p));

            if (projetosVisiveis.length === 0) {
              return (
                <div className="text-center py-20 bg-gradient-to-b from-gray-50 to-white rounded-2xl border-2 border-dashed border-gray-200">
                  <div className="text-6xl mb-4">{termoBusca ? "🔍" : "📋"}</div>
                  <p className="text-gray-500 text-xl font-medium">
                    {termoBusca
                      ? `Nenhum projeto encontrado para "${termoBusca}"`
                      : "Nenhum projeto cadastrado no momento"}
                  </p>
                  {termoBusca && (
                    <button onClick={() => setTermoBusca("")} className="mt-4 text-teal-600 font-bold hover:underline">
                      Limpar busca
                    </button>
                  )}
                </div>
              );
            }

            const RenderProjetoCard = ({ proj }: { proj: Projeto }) => (
              <div
                key={proj.idProjeto}
                className="group bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full hover:-translate-y-2"
              >
                <div className="p-8 flex-1">
                  <div className="flex justify-between items-start mb-6">
                    <span
                      className={`text-xs font-bold px-3 py-1.5 rounded-full ${
                        proj.situacao === "Concluido"
                          ? "text-blue-600 bg-blue-50"
                          : proj.situacao === "Ativo"
                            ? "text-green-600 bg-green-50"
                            : proj.situacao === "Inativo"
                              ? "text-red-600 bg-red-50"
                              : "text-yellow-600 bg-yellow-50"
                      }`}
                    >
                      {proj.situacao === "Concluido" ? "Projeto Concluído" : proj.situacao}
                    </span>
                    <span className="text-xs text-gray-500">Por: {proj.criador?.nome}</span>
                  </div>
                  <div className="min-h-[80px]">
                    <h3 className={`${inriaSerif700.className} text-2xl text-gray-900 line-clamp-2 leading-tight`}>
                      {proj.nome}
                    </h3>
                  </div>
                </div>
                <div className="p-6 pt-0">
                  <Link
                    href={`/projetos/${proj.idProjeto}`}
                    className="block w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 hover:shadow-md flex items-center justify-center gap-2 group/link"
                  >
                    <span>Ver Detalhes</span>
                    <span className="group-hover/link:translate-x-1 transition-transform">→</span>
                  </Link>
                </div>
              </div>
            );

            return (
              <div className="flex flex-col gap-12">
                {usuarioLogado && meusProjReal.length > 0 && (
                  <div>
                    <h2
                      className={`${inriaSerif700.className} text-3xl text-teal-700 mb-6 border-b-2 border-teal-100 line-clamp-2 pb-2 inline-block pr-6`}
                    >
                      Meus Projetos
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {meusProjReal.map((proj) => (
                        <RenderProjetoCard key={proj.idProjeto} proj={proj} />
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  {usuarioLogado && meusProjReal.length > 0 && outrosProj.length > 0 && (
                    <h2
                      className={`${inriaSerif700.className} text-3xl text-gray-700 mb-6 border-b-2 border-gray-200 line-clamp-2 pb-2 inline-block pr-6`}
                    >
                      Outros Projetos
                    </h2>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {(usuarioLogado ? outrosProj : projetosVisiveis).map((proj) => (
                      <RenderProjetoCard key={proj.idProjeto} proj={proj} />
                    ))}
                  </div>
                </div>
              </div>
            );
          })()
        )}
      </div>
    </>
  );
}
