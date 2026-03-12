import { TopUsuario } from "@/utils/tipos";

interface TopFrequentadoresProps {
  titulo: string;
  usuarios: TopUsuario[];
  periodo: "mês" | "semana";
}

export function TopFrequentadores({ titulo, usuarios, periodo }: TopFrequentadoresProps) {
  return (
    <div className="col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full hover:shadow-md transition-shadow duration-300" aria-label={`Top do ${periodo}`}>
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center text-teal-600">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        </div>
        <p className="text-sm font-bold text-gray-800 uppercase tracking-wider">{titulo}</p>
      </div>

      {usuarios?.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-gray-100 rounded-xl bg-gray-50/50">
          <span className="text-4xl mb-3 grayscale opacity-30">🏆</span>
          <p className="text-sm font-medium text-gray-600">Nenhum dado registrado</p>
          <p className="text-xs text-gray-400 mt-1">Os frequentadores aparecerão aqui.</p>
        </div>
      ) : (
        <div className="flex-1 flex flex-col gap-3">
          {usuarios?.map((u, i) => {
            let medalColor = "bg-gray-100 text-gray-600";
            let borderColor = "border-transparent";
            let medalEmoji = "";
            let nameStyle = "text-gray-700 font-medium";

            if (i === 0) {
              medalColor = "bg-amber-100 text-amber-700";
              borderColor = "border-amber-200";
              medalEmoji = "🥇";
              nameStyle = "text-gray-900 font-bold text-lg";
            } else if (i === 1) {
              medalColor = "bg-slate-200 text-slate-700";
              borderColor = "border-slate-300";
              medalEmoji = "🥈";
              nameStyle = "text-gray-800 font-semibold text-base";
            } else if (i === 2) {
              medalColor = "bg-orange-100 text-orange-800";
              borderColor = "border-orange-200";
              medalEmoji = "🥉";
              nameStyle = "text-gray-800 font-medium text-base";
            }

            return (
              <div
                key={u.nome}
                className={`flex justify-between items-center p-3 rounded-xl border transition-all duration-200 hover:bg-gray-50 ${i < 3 ? borderColor + " shadow-sm" : "border-gray-100 bg-white"}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-base ${medalColor}`}>
                    {i < 3 ? medalEmoji : `${i + 1}º`}
                  </div>
                  <span className={`${nameStyle}`}>{u.nome}</span>
                </div>
                
                <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                  <span className="font-bold text-teal-600">{u.total}</span>
                  <span className="text-xs text-gray-500 font-medium uppercase">visitas</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
