/*
  Warnings:

  - A unique constraint covering the columns `[idAuth]` on the table `Usuario` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN     "idAuth" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_idAuth_key" ON "Usuario"("idAuth");
