import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface GraficoHorariosProps {
  periodo: "manha" | "tarde";
  data: Array<{ hora: string; valor: number }>;
}

export function GraficoHorarios({ periodo, data }: GraficoHorariosProps) {
  const titulo =
    periodo === "manha"
      ? "HORÁRIOS MAIS UTILIZADOS - MANHÃ (6h-11h)"
      : "HORÁRIOS MAIS UTILIZADOS - TARDE/NOITE (13h-23h)";

  return (
    <div className="col-span-1 bg-white p-4 rounded-lg shadow" aria-label={`Gráfico da ${periodo}`}>
      <p className="text-xs font-semibold mb-2">{titulo}</p>
      <div className="w-full h-40">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="hora" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Line type="monotone" dataKey="valor" stroke="#000" strokeWidth={2} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
