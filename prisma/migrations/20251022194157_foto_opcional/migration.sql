/*
  Warnings:

  - You are about to drop the `espacos` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `reservas` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `salas` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `usuarios` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."espacos" DROP CONSTRAINT "espacos_idSalaPertence_fkey";

-- DropForeignKey
ALTER TABLE "public"."espacos" DROP CONSTRAINT "espacos_idUsuarioCriador_fkey";

-- DropForeignKey
ALTER TABLE "public"."reservas" DROP CONSTRAINT "reservas_idEspacoReservado_fkey";

-- DropForeignKey
ALTER TABLE "public"."reservas" DROP CONSTRAINT "reservas_idUsuarioCriador_fkey";

-- DropForeignKey
ALTER TABLE "public"."salas" DROP CONSTRAINT "salas_idUsuarioCriador_fkey";

-- DropTable
DROP TABLE "public"."espacos";

-- DropTable
DROP TABLE "public"."reservas";

-- DropTable
DROP TABLE "public"."salas";

-- DropTable
DROP TABLE "public"."usuarios";

-- CreateTable
CREATE TABLE "public"."Usuario" (
    "idUsuario" SERIAL NOT NULL,
    "foto" TEXT,
    "email" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "admin" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("idUsuario")
);

-- CreateTable
CREATE TABLE "public"."Sala" (
    "idSala" SERIAL NOT NULL,
    "nomeSala" TEXT NOT NULL,
    "mapa" TEXT NOT NULL,
    "limiteHorasReserva" INTEGER NOT NULL,
    "ativa" BOOLEAN NOT NULL DEFAULT true,
    "idUsuarioCriador" INTEGER NOT NULL,

    CONSTRAINT "Sala_pkey" PRIMARY KEY ("idSala")
);

-- CreateTable
CREATE TABLE "public"."Espaco" (
    "idEspaco" SERIAL NOT NULL,
    "codigoEspaco" TEXT NOT NULL,
    "idUsuarioCriador" INTEGER NOT NULL,
    "idSalaPertence" INTEGER NOT NULL,

    CONSTRAINT "Espaco_pkey" PRIMARY KEY ("idEspaco")
);

-- CreateTable
CREATE TABLE "public"."Reserva" (
    "idReserva" SERIAL NOT NULL,
    "motivo" TEXT NOT NULL,
    "horaInicio" TIMESTAMP(3) NOT NULL,
    "horaFim" TIMESTAMP(3) NOT NULL,
    "situacao" TEXT NOT NULL,
    "idUsuarioCriador" INTEGER NOT NULL,
    "idEspacoReservado" INTEGER NOT NULL,

    CONSTRAINT "Reserva_pkey" PRIMARY KEY ("idReserva")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "public"."Usuario"("email");

-- AddForeignKey
ALTER TABLE "public"."Sala" ADD CONSTRAINT "Sala_idUsuarioCriador_fkey" FOREIGN KEY ("idUsuarioCriador") REFERENCES "public"."Usuario"("idUsuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Espaco" ADD CONSTRAINT "Espaco_idUsuarioCriador_fkey" FOREIGN KEY ("idUsuarioCriador") REFERENCES "public"."Usuario"("idUsuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Espaco" ADD CONSTRAINT "Espaco_idSalaPertence_fkey" FOREIGN KEY ("idSalaPertence") REFERENCES "public"."Sala"("idSala") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Reserva" ADD CONSTRAINT "Reserva_idUsuarioCriador_fkey" FOREIGN KEY ("idUsuarioCriador") REFERENCES "public"."Usuario"("idUsuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Reserva" ADD CONSTRAINT "Reserva_idEspacoReservado_fkey" FOREIGN KEY ("idEspacoReservado") REFERENCES "public"."Espaco"("idEspaco") ON DELETE RESTRICT ON UPDATE CASCADE;
