"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function SobrePage() {
  return (
    <section className="flex flex-col justify-center items-center min-h-screen w-full bg-[#C76E88] px-6 sm:px-12 md:px-20 py-20 text-white relative overflow-hidden">
      <div className="relative max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center z-10">
        
        {/* TEXTO */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, amount: 0.3 }}
          className="elative max-w-2xl z-10 text-center md:text-justify flex-1"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-8 text-white drop-shadow-md !text-white">
            Como Funciona
          </h1>

          <p className="text-lg md:text-xl leading-relaxed text-white/90 font-light mb-6">
            A plataforma reúne todas as funcionalidades essenciais em um só lugar: visualização de
            espaços disponíveis, realização e cancelamento de reservas, e geração de
            relatórios para controle e acompanhamento.
          </p>

          <p className="text-lg md:text-xl leading-relaxed text-white/90 font-light mb-6">
            O processo é rápido e seguro: o usuário acessa o sistema, escolhe a data e
            o horário desejados, verifica a disponibilidade e confirma sua reserva com
            apenas alguns cliques. Reforçando o propósito do Mambee Space em promover a tecnologia como aliada
            da gestão e da educação.
          </p>

          <p className="text-lg md:text-xl leading-relaxed text-white/90 font-light">
            Ao confirmar a reserva, o usuário assegura seu espaço e conta com uma
            experiência <strong>organizada, transparente e colaborativa.</strong> 
          </p>
        </motion.div>

        {/* IMAGEM */}
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, amount: 0.3 }}
          className="flex justify-center md:justify-end"
        >

          <img
            src="sobre.png" 
            alt="Demonstração da plataforma"
            className="rounded-2xl shadow-lg max-w-full h-auto"
          />
        </motion.div>
      </div>
    </section>
  );
}
