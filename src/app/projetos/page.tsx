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
  anexos: string | null;
  criador?: { nome: string };
};

export default function GerenciarProjetos() {
  // --- ESTADOS DE DADOS ---
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [loading, setLoading] = useState(false);
  const [carregandoLista, setCarregandoLista] = useState(true);

  // --- ESTADOS DO FORMULÁRIO ---
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [nome, setNome] = useState("");
  const [resumo, setResumo] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [situacao, setSituacao] = useState("Ativo");
  const [anexos, setAnexos] = useState("");

  // --- ESTADOS DE AUTH ---
  const [idUsuarioAuth, setIdUsuarioAuth] = useState<string | null>(null);
  const [emailUsuario, setEmailUsuario] = useState<string>("");
  const [authLoading, setAuthLoading] = useState(true);

  // --- ESTADOS DO MODAL DE EXCLUSÃO (NOVO) ---
  const [idParaExcluir, setIdParaExcluir] = useState<number | null>(null);
  const [modalAberto, setModalAberto] = useState(false);

  // --- TOAST ---
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

  // 1. AUTH SETUP
  useEffect(() => {
    const setupAuth = async () => {
      setAuthLoading(true);
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        setIdUsuarioAuth(session.user.id);
        setEmailUsuario(session.user.email || "");
      }
      setAuthLoading(false);
    };
    setupAuth();
  }, []);

  // 2. CARREGAR PROJETOS (Com useCallback para corrigir o aviso do React)
  const fetchProjetos = useCallback(async () => {
    setCarregandoLista(true);
    try {
      const res = await fetch("/api/projetos");
      const data = await res.json();
      if (Array.isArray(data)) setProjetos(data);
    } catch (e) {
      console.error("Erro ao buscar projetos", e);
    } finally {
      setCarregandoLista(false);
    }
  }, []);

  useEffect(() => {
    fetchProjetos();
  }, [fetchProjetos]);

  // 3. AUXILIARES
  const formatarDataInput = (isoString: string) => {
    if (!isoString) return "";
    return isoString.split("T")[0];
  };

  const formatarDataBonita = (isoString: string) => {
    if (!isoString) return "-";
    // Ajuste de fuso horário simples para exibição
    const dataObj = new Date(isoString);
    return dataObj.toLocaleDateString("pt-BR", { timeZone: "UTC" });
  };

  const resetForm = () => {
    setEditandoId(null);
    setNome("");
    setResumo("");
    setDataInicio("");
    setDataFim("");
    setSituacao("Ativo");
    setAnexos("");
  };

  // 4. PREENCHER FORM PARA EDIÇÃO
  const handleEditar = (proj: Projeto) => {
    setEditandoId(proj.idProjeto);
    setNome(proj.nome);
    setResumo(proj.resumo);
    setDataInicio(formatarDataInput(proj.dataInicio));
    setDataFim(proj.dataFim ? formatarDataInput(proj.dataFim) : "");
    setSituacao(proj.situacao);
    setAnexos(proj.anexos || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 5. LÓGICA DE EXCLUSÃO COM MODAL
  const abrirModalExclusao = (idProjeto: number) => {
    setIdParaExcluir(idProjeto);
    setModalAberto(true);
  };

  const confirmarExclusao = async () => {
    if (!idParaExcluir || !idUsuarioAuth) return;

    try {
      const res = await fetch(
        `/api/projetos?idProjeto=${idParaExcluir}&idUsuarioAuth=${idUsuarioAuth}`,
        { method: "DELETE" },
      );

      if (res.ok) {
        showToast("Projeto excluído com sucesso!", "success");
        fetchProjetos();
        // Se estava editando o projeto que excluiu, limpa o form
        if (editandoId === idParaExcluir) resetForm();
      } else {
        const json = await res.json();
        showToast(`Erro: ${json.error}`, "error");
      }
    } catch {
      showToast("Erro ao excluir", "error");
    } finally {
      setModalAberto(false);
      setIdParaExcluir(null);
    }
  };

  // 6. SUBMIT (CRIAR OU EDITAR)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!idUsuarioAuth) {
      showToast("Você precisa ser Admin logado!", "error");
      setLoading(false);
      return;
    }

    const payload = {
      idUsuarioAuth,
      idProjeto: editandoId,
      nome,
      resumo,
      dataInicio,
      dataFim: dataFim || null,
      situacao,
      anexos,
    };

    try {
      const method = editandoId ? "PUT" : "POST";
      const res = await fetch("/api/projetos", {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok) {
        showToast(`Erro: ${json.error}`, "error");
      } else {
        showToast(
          editandoId ? "Projeto atualizado!" : "Projeto criado!",
          "success",
        );
        resetForm();
        fetchProjetos();
      }
    } catch {
      showToast("Erro de conexão.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* TOAST FLUTUANTE */}
      {toast.visible && (
        <div
          className={`fixed top-4 left-1/2 -translate-x-1/2 px-6 py-3 rounded-md shadow-lg z-50 border transition-all duration-300 ${
            toast.type === "success"
              ? "bg-teal-500 border-teal-300 text-white"
              : "bg-red-500 border-red-500 text-white"
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* MODAL DE CONFIRMAÇÃO DE EXCLUSÃO */}
      {modalAberto && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center">
              {/* Ícone de Alerta */}
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <title>Ícone de alerta</title>
                  <path d="M12 2L2 22h20L12 2z" />
                </svg>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Excluir Projeto?
              </h3>
              <p className="text-gray-500 mb-6">
                Tem certeza que deseja remover o projeto selecionado? Essa ação
                não pode ser desfeita.
              </p>

              <div className="flex gap-3 w-full justify-center">
                <button
                  type="button"
                  onClick={() => setModalAberto(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 font-medium w-32 border border-gray-300"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={confirmarExclusao}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium w-32 shadow-sm"
                >
                  Sim, Excluir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-center items-start mt-5 pb-10 w-full px-4">
        <div className="bg-white shadow-md rounded-xl w-full max-w-6xl border border-gray-300 flex flex-col lg:flex-row overflow-hidden">
          {/* --- LADO ESQUERDO: FORMULÁRIO --- */}
          <div className="w-full lg:w-[35%] p-6 border-b lg:border-b-0 lg:border-r border-gray-300 bg-white">
            <div className="mb-6">
              <h1
                className={`${inriaSerif700.className} text-2xl text-gray-900 uppercase`}
              >
                {editandoId ? "Editar Projeto" : "Cadastrar Projeto"}
              </h1>
              <div className="text-sm font-bold mt-1 min-h-5">
                {authLoading ? (
                  <span className="text-gray-400 animate-pulse">
                    Verificando permissões...
                  </span>
                ) : emailUsuario ? (
                  <span className="text-teal-600">Admin: {emailUsuario}</span>
                ) : (
                  <span className="text-red-400">
                    Não logado. Acesso restrito.
                  </span>
                )}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <p className="mb-1 text-gray-700 font-medium">
                  Nome do Projeto: *
                </p>
                <input
                  required
                  type="text"
                  className="w-full h-10 border border-gray-300 rounded p-2 text-gray-900"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Ex: Robótica Avançada"
                />
              </div>

              <div>
                <p className="mb-1 text-gray-700 font-medium">Situação: *</p>
                <select
                  className="w-full h-10 border border-gray-300 rounded p-2 bg-white text-gray-900"
                  value={situacao}
                  onChange={(e) => setSituacao(e.target.value)}
                >
                  <option value="Ativo">Ativo</option>
                  <option value="Inativo">Inativo</option>
                  <option value="Concluido">Concluído</option>
                </select>
              </div>

              <div className="flex gap-2">
                <div className="w-1/2">
                  <p className="mb-1 text-gray-700 font-medium">Início: *</p>
                  <input
                    required
                    type="date"
                    className="w-full h-10 border border-gray-300 rounded p-2 text-gray-900"
                    value={dataInicio}
                    onChange={(e) => setDataInicio(e.target.value)}
                  />
                </div>
                <div className="w-1/2">
                  <p className="mb-1 text-gray-700 font-medium">
                    Fim (Opcional):
                  </p>
                  <input
                    type="date"
                    className="w-full h-10 border border-gray-300 rounded p-2 text-gray-900"
                    value={dataFim}
                    onChange={(e) => setDataFim(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <p className="mb-1 text-gray-700 font-medium">Resumo: *</p>
                <textarea
                  required
                  rows={4}
                  className="w-full border border-gray-300 rounded p-2 resize-none text-gray-900"
                  value={resumo}
                  onChange={(e) => setResumo(e.target.value)}
                  placeholder="Descreva o objetivo do projeto..."
                />
              </div>

              <div>
                <p className="mb-1 text-gray-700 font-medium">Link/Anexos:</p>
                <input
                  type="text"
                  className="w-full h-10 border border-gray-300 rounded p-2 text-gray-900"
                  value={anexos}
                  onChange={(e) => setAnexos(e.target.value)}
                  placeholder="URL do drive, PDF, etc."
                />
              </div>

              <div className="flex justify-center gap-3 pt-4">
                {editandoId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 text-gray-700"
                  >
                    Cancelar Edição
                  </button>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 disabled:opacity-50 font-bold shadow-sm"
                >
                  {loading
                    ? "Salvando..."
                    : editandoId
                      ? "Atualizar"
                      : "Cadastrar"}
                </button>
              </div>
            </form>
          </div>

          {/* --- LADO DIREITO: LISTA DE PROJETOS --- */}
          <div className="flex-1 p-6 bg-gray-50 flex flex-col gap-4 overflow-y-auto max-h-[800px] custom-scrollbar">
            <div className="flex items-center justify-between border-b border-gray-200 pb-2 mb-2">
              <h3
                className={`${inriaSerif700.className} text-gray-800 text-xl`}
              >
                Projetos Cadastrados
              </h3>
              <span className="text-sm text-gray-500">
                {projetos.length} projetos
              </span>
            </div>

            {carregandoLista ? (
              <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                <span className="animate-pulse">Carregando lista...</span>
              </div>
            ) : projetos.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
                <p>Nenhum projeto encontrado.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {projetos.map((proj) => (
                  <div
                    key={proj.idProjeto}
                    className={`bg-white border-l-4 p-4 shadow-sm rounded-r-md flex flex-col gap-2 transition hover:shadow-md ${
                      proj.situacao === "Ativo"
                        ? "border-teal-500"
                        : proj.situacao === "Inativo"
                          ? "border-gray-400"
                          : "border-blue-500"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-gray-800 text-lg">
                          {proj.nome}
                        </h4>
                        <span
                          className={`text-xs px-2 py-0.5 rounded font-bold uppercase ${
                            proj.situacao === "Ativo"
                              ? "bg-teal-100 text-teal-700"
                              : "bg-gray-200 text-gray-600"
                          }`}
                        >
                          {proj.situacao}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleEditar(proj)}
                          className="text-blue-600 hover:text-blue-800 text-sm underline font-medium"
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          onClick={() => abrirModalExclusao(proj.idProjeto)}
                          className="text-red-500 hover:text-red-700 text-sm underline font-medium"
                        >
                          Excluir
                        </button>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm line-clamp-2">
                      {proj.resumo}
                    </p>

                    <div className="mt-2 text-xs text-gray-400 flex gap-4">
                      <span>Início: {formatarDataBonita(proj.dataInicio)}</span>
                      <span>Fim: {formatarDataBonita(proj.dataFim || "")}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
