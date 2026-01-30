"use client";

import { useState, useEffect, useCallback } from "react";
import { Inria_Serif } from "next/font/google";
import { supabase } from "@/lib/supabase/browser/supabaseClient";
import { useRouter } from "next/navigation";
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
  anexos?: string;
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

export default function ListaProjetos() {
  const router = useRouter();

  // ESTADOS
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [loading, setLoading] = useState(true);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [participacoes, setParticipacoes] = useState<Participacao[]>([]);
  const [loadingAuth, setLoadingAuth] = useState(true);

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

  // 1. Verificar autenticação e carregar dados do usuário
  useEffect(() => {
    const verificarAutenticacao = async () => {
      setLoadingAuth(true);
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          // Busca dados do usuário no seu banco
          const resUsuario = await fetch("/api/usuarios/me");
          if (resUsuario.ok) {
            const usuarioData = await resUsuario.json();
            setUsuario(usuarioData);

            // Busca participações do usuário
            const resPart = await fetch("/api/solicitar_participacao");
            if (resPart.ok) {
              const dadosPart = await resPart.json();
              if (Array.isArray(dadosPart)) {
                setParticipacoes(dadosPart);
              }
            }
          }
        }
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error);
      } finally {
        setLoadingAuth(false);
      }
    };

    verificarAutenticacao();

    // Listener para mudanças na autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const resUsuario = await fetch("/api/usuarios/me");
        if (resUsuario.ok) {
          const usuarioData = await resUsuario.json();
          setUsuario(usuarioData);
        }
      } else {
        setUsuario(null);
        setParticipacoes([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // 2. Carregar projetos
  useEffect(() => {
    const carregarProjetos = async () => {
      setLoading(true);
      try {
        const resProj = await fetch("/api/projetos");
        if (resProj.ok) {
          const dadosProj = await resProj.json();
          if (Array.isArray(dadosProj)) setProjetos(dadosProj);
        } else {
          console.error("Erro ao buscar projetos:", resProj.status, resProj.statusText);
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

  // 3. Fazer login
  const fazerLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      showToast("Erro ao fazer login", "error");
    }
  };

  // 4. Fazer logout
  const fazerLogout = async () => {
    await supabase.auth.signOut();
    setUsuario(null);
    showToast("Logout realizado com sucesso", "success");
  };

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

      {/* CONTEÚDO PRINCIPAL */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* CABEÇALHO COM INFO DE LOGIN */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <h1 className={`${inriaSerif700.className} text-4xl md:text-5xl text-gray-900 mb-3`}>PROJETOS</h1>
              <p className="text-gray-600 text-lg max-w-3xl">
                Conheça os projetos em desenvolvimento e participe das nossas iniciativas
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {loadingAuth ? (
                <div className="px-6 py-3 bg-gray-100 rounded-xl animate-pulse"></div>
              ) : usuario ? (
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{usuario.nome}</p>
                    <p className="text-sm text-gray-600">{usuario.email}</p>
                    {usuario.admin && (
                      <span className="inline-block mt-1 px-2 py-1 text-xs font-bold bg-teal-100 text-teal-700 rounded">
                        ADMIN
                      </span>
                    )}
                  </div>
                  <button
                    onClick={fazerLogout}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-xl transition-colors"
                  >
                    Sair
                  </button>
                </div>
              ) : (
                <button
                  onClick={fazerLogin}
                  className="px-6 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-bold rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <span>🔐</span>
                  <span>Fazer Login com Google</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* LISTA DE PROJETOS */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-56 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : projetos.length === 0 ? (
          <div className="text-center py-20 bg-gradient-to-b from-gray-50 to-white rounded-2xl border-2 border-dashed border-gray-200">
            <div className="text-6xl mb-4">📋</div>
            <p className="text-gray-500 text-xl">Nenhum projeto cadastrado no momento</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projetos.map((proj) => (
              <div
                key={proj.idProjeto}
                className="group bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full hover:-translate-y-2"
              >
                {/* CABEÇALHO DO CARD */}
                <div className="p-8 flex-1">
                  <div className="flex justify-between items-start mb-6">
                    <span
                      className={`text-xs font-bold px-3 py-1.5 rounded-full ${
                        proj.situacao === "Ativo"
                          ? "text-green-600 bg-green-50"
                          : proj.situacao === "Inativo"
                            ? "text-red-600 bg-red-50"
                            : "text-yellow-600 bg-yellow-50"
                      }`}
                    >
                      {proj.situacao}
                    </span>
                    <span className="text-xs text-gray-500">Por: {proj.criador?.nome}</span>
                  </div>

                  <div className="min-h-[80px]">
                    <h3 className={`${inriaSerif700.className} text-2xl text-gray-900 line-clamp-2 leading-tight`}>
                      {proj.nome}
                    </h3>
                  </div>
                </div>

                {/* RODAPÉ COM BOTÃO - AGORA USANDO LINK */}
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
            ))}
          </div>
        )}
      </div>
    </>
  );
}
