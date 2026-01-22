interface CardTotalReservasProps {
  totalReservas: number;
}

export function CardTotalReservas({ totalReservas }: CardTotalReservasProps) {
  return (
    <div
      className="col-span-1 bg-teal-500 text-white p-5 rounded-lg shadow flex flex-col"
      aria-label="Card espaço mais utilizado"
    >
      <p className="text-xs font-semibold">Total de reservas</p>
      <p className="text-5xl font-extrabold mt-2">{totalReservas}</p>
    </div>
  );
}
