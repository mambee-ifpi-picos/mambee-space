import {supabase} from "@/lib/supabaseClient";
import { NextResponse } from "next/server";

type UsuarioInfo = {
    nome: string;
    email:string;
};

type ReservaComUsuario = {
    idReserva: Number;
    motivo: string;
    horaInicio: string;
    horaFim: string;
    situacao: string;
    Usuario?: UsuarioInfo[];
};

export async function GET(req: Request) {
    try {
        let hoje = new Date()
        let depois24 = new Date(hoje.getTime() + (1000 * 60 * 60 * 24));

        let query = supabase.from("Reserva")
        .select(`
            idReserva,
            motivo,
            horaInicio,
            horaFim,
            situacao,
            Usuario: idUsuarioCriador(nome,email)
            `).order('horaInicio', {ascending: true});
        
        query = query.gte("horaInicio", hoje.toISOString()).lte("horaFim", depois24.toISOString());

        const res = await query;
        if (res.error) throw res.error;

        const rawData = Array.isArray(res.data) ? res.data : [];
        const reservas = rawData as unknown as ReservaComUsuario[];

        const relatorio = reservas.map((reserva) => {
            const usuarioData = Array.isArray(reserva.Usuario)
            ? reserva.Usuario[0]
            : reserva.Usuario;

            return {
            id: reserva.idReserva,
            motivo: reserva.motivo,
            inicio: reserva.horaInicio
                ? new Date(reserva.horaInicio).toLocaleString("pt-BR")
                : "-",
            fim: reserva.horaFim
                ? new Date(reserva.horaFim).toLocaleString("pt-BR")
                : "-",
            situacao: reserva.situacao || "-",
            usuario: usuarioData?.nome || "Usuário não encontrado",
            email: usuarioData?.email || "-",
            };
        });

        return NextResponse.json({
            success: true,
            total: relatorio.length,
            relatorio,
        });

        } catch (error: unknown) {
        console.error("ERRO AO GERAR RELATÓRIO:", error);
        const msg = error instanceof Error ? error.message : JSON.stringify(error);
        return NextResponse.json({ success: false, error: msg }, { status: 500 });
        }
}


