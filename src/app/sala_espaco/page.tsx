"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";

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
  const [nomeSala, setNomeSala] = useState("");
  const [mapa, setMapa] = useState<MapaPreview | null>(null);
  const [arrastando, setArrastando] = useState(false);
  const [situacao, setSituacao] = useState<"Ativa" | "Inativa">("Ativa");
  const [tempoReserva, setTempoReserva] = useState("");
  const [espaco, setEspaco] = useState("");
  const [espacos, setEspacos] = useState<string[]>([]);
  const [mostrarEspacos, setMostrarEspacos] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<Toast>({
    visible: false,
    message: "",
    type: "success",
  });
  const [dadosCarregados, setDadosCarregados] = useState(false);
  const [editandoIndex, setEditandoIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!idSala || dadosCarregados) return;
    setLoading(true);

    fetch(`/api/salas?id=${idSala}`)
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.salas.length > 0) {
          const s = res.salas[0];
          setNomeSala(s.nomeSala);
          setMapa(s.mapa ? { preview: s.mapa } : null);
          setSituacao(s.ativa ? "Ativa" : "Inativa");
          setTempoReserva(s.limiteHorasReserva?.toString() || "");
          setEspacos(s.Espaco?.map((e: Espaco) => e.codigoEspaco) || []);
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
  }, [idSala, dadosCarregados]);

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
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setMapa({ file, preview: URL.createObjectURL(file) });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setMapa({ file, preview: URL.createObjectURL(file) });
    }
  };

  const removerImagem = () => setMapa(null);
  const toggleSituacao = () =>
    setSituacao(situacao === "Ativa" ? "Inativa" : "Ativa");
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

  const limparCampos = () => {
    setNomeSala("");
    setMapa(null);
    setSituacao("Ativa");
    setTempoReserva("");
    setEspaco("");
    setEspacos([]);
    setMostrarEspacos(false);
    setDadosCarregados(false);
    setEditandoIndex(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      if (isNaN(limiteHoras) || limiteHoras <= 0) {
        setToast({
          visible: true,
          message: "Limite de horas deve ser um número positivo",
          type: "error",
        });
        setLoading(false);
        return;
      }

      const body: {
        nomeSala: string;
        mapa: string;
        limiteHorasReserva: number;
        ativa: boolean;
        espacos: string[];
        idSala?: number;
      } = {
        nomeSala: nomeSala.trim(),
        mapa: mapa.preview,
        limiteHorasReserva: limiteHoras,
        ativa: situacao === "Ativa",
        espacos: espacos.filter((esp) => esp.trim() !== ""),
      };

      if (idSala) body.idSala = Number(idSala);

      console.log("Enviando para API:", body);

      const res = await fetch("/api/salas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (data.success) {
        setToast({
          visible: true,
          message: idSala
            ? "Sala atualizada com sucesso!"
            : "Sala criada com sucesso!",
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      adicionarEspaco();
    }
  };

  return (
    <>
      {loading && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-[9999]">
          <div className="w-14 h-14 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {toast.visible && (
        <div
          className={`fixed top-4 left-1/2 -translate-x-1/2 ml-[13%] px-6 py-3 rounded-md shadow-lg flex items-center justify-between w-[450px] border animate-slideDown z-50 ${
            toast.type === "success"
              ? "bg-teal-500 border-teal-300"
              : "bg-red-500 border-red-500"
          }`}
        >
          <div className="flex items-center gap-2">
            <Image src="/check.png" width={18} height={18} alt="status" />
            <span className="text-base text-white">{toast.message}</span>
          </div>
          <button
            type="button"
            onClick={() =>
              setToast({ visible: false, message: "", type: "success" })
            }
            className="cursor-pointer"
          >
            <Image src="/close.png" width={18} height={18} alt="fechar" />
          </button>
        </div>
      )}

      <div className="min-h-screen flex justify-center items-start mt-[20px]">
        <div className="bg-white shadow-md rounded-xl p-8 w-[910px] border border-gray-300">
          <h1 className="text-3xl mb-3 text-gray-900">
            {idSala ? "EDITAR SALA E ESPAÇOS" : "CRIAR SALA E ESPAÇOS"}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6 ml-[60px]">
            <div>
              <span className="block text-gray-700">
                Mapa da sala:<span className="text-red-500">*</span>
              </span>
              {!mapa ? (
                <label
                  htmlFor="mapa"
                  tabIndex={-1}
                  className={`w-[730px] border-2 border-dashed p-6 flex flex-col items-center justify-center cursor-pointer ${
                    arrastando
                      ? "bg-teal-100 border-teal-400"
                      : "bg-gray-50 border-gray-300"
                  }`}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  <Image src="/upload.png" width={40} height={40} alt="Up" />
                  <p className="text-gray-700 mt-2 text-sm">
                    Arraste e solte a imagem aqui
                  </p>
                  <button
                    type="button"
                    className="mt-2 px-3 py-1 bg-gray-200 text-gray-700 rounded-md text-sm"
                  >
                    Fazer upload do computador
                  </button>
                  <input
                    type="file"
                    id="mapa"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </label>
              ) : (
                <div className="w-[730px] relative p-4 bg-gray-50 border border-gray-300 rounded-lg flex flex-col items-center">
                  <button
                    type="button"
                    onClick={removerImagem}
                    className="absolute top-3 right-3 p-1 rounded-full shadow hover:bg-gray-100 cursor-pointer"
                  >
                    <Image
                      src="/lixeira.png"
                      width={30}
                      height={30}
                      alt="Lixeira"
                    />
                  </button>
                  <Image
                    src={mapa.preview}
                    alt="Preview"
                    width={800}
                    height={350}
                    className="w-full max-h-[350px] object-contain rounded-none"
                    unoptimized
                  />
                </div>
              )}
            </div>

            <div className="flex flex-row items-start gap-8">
              <div className="w-[600px]">
                <p className="block text-gray-700 mb-1">
                  Nome da Sala:<span className="text-red-500">*</span>
                </p>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-none p-2 h-[30px]"
                  value={nomeSala}
                  onChange={(e) => setNomeSala(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col">
                <p className="text-gray-700 mb-1">Situação:</p>
                <div
                  role="switch"
                  aria-checked={situacao === "Ativa"}
                  tabIndex={0}
                  onClick={toggleSituacao}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      toggleSituacao();
                    }
                  }}
                  className={`relative w-[98px] h-[30px] cursor-pointer rounded-none transition-all duration-300 ${
                    situacao === "Ativa" ? "bg-teal-500" : "bg-red-500"
                  }`}
                >
                  <div
                    className={`absolute h-full w-[25px] bg-gray-300 transition-all duration-300 ${
                      situacao === "Ativa"
                        ? "translate-x-[74px]"
                        : "translate-x-0"
                    }`}
                  />
                  <span className="absolute inset-0 flex items-center justify-center text-white font-semibold text-sm">
                    {situacao === "Ativa" ? "Ativa" : "Inativa"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <p className="text-gray-700">
                Limite de tempo das reservas:
                <span className="text-red-500">*</span>
              </p>
              <input
                type="number"
                min="1"
                className="w-[365px] h-[30px] border border-gray-300 rounded-none p-2"
                value={tempoReserva}
                onChange={(e) => setTempoReserva(e.target.value)}
                required
              />
            </div>

            <div className="mt-4 relative">
              <p className="block text-gray-700 font-medium mb-1">Espaços:</p>

              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  className="w-[494px] h-[30px] border border-gray-300 rounded-none p-2"
                  value={espaco}
                  onChange={(e) => setEspaco(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={
                    editandoIndex !== null
                      ? `Editando espaço "${espacos[editandoIndex]}"...`
                      : "Digite o código do espaço e pressione Enter"
                  }
                />
                <button
                  type="button"
                  onClick={adicionarEspaco}
                  className="w-[130px] h-[30px] bg-gray-100 border border-gray-300 rounded-none px-3 py-2 hover:bg-gray-200 text-gray-600 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Image
                    src="/adicionar.png"
                    alt="add"
                    width={18}
                    height={18}
                  />
                  <span>
                    {editandoIndex !== null ? "Salvar Edição" : "Adicionar"}
                  </span>
                </button>
                {espacos.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setMostrarEspacos((prev) => !prev)}
                    className="px-3 py-1 border border-gray-300 rounded-md bg-gray-50 hover:bg-gray-100"
                  >
                    {mostrarEspacos ? "▲" : "▼"}
                  </button>
                )}
              </div>

              {espacos.length > 0 && (
                <div className="mb-2 text-sm text-gray-600">
                  {espacos.length} espaço(s) adicionado(s)
                  {editandoIndex !== null &&
                    ` - Editando espaço ${editandoIndex + 1}`}
                </div>
              )}

              {mostrarEspacos && espacos.length > 0 && (
                <div className="w-[650px] space-y-2 border border-gray-200 p-2 rounded-md bg-gray-50 absolute z-10">
                  {espacos.map((item, i) => (
                    <div
                      key={item}
                      className="flex justify-between items-center"
                    >
                      <span className="text-gray-800 border-gray-300 border-x border-y text-center w-[494px] h-[40px] flex items-center justify-center">
                        {item} {i === editandoIndex && "(Editando)"}
                      </span>
                      <div className="flex gap-5 h-[40px]">
                        <button
                          type="button"
                          onClick={() => editarEspaco(i)}
                          className="border-gray-300 border-x border-y p-3 cursor-pointer"
                        >
                          <Image
                            src="/editar.png"
                            alt="editar"
                            width={30}
                            height={10}
                            className="mt-[-7px]"
                          />
                        </button>
                        <button
                          type="button"
                          onClick={() => apagarEspaco(i)}
                          className="mr-[20px] border-gray-300 border-x border-y p-3 h-[40px] cursor-pointer"
                        >
                          <Image
                            src="/lixeira.png"
                            alt="deletar"
                            width={30}
                            height={10}
                            className="mt-[-7px]"
                          />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-4 mt-8 w-[730px]">
              <button
                type="button"
                onClick={() => router.push("/salas")}
                className="bg-gray-100 border border-gray-300 px-5 py-2 rounded-md cursor-pointer hover:bg-gray-200"
              >
                ✖ Cancelar
              </button>
              <button
                type="submit"
                className="bg-teal-500 text-white px-5 py-2 rounded-md hover:bg-teal-600 cursor-pointer"
                disabled={loading}
              >
                {loading ? "Salvando..." : "✓ Salvar"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
