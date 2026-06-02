"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/browser/supabaseClient";

interface MapaPreview {
  preview: string;
  file?: File;
}

interface Toast {
  visible: boolean;
  message: string;
  type: "success" | "error";
}

interface Espaco {
  idEspaco: number;
  codigoEspaco: string;
  idSalaPertence: number;
}

export default function SalaEspacoPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const idSala = searchParams.get("idSala");

  const [isAdmin, setIsAdmin] = useState(false);
  const [verificandoPermissao, setVerificandoPermissao] = useState(true);
  const [mostrarModalAcessoNegado, setMostrarModalAcessoNegado] = useState(false);
  const [nomeSala, setNomeSala] = useState("");
  const [mapa, setMapa] = useState<MapaPreview | null>(null);
  const [arrastando, setArrastando] = useState(false);
  const [situacao, setSituacao] = useState<"Ativa" | "Inativa">("Ativa");
  const [tempoReserva, setTempoReserva] = useState("");
  const [espaco, setEspaco] = useState("");
  const [espacos, setEspacos] = useState<string[]>([]);
  const [mostrarEspacos, setMostrarEspacos] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dadosCarregados, setDadosCarregados] = useState(false);
  const [editandoIndex, setEditandoIndex] = useState<number | null>(null);
  const [codigoSala, setCodigoSala] = useState("");

  const [toast, setToast] = useState<Toast>({
    visible: false,
    message: "",
    type: "success",
  });

  useEffect(() => {
    const verificarAdmin = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session?.user) {
          const { data: usuario } = await supabase
            .from("Usuario")
            .select("admin")
            .eq("idAuth", session.user.id)
            .single();

          const isUserAdmin = usuario?.admin ?? false;
          setIsAdmin(isUserAdmin);

          if (!isUserAdmin) {
            setMostrarModalAcessoNegado(true);
          }
        } else {
          setMostrarModalAcessoNegado(true);
        }
      } catch (error) {
        console.error("Erro ao verificar permissões:", error);
        setMostrarModalAcessoNegado(true);
      } finally {
        setVerificandoPermissao(false);
      }
    };

    verificarAdmin();
  }, []);

  const ModalAcessoNegado = () => {
    if (!mostrarModalAcessoNegado) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
        <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md mx-4">
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <title>Ícone de alerta</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Acesso Restrito</h3>
            </div>
            <button
              type="button"
              onClick={() => router.push("/salas")}
              className="p-1 rounded-lg hover:bg-gray-100 transition"
            >
              <svg
                className="w-6 h-6 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <title>Fechar modal</title>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="p-6">
            <div className="mb-6">
              <p className="text-gray-700 mb-3">
                Esta funcionalidade está disponível apenas para administradores do sistema.
              </p>
              <p className="text-gray-600 text-sm">
                Para criar ou editar salas, entre em contato com um administrador.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-medium">Permissões necessárias:</span>
              </p>
              <ul className="text-sm text-gray-600 space-y-1 ml-4 list-disc">
                <li>Conta de administrador ativa</li>
                <li>Privilégios de gerenciamento de salas</li>
                <li>Autorização para modificar configurações do sistema</li>
              </ul>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => router.push("/salas")}
                className="px-6 py-2.5 bg-teal-500 text-white font-medium rounded-lg hover:bg-teal-600 transition"
              >
                Voltar para Salas
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (!idSala || dadosCarregados || !isAdmin) return;

    setLoading(true);

    fetch(`/api/salas?id=${idSala}`)
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.salas.length > 0) {
          const s = res.salas[0];

          setNomeSala(s.nomeSala);
          setSituacao(s.ativa ? "Ativa" : "Inativa");
          setTempoReserva(s.limiteHorasReserva?.toString() || "");
          setEspacos(s.Espaco?.map((e: Espaco) => e.codigoEspaco) || []);

          setCodigoSala(s.idSala.toString());

          if (s.mapa) {
            let previewUrl = s.mapa;

            if (!s.mapa.startsWith("http") && !s.mapa.startsWith("data:") && !s.mapa.startsWith("blob:")) {
              previewUrl = `https://lkrpzqpcmdlnjmloaryj.supabase.co/storage/v1/object/public/mapas_salas/${s.mapa}`;
            }

            setMapa({ preview: previewUrl });
          } else {
            setMapa(null);
          }

          setDadosCarregados(true);
        } else {
          setToast({
            visible: true,
            message: "Sala não encontrada",
            type: "error",
          });
        }
      })
      .catch((error) => {
        console.error("Erro ao carregar sala:", error);
        setToast({
          visible: true,
          message: "Erro ao carregar dados da sala",
          type: "error",
        });
      })
      .finally(() => setLoading(false));
  }, [idSala, dadosCarregados, isAdmin]);

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setArrastando(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setArrastando(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setArrastando(false);
    if (e.dataTransfer.files?.[0]) {
      const file = e.dataTransfer.files[0];
      setMapa({ file, preview: URL.createObjectURL(file) });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setMapa({ file, preview: URL.createObjectURL(file) });
    }
  };

  const removerImagem = () => setMapa(null);
  const toggleSituacao = () => setSituacao(situacao === "Ativa" ? "Inativa" : "Ativa");

  const adicionarEspaco = () => {
    if (!espaco.trim()) return;

    if (editandoIndex !== null) {
      const novosEspacos = [...espacos];
      novosEspacos[editandoIndex] = espaco.trim();
      setEspacos(novosEspacos);
      setEditandoIndex(null);
    } else {
      setEspacos([...espacos, espaco.trim()]);
    }

    setEspaco("");
    setMostrarEspacos(true);
  };

  const editarEspaco = (index: number) => {
    setEspaco(espacos[index]);
    setEditandoIndex(index);
    setMostrarEspacos(true);
  };

  const apagarEspaco = (index: number) => {
    setEspacos((prev) => prev.filter((_, i) => i !== index));
    if (editandoIndex === index) {
      setEditandoIndex(null);
      setEspaco("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      adicionarEspaco();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAdmin) {
      setToast({
        visible: true,
        message: "Acesso negado. Apenas administradores podem salvar salas.",
        type: "error",
      });
      return;
    }

    setLoading(true);

    try {
      if (!nomeSala.trim() || !tempoReserva.trim() || !mapa?.preview) {
        setToast({
          visible: true,
          message: "Preencha todos os campos obrigatórios (*)",
          type: "error",
        });
        setLoading(false);
        return;
      }

      const limiteHoras = Number(tempoReserva);
      if (Number.isNaN(limiteHoras) || limiteHoras <= 0) {
        setToast({
          visible: true,
          message: "Limite de horas deve ser um número positivo",
          type: "error",
        });
        setLoading(false);
        return;
      }

      let mapaUrl = mapa.preview;

      if (mapa.preview.startsWith("blob:") && mapa.file) {
        const ext = mapa.file.name.split(".").pop();
        const fileName = `${crypto.randomUUID()}.${ext}`;

        const { error } = await supabase.storage.from("mapas_salas").upload(fileName, mapa.file, {
          cacheControl: "3600",
          upsert: false,
        });

        if (error) throw error;

        const { data } = supabase.storage.from("mapas_salas").getPublicUrl(fileName);

        mapaUrl = data.publicUrl;
      }

      const body: {
        nomeSala: string;
        mapa: string;
        limiteHorasReserva: number;
        ativa: boolean;
        espacos: string[];
        idSala?: number;
        idUsuarioCriador?: number;
      } = {
        nomeSala: nomeSala.trim(),
        mapa: mapaUrl,
        limiteHorasReserva: limiteHoras,
        ativa: true,
        espacos: espacos.filter((esp) => esp.trim() !== ""),
      };

      if (idSala) {
        body.idSala = Number(idSala);
      } else {
        const userData = localStorage.getItem("user");
        if (userData) {
          const user = JSON.parse(userData);
          body.idUsuarioCriador = user.id;
        }
      }

      const res = await fetch("/api/salas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (data.success) {
        setToast({
          visible: true,
          message: idSala ? "Sala atualizada com sucesso!" : "Sala criada com sucesso!",
          type: "success",
        });
        setDadosCarregados(false);
        setTimeout(() => {
          router.push("/salas");
        }, 2000);
      } else {
        setToast({
          visible: true,
          message: data.error || "Erro ao salvar sala",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Erro ao salvar:", error);
      setToast({
        visible: true,
        message: "Erro interno ao salvar sala",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  if (verificandoPermissao) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-14 h-14 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <>
        <ModalAcessoNegado />
        <div className="min-h-screen bg-gray-50" />
      </>
    );
  }

  return (
    <>
      <ModalAcessoNegado />
      {isAdmin && (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6 md:mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                    {idSala ? "EDITAR SALA E ESPAÇOS" : "CRIAR SALA E ESPAÇOS"}
                  </h1>
                  <p className="text-gray-600 text-sm md:text-base">
                    {idSala ? "Atualize os dados da sala e seus espaços" : "Preencha os dados para criar uma nova sala"}
                  </p>
                </div>

                {codigoSala && (
                  <div className="p-3 bg-gray-100 border border-gray-300 rounded-lg inline-block">
                    <span className="text-gray-700 font-medium text-sm md:text-base">Código da sala: </span>
                    <span className="text-teal-600 font-bold text-sm md:text-base">{codigoSala}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white shadow-lg rounded-xl p-4 sm:p-6 md:p-8 border border-gray-300">
              <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
                <div>
                  <label htmlFor="mapa" className="block text-gray-700 font-medium mb-2 text-sm md:text-base">
                    Mapa da sala:<span className="text-red-500 ml-1">*</span>
                  </label>
                  {!mapa ? (
                    <label
                      htmlFor="mapa"
                      tabIndex={-1}
                      className={`flex flex-col items-center justify-center w-full border-2 border-dashed p-4 sm:p-6 cursor-pointer transition-colors ${
                        arrastando ? "bg-teal-50 border-teal-400" : "bg-gray-50 border-gray-300 hover:bg-gray-100"
                      } rounded-lg`}
                      onDragLeave={handleDragLeave}
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                    >
                      <div className="w-10 h-10 sm:w-12 sm:h-12 relative mb-3">
                        <svg
                          className="w-full h-full text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <title>Ícone de upload</title>
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>
                      </div>
                      <p className="text-gray-700 mb-2 text-sm sm:text-base text-center">
                        Arraste e solte a imagem aqui
                      </p>
                      <p className="text-gray-500 text-xs sm:text-sm mb-3 text-center">ou</p>
                      <div className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300 transition">
                        Fazer upload do computador
                      </div>
                      <input type="file" id="mapa" className="hidden" accept="image/*" onChange={handleFileChange} />
                      <p className="text-gray-500 text-xs mt-3 text-center">Formatos suportados: JPG, PNG, GIF</p>
                    </label>
                  ) : (
                    <div className="relative w-full p-4 bg-gray-50 border border-gray-300 rounded-lg flex flex-col items-center">
                      <button
                        type="button"
                        onClick={removerImagem}
                        className="absolute top-3 right-3 p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition z-10"
                        aria-label="Remover imagem"
                      >
                        <svg
                          className="w-5 h-5 text-gray-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <title>Remover imagem</title>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                      <div className="w-full max-w-2xl">
                        <Image
                          src={mapa.preview}
                          alt="Preview do mapa da sala"
                          width={800}
                          height={400}
                          className="w-full h-auto max-h-[400px] object-contain rounded-lg"
                          unoptimized
                          priority
                        />
                      </div>
                      <p className="text-gray-500 text-xs mt-3 text-center">
                        Imagem carregada. Clique no ícone X para remover.
                      </p>
                    </div>
                  )}
                </div>

                <div className="max-w-xl">
                  <label htmlFor="nomeSala" className="block text-gray-700 font-medium mb-2 text-sm md:text-base">
                    Nome da Sala:<span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    id="nomeSala"
                    className="w-full border border-gray-300 rounded-lg p-3 text-sm md:text-base focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                    value={nomeSala}
                    onChange={(e) => setNomeSala(e.target.value)}
                    required
                    placeholder="Ex: Sala de Reuniões A"
                  />
                </div>

                <div className="max-w-md">
                  <label htmlFor="tempoReserva" className="block text-gray-700 font-medium mb-2 text-sm md:text-base">
                    Limite de tempo das reservas (horas):
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="flex items-center">
                    <input
                      type="number"
                      id="tempoReserva"
                      min="1"
                      className="w-full max-w-xs border border-gray-300 rounded-lg p-3 text-sm md:text-base focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                      value={tempoReserva}
                      onChange={(e) => setTempoReserva(e.target.value)}
                      required
                      placeholder="Ex: 4"
                    />
                    <span className="ml-3 text-gray-600 text-sm">horas por reserva</span>
                  </div>
                  <p className="text-gray-500 text-xs mt-2">
                    Defina o tempo máximo que uma reserva pode ocupar esta sala
                  </p>
                </div>



                <div className="relative">
                  <div className="text-gray-700 font-medium mb-2 text-sm md:text-base">Espaços:</div>

                  <div className="flex flex-col sm:flex-row gap-3 mb-4">
                    <div className="flex-1">
                      <input
                        type="text"
                        id="espacoInput"
                        className="w-full border border-gray-300 rounded-lg p-3 text-sm md:text-base focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                        value={espaco}
                        onChange={(e) => setEspaco(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder={
                          editandoIndex !== null
                            ? `Editando espaço "${espacos[editandoIndex]}"...`
                            : "Digite o código do espaço (Ex: A1, B2, C3...)"
                        }
                      />
                      {espacos.length > 0 && (
                        <p className="text-gray-500 text-xs mt-2">
                          {espacos.length} espaço(s) adicionado(s)
                          {editandoIndex !== null && ` - Editando espaço ${editandoIndex + 1}`}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={adicionarEspaco}
                        className="px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 text-gray-700 font-medium flex items-center justify-center gap-2 transition whitespace-nowrap text-sm md:text-base"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <title>Adicionar espaço</title>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        {editandoIndex !== null ? "Salvar Edição" : "Adicionar"}
                      </button>
                      {espacos.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setMostrarEspacos((prev) => !prev)}
                          className="px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 font-medium transition"
                          aria-label={mostrarEspacos ? "Ocultar espaços" : "Mostrar espaços"}
                        >
                          {mostrarEspacos ? "▲" : "▼"}
                        </button>
                      )}
                    </div>
                  </div>

                  {mostrarEspacos && espacos.length > 0 && (
                    <div className="mt-4 space-y-2 border border-gray-200 p-4 rounded-lg bg-gray-50">
                      <h4 className="font-medium text-gray-700 mb-3 text-sm md:text-base">
                        Espaços Adicionados ({espacos.length})
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {espacos.map((item, i) => (
                          <div
                            key={`espaco-${item}-${item}`}
                            className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                          >
                            <div className="flex-1 mb-2 sm:mb-0">
                              <span className="text-gray-800 font-medium text-sm md:text-base">{item}</span>
                              {i === editandoIndex && (
                                <span className="ml-2 text-teal-600 text-xs font-medium">(Editando)</span>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => editarEspaco(i)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded transition"
                                aria-label={`Editar espaço ${item}`}
                              >
                                <svg
                                  className="w-5 h-5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                >
                                  <title>Editar espaço</title>
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                  />
                                </svg>
                              </button>
                              <button
                                type="button"
                                onClick={() => apagarEspaco(i)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                                aria-label={`Remover espaço ${item}`}
                              >
                                <svg
                                  className="w-5 h-5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                >
                                  <title>Remover espaço</title>
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  />
                                </svg>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                      <p className="text-gray-500 text-xs mt-3 text-center">
                        Clique no ícone de edição para modificar ou no ícone de lixeira para remover
                      </p>
                    </div>
                  )}
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <div className="flex flex-col sm:flex-row gap-4 justify-end">
                    <button
                      type="button"
                      onClick={() => router.push("/salas")}
                      className="px-6 py-3 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 text-gray-700 font-medium transition w-full sm:w-auto text-center"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 font-medium transition disabled:opacity-70 disabled:cursor-not-allowed w-full sm:w-auto text-center"
                      disabled={loading}
                    >
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          {idSala ? "Salvando..." : "Criando Sala..."}
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                          >
                            <title>Salvar sala</title>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {idSala ? "Atualizar Sala" : "Criar Sala"}
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
