interface CardInatividadeProps {
  totalInatividade: number;
}

export function CardInatividade({ totalInatividade }: CardInatividadeProps) {
  return (
    <div
      className="col-span-1 bg-white p-5 rounded-lg shadow flex flex-col justify-between"
      aria-label="Total de minhas reservas"
    >
      <p className="text-xs font-semibold">INATIVIDADE</p>
      <p className="text-5xl font-bold">{totalInatividade}</p>
      <p className="text-xs text-gray-500">Total de pessoas que não fez nenhuma reserva.</p>
    </div>
  );
}
