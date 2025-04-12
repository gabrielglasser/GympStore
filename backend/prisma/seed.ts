import { PrismaClient } from '@prisma/client';
import seedProducts from './seed-products';

const prisma = new PrismaClient();

async function main() {
  const categories = [
    { 
      name: "Proteínas", 
      slug: "proteinas",
      image: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d"
    },
    { 
      name: "Pré-treino", 
      slug: "pre-treino",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b"
    },
    { 
      name: "Hipercalóricos", 
      slug: "hipercaloricos",
      image: "https://images.unsplash.com/photo-1622484212850-eb596d769edc"
    },
    { 
      name: "Vitaminas", 
      slug: "vitaminas",
      image: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843"
    },
  ];

  // Criar categorias
  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: { 
        name: category.name,
        image: category.image,
        slug: category.slug
      },
      create: category,
    });
  }

  // Criar produtos
  await seedProducts();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });