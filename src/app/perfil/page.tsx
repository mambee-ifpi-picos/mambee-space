"use client";

import { useState, useEffect, type FormEvent, type ChangeEvent } from "react";
import { User, Camera, CheckCircle, XCircle, LogOut } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

const COLOR_PRIMARY = "#33b5b5";
const COLOR_INPUT_BG = "#e0e0e0";

interface NotificationProps {
  message: string;
  type: "success" | "error" | "";
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({
  message,
  type,
  onClose,
}) => {
  const isSuccess = type === "success";
  const bgColor = isSuccess ? "bg-green-500" : "bg-red-500";
  const Icon = isSuccess ? CheckCircle : XCircle;

  useEffect(() => {
    if (message) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className="fixed top-5 right-5 z-50">
      <div
        className={`flex items-center ${bgColor} text-white text-sm font-bold px-4 py-3 rounded-lg shadow-xl`}
        role="alert"
      >
        <Icon className="w-5 h-5 mr-3" />
        <p>{message}</p>
        <button
          type="button"
          onClick={onClose}
          className="ml-4 text-white hover:text-gray-200"
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default function ProfilePage() {
  const router = useRouter();

  const [initialData, setInitialData] = useState({
    name: "",
    email: "",
    photo: "",
  });

  const [nome, setNome] = useState("");
  const [fotoUrl, setFotoUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error" | "";
  }>({ message: "", type: "" });

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
    router.push("/login");
  };

  useEffect(() => {
    const fetchUser = async () => {
      const { data: sessionData } = await supabase.auth.getSession();

      if (!sessionData.session) {
        router.push("/login");
        return;
      }

      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;

      if (!user) {
        router.push("/login");
        return;
      }

      const { data: dbUser } = await supabase
        .from("Usuario")
        .select("nome, foto")
        .ilike("email", user.email || "")
        .maybeSingle();

      const userName =
        dbUser?.nome ||
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        "";

      const userPhoto =
        dbUser?.foto ||
        user.user_metadata?.avatar_url ||
        user.user_metadata?.picture ||
        "";

      const userEmail = user.email || "";

      setInitialData({
        name: userName,
        email: userEmail,
        photo: userPhoto,
      });

      setNome(userName);
      setFotoUrl(userPhoto);

      setIsLoadingUser(false);
    };

    fetchUser();
  }, []);

  useEffect(() => {
    return () => {
      if (fotoUrl?.startsWith("blob:")) URL.revokeObjectURL(fotoUrl);
    };
  }, [fotoUrl]);

  const isChanged = nome !== initialData.name || fotoUrl !== initialData.photo;

  const handleFotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setFotoUrl(objectUrl);
      setSelectedFile(file);
    }
  };

  const handleSalvar = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      let finalAvatarUrl = initialData.photo;

      if (selectedFile) {
        const fileExt = selectedFile.name.split(".").pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = fileName;

        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(filePath, selectedFile);

        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from("avatars").getPublicUrl(filePath);

        finalAvatarUrl = publicUrl;
      }

      // Atualiza AUTH
      const { error: updateAuth } = await supabase.auth.updateUser({
        data: {
          full_name: nome,
          avatar_url: finalAvatarUrl,
        },
      });

      if (updateAuth) throw updateAuth;

      // Atualiza BANCO
      await supabase
        .from("Usuario")
        .update({
          nome: nome,
          foto: finalAvatarUrl,
        })
        .eq("email", initialData.email);

      setInitialData({
        name: nome,
        email: initialData.email,
        photo: finalAvatarUrl,
      });

      setFotoUrl(finalAvatarUrl);
      setSelectedFile(null);

      setNotification({
        message: "Perfil atualizado com sucesso!",
        type: "success",
      });
    } catch (error) {
      console.error("Erro ao atualizar:", error);

      const message =
        error instanceof Error ? error.message : "Erro desconhecido";

      setNotification({
        message: `Erro ao salvar: ${message}`,
        type: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelar = () => {
    setNome(initialData.name);
    setFotoUrl(initialData.photo);
    setSelectedFile(null);
    setNotification({
      message: "Alterações descartadas.",
      type: "error",
    });
  };

  const closeNotification = () => setNotification({ message: "", type: "" });

  if (isLoadingUser) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#f5f5f5]">
        Carregando perfil...
      </div>
    );
  }

  return (
    <div
      className="flex flex-col bg-[#f5f5f5] min-h-screen"
      style={{ fontFamily: '"Inria Serif", serif' }}
    >
      <Notification
        message={notification.message}
        type={notification.type}
        onClose={closeNotification}
      />

      <div
        className="h-[100px] w-full shadow-lg"
        style={{ backgroundColor: COLOR_PRIMARY }}
      />

      <div className="relative mx-auto w-full max-w-4xl p-4 sm:p-6 md:p-8 -mt-16">
        <div className="flex items-center gap-2 sm:gap-2 sm:-mt-9">
          <div className="relative rounded-full w-24 h-24 sm:w-32 sm:h-32 shadow-xl border-4 border-white overflow-hidden group bg-gray-200">
            <label
              htmlFor="foto"
              className="cursor-pointer flex items-center justify-center w-full h-full"
            >
              {fotoUrl ? (
                <Image
                  src={fotoUrl}
                  alt="Foto de Perfil"
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                  unoptimized
                />
              ) : (
                <User size={70} color="#888" />
              )}

              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-40 transition-opacity duration-300">
                <Camera size={32} color="white" />
              </div>

              <input
                id="foto"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFotoChange}
              />
            </label>
          </div>

          <h1 className="text-3xl sm:text-4xl text-gray-800 font-extrabold mt-10">
            {nome}
          </h1>
        </div>

        <form onSubmit={handleSalvar} className="mt-8 p-6 sm:p-8 rounded-xl">
          <div className="flex justify-between items-center mb-6 pb-2">
            <h2 className="text-2xl font-semibold text-gray-800">Perfil</h2>

            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 text-red-500 font-bold hover:text-red-700 transition-colors"
              title="Sair da conta"
            >
              <LogOut size={20} />
              Sair
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-gray-700 font-medium mb-2">
                Nome
              </label>
              <input
                id="nome"
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-[#2ca3a3]"
                style={{ backgroundColor: COLOR_INPUT_BG }}
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 font-medium mb-2">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                value={initialData.email}
                disabled
                className="w-full p-3 border-2 border-gray-300 rounded-lg text-gray-500 cursor-not-allowed"
                style={{ backgroundColor: COLOR_INPUT_BG }}
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-10 pt-6">
            <button
              type="submit"
              disabled={isSaving || !isChanged}
              className="text-white px-6 py-2 rounded-lg shadow-lg disabled:opacity-60 hover:bg-[#2ca3a3]"
              style={{ backgroundColor: COLOR_PRIMARY }}
            >
              {isSaving ? "Salvando..." : "Salvar"}
            </button>

            <button
              type="button"
              onClick={handleCancelar}
              disabled={isSaving || !isChanged}
              className="text-gray-700 px-6 py-2 rounded-lg border-2 border-gray-300 hover:bg-gray-300 disabled:opacity-50"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
