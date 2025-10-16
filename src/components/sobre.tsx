"use client";

import { motion } from "framer-motion";

export default function SobrePage() {
  return (
    <section className="flex flex-col justify-center items-center min-h-screen w-full bg-[#C76E88] px-6 sm:px-12 md:px-20 py-20 text-white relative overflow-hidden">
      <motion.div
  initial={{ opacity: 0, y: 50 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.7 }}
  viewport={{ once: true, amount: 0.3 }}
  className="relative max-w-5xl z-10 text-center md:text-justify"
>

        <h1 className="text-4xl sm:text-5xl font-extrabold mb-8 text-black drop-shadow-md text-center md:text-left">
          Como Funciona
        </h1>

        <p className="text-lg md:text-xl leading-relaxed text-white/90 font-light mb-6">
          O <strong>Mambee Space</strong> foi criado para tornar o agendamento da
          sala Mambee <strong>simples, acessível e eficiente</strong>. A plataforma
          reúne todas as funcionalidades essenciais em um só lugar: visualização de
          espaços disponíveis, realização e cancelamento de reservas, e geração de
          relatórios para controle e acompanhamento.
        </p>

        <p className="text-lg md:text-xl leading-relaxed text-white/90 font-light mb-6">
          O processo é rápido e seguro: o usuário acessa o sistema, escolhe a data e
          o horário desejados, verifica a disponibilidade e confirma sua reserva com
          apenas alguns cliques. Aberto ao público em geral, o Mambee Space garante
          que todos possam usufruir de um ambiente adequado para estudos, reuniões e
          projetos.
        </p>

        <p className="text-lg md:text-xl leading-relaxed text-white/90 font-light">
          Ao confirmar a reserva, o usuário assegura seu espaço e conta com uma
          experiência <strong>organizada, transparente e colaborativa</strong> —
          reforçando o propósito do Mambee Space em promover a tecnologia como aliada
          da gestão e da educação.
        </p>
      </motion.div>
    </section>
  );
}
