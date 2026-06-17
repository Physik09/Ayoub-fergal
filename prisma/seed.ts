import 'dotenv/config';
import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const url = process.env.DATABASE_URL;
if (!url) throw new Error('DATABASE_URL is not set');
const adapter = new PrismaPg({ connectionString: url });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seeding database...');

  const adminEmail = 'admin@ayoubfergal.com';
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const adminUser = await prisma.user.create({
      data: {
        email: adminEmail,
        name: 'Admin Ayoub Fergal',
        role: 'ADMIN',
        phone: '+212600000000',
      },
    });

    await prisma.admin.create({
      data: {
        userId: adminUser.id,
        role: 'SUPER_ADMIN',
      },
    });

    console.log(`✅ Admin created: ${adminEmail}`);
  }

  const categories = [
    { slug: 'hoodies', nameFr: 'Hoodies', nameAr: 'هوديز', sortOrder: 1 },
    { slug: 'sweatpants', nameFr: 'Sweatpants', nameAr: 'سويت بنط', sortOrder: 2 },
    { slug: 't-shirts', nameFr: 'T-Shirts', nameAr: 'تيشيرتات', sortOrder: 3 },
    { slug: 'jackets', nameFr: 'Jackets', nameAr: 'جواكت', sortOrder: 4 },
    { slug: 'accessoires', nameFr: 'Accessoires', nameAr: 'إكسسوارات', sortOrder: 5 },
  ];

  for (const cat of categories) {
    const existing = await prisma.category.findUnique({ where: { slug: cat.slug } });
    if (!existing) {
      await prisma.category.create({ data: cat });
      console.log(`  ✅ Category: ${cat.nameFr}`);
    }
  }

  const supplierData = {
    name: 'Fournisseur Principal',
    contactPerson: 'Karim Benchekroun',
    phone: '+212612345678',
    email: 'karim@fournisseur.ma',
    isActive: true,
  };

  const existingSupplier = await prisma.supplier.findFirst({
    where: { name: supplierData.name },
  });

  if (!existingSupplier) {
    await prisma.supplier.create({ data: supplierData });
    console.log(`  ✅ Supplier: ${supplierData.name}`);
  }

  const supplier = await prisma.supplier.findFirstOrThrow({
    where: { name: supplierData.name },
  });

  const allCategories = await prisma.category.findMany();

  const products = [
    {
      slug: 'hoodie-premium-noir',
      nameFr: 'Hoodie Premium Noir',
      nameAr: 'هودي بريميوم أسود',
      descriptionFr: 'Hoodie premium en coton épais. Coupe oversized, capuche doublée, poche kangourou.',
      descriptionAr: 'هودي بريميوم من القطن السميك. قصّة واسعة، غطاء رأس مبطن، جيب كنغر.',
      sellPrice: 450,
      images: ['/images/products/hoodie-premium-noir.jpg'],
      status: 'ACTIVE' as const,
      featured: true,
      categorySlug: 'hoodies',
    },
    {
      slug: 'sweatpants-cargo-kaki',
      nameFr: 'Sweatpants Cargo Kaki',
      nameAr: 'سويت بنط كارغو كاكي',
      descriptionFr: 'Sweatpants cargo confortable avec poches latérales. Taille élastique avec cordon.',
      descriptionAr: 'سويت بنط كارغو مريح مع جيوب جانبية. خصر مطاطي مع رباط.',
      sellPrice: 380,
      images: ['/images/products/sweatpants-cargo-kaki.jpg'],
      status: 'ACTIVE' as const,
      featured: true,
      categorySlug: 'sweatpants',
    },
    {
      slug: 't-shirt-classique-blanc',
      nameFr: 'T-Shirt Classique Blanc',
      nameAr: 'تيشيرت كلاسيك أبيض',
      descriptionFr: 'T-shirt en coton peigné 100%. Coupe regular, col rond renforcé.',
      descriptionAr: 'تيشيرت من القطن الممشط 100%. قصّة عادية، ياقة مدورة معززة.',
      sellPrice: 199,
      images: ['/images/products/t-shirt-classique-blanc.jpg'],
      status: 'ACTIVE' as const,
      featured: true,
      categorySlug: 't-shirts',
    },
    {
      slug: 'veste-zippee-noire',
      nameFr: 'Veste Zippée Noire',
      nameAr: 'سترة بسحاب أسود',
      descriptionFr: 'Veste légère zippée avec col montant. Idéale pour la mi-saison.',
      descriptionAr: 'سترة خفيفة بسحاب مع ياقة عالية. مثالية لفصل الخريف.',
      sellPrice: 520,
      images: ['/images/products/veste-zippee-noire.jpg'],
      status: 'ACTIVE' as const,
      featured: false,
      categorySlug: 'jackets',
    },
    {
      slug: 'casquette-trucker-gold',
      nameFr: 'Casquette Trucker Gold',
      nameAr: 'كاب تركر جولد',
      descriptionFr: 'Casquette trucker avec broderie AF. Devant en coton, dos en mesh.',
      descriptionAr: 'كاب تركر مع تطريز AF. أمامية من القطن، خلفية من الشبك.',
      sellPrice: 150,
      images: ['/images/products/casquette-trucker-gold.jpg'],
      status: 'ACTIVE' as const,
      featured: false,
      categorySlug: 'accessoires',
    },
    {
      slug: 'hoodie-oversized-gris',
      nameFr: 'Hoodie Oversized Gris',
      nameAr: 'هودي أوفر سايزد رمادي',
      descriptionFr: 'Hoodie oversized en molleton gris foncé. Coupe large et confortable.',
      descriptionAr: 'هودي أوفر سايزد من الصوف الرمادي الغامق. قصّة واسعة ومريحة.',
      sellPrice: 490,
      images: ['/images/products/hoodie-oversized-gris.jpg'],
      status: 'ACTIVE' as const,
      featured: true,
      categorySlug: 'hoodies',
    },
  ];

  for (const product of products) {
    const category = allCategories.find((c) => c.slug === product.categorySlug);
    if (!category) continue;

    const existing = await prisma.product.findUnique({ where: { slug: product.slug } });
    if (existing) {
      await prisma.product.update({
        where: { id: existing.id },
        data: { images: product.images },
      });
      console.log(`  📸 Updated images: ${product.nameFr}`);
    } else {
      const created = await prisma.product.create({
        data: {
          slug: product.slug,
          nameFr: product.nameFr,
          nameAr: product.nameAr,
          descriptionFr: product.descriptionFr,
          descriptionAr: product.descriptionAr,
          sellPrice: product.sellPrice,
          images: product.images,
          status: product.status,
          featured: product.featured,
          categoryId: category.id,
          supplierId: supplier.id,
        },
      });

      const sizes = ['S', 'M', 'L', 'XL'];
      for (const size of sizes) {
        await prisma.productVariant.create({
          data: {
            productId: created.id,
            size,
            stock: Math.floor(Math.random() * 20) + 3,
            sku: `${product.slug}-${size}`.toUpperCase(),
          },
        });
      }

      console.log(`  ✅ Product: ${product.nameFr}`);
    }
  }

  console.log('✅ Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
