import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedProducts() {
  const categories = await prisma.category.findMany();

  // Produtos para categoria Proteínas
  const proteinProducts = [
    {
      id: '1', 
      name: "Whey Protein Gold Standard",
      description: "Proteína isolada de alta qualidade para ganho muscular",
      price: 159.90,
      stock: 50,
      images: ["https://images.unsplash.com/photo-1593095948071-474c5cc2989d"],
      categoryId: categories.find(c => c.slug === "proteinas")?.id,
      brand: "Optimum Nutrition",
      weight: 900,
      flavor: "Chocolate"
    },
    {
      id: '2',
      name: "Whey Protein Isolate",
      description: "Proteína isolada com alto valor biológico",
      price: 179.90,
      stock: 30,
      images: ["https://images.unsplash.com/photo-1579722820308-d74e571900a9"],
      categoryId: categories.find(c => c.slug === "proteinas")?.id,
      brand: "Dymatize",
      weight: 900,
      flavor: "Baunilha"
    },
    {
      id: '3',
      name: "Whey Protein Concentrate",
      description: "Proteína concentrada para recuperação muscular",
      price: 129.90,
      stock: 45,
      images: ["https://images.unsplash.com/photo-1593095948071-474c5cc2989d"],
      categoryId: categories.find(c => c.slug === "proteinas")?.id,
      brand: "Max Titanium",
      weight: 900,
      flavor: "Morango"
    },
    {
      id: '4',
      name: "ISO Whey Zero",
      description: "Proteína isolada zero lactose",
      price: 199.90,
      stock: 25,
      images: ["https://images.unsplash.com/photo-1579722820308-d74e571900a9"],
      categoryId: categories.find(c => c.slug === "proteinas")?.id,
      brand: "BioTech USA",
      weight: 900,
      flavor: "Cookies"
    },
    {
      id: '5',
      name: "Beef Protein",
      description: "Proteína isolada da carne bovina",
      price: 169.90,
      stock: 35,
      images: ["https://images.unsplash.com/photo-1593095948071-474c5cc2989d"],
      categoryId: categories.find(c => c.slug === "proteinas")?.id,
      brand: "Growth",
      weight: 900,
      flavor: "Chocolate"
    }
  ];

  // Produtos para categoria Pré-treino
  const preWorkoutProducts = [
    {
      id: '6',
      name: "C4 Original",
      description: "Pré-treino para energia e foco",
      price: 149.90,
      stock: 40,
      images: ["https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b"],
      categoryId: categories.find(c => c.slug === "pre-treino")?.id,
      brand: "Cellucor",
      weight: 300,
      flavor: "Frutas Vermelhas"
    },
    {
      id: '7',
      name: "Jack3d",
      description: "Pré-treino para energia extrema",
      price: 159.90,
      stock: 30,
      images: ["https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b"],
      categoryId: categories.find(c => c.slug === "pre-treino")?.id,
      brand: "USP Labs",
      weight: 250,
      flavor: "Uva"
    },
    {
      id: '8',
      name: "Pre HD",
      description: "Pré-treino com beta-alanina",
      price: 129.90,
      stock: 35,
      images: ["https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b"],
      categoryId: categories.find(c => c.slug === "pre-treino")?.id,
      brand: "BPI Sports",
      weight: 300,
      flavor: "Limão"
    },
    {
      id: '9',
      name: "Pump Extreme",
      description: "Pré-treino para bombas musculares",
      price: 139.90,
      stock: 25,
      images: ["https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b"],
      categoryId: categories.find(c => c.slug === "pre-treino")?.id,
      brand: "Dragon Pharma",
      weight: 300,
      flavor: "Laranja"
    },
    {
      id: '10',
      name: "NO Xplode",
      description: "Pré-treino clássico para energia",
      price: 169.90,
      stock: 30,
      images: ["https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b"],
      categoryId: categories.find(c => c.slug === "pre-treino")?.id,
      brand: "BSN",
      weight: 300,
      flavor: "Melancia"
    }
  ];

  // Produtos para categoria Hipercalóricos
  const massGainerProducts = [
    {
      id: '11',
      name: "Mass Titanium",
      description: "Hipercalórico para ganho de massa",
      price: 189.90,
      stock: 40,
      images: ["https://images.unsplash.com/photo-1622484212850-eb596d769edc"],
      categoryId: categories.find(c => c.slug === "hipercaloricos")?.id,
      brand: "Max Titanium",
      weight: 3000,
      flavor: "Chocolate"
    },
    {
      id: '12',
      name: "Serious Mass",
      description: "Hipercalórico com alto teor de carboidratos",
      price: 219.90,
      stock: 25,
      images: ["https://images.unsplash.com/photo-1622484212850-eb596d769edc"],
      categoryId: categories.find(c => c.slug === "hipercaloricos")?.id,
      brand: "Optimum Nutrition",
      weight: 2727,
      flavor: "Baunilha"
    },
    {
      id: '13',
      name: "Mass Gainer",
      description: "Hipercalórico para ganho de peso",
      price: 169.90,
      stock: 35,
      images: ["https://images.unsplash.com/photo-1622484212850-eb596d769edc"],
      categoryId: categories.find(c => c.slug === "hipercaloricos")?.id,
      brand: "Growth",
      weight: 3000,
      flavor: "Morango"
    },
    {
      id: '14',
      name: "Hiper Mass",
      description: "Hipercalórico com blend de proteínas",
      price: 179.90,
      stock: 30,
      images: ["https://images.unsplash.com/photo-1622484212850-eb596d769edc"],
      categoryId: categories.find(c => c.slug === "hipercaloricos")?.id,
      brand: "Atlhetica",
      weight: 3000,
      flavor: "Cookies"
    },
    {
      id: '15',
      name: "Super Mass",
      description: "Hipercalórico premium",
      price: 199.90,
      stock: 20,
      images: ["https://images.unsplash.com/photo-1622484212850-eb596d769edc"],
      categoryId: categories.find(c => c.slug === "hipercaloricos")?.id,
      brand: "Integral Médica",
      weight: 3000,
      flavor: "Chocolate"
    }
  ];

  // Produtos para categoria Vitaminas
  const vitaminProducts = [
    {
      id: '16',
      name: "Multivitamínico Daily",
      description: "Complexo vitamínico completo",
      price: 49.90,
      stock: 60,
      images: ["https://images.unsplash.com/photo-1584017911766-d451b3d0e843"],
      categoryId: categories.find(c => c.slug === "vitaminas")?.id,
      brand: "Vitafor",
      weight: 60,
      flavor: null
    },
    {
      id: '17',
      name: "Vitamina D3",
      description: "Suplemento de vitamina D3 5000UI",
      price: 39.90,
      stock: 50,
      images: ["https://images.unsplash.com/photo-1584017911766-d451b3d0e843"],
      categoryId: categories.find(c => c.slug === "vitaminas")?.id,
      brand: "Now Foods",
      weight: 30,
      flavor: null
    },
    {
      id: '18',
      name: "Ômega 3",
      description: "Suplemento de ômega 3 EPA/DHA",
      price: 69.90,
      stock: 45,
      images: ["https://images.unsplash.com/photo-1584017911766-d451b3d0e843"],
      categoryId: categories.find(c => c.slug === "vitaminas")?.id,
      brand: "Essential",
      weight: 90,
      flavor: null
    },
    {
      id: '19',
      name: "ZMA",
      description: "Suplemento de Zinco, Magnésio e B6",
      price: 59.90,
      stock: 40,
      images: ["https://images.unsplash.com/photo-1584017911766-d451b3d0e843"],
      categoryId: categories.find(c => c.slug === "vitaminas")?.id,
      brand: "Profit",
      weight: 90,
      flavor: null
    },
    {
      id: '20',
      name: "Vitamina C",
      description: "Suplemento de vitamina C 1000mg",
      price: 29.90,
      stock: 55,
      images: ["https://images.unsplash.com/photo-1584017911766-d451b3d0e843"],
      categoryId: categories.find(c => c.slug === "vitaminas")?.id,
      brand: "Sundown",
      weight: 30,
      flavor: null
    }
  ];

  // Criar os produtos no banco de dados
  const allProducts = [
    ...proteinProducts,
    ...preWorkoutProducts,
    ...massGainerProducts,
    ...vitaminProducts
  ];

  for (const product of allProducts) {
    if (!product.categoryId) {
      console.error(`Categoria não encontrada para o produto ${product.name}`);
      continue;
    }

    await prisma.product.upsert({
      where: {
        id: product.id 
      },
      update: {
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        images: product.images,
        categoryId: product.categoryId,
        brand: product.brand,
        weight: product.weight,
        flavor: product.flavor || null
      },
      create: {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        images: product.images,
        categoryId: product.categoryId,
        brand: product.brand,
        weight: product.weight,
        flavor: product.flavor || null
      }
    });
  }

  console.log('Produtos cadastrados com sucesso!');
}

export default seedProducts;