import Sobre from "@/components/sobre";
import Relatorios from "@/components/relatorios";

export default function Home() {
  return (
    <>
      <div className="flex flex-col justify-center min-h-screen bg-gray-50 px-6 sm:px-12 md:px-20 lg:px-32">
        <div className="w-full max-w-5xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-6 text-center md:text-left">
            O que é o{" "}
            <span className="text-[#C76E88] drop-shadow-sm">Mambee</span> Space?
          </h1>

          <p className="text-gray-700 text-base sm:text-lg md:text-xl leading-relaxed text-justify">
            O Mambee Space é um sistema online desenvolvido para o agendamento
            de espaços em salas. A primeira sala utilizando o sistema é a Mambee
            (Fábrica e escola de Software), localizada no Instituto Federal do
            Piauí (IFPI). Criado com o objetivo de organizar e facilitar o
            acesso ao espaço, o serviço oferece visualização dos espaços
            disponíveis, realização e cancelamento de reservas, além da geração
            de relatórios. A plataforma garante praticidade, transparência e
            acessibilidade, permitindo que cada usuário reserve seu horário de
            forma simples e segura, assegurando um ambiente adequado para
            estudos, reuniões e projetos.
          </p>
        </div>
      </div>
      <Sobre />
      <Relatorios />
    </>
  );
}
