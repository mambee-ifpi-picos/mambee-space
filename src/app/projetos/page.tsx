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

export default function ListaProjetos() {
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [loading, setLoading] = useState(true);
  const [usuarioLogado, setUsuarioLogado] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [termoBusca, setTermoBusca] = useState("");

  // TOAST
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "success" as "success" | "error",
  });

  const showToast = useCallback(
    (msg: string, type: "success" | "error" = "success") => {
      setToast({ visible: true, message: msg, type });
      setTimeout(
        () => setToast({ visible: false, message: "", type: "success" }),
        3500,
      );
    },
    [],
  );

  
  useEffect(() => {
    const verificarAutenticacao = async () => {
      setLoadingAuth(true);
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUsuarioLogado(!!session);
      setLoadingAuth(false);
    };

    verificarAutenticacao();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUsuarioLogado(!!session);
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
          if (Array.isArray(dadosProj)) setProjetos(dadosProj);
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
            toast.type === "success"
              ? "bg-teal-500 border-teal-300 text-white"
              : "bg-red-500 border-red-500 text-white"
          }`}
        >
          {toast.message}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <h1
                className={`${inriaSerif700.className} text-4xl md:text-5xl text-gray-900 mb-3`}
              >
                PROJETOS
              </h1>
              <p className="text-gray-600 text-lg max-w-3xl">
                Conheça os projetos em desenvolvimento e participe das nossas
                iniciativas
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <div className="relative group min-w-[300px]">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-teal-500 transition-colors">
                  🔍
                </span>
                <input
                  type="text"
                  placeholder="Buscar projetos..."
                  value={termoBusca}
                  onChange={(e) => setTermoBusca(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all shadow-sm"
                />
              </div>

              {!loadingAuth && !usuarioLogado && (
                <button
                  type="button"
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

        {}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-56 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl animate-pulse"
              ></div>
            ))}
          </div>
        ) : (
          (() => {
            const projetosFiltrados = projetos.filter(
              (p) =>
                p.nome.toLowerCase().includes(termoBusca.toLowerCase()) ||
                p.resumo.toLowerCase().includes(termoBusca.toLowerCase())
            );

            if (projetosFiltrados.length === 0) {
              return (
                <div className="text-center py-20 bg-gradient-to-b from-gray-50 to-white rounded-2xl border-2 border-dashed border-gray-200">
                  <div className="text-6xl mb-4">
                    {termoBusca ? "🔍" : "📋"}
                  </div>
                  <p className="text-gray-500 text-xl font-medium">
                    {termoBusca
                      ? `Nenhum projeto encontrado para "${termoBusca}"`
                      : "Nenhum projeto cadastrado no momento"}
                  </p>
                  {termoBusca && (
                    <button
                      onClick={() => setTermoBusca("")}
                      className="mt-4 text-teal-600 font-bold hover:underline"
                    >
                      Limpar busca
                    </button>
                  )}
                </div>
              );
            }

            return (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projetosFiltrados.map((proj) => (
              <div
                key={proj.idProjeto}
                className="group bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full hover:-translate-y-2"
              >
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
                    <span className="text-xs text-gray-500">
                      Por: {proj.criador?.nome}
                    </span>
                  </div>
                  <div className="min-h-[80px]">
                    <h3
                      className={`${inriaSerif700.className} text-2xl text-gray-900 line-clamp-2 leading-tight`}
                    >
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
                    <span className="group-hover/link:translate-x-1 transition-transform">
                      →
                    </span>
                  </Link>
                </div>
              </div>
                ))}
              </div>
            );
          })()
        )}
      </div>
    </>
  );
}
