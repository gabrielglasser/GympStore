import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const categories = [
    { name: "Proteínas", slug: "proteinas" },
    { name: "Pré-treino", slug: "pre-treino" },
    { name: "Hipercalóricos", slug: "hipercaloricos" },
    { name: "Vitaminas", slug: "vitaminas" },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });