"use client";

import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export default function ForbiddenPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <div className="flex flex-col items-center text-center max-w-md bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
          <ShieldAlert size={40} />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">Acesso Negado</h1>

        <p className="text-gray-600 mb-8">
          Acesso permitido apenas para administradores. Você não tem permissão para visualizar esta página ou realizar
          esta ação.
        </p>

        <Link
          href="/dashboard"
          className="w-full bg-teal-500 hover:bg-teal-600 text-white font-medium py-3 px-4 rounded-xl transition-colors duration-200"
        >
          Voltar para o Dashboard
        </Link>
      </div>
    </div>
  );
}
