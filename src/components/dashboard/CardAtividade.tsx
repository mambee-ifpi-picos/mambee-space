interface CardAtividadeProps {
  totalAtividade: number;
}

export function CardAtividade({ totalAtividade }: CardAtividadeProps) {
  return (
    <div
      className="col-span-1 bg-white p-5 rounded-lg shadow flex flex-col justify-between"
      aria-label="Total de pessoas ativas"
    >
      <p className="text-xs font-semibold text-teal-600 uppercase">Atividade</p>
      <p className="text-5xl font-bold">{totalAtividade}</p>
      <p className="text-xs text-gray-500">Total de pessoas que já fizeram pelo menos uma reserva.</p>
    </div>
  );
}
