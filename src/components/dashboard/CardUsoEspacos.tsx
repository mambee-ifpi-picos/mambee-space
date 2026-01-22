// interface CardUsoEspacosProps {
//   data?: UsoEspacosData;
// }

// export function CardUsoEspacos({ data }: CardUsoEspacosProps) {
//   if (!data) {
//     return (
//       <div className="col-span-1 bg-white p-5 rounded-lg shadow">
//         <p className="text-xs font-semibold">USO DOS ESPAÇOS (%)</p>
//         <div className="mt-4 text-center text-gray-500">Dados não disponíveis</div>
//       </div>
//     );
//   }

//   return (
//     <div className="col-span-1 bg-white p-5 rounded-lg shadow" aria-label="Uso dos espaços">
//       <p className="text-xs font-semibold">USO DOS ESPAÇOS (%)</p>

//       <div className="mt-4 flex justify-between">
//         <div className="text-center" aria-label="Uso mensal">
//           <div className="w-16 h-16 rounded-full border-4 border-teal-400 flex items-center justify-center font-bold text-teal-600 text-xl">
//             {data.mensal}%
//           </div>
//           <p className="text-xs mt-1">Mensal</p>
//         </div>

//         <div className="text-center" aria-label="Uso semanal">
//           <div className="w-16 h-16 rounded-full border-4 border-yellow-400 flex items-center justify-center font-bold text-yellow-600 text-xl">
//             {data.semanal}%
//           </div>
//           <p className="text-xs mt-1">Semanal</p>
//         </div>

//         <div className="text-center" aria-label="Uso diário">
//           <div className="w-16 h-16 rounded-full border-4 border-red-400 flex items-center justify-center font-bold text-red-600 text-xl">
//             {data.diario}%
//           </div>
//           <p className="text-xs mt-1">Diário</p>
//         </div>
//       </div>
//     </div>
//   );
// }
