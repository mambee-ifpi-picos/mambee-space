export default function SobrePage() {
  return (
    <div className="flex flex-col min-h-screen w-screen">
      <section className="flex-1 bg-[#C76E88] w-full px-4 py-8 sm:py-12 md:py-16 lg:py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold !text-black mb-6">
            Como Funciona
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white leading-relaxed text-justify">
            O Mambee Space foi desenvolvido para tornar o agendamento da sala Mambee simples e acessível, oferecendo praticidade e
            organização no uso do espaço. A plataforma reúne funcionalidades essenciais, como visualização dos espaços disponíveis,
            realização e cancelamento de reservas, além da geração de relatórios para melhor controle e acompanhamento. O processo
            é rápido e seguro: o usuário acessa o sistema, escolhe a data e o horário desejados, verifica a disponibilidade e
            confirma a reserva em poucos cliques, aberto ao público em geral, o Mambee Space garante que todos possam usufruir
            de um ambiente adequado para estudos, reuniões e projetos. Ao confirmar a reserva, o usuário assegura seu espaço e
            pode utilizar a sala no período escolhido de forma organizada e transparente.
          </p>
        </div>
      </section>
    </div>
  );
}