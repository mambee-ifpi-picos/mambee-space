"use client";

import Image from "next/image";
import { useState } from "react";
import { Inria_Serif } from "next/font/google";
import { supabase } from "@/lib/supabaseClient";

type MapaInfo = {
  file: File;
  preview: string;
};

const inriaSerif400 = Inria_Serif({
  subsets: ["latin"],
  weight: ["400"],
});

const inriaSerif700 = Inria_Serif({
  subsets: ["latin"],
  weight: ["700"],
});

export default function CriarSalaEspacos() {
  const [nomeSala, setNomeSala] = useState("");
  const [situacao, setSituacao] = useState("Ativa");
  const [tempoReserva, setTempoReserva] = useState("");
  const [espaco, setEspaco] = useState("");
  const [espacos, setEspacos] = useState<string[]>([]);
  const [mapa, setMapa] = useState<MapaInfo | null>(null);
  const [arrastando, setArrastando] = useState(false);
  const [animando, setAnimando] = useState(false);
  const [loading, setLoading] = useState(false);

  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "success" as "success" | "error",
  });

  /* =====================
     TOAST
  ====================== */
  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ visible: true, message: msg, type });
    setTimeout(() => {
      setToast({ visible: false, message: "", type: "success" });
    }, 3500);
  };

  /* =====================
     UPLOAD MAPA
  ====================== */
  const handleFile = (file: File) => {
    setMapa({
      file,
      preview: URL.createObjectURL(file),
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setArrastando(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setArrastando(true);
  };

  const handleDragLeave = () => {
    setArrastando(false);
  };

  const removerImagem = () => {
    setMapa(null);
  };

  /* =====================
     ESPAÇOS
  ====================== */
  const adicionarEspaco = () => {
    if (espaco.trim()) {
      setEspacos([...espacos, espaco.trim()]);
      setEspaco("");
    }
  };

  const editarEspaco = (index: number) => {
    setEspaco(espacos[index]);
    setEspacos(espacos.filter((_, i) => i !== index));
  };

  const apagarEspaco = (index: number) => {
    setEspacos(espacos.filter((_, i) => i !== index));
  };

  /* =====================
     SITUAÇÃO
  ====================== */
  const toggleSituacao = () => {
    if (animando) return;
    setAnimando(true);
    setSituacao((prev) => (prev === "Ativa" ? "Inativa" : "Ativa"));
    setTimeout(() => setAnimando(false), 300);
  };

  const limparCampos = () => {
    setNomeSala("");
    setSituacao("Ativa");
    setTempoReserva("");
    setEspaco("");
    setEspacos([]);
    setMapa(null);
  };

  /* =====================
     SUBMIT
  ====================== */
  /* =====================
      SUBMIT (COM UPLOAD DE VERDADE)
  ====================== */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.getUser();

      if (error || !data.user) {
        showToast("Usuário não autenticado", "error");
        setLoading(false);
        return;
      }

      const idAuth = data.user.id;

      if (!nomeSala.trim()) {
        showToast("Informe o nome da sala", "error");
        setLoading(false);
        return;
      }

      const limite = Number(tempoReserva);
      if (!tempoReserva || Number.isNaN(limite)) {
        showToast("Informe um tempo de reserva válido", "error");
        setLoading(false);
        return;
      }

      if (espacos.length === 0) {
        showToast("Adicione pelo menos um espaço", "error");
        setLoading(false);
        return;
      }

      let nomeMapaNoBanco = "sem_mapa"; // Valor padrão se não tiver imagem

      if (mapa) {
        // 1. Gera um nome único pra não dar conflito
        const fileExt = mapa.file.name.split(".").pop();
        const nomeArquivo = `mapa-${Date.now()}.${fileExt}`;

        // 2. Sobe o arquivo pro bucket "mapas_salas"
        const { error: uploadError } = await supabase.storage
          .from("mapas_salas")
          .upload(nomeArquivo, mapa.file);

        if (uploadError) {
          console.error("Erro no upload:", uploadError);
          showToast("Erro ao subir a imagem do mapa!", "error");
          setLoading(false);
          return;
        }

        nomeMapaNoBanco = nomeArquivo;
      }
      // -------------------------------------------------

      const body = {
        nomeSala,
        mapa: nomeMapaNoBanco,
        limiteHorasReserva: limite,
        ativa: situacao === "Ativa",
        idAuth,
      };

      const res = await fetch("/api/salas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const result = await res.json();

      if (!result.success) {
        showToast(result.error, "error");
        setLoading(false);
        return;
      }

      const idSalaCriada = result.sala.idSala;

      for (const codigoEspaco of espacos) {
        const resEspaco = await fetch("/api/salas/espacos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            codigoEspaco,
            idSalaPertence: idSalaCriada,
            idAuth,
          }),
        });

        const resultEspaco = await resEspaco.json().catch(() => null);

        if (!resEspaco.ok || !resultEspaco?.success) {
          const msg =
            resultEspaco?.error || `Erro ao criar espaço "${codigoEspaco}".`;

          showToast(msg, "error");
          setLoading(false);
          return;
        }
      }

      showToast("Sala criada com sucesso");
      limparCampos();
    } catch (err) {
      console.error(err);
      showToast("Erro ao salvar a sala", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {toast.visible && (
        <div
          className={`fixed top-4 left-1/2 -translate-x-1/2 ml-[13%]
          px-6 py-3 rounded-md shadow-lg flex items-center justify-between 
          w-[450px] border animate-slideDown z-50
          ${
            toast.type === "success"
              ? "bg-teal-500 border-teal-300"
              : "bg-red-500 border-red-500"
          }
        `}
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

      {loading && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-[9999]">
          <div className="w-14 h-14 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      <div className="min-h-screen flex justify-center items-start mt-[20px]">
        <div className="bg-white shadow-md rounded-xl p-8 w-[910px] border border-gray-300">
          <h1
            className={`${inriaSerif700.className} text-3xl mb-3 text-gray-900`}
          >
            CRIAR SALA E ESPAÇOS
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6 ml-[60px]">
            <div>
              <span
                className={`${inriaSerif400.className} block text-gray-700`}
              >
                Mapa da sala:<span className="text-red-500">*</span>
              </span>

              {!mapa && (
                <label
                  htmlFor="mapa"
                  tabIndex={-1}
                  className={`w-[730px] border-2 border-dashed rounded-none p-6 transition flex flex-col items-center justify-center cursor-pointer ${
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
                    className="mt-2 px-3 py-1 bg-gray-200 text-gray-700 rounded-md shadow-sm text-sm"
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
              )}

              {mapa && (
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
                <p
                  className={`${inriaSerif400.className} block text-gray-700 mb-1`}
                >
                  Nome da Sala:<span className="text-red-500">*</span>
                </p>

                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-none p-2 h-[30px]"
                  value={nomeSala}
                  onChange={(e) => setNomeSala(e.target.value)}
                />
              </div>

              <div className="flex flex-col">
                <p className={`${inriaSerif400.className} text-gray-700 mb-1`}>
                  Situação:
                </p>

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
                    situacao === "Ativa" ? "bg-teal-500" : "bg-pink-400"
                  }`}
                >
                  <div
                    className={`absolute h-full w-[25px] bg-gray-300 transition-all duration-300 ${
                      situacao === "Ativa"
                        ? "translate-x-[74px]"
                        : "translate-x-0"
                    }`}
                  />

                  <span
                    className={`${inriaSerif700.className} absolute inset-0 flex items-center text-white font-semibold transition-all ${
                      situacao === "Ativa"
                        ? "justify-start pl-5 opacity-100"
                        : "opacity-0"
                    }`}
                  >
                    Ativo
                  </span>

                  <span
                    className={`${inriaSerif700.className} absolute inset-0 flex items-center text-white font-semibold transition-all ${
                      situacao === "Inativa"
                        ? "justify-end pr-2 opacity-100"
                        : "opacity-0"
                    }`}
                  >
                    Inativo
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <p className={`${inriaSerif400.className} text-gray-700`}>
                Limite de tempo das reservas:
                <span className="text-red-500">*</span>
              </p>

              <input
                type="text"
                className="w-[365px] h-[30px] border border-gray-300 rounded-none p-2"
                value={tempoReserva}
                onChange={(e) => setTempoReserva(e.target.value)}
              />
            </div>

            <div>
              <p
                className={`${inriaSerif400.className} block text-gray-700 font-medium mb-1`}
              >
                Espaços:<span className="text-red-500">*</span>
              </p>

              <div className="flex gap-2">
                <input
                  type="text"
                  className="w-[494px] h-[30px] border border-gray-300 rounded-none p-2"
                  value={espaco}
                  onChange={(e) => setEspaco(e.target.value)}
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
                  <span>Adicionar</span>
                </button>
              </div>

              {espacos.length > 0 && (
                <div className="mt-4 w-[650px] space-y-3">
                  {espacos.map((item, i) => (
                    <div
                      key={item}
                      className="flex justify-between items-center"
                    >
                      <span className="text-gray-800 border-gray-300 border-x border-y text-center w-[494px] h-[40px] flex items-center justify-center">
                        {item}
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
                onClick={limparCampos}
                className="bg-gray-100 border border-gray-300 px-5 py-2 rounded-md cursor-pointer hover:bg-gray-200"
              >
                ✖ Cancelar
              </button>

              <button
                type="submit"
                className="bg-teal-500 text-white px-5 py-2 rounded-md hover:bg-teal-600 cursor-pointer"
              >
                ✓ Salvar
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
