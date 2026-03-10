"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Inria_Serif } from "next/font/google";
import { supabase } from "@/lib/supabase/browser/supabaseClient";
import Link from "next/link";

const inriaSerif700 = Inria_Serif({ subsets: ["latin"], weight: ["700"] });

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
  const [participacoes, setParticipacoes] = useState<ParticipacaoDetalhada[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalSolicitacao, setModalSolicitacao] = useState(false);
  const [motivoSolicitacao, setMotivoSolicitacao] = useState("");
  const [modalDecisao, setModalDecisao] = useState(false);
  const [solicitacaoAlvo, setSolicitacaoAlvo] = useState<ParticipacaoDetalhada | null>(null);
  const [motivoNegativa, setMotivoNegativa] = useState("");

  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "success",
  });

  const showToast = useCallback((msg: string, type = "success") => {
    setToast({ visible: true, message: msg, type });
    setTimeout(() => setToast({ visible: false, message: "", type: "success" }), 3500);
  }, []);

  const carregarDados = useCallback(async () => {
    try {
      const resProj = await fetch(`/api/projetos/${idProjeto}?include=participacoes`);
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
        const resUsuario = await fetch(`/api/usuarios/me?idAuth=${session.user.id}`);
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

  const processarAcaoAdmin = async (acao: "entrar" | "sair" | "remover", idUsuarioRemover?: number) => {
    try {
      if (!usuario?.idUsuario) return showToast("Usuário não identificado", "error");

      if (acao === "entrar") {
        await fetch("/api/solicitar_participacao", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            idProjeto,
            idUsuario: usuario.idUsuario,
            motivo: "Acesso direto Admin",
            situacaoManual: "Autorizado",
          }),
        });
      } else {
        const idAlvo = acao === "remover" ? idUsuarioRemover : usuario.idUsuario;
        if (!idAlvo) return showToast("Usuário alvo não identificado", "error");
        await fetch(`/api/solicitar_participacao?idProjeto=${idProjeto}&idUsuario=${idAlvo}`, { method: "DELETE" });
      }
      showToast("Sucesso!");
      carregarDados();
    } catch (e) {
      showToast("Erro na ação", "error");
    }
  };

  const responderSolicitacao = async (status: "Autorizado" | "Negado") => {
    if (!solicitacaoAlvo) return;
    try {
      const res = await fetch("/api/solicitar_participacao", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idParticipa: solicitacaoAlvo.idParticipa,
          situacao: status,
          motivoSituacao: motivoNegativa,
        }),
      });

      if (res.ok) {
        showToast(`Candidato ${status === "Autorizado" ? "Aprovado" : "Recusado"}!`);
        setModalDecisao(false);
        setSolicitacaoAlvo(null);
        setMotivoNegativa("");
        carregarDados();
      } else {
        showToast("Erro ao processar decisão.", "error");
      }
    } catch (e) {
      showToast("Erro de conexão", "error");
    }
  };

  const enviarSolicitacao = async () => {
    if (!motivoSolicitacao.trim()) return showToast("Diga o motivo!", "error");
    if (!usuario?.idUsuario) return showToast("Você precisa estar logado!", "error");
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
      }
    } catch (e) {
      showToast("Erro ao enviar", "error");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center font-bold uppercase tracking-widest">
        Carregando...
      </div>
    );
  if (!projeto) return null;

  const minhaPart = participacoes.find((p) => p.usuario?.idUsuario === usuario?.idUsuario);

  const isMembroAutorizado = usuario?.admin || minhaPart?.situacao === "Autorizado";

  const solicitacoesPendentes = participacoes.filter((p) => p.situacao === "Solicitado");

  return (
    <>
      {toast.visible && (
        <div
          className={`fixed top-4 left-1/2 -translate-x-1/2 px-6 py-3 rounded-md shadow-lg z-[100] text-white font-bold ${toast.type === "success" ? "bg-teal-500" : "bg-red-500"}`}
        >
          {toast.message}
        </div>
      )}

      {}
      {modalSolicitacao && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md p-8 shadow-2xl border border-gray-200">
            <h3 className={`${inriaSerif700.className} text-2xl mb-4 uppercase tracking-tighter`}>Solicitar Vaga</h3>
            <textarea
              value={motivoSolicitacao}
              onChange={(e) => setMotivoSolicitacao(e.target.value)}
              rows={5}
              className="w-full border border-gray-300 p-4 rounded-xl outline-none focus:ring-2 focus:ring-teal-500 resize-none text-gray-800"
              placeholder="Por que você quer entrar?"
            />
            <div className="flex gap-3 justify-end mt-6">
              <button
                onClick={() => setModalSolicitacao(false)}
                className="px-6 py-3 bg-gray-100 rounded-xl font-bold text-xs uppercase text-gray-500"
              >
                Cancelar
              </button>
              <button
                onClick={enviarSolicitacao}
                className="px-6 py-3 bg-teal-600 text-white rounded-xl font-bold text-xs uppercase shadow-md"
              >
                Enviar Pedido
              </button>
            </div>
          </div>
        </div>
      )}

      {}
      {modalDecisao && solicitacaoAlvo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl w-full max-w-md p-6 text-gray-900 border shadow-2xl">
            <h3 className="font-bold text-lg mb-2 underline tracking-tighter uppercase text-teal-700">
              Avaliar Candidato
            </h3>
            <div className="flex items-center gap-3 mb-4 bg-gray-50 p-3 rounded-lg border border-gray-200">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 border">
                {solicitacaoAlvo.usuario.foto ? (
                  <img src={solicitacaoAlvo.usuario.foto} className="w-full h-full object-cover" />
                ) : (
                  <span className="flex items-center justify-center h-full text-xl font-bold">👤</span>
                )}
              </div>
              <span className="font-bold text-gray-800">{solicitacaoAlvo.usuario.nome}</span>
            </div>
            <p className="text-sm text-gray-600 mb-4 italic">"{solicitacaoAlvo.motivo}"</p>
            <textarea
              value={motivoNegativa}
              onChange={(e) => setMotivoNegativa(e.target.value)}
              placeholder="Motivo da negativa (opcional)..."
              className="w-full border p-2 rounded-lg text-sm mb-4 outline-none focus:ring-2 focus:ring-teal-500"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setModalDecisao(false)}
                className="flex-1 py-3 bg-gray-100 rounded-xl font-bold uppercase text-[10px]"
              >
                Voltar
              </button>
              <button
                onClick={() => responderSolicitacao("Negado")}
                className="flex-1 py-3 bg-red-100 text-red-600 rounded-xl font-bold uppercase text-[10px]"
              >
                Negar
              </button>
              <button
                onClick={() => responderSolicitacao("Autorizado")}
                className="flex-1 py-3 bg-teal-600 text-white rounded-xl font-bold uppercase text-[10px]"
              >
                Aprovar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gray-50 pb-20 text-gray-900">
        <div className="bg-white border-b py-6 px-4 shadow-sm border-gray-200">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <Link
              href="/projetos"
              className="text-teal-600 font-bold uppercase text-xs tracking-widest hover:underline"
            >
              ← Voltar
            </Link>
            <h1 className={`${inriaSerif700.className} text-2xl uppercase tracking-tighter text-gray-800`}>
              {projeto.nome}
            </h1>
            <div className="w-12"></div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border p-8 border-gray-300">
              <h3 className="text-2xl font-bold mb-4 uppercase tracking-tighter text-teal-800">Sobre o Projeto</h3>
              <p className="text-gray-700 whitespace-pre-line leading-relaxed mb-8 text-lg">{projeto.resumo}</p>

              <div className="mt-8 pt-8 border-t space-y-8 border-gray-200">
                {}
                <div>
                  <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6">
                    Equipe do Projeto
                  </h4>
                  <div className="flex flex-wrap gap-6">
                    {participacoes
                      .filter((p) => p.situacao === "Autorizado")
                      .map((p) => (
                        <div
                          key={p.idParticipa}
                          className="flex items-center gap-3 bg-white border px-4 py-2 rounded-full shadow-sm border-gray-200 relative"
                        >
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 border border-gray-200">
                            {p.usuario.foto ? (
                              <img src={p.usuario.foto} className="w-full h-full object-cover" />
                            ) : (
                              <span className="flex items-center justify-center h-full text-xs font-bold text-gray-400">
                                👤
                              </span>
                            )}
                          </div>
                          <span className="text-sm font-bold text-gray-700">{p.usuario.nome}</span>
                          {usuario?.admin && (
                            <button
                              onClick={() => processarAcaoAdmin("remover", p.usuario.idUsuario)}
                              className="ml-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px] hover:bg-red-700 font-bold transition-all shadow-md"
                            >
                              X
                            </button>
                          )}
                        </div>
                      ))}
                  </div>
                </div>

                {}
                {isMembroAutorizado && projeto.anexos && projeto.anexos.length > 0 && (
                  <div className="border-t pt-8 border-gray-100">
                    <h4 className="text-[10px] font-bold text-teal-600 uppercase tracking-widest mb-4">
                      📎 Documentação Restrita
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                      {projeto.anexos.map((url, i) => (
                        <a
                          key={i}
                          href={url}
                          target="_blank"
                          className="flex items-center justify-between p-5 bg-teal-50 border border-teal-100 rounded-2xl hover:bg-teal-100 transition-all group"
                        >
                          <span className="text-sm font-bold text-teal-900 uppercase">Documento de Apoio {i + 1}</span>
                          <span className="text-teal-600 text-[10px] font-bold uppercase underline tracking-tighter group-hover:scale-110 transition-transform">
                            Baixar Arquivo
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {}
            {usuario?.admin && (
              <div className="bg-white rounded-3xl shadow-xl border-2 border-teal-500 p-6 space-y-6">
                <div>
                  <h4 className="text-[10px] font-bold text-teal-600 uppercase tracking-widest mb-4 border-b pb-2 text-center font-black">
                    Painel de Gestão
                  </h4>
                  <button
                    onClick={() => router.push(`/projetos/editar/${projeto.idProjeto}`)}
                    className="w-full bg-amber-500 text-white py-4 rounded-2xl font-bold uppercase text-xs shadow-md mb-2 hover:bg-amber-600 transition-all"
                  >
                    ✏️ Editar Projeto
                  </button>
                  {minhaPart?.situacao === "Autorizado" ? (
                    <button
                      onClick={() => processarAcaoAdmin("sair")}
                      className="w-full bg-red-50 text-red-600 border border-red-200 py-4 rounded-2xl font-bold uppercase text-xs hover:bg-red-100 transition-all"
                    >
                      Sair da Equipe
                    </button>
                  ) : (
                    <button
                      onClick={() => processarAcaoAdmin("entrar")}
                      className="w-full bg-teal-600 text-white py-4 rounded-2xl font-bold uppercase text-xs hover:bg-teal-700 shadow-lg transition-all"
                    >
                      Entrar na Equipe
                    </button>
                  )}
                </div>

                {}
                {solicitacoesPendentes.length > 0 && (
                  <div className="pt-4 border-t border-teal-100">
                    <h5 className="text-[10px] font-black text-gray-500 uppercase mb-4 text-center tracking-widest">
                      Pendentes de Avaliação ({solicitacoesPendentes.length})
                    </h5>
                    <div className="space-y-3">
                      {solicitacoesPendentes.map((s) => (
                        <div
                          key={s.idParticipa}
                          className="p-4 bg-gray-50 rounded-2xl border flex flex-col gap-3 border-gray-200 shadow-sm"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 border">
                              {s.usuario.foto ? (
                                <img src={s.usuario.foto} className="w-full h-full object-cover" />
                              ) : (
                                <span className="flex items-center justify-center h-full text-[10px] font-bold">
                                  👤
                                </span>
                              )}
                            </div>
                            <span className="text-xs font-bold text-gray-700">{s.usuario.nome}</span>
                          </div>
                          <button
                            onClick={() => {
                              setSolicitacaoAlvo(s);
                              setModalDecisao(true);
                            }}
                            className="text-[10px] bg-white border-teal-500 border text-teal-600 py-2.5 rounded-xl font-bold uppercase hover:bg-teal-500 hover:text-white transition-all shadow-sm"
                          >
                            Analisar Candidato
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {}
            {!usuario?.admin && (
              <div className="bg-white rounded-3xl shadow-lg border p-6 border-gray-300">
                <h4 className="text-[10px] font-bold text-gray-400 uppercase mb-4 border-b pb-2 tracking-widest">
                  Status da Participação
                </h4>
                {minhaPart?.situacao === "Solicitado" ? (
                  <div className="p-5 bg-amber-50 text-amber-700 border border-amber-200 rounded-2xl text-center font-bold text-xs uppercase italic animate-pulse">
                    ⏳ Aguardando Aprovação
                  </div>
                ) : minhaPart?.situacao === "Autorizado" ? (
                  <div className="p-5 bg-green-50 text-green-700 border border-green-200 rounded-2xl text-center font-bold text-xs uppercase">
                    ✅ Você é Integrante
                  </div>
                ) : minhaPart?.situacao === "Negado" ? (
                  <div className="p-5 bg-red-50 text-red-700 border border-red-200 rounded-2xl text-center">
                    <p className="font-bold text-xs uppercase">❌ Participação Recusada</p>
                    {minhaPart.motivoSituacao && (
                      <p className="text-[10px] mt-2 italic opacity-80 leading-tight">"{minhaPart.motivoSituacao}"</p>
                    )}
                    <button
                      onClick={() => setModalSolicitacao(true)}
                      className="mt-4 text-[9px] underline font-black uppercase text-red-800"
                    >
                      Tentar Novamente
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setModalSolicitacao(true)}
                    className="w-full bg-teal-600 text-white font-bold py-5 rounded-2xl hover:bg-teal-700 shadow-md uppercase text-sm tracking-tighter transition-all"
                  >
                    Quero Fazer Parte
                  </button>
                )}
              </div>
            )}

            <div className="bg-white rounded-3xl shadow-sm border p-6 text-sm border-gray-300">
              <h4 className="text-[10px] font-bold text-gray-400 uppercase mb-4 border-b pb-2 tracking-widest">
                Informações Técnicas
              </h4>
              <div className="space-y-4">
                <div className="flex justify-between uppercase text-[10px] font-medium items-center">
                  <span className="text-gray-400">Status</span>
                  <span
                    className={`font-bold tracking-widest px-2 py-1 rounded-md ${
                      projeto.situacao === "Concluido"
                        ? "bg-blue-50 text-blue-600"
                        : projeto.situacao === "Ativo"
                          ? "bg-green-50 text-green-600"
                          : projeto.situacao === "Inativo"
                            ? "bg-red-50 text-red-600"
                            : "text-orange-600 bg-orange-50"
                    }`}
                  >
                    {projeto.situacao === "Concluido" ? "Projeto Concluído" : projeto.situacao}
                  </span>
                </div>
                <div className="flex justify-between uppercase text-[10px] font-medium">
                  <span className="text-gray-400">Início</span>
                  <span className="font-bold text-gray-800">{new Date(projeto.dataInicio).toLocaleDateString()}</span>
                </div>
                {projeto.dataFim && (
                  <div className="flex justify-between uppercase text-[10px] font-medium">
                    <span className="text-gray-400">Término</span>
                    <span className="font-bold text-gray-800">{new Date(projeto.dataFim).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
