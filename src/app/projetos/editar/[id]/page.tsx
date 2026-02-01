"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Inria_Serif } from "next/font/google";
import { supabase } from "@/lib/supabase/browser/supabaseClient";
import Link from "next/link";

const inriaSerif700 = Inria_Serif({ subsets: ["latin"], weight: ["700"] });

export default function EditarProjeto() {
  const params = useParams();
  const router = useRouter();
  const idProjeto = Number(params.id);

  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [loadingText, setLoadingText] = useState("Salvando...");

  const [nome, setNome] = useState("");
  const [resumo, setResumo] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState(""); // <-- Novo estado aqui
  const [situacao, setSituacao] = useState("Ativo");
  const [anexosExistentes, setAnexosExistentes] = useState<string[]>([]);
  const [arquivosNovos, setArquivosNovos] = useState<File[]>([]);

  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "success",
  });

  const showToast = useCallback((msg: string, type = "success") => {
    setToast({ visible: true, message: msg, type });
    setTimeout(
      () => setToast({ visible: false, message: "", type: "success" }),
      3500,
    );
  }, []);

  useEffect(() => {
    async function carregarProjeto() {
      try {
        const res = await fetch(`/api/cadastro_projetos`);
        const projetos = await res.json();
        const p = projetos.find((proj: any) => proj.idProjeto === idProjeto);

        if (p) {
          setNome(p.nome);
          setResumo(p.resumo);
          setSituacao(p.situacao);
          setDataInicio(p.dataInicio.split("T")[0]);
          setDataFim(p.dataFim ? p.dataFim.split("T")[0] : ""); // Trata data fim se existir
          setAnexosExistentes(p.anexos || []);
        }
      } catch (error) {
        showToast("Erro ao carregar projeto", "error");
      } finally {
        setLoading(false);
      }
    }
    carregarProjeto();
  }, [idProjeto, showToast]);

  const adicionarArquivos = (files: FileList | null) => {
    if (!files) return;
    setArquivosNovos((prev) => [...prev, ...Array.from(files)]);
  };

  const removerAnexoExistente = (index: number) => {
    setAnexosExistentes((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadArquivoSupabase = async (file: File) => {
    const nomeLimpo = file.name.replace(/[^a-zA-Z0-9.]/g, "_");
    const fileName = `${Date.now()}_${nomeLimpo}`;
    const { error: uploadError } = await supabase.storage
      .from("documentos-projetos")
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const {
      data: { publicUrl },
    } = supabase.storage.from("documentos-projetos").getPublicUrl(fileName);
    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSalvando(true);

    try {
      const urlsNovas: string[] = [];
      for (let i = 0; i < arquivosNovos.length; i++) {
        setLoadingText(`Subindo anexo ${i + 1}/${arquivosNovos.length}...`);
        const url = await uploadArquivoSupabase(arquivosNovos[i]);
        if (url) urlsNovas.push(url);
      }

      const todosAnexos = [...anexosExistentes, ...urlsNovas];

      const payload = {
        idProjeto,
        nome,
        resumo,
        dataInicio,
        dataFim: dataFim || null, // Manda null se estiver vazio
        situacao,
        anexos: todosAnexos,
      };

      setLoadingText("Atualizando banco...");
      const res = await fetch("/api/cadastro_projetos", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        showToast("Projeto atualizado!", "success");
        router.push(`/projetos/${idProjeto}`);
      } else {
        const data = await res.json();
        showToast(data.error || "Erro ao salvar", "error");
      }
    } catch (err) {
      showToast("Erro na conexão", "error");
    } finally {
      setSalvando(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center font-bold">
        CARREGANDO...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 pb-20 text-gray-900">
      {toast.visible && (
        <div
          className={`fixed top-4 left-1/2 -translate-x-1/2 px-6 py-3 rounded-md shadow-lg z-50 transition-all ${toast.type === "success" ? "bg-teal-500 text-white" : "bg-red-500 text-white"}`}
        >
          {toast.message}
        </div>
      )}

      <div className="bg-white border-b border-gray-200 mb-8 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-6 flex justify-between items-center">
          <Link
            href={`/projetos/${idProjeto}`}
            className="text-teal-600 font-bold uppercase text-sm"
          >
            ← Cancelar
          </Link>
          <h1 className={`${inriaSerif700.className} text-2xl uppercase`}>
            Editar Projeto
          </h1>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-lg border border-gray-300 p-8 space-y-6"
        >
          <div>
            <p className="mb-1 text-gray-700 font-bold uppercase text-xs">
              Nome do Projeto:
            </p>
            <input
              required
              type="text"
              className="w-full h-12 border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-teal-500"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="mb-1 text-gray-700 font-bold uppercase text-xs">
                Situação:
              </p>
              <select
                className="w-full h-12 border border-gray-300 rounded-lg p-2 bg-white outline-none focus:ring-2 focus:ring-teal-500"
                value={situacao}
                onChange={(e) => setSituacao(e.target.value)}
              >
                <option value="Ativo">Ativo</option>
                <option value="Inativo">Inativo</option>
                <option value="Concluido">Concluído</option>
              </select>
            </div>
            <div>
              <p className="mb-1 text-gray-700 font-bold uppercase text-xs">
                Data de Início:
              </p>
              <input
                required
                type="date"
                className="w-full h-12 border border-gray-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-teal-500"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
              />
            </div>
          </div>

          <div>
            <p className="mb-1 text-gray-700 font-bold uppercase text-xs">
              Data de Término (Previsto):
            </p>
            <input
              type="date"
              className="w-full h-12 border border-gray-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-teal-500"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
            />
          </div>

          {/* GERENCIAR ANEXOS */}
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 space-y-4">
            <p className="font-bold text-gray-700 border-b pb-2 text-md uppercase">
              Gerenciar Anexos
            </p>

            {anexosExistentes.length > 0 && (
              <div className="space-y-2">
                {anexosExistentes.map((url, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200 text-sm shadow-sm"
                  >
                    <span className="truncate w-4/5 text-teal-700 font-medium">
                      📄 {url.split("/").pop()}
                    </span>
                    <button
                      type="button"
                      onClick={() => removerAnexoExistente(index)}
                      className="text-red-500 font-bold px-2 hover:scale-110 transition-transform"
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="relative mt-4">
              <input
                id="fileInput"
                type="file"
                multiple
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={(e) => adicionarArquivos(e.target.files)}
              />
              <div className="w-full h-12 bg-white border border-dashed border-teal-400 rounded-lg flex items-center justify-center gap-2 text-teal-600 hover:bg-teal-50 transition-colors">
                <span className="font-bold text-sm">
                  + ANEXAR NOVO DOCUMENTO
                </span>
              </div>
            </div>

            {arquivosNovos.length > 0 && (
              <div className="space-y-2 mt-2">
                {arquivosNovos.map((arq, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-teal-50 p-2 rounded border border-teal-100 text-xs"
                  >
                    <span className="italic text-teal-800">
                      {arq.name} (Pronto para subir)
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setArquivosNovos((prev) =>
                          prev.filter((_, i) => i !== index),
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

          <div>
            <p className="mb-1 text-gray-700 font-bold uppercase text-xs">
              Resumo do Projeto:
            </p>
            <textarea
              required
              rows={6}
              className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-teal-500 resize-none"
              value={resumo}
              onChange={(e) => setResumo(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={salvando}
            className="w-full h-14 bg-teal-600 text-white rounded-xl hover:bg-teal-700 disabled:opacity-50 font-bold shadow-lg transition-all text-lg uppercase tracking-wider"
          >
            {salvando ? loadingText : "Salvar Alterações"}
          </button>
        </form>
      </div>
    </div>
  );
}
