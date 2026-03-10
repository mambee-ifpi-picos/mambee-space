import type { NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server/supabaseServer";
import PDFDocument from "pdfkit";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const supabase = await createSupabaseServerClient();
    const filtroSala = (searchParams.get("sala") ?? "").trim().toLowerCase();
    const filtroEspaco = (searchParams.get("espaco") ?? "").trim().toLowerCase();
    const filtroUsuario = (searchParams.get("usuario") ?? "").trim().toLowerCase();

    const dataInicio = searchParams.get("inicio");
    const dataFim = searchParams.get("fim");

    if (!dataInicio || !dataFim) {
      return new Response("Datas obrigatórias", { status: 400 });
    }

    const dtInicio = new Date(`${dataInicio}T00:00:00`);
    const dtFim = new Date(`${dataFim}T23:59:59`);

    
    const { data: reservas } = await supabase.from("Reserva").select("*").order("horaInicio", { ascending: false });

    const { data: espacos } = await supabase.from("Espaco").select("idEspaco, codigoEspaco, idSalaPertence");

    const { data: salas } = await supabase.from("Sala").select("idSala, nomeSala");

    const { data: usuarios } = await supabase.from("Usuario").select("idUsuario, nome, email, foto");

    const mapeadas =
      reservas?.map((r) => {
        const espaco = espacos?.find((e) => e.idEspaco === r.idEspacoReservado);
        const sala = espaco ? salas?.find((s) => s.idSala === espaco.idSalaPertence) : null;
        const usuario = usuarios?.find((u) => u.idUsuario === r.idUsuarioCriador);

        return {
          usuario: usuario?.nome ?? "",
          foto: usuario?.foto ?? "",
          sala: sala?.nomeSala ?? "",
          espaco: espaco?.codigoEspaco ?? "",
          inicio: r.horaInicio ?? "",
          fim: r.horaFim ?? "",
        };
      }) ?? [];

    const filtradas = mapeadas.filter((r) => {
      const salaOK = r.sala.toLowerCase().includes(filtroSala);
      const espacoOK = r.espaco.toLowerCase().includes(filtroEspaco);
      const usuarioOK = r.usuario.toLowerCase().includes(filtroUsuario);

      const dataInicioRes = new Date(r.inicio);
      const dataOK = dataInicioRes >= dtInicio && dataInicioRes <= dtFim;

      return salaOK && espacoOK && usuarioOK && dataOK;
    });

    // === GERAR PDF ===
    const doc = new PDFDocument({ size: "A4", margin: 40 });

    const chunks: Uint8Array[] = [];
    doc.on("data", (c) => chunks.push(c));
    doc.on("end", () => {});

    doc.fontSize(20).text("Relatório de Reservas", { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text(`Período: ${dataInicio} até ${dataFim}`);
    doc.moveDown();

    filtradas.forEach((r, i) => {
      doc.fontSize(12).text(`Usuário: ${r.usuario}`);
      doc.text(`Sala: ${r.sala}`);
      doc.text(`Espaço: ${r.espaco}`);
      doc.text(`Início: ${r.inicio}`);
      doc.text(`Fim: ${r.fim}`);

      if (r.foto) {
        try {
          doc.image(r.foto, { fit: [80, 80] });
        } catch {
          doc.text("Foto indisponível");
        }
      }

      doc.moveDown();
      if (i < filtradas.length - 1) doc.moveDown();
    });

    doc.end();
    const buffer = Buffer.concat(chunks);

    return new Response(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="relatorio.pdf"',
      },
    });
  } catch (e) {
    return new Response("Erro ao gerar PDF", { status: 500 });
  }
}
