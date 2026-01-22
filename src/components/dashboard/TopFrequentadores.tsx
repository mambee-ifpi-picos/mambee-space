import { TopUsuario } from "@/utils/tipos";

interface TopFrequentadoresProps {
  titulo: string;
  usuarios: TopUsuario[];
  periodo: "mês" | "semana";
}

export function TopFrequentadores({ titulo, usuarios, periodo }: TopFrequentadoresProps) {
  return (
    <div className="col-span-2 bg-white p-5 rounded-lg shadow" aria-label={`Top do ${periodo}`}>
      <p className="text-xs font-semibold mb-3">{titulo}</p>

      {usuarios?.length === 0 && <p className="text-xs text-gray-500">Sem dados</p>}

      {usuarios?.map((u, i) => (
        <div
          key={u.nome}
          className={`flex justify-between items-center py-2 border-b last:border-b-0
            ${i === 0 ? "text-xl font-bold text-yellow-600" : ""}
            ${i === 1 ? "text-lg font-semibold text-gray-700" : ""}
            ${i === 2 ? "text-base font-medium text-gray-600" : ""}`}
        >
          <span>
            {i === 0 && "🥇 "}
            {i === 1 && "🥈 "}
            {i === 2 && "🥉 "}
            {i + 1}° — {u.nome}
          </span>
          <span>{u.total} visitas</span>
        </div>
      ))}
    </div>
  );
}
