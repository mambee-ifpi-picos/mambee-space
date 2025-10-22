-- CreateTable
CREATE TABLE "public"."usuarios" (
    "idUsuario" SERIAL NOT NULL,
    "foto" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "admin" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("idUsuario")
);

-- CreateTable
CREATE TABLE "public"."salas" (
    "idSala" SERIAL NOT NULL,
    "nomeSala" TEXT NOT NULL,
    "mapa" TEXT NOT NULL,
    "limiteHorasReserva" INTEGER NOT NULL,
    "ativa" BOOLEAN NOT NULL DEFAULT true,
    "idUsuarioCriador" INTEGER NOT NULL,

    CONSTRAINT "salas_pkey" PRIMARY KEY ("idSala")
);

-- CreateTable
CREATE TABLE "public"."espacos" (
    "idEspaco" SERIAL NOT NULL,
    "codigoEspaco" TEXT NOT NULL,
    "idUsuarioCriador" INTEGER NOT NULL,
    "idSalaPertence" INTEGER NOT NULL,

    CONSTRAINT "espacos_pkey" PRIMARY KEY ("idEspaco")
);

-- CreateTable
CREATE TABLE "public"."reservas" (
    "idReserva" SERIAL NOT NULL,
    "motivo" TEXT NOT NULL,
    "horaInicio" TIMESTAMP(3) NOT NULL,
    "horaFim" TIMESTAMP(3) NOT NULL,
    "situacao" TEXT NOT NULL,
    "idUsuarioCriador" INTEGER NOT NULL,
    "idEspacoReservado" INTEGER NOT NULL,

    CONSTRAINT "reservas_pkey" PRIMARY KEY ("idReserva")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "public"."usuarios"("email");

-- AddForeignKey
ALTER TABLE "public"."salas" ADD CONSTRAINT "salas_idUsuarioCriador_fkey" FOREIGN KEY ("idUsuarioCriador") REFERENCES "public"."usuarios"("idUsuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."espacos" ADD CONSTRAINT "espacos_idUsuarioCriador_fkey" FOREIGN KEY ("idUsuarioCriador") REFERENCES "public"."usuarios"("idUsuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."espacos" ADD CONSTRAINT "espacos_idSalaPertence_fkey" FOREIGN KEY ("idSalaPertence") REFERENCES "public"."salas"("idSala") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reservas" ADD CONSTRAINT "reservas_idUsuarioCriador_fkey" FOREIGN KEY ("idUsuarioCriador") REFERENCES "public"."usuarios"("idUsuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reservas" ADD CONSTRAINT "reservas_idEspacoReservado_fkey" FOREIGN KEY ("idEspacoReservado") REFERENCES "public"."espacos"("idEspaco") ON DELETE RESTRICT ON UPDATE CASCADE;
