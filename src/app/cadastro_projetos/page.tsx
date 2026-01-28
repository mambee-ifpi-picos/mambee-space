"use client";

import { useState, useEffect, useCallback } from "react";
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
  anexos: string[] | null;
  criador?: { nome: string };
};

export default function GerenciarProjetos() {
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Salvando...");
  const [carregandoLista, setCarregandoLista] = useState(true);

  const [nome, setNome] = useState("");
  const [resumo, setResumo] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [situacao, setSituacao] = useState("Ativo");
  const [arquivosParaEnviar, setArquivosParaEnviar] = useState<File[]>([]);
  const [idUsuarioAuth, setIdUsuarioAuth] = useState<string | null>(null);
  const [_emailUsuario, setEmailUsuario] = useState<string>("");
  const [_authLoading, setAuthLoading] = useState(true);

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

  // FIX: Ajustado o endpoint para bater na pasta correta
  const fetchProjetos = useCallback(async () => {
    setCarregandoLista(true);
    try {
      const res = await fetch("/api/cadastro_projetos");
      if (!res.ok) throw new Error("Falha ao buscar");
      const data = await res.json();
      if (Array.isArray(data)) setProjetos(data);
    } catch (e) {
      console.error(e);
      showToast("Erro ao carregar lista.", "error");
    } finally {
      setCarregandoLista(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchProjetos();
  }, [fetchProjetos]);

  const resetForm = () => {
    setNome("");
    setResumo("");
    setDataInicio("");
    setDataFim("");
    setSituacao("Ativo");
    setArquivosParaEnviar([]);
    const input = document.getElementById("fileInput") as HTMLInputElement;
    if (input) input.value = "";
  };

  const adicionarArquivos = (files: FileList | null) => {
    if (!files) return;
    setArquivosParaEnviar((prev) => [...prev, ...Array.from(files)]);
  };

  const _removerArquivo = (index: number) => {
    setArquivosParaEnviar((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadArquivoSupabase = async (file: File) => {
    const nomeLimpo = file.name.replace(/[^a-zA-Z0-9.]/g, "_");
    const fileName = `${Date.now()}_${nomeLimpo}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("documentos-projetos")
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const {
      data: { publicUrl },
    } = supabase.storage.from("documentos-projetos").getPublicUrl(filePath);
    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!idUsuarioAuth) {
      showToast("Logue primeiro!", "error");
      setLoading(false);
      return;
    }

    try {
      const urlsGeradas: string[] = [];
      if (arquivosParaEnviar.length > 0) {
        for (let i = 0; i < arquivosParaEnviar.length; i++) {
          setLoadingText(`Enviando ${i + 1}/${arquivosParaEnviar.length}...`);
          try {
            const url = await uploadArquivoSupabase(arquivosParaEnviar[i]);
            if (url) urlsGeradas.push(url);
          } catch (error) {
            console.error("Erro upload:", error);
          }
        }
      }

      setLoadingText("Salvando projeto...");

      const payload = {
        idUsuarioAuth,
        nome,
        resumo,
        dataInicio,
        dataFim: dataFim || null,
        situacao,
        anexos: urlsGeradas,
      };

      // FIX: Ajustado o endpoint para bater na pasta correta
      const res = await fetch("/api/cadastro_projetos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok) {
        showToast(`Erro: ${json.error}`, "error");
      } else {
        showToast("Projeto criado!", "success");
        resetForm();
        fetchProjetos();
      }
    } catch (err) {
      console.error(err);
      showToast("Erro de conexão.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {toast.visible && (
        <div
          className={`fixed top-4 left-1/2 -translate-x-1/2 px-6 py-3 rounded-md shadow-lg z-50 border transition-all duration-300 ${toast.type === "success" ? "bg-teal-500 border-teal-300 text-white" : "bg-red-500 border-red-500 text-white"}`}
        >
          {toast.message}
        </div>
      )}

      <div className="flex justify-center items-start mt-5 pb-10 w-full px-4">
        <div className="bg-white shadow-md rounded-xl w-full max-w-6xl border border-gray-300 flex flex-col lg:flex-row overflow-hidden">
          {/* Form */}
          <div className="w-full lg:w-[40%] p-8 border-b lg:border-b-0 lg:border-r border-gray-300 bg-white">
            <h1
              className={`${inriaSerif700.className} text-3xl text-gray-900 uppercase mb-6`}
            >
              Novo Projeto
            </h1>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <p className="mb-1 text-gray-700 font-medium">Nome: *</p>
                <input
                  required
                  type="text"
                  className="w-full h-11 border border-gray-300 rounded p-3 text-gray-900"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="mb-1 text-gray-700 font-medium">Situação: *</p>
                  <select
                    className="w-full h-11 border border-gray-300 rounded p-2 text-gray-900 bg-white"
                    value={situacao}
                    onChange={(e) => setSituacao(e.target.value)}
                  >
                    <option value="Ativo">Ativo</option>
                    <option value="Inativo">Inativo</option>
                    <option value="Concluido">Concluído</option>
                  </select>
                </div>
                <div>
                  <p className="mb-1 text-gray-700 font-medium">Início: *</p>
                  <input
                    required
                    type="date"
                    className="w-full h-11 border border-gray-300 rounded p-2 text-gray-900"
                    value={dataInicio}
                    onChange={(e) => setDataInicio(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <p className="mb-1 text-gray-700 font-medium">
                  Fim (Previsto):
                </p>
                <input
                  type="date"
                  className="w-full h-11 border border-gray-300 rounded p-2 text-gray-900"
                  value={dataFim}
                  onChange={(e) => setDataFim(e.target.value)}
                />
              </div>
              <div>
                <p className="mb-1 text-gray-700 font-medium">Resumo: *</p>
                <textarea
                  required
                  rows={4}
                  className="w-full border border-gray-300 rounded p-3 text-gray-900"
                  value={resumo}
                  onChange={(e) => setResumo(e.target.value)}
                />
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3">
                <div className="flex justify-between items-center border-b pb-2 mb-2">
                  <p className="font-bold text-gray-700">Anexos</p>
                  <span className="text-xs text-gray-500">
                    {arquivosParaEnviar.length} arquivo(s)
                  </span>
                </div>
                <div className="relative">
                  <input
                    id="fileInput"
                    type="file"
                    multiple
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={(e) => adicionarArquivos(e.target.files)}
                  />
                  <div className="w-full h-10 bg-white border border-dashed border-gray-400 rounded flex items-center justify-center gap-2 text-gray-600 hover:bg-gray-100 transition-colors">
                    <span className="text-sm font-medium">
                      Clique para adicionar anexos
                    </span>
                  </div>
                </div>
                {arquivosParaEnviar.length > 0 && (
                  <div className="space-y-2 mt-2 max-h-40 overflow-y-auto pr-1">
                    {arquivosParaEnviar.map((arq, _index) => (
                      <div
                        key={`${arq.name}-${arq.lastModified}`}
                        className="flex items-center justify-between bg-white p-2 rounded border border-gray-200 text-sm"
                      >
                        <span className="text-gray-700 truncate w-3/4">
                          {arq.name}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setArquivosParaEnviar((prev) =>
                              prev.filter(
                                (f) =>
                                  !(
                                    f.name === arq.name &&
                                    f.lastModified === arq.lastModified
                                  ),
                              ),
                            )
                          }
                          className="text-red-500 font-bold px-2"
                        >
                          X
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-teal-600 text-white rounded hover:bg-teal-700 disabled:opacity-50 font-bold shadow-md transition-all uppercase tracking-wide text-lg flex items-center justify-center gap-2"
              >
                {loading ? loadingText : "Cadastrar Projeto"}
              </button>
            </form>
          </div>

          {/* Lista Simples */}
          <div className="flex-1 bg-gray-100 flex flex-col overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-white shadow-sm z-10">
              <h3
                className={`${inriaSerif700.className} text-gray-800 text-2xl`}
              >
                Projetos Criados
              </h3>
              <p className="text-sm text-gray-500">Total: {projetos.length}</p>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-3 custom-scrollbar">
              {carregandoLista ? (
                <div className="text-center p-4 text-gray-400">
                  Carregando...
                </div>
              ) : projetos.length === 0 ? (
                <div className="text-center p-4 text-gray-400 border-2 border-dashed rounded-lg">
                  Nada aqui.
                </div>
              ) : (
                projetos.map((proj) => (
                  <div
                    key={proj.idProjeto}
                    className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-3 h-3 rounded-full ${proj.situacao === "Ativo" ? "bg-green-500" : proj.situacao === "Concluido" ? "bg-blue-500" : "bg-gray-400"}`}
                      ></div>
                      <h4 className="font-bold text-gray-800 text-lg group-hover:text-teal-700 transition-colors">
                        {proj.nome}
                      </h4>
                    </div>
                    <Link
                      href={`/projetos`}
                      className="bg-teal-600 text-white text-sm px-6 py-2.5 rounded hover:bg-teal-700 transition-colors font-medium shadow-sm flex items-center gap-2"
                    >
                      Gerenciar
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
