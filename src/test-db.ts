import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const p = await prisma.projeto.findMany({
    select: { idProjeto: true, nome: true, situacao: true, dataInicio: true, dataFim: true }
  });
  console.log(p);
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
