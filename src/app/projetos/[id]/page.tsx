"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Inria_Serif } from "next/font/google";
import { supabase } from "@/lib/supabase/browser/supabaseClient";
import Link from "next/link";

const inriaSerif700 = Inria_Serif({ subsets: ["latin"], weight: ["700"] });

// --- TIPAGENS ---
type ParticipacaoDetalhada = {
  idParticipa: number;
  motivo: string;
  situacao: string;
  motivoSituacao?: string;
  usuario: { idUsuario: number; nome: string; foto?: string };
};

type Projeto = {
  idProjeto: number;
  nome: string;
  resumo: string;
  dataInicio: string;
  dataFim: string | null;
  situacao: string;
  criador: { idUsuario: number; nome: string; foto?: string };
  anexos: string[];
  participacoes?: ParticipacaoDetalhada[];
};

type Usuario = {
  idUsuario: number;
  nome: string;
  email: string;
  foto?: string;
  admin: boolean;
};

export default function DetalhesProjeto() {
  const params = useParams();
  const router = useRouter();
  const idProjeto = Number(params.id);

  const [projeto, setProjeto] = useState<Projeto | null>(null);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [participacoes, setParticipacoes] = useState<ParticipacaoDetalhada[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [modalSolicitacao, setModalSolicitacao] = useState(false);
  const [motivoSolicitacao, setMotivoSolicitacao] = useState("");
  const [modalAprovarNegar, setModalAprovarNegar] = useState(false);
  const [solicitacaoSelecionada, setSolicitacaoSelecionada] =
    useState<ParticipacaoDetalhada | null>(null);
  const [motivoDecisao, setMotivoDecisao] = useState("");
  const [decisao, setDecisao] = useState<"Autorizado" | "Negado">("Autorizado");
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "success" as "success" | "error",
  });

  const showToast = useCallback(
    (msg: string, type: "success" | "error" = "success") => {
      setToast({ visible: true, message: msg, type });
      setTimeout(() => setToast((prev) => ({ ...prev, visible: false })), 3500);
    },
    [],
  );

  // Função para formatar data BR (ex: 31/01/2026)
  const formatarData = (dataStr: string | null) => {
    if (!dataStr) return null;
    const data = new Date(dataStr);
    return data.toLocaleDateString("pt-BR");
  };

  const carregarDados = useCallback(async () => {
    try {
      const resProj = await fetch(
        `/api/projetos/${idProjeto}?include=participacoes`,
      );
      if (resProj.ok) {
        const dadosProj = await resProj.json();
        setProjeto(dadosProj);
        if (dadosProj.participacoes) setParticipacoes(dadosProj.participacoes);
      } else {
        return router.push("/projetos");
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        const resUsuario = await fetch("/api/usuarios/me");
        if (resUsuario.ok) setUsuario(await resUsuario.json());
      }
    } catch (error) {
      showToast("Erro ao carregar dados", "error");
    } finally {
      setLoading(false);
    }
  }, [idProjeto, router, showToast]);

  useEffect(() => {
    if (idProjeto) carregarDados();
  }, [idProjeto, carregarDados]);

  const enviarSolicitacao = async () => {
    if (!usuario) return showToast("Faça login para solicitar", "error");
    if (!motivoSolicitacao.trim())
      return showToast("Diga o motivo da solicitação", "error");

    try {
      const res = await fetch("/api/solicitar_participacao", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idProjeto,
          idUsuario: usuario.idUsuario,
          motivo: motivoSolicitacao,
        }),
      });

      if (res.ok) {
        showToast("Solicitação enviada!");
        setModalSolicitacao(false);
        setMotivoSolicitacao("");
        carregarDados();
      } else {
        const err = await res.json();
        showToast(err.error || "Erro ao solicitar", "error");
      }
    } catch (e) {
      showToast("Erro de conexão", "error");
    }
  };

  const processarSolicitacao = async () => {
    if (!solicitacaoSelecionada) return;
    try {
      const res = await fetch("/api/solicitacoes", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idParticipa: solicitacaoSelecionada.idParticipa,
          novaSituacao: decisao,
          motivoSituacao: motivoDecisao || null,
        }),
      });
      if (res.ok) {
        showToast(
          `Solicitação ${decisao === "Autorizado" ? "aprovada" : "negada"}!`,
        );
        setModalAprovarNegar(false);
        setMotivoDecisao("");
        carregarDados();
      }
    } catch (e) {
      showToast("Erro ao processar", "error");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  if (!projeto) return null;

  const minhaPart = participacoes.find(
    (p) => p.usuario?.idUsuario === usuario?.idUsuario,
  );
  const isMembroAutorizado =
    usuario?.admin ||
    projeto.criador?.idUsuario === usuario?.idUsuario ||
    minhaPart?.situacao === "Autorizado";

  return (
    <>
      {/* TOAST */}
      {toast.visible && (
        <div
          className={`fixed top-4 left-1/2 -translate-x-1/2 px-6 py-3 rounded-md shadow-lg z-[100] text-white font-bold ${toast.type === "success" ? "bg-teal-500" : "bg-red-500"}`}
        >
          {toast.message}
        </div>
      )}

      {/* ... (MODAIS permanecem iguais) ... */}
      {modalSolicitacao && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 text-gray-900">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <h3 className={`${inriaSerif700.className} text-xl mb-4`}>
              Solicitar Participação
            </h3>
            <textarea
              value={motivoSolicitacao}
              onChange={(e) => setMotivoSolicitacao(e.target.value)}
              rows={4}
              className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Explique por que quer entrar..."
            />
            <div className="flex gap-3 justify-end mt-4">
              <button
                onClick={() => setModalSolicitacao(false)}
                className="px-4 py-2 bg-gray-100 rounded-lg"
              >
                Cancelar
              </button>
              <button
                onClick={enviarSolicitacao}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg font-bold"
              >
                Enviar
              </button>
            </div>
          </div>
        </div>
      )}

      {modalAprovarNegar && solicitacaoSelecionada && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm text-gray-900">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
            <h3 className={`${inriaSerif700.className} text-xl mb-4`}>
              Avaliar Candidato
            </h3>
            <p className="mb-4 text-sm text-gray-600 italic">
              "{solicitacaoSelecionada.motivo}"
            </p>
            <div className="flex gap-3 mb-4">
              <button
                onClick={() => setDecisao("Autorizado")}
                className={`flex-1 py-3 rounded-lg font-bold ${decisao === "Autorizado" ? "bg-green-100 border-2 border-green-500 text-green-700" : "bg-gray-100 text-gray-400"}`}
              >
                Aprovar
              </button>
              <button
                onClick={() => setDecisao("Negado")}
                className={`flex-1 py-3 rounded-lg font-bold ${decisao === "Negado" ? "bg-red-100 border-2 border-red-500 text-red-700" : "bg-gray-100 text-gray-400"}`}
              >
                Negar
              </button>
            </div>
            <textarea
              value={motivoDecisao}
              onChange={(e) => setMotivoDecisao(e.target.value)}
              rows={2}
              className="w-full border border-gray-300 p-3 rounded-lg outline-none focus:ring-2 focus:ring-teal-500 text-gray-800"
              placeholder="Motivo/Feedback..."
            />
            <div className="flex gap-3 justify-end mt-6">
              <button
                onClick={() => setModalAprovarNegar(false)}
                className="px-4 py-2 bg-gray-100 rounded-lg"
              >
                Sair
              </button>
              <button
                onClick={processarSolicitacao}
                className={`px-4 py-2 rounded-lg text-white font-bold ${decisao === "Autorizado" ? "bg-green-600" : "bg-red-600"}`}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
            <Link href="/projetos" className="text-teal-600 font-medium">
              ← Voltar
            </Link>
            <h1 className={`${inriaSerif700.className} text-2xl text-gray-900`}>
              {projeto.nome}
            </h1>
            <div className="w-10 h-10 invisible md:block"></div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border p-8">
              <h3 className="text-2xl font-bold mb-4 text-gray-900">
                Sobre o Projeto
              </h3>
              <p className="text-gray-700 whitespace-pre-line text-lg mb-8">
                {projeto.resumo}
              </p>

              {isMembroAutorizado && (
                <div className="space-y-8 border-t pt-8">
                  {/* ANEXOS */}
                  {projeto.anexos && projeto.anexos.length > 0 && (
                    <div>
                      <h3 className="text-xl font-bold mb-4 text-gray-900">
                        Arquivos do Projeto
                      </h3>
                      <div className="grid grid-cols-1 gap-2">
                        {projeto.anexos.map((url, i) => (
                          <a
                            key={i}
                            href={url}
                            target="_blank"
                            download
                            className="flex items-center justify-between p-4 bg-teal-50 border border-teal-100 rounded-xl hover:bg-teal-100 transition-all group"
                          >
                            <span className="text-sm font-medium text-teal-900">
                              📎 Baixar Anexo {i + 1}
                            </span>
                            <span className="text-teal-600 text-xs font-bold uppercase">
                              Download
                            </span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* TIME */}
                  <div>
                    <h3 className="text-xl font-bold mb-4 text-gray-900">
                      Membros do Time
                    </h3>
                    <div className="flex flex-wrap gap-4">
                      {participacoes
                        .filter((p) => p.situacao === "Autorizado")
                        .map((p) => (
                          <div
                            key={p.idParticipa}
                            className="flex items-center gap-2 p-2 bg-white border rounded-full pr-4 shadow-sm"
                          >
                            <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100">
                              {p.usuario.foto ? (
                                <img
                                  src={p.usuario.foto}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <span className="flex items-center justify-center h-full text-xs">
                                  👤
                                </span>
                              )}
                            </div>
                            <span className="text-sm font-bold text-gray-800">
                              {p.usuario.nome}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            {/* CARD DE STATUS */}
            {!usuario?.admin && projeto.situacao === "Ativo" && (
              <div className="bg-white rounded-2xl shadow-lg border p-6">
                <h4 className="text-xs font-bold text-gray-400 uppercase mb-4 border-b pb-2">
                  Participação
                </h4>
                {minhaPart?.situacao === "Solicitado" ? (
                  <div className="p-4 bg-amber-50 text-amber-700 border border-amber-200 rounded-xl text-center font-bold uppercase text-sm tracking-tight">
                    ⏳ Aguardando Resposta
                  </div>
                ) : minhaPart?.situacao === "Autorizado" ? (
                  <div className="p-4 bg-green-50 text-green-700 border border-green-200 rounded-xl text-center font-bold uppercase text-sm tracking-tight">
                    ✅ Participação Aceita
                  </div>
                ) : minhaPart?.situacao === "Negado" ? (
                  <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-xl text-center">
                    <p className="font-bold uppercase text-sm tracking-tight">
                      ❌ Participação Recusada
                    </p>
                    {minhaPart.motivoSituacao && (
                      <p className="text-xs mt-2 italic text-red-600 font-medium">
                        Motivo: "{minhaPart.motivoSituacao}"
                      </p>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => setModalSolicitacao(true)}
                    className="w-full bg-teal-600 text-white font-bold py-4 rounded-xl hover:bg-teal-700 transition-all"
                  >
                    PEDIR PARA PARTICIPAR
                  </button>
                )}
              </div>
            )}

            {/* PAINEL ADMIN */}
            {usuario?.admin && (
              <div className="space-y-4">
                <button
                  onClick={() =>
                    router.push(`/projetos/editar/${projeto.idProjeto}`)
                  }
                  className="w-full bg-amber-500 text-white py-4 rounded-xl font-bold shadow-md hover:bg-amber-600"
                >
                  ✏️ Editar Projeto
                </button>
                <h4 className="font-bold text-gray-400 text-xs uppercase px-2">
                  Pedidos de entrada
                </h4>
                {participacoes.filter((p) => p.situacao === "Solicitado")
                  .length === 0 && (
                  <p className="text-xs text-gray-400 px-2 italic">
                    Nenhum pedido.
                  </p>
                )}
                {participacoes
                  .filter((p) => p.situacao === "Solicitado")
                  .map((p) => (
                    <div
                      key={p.idParticipa}
                      className="p-4 bg-white border-2 border-teal-100 rounded-2xl shadow-sm"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100">
                          {p.usuario.foto && (
                            <img
                              src={p.usuario.foto}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <p className="font-bold text-sm text-gray-800">
                          {p.usuario.nome}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setSolicitacaoSelecionada(p);
                          setModalAprovarNegar(true);
                        }}
                        className="w-full py-2 bg-teal-500 text-white text-xs font-bold rounded-lg hover:bg-teal-600"
                      >
                        Analisar Pedido
                      </button>
                    </div>
                  ))}
              </div>
            )}

            {/* CARD DE DETALHES - COM DATAS */}
            <div className="bg-white rounded-2xl shadow-lg border p-6">
              <h4 className="text-xs font-bold text-gray-400 uppercase mb-4 border-b pb-2 tracking-widest">
                Informações
              </h4>
              <div className="space-y-4">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase font-bold text-gray-400">
                    Status
                  </span>
                  <span
                    className={`text-sm font-bold ${projeto.situacao === "Ativo" ? "text-green-600" : "text-amber-600"}`}
                  >
                    {projeto.situacao}
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase font-bold text-gray-400">
                    📅 Data de Início
                  </span>
                  <span className="text-sm font-bold text-gray-900">
                    {formatarData(projeto.dataInicio)}
                  </span>
                </div>

                {projeto.dataFim && (
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] uppercase font-bold text-gray-400">
                      🏁 Término Previsto
                    </span>
                    <span className="text-sm font-bold text-gray-900">
                      {formatarData(projeto.dataFim)}
                    </span>
                  </div>
                )}

                <div className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase font-bold text-gray-400">
                    Responsável
                  </span>
                  <span className="text-sm font-bold text-gray-900">
                    {projeto.criador.nome}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
