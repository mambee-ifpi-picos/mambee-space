import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface GraficoFrequenciaProps {
  data: Array<{ dia: string; valor: number }>;
}

export function GraficoFrequencia({ data }: GraficoFrequenciaProps) {
  return (
    <div className="col-span-2 bg-white p-5 rounded-lg shadow" aria-label="Frequência por dia da semana">
      <p className="text-xs font-semibold mb-2">FREQUÊNCIA POR DIA DA SEMANA</p>

      <div className="w-full h-52">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="dia" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="valor" fill="#14b8a6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
