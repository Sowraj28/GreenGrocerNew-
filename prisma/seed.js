const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin
  const hashedAdminPassword = await bcrypt.hash('admin123', 10);
  await prisma.admin.upsert({
    where: { email: 'admin@greengrocer.com' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@greengrocer.com',
      password: hashedAdminPassword,
    },
  });

  // Create demo user
  const hashedUserPassword = await bcrypt.hash('user123', 10);
  await prisma.user.upsert({
    where: { email: 'user@demo.com' },
    update: {},
    create: {
      name: 'Demo User',
      email: 'user@demo.com',
      phone: '9876543210',
      password: hashedUserPassword,
      address: '123, Demo Street, Chennai, Tamil Nadu - 600001',
    },
  });

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({ where: { name: 'Vegetables' }, update: {}, create: { name: 'Vegetables' } }),
    prisma.category.upsert({ where: { name: 'Fruits' }, update: {}, create: { name: 'Fruits' } }),
    prisma.category.upsert({ where: { name: 'Grains & Pulses' }, update: {}, create: { name: 'Grains & Pulses' } }),
    prisma.category.upsert({ where: { name: 'Dairy' }, update: {}, create: { name: 'Dairy' } }),
    prisma.category.upsert({ where: { name: 'Spices' }, update: {}, create: { name: 'Spices' } }),
  ]);

  const [vegCat, fruitCat, grainCat, dairyCat, spiceCat] = categories;

  // Products with variants
  const products = [
    {
      name: 'Fresh Tomatoes',
      description: 'Farm fresh red tomatoes, rich in vitamins',
      imageUrl: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400',
      categoryId: vegCat.id,
      variants: [
        { weight: '500g', price: 30, stock: 100 },
        { weight: '1kg', price: 55, stock: 80 },
        { weight: '2kg', price: 100, stock: 50 },
      ],
    },
    {
      name: 'Green Spinach',
      description: 'Organic fresh spinach leaves, iron-rich',
      imageUrl: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400',
      categoryId: vegCat.id,
      variants: [
        { weight: '250g', price: 25, stock: 60 },
        { weight: '500g', price: 45, stock: 40 },
      ],
    },
    {
      name: 'Carrots',
      description: 'Fresh orange carrots, great for cooking and snacking',
      imageUrl: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400',
      categoryId: vegCat.id,
      variants: [
        { weight: '500g', price: 40, stock: 90 },
        { weight: '1kg', price: 70, stock: 70 },
      ],
    },
    {
      name: 'Alphonso Mangoes',
      description: 'Premium Alphonso mangoes from Ratnagiri',
      imageUrl: 'https://images.unsplash.com/photo-1601493700631-2851b79c5d68?w=400',
      categoryId: fruitCat.id,
      variants: [
        { weight: '500g', price: 150, stock: 30 },
        { weight: '1kg', price: 280, stock: 25 },
        { weight: '2kg', price: 520, stock: 15 },
      ],
    },
    {
      name: 'Bananas',
      description: 'Ripe yellow bananas, energy-packed',
      imageUrl: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400',
      categoryId: fruitCat.id,
      variants: [
        { weight: '500g', price: 35, stock: 100 },
        { weight: '1kg', price: 60, stock: 80 },
      ],
    },
    {
      name: 'Basmati Rice',
      description: 'Premium long-grain basmati rice, aged 2 years',
      imageUrl: 'https://images.unsplash.com/photo-1536304993881-ff86e0c9c3d4?w=400',
      categoryId: grainCat.id,
      variants: [
        { weight: '1kg', price: 120, stock: 200 },
        { weight: '2kg', price: 230, stock: 150 },
        { weight: '5kg', price: 550, stock: 100 },
      ],
    },
    {
      name: 'Toor Dal',
      description: 'Premium split pigeon peas, rich in protein',
      imageUrl: 'https://images.unsplash.com/photo-1612257999756-a65e3e5ab78d?w=400',
      categoryId: grainCat.id,
      variants: [
        { weight: '500g', price: 75, stock: 120 },
        { weight: '1kg', price: 140, stock: 100 },
      ],
    },
    {
      name: 'Full Cream Milk',
      description: 'Fresh pasteurized full cream milk',
      imageUrl: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400',
      categoryId: dairyCat.id,
      variants: [
        { weight: '500ml', price: 30, stock: 150 },
        { weight: '1L', price: 56, stock: 120 },
      ],
    },
    {
      name: 'Paneer',
      description: 'Fresh cottage cheese made from whole milk',
      imageUrl: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400',
      categoryId: dairyCat.id,
      variants: [
        { weight: '200g', price: 80, stock: 60 },
        { weight: '500g', price: 190, stock: 40 },
      ],
    },
    {
      name: 'Turmeric Powder',
      description: 'Pure organic turmeric powder',
      imageUrl: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400',
      categoryId: spiceCat.id,
      variants: [
        { weight: '100g', price: 45, stock: 200 },
        { weight: '250g', price: 100, stock: 150 },
        { weight: '500g', price: 180, stock: 100 },
      ],
    },
    {
      name: 'Red Chilli Powder',
      description: 'Hot and spicy red chilli powder',
      imageUrl: 'https://images.unsplash.com/photo-1589187153252-a1d4c5de9df8?w=400',
      categoryId: spiceCat.id,
      variants: [
        { weight: '100g', price: 40, stock: 180 },
        { weight: '250g', price: 90, stock: 120 },
      ],
    },
    {
      name: 'Onions',
      description: 'Fresh red onions, essential for everyday cooking',
      imageUrl: 'https://images.unsplash.com/photo-1518977956812-cd3dbadaaf31?w=400',
      categoryId: vegCat.id,
      variants: [
        { weight: '500g', price: 25, stock: 200 },
        { weight: '1kg', price: 45, stock: 180 },
        { weight: '2kg', price: 80, stock: 120 },
      ],
    },
  ];

  for (const productData of products) {
    const existing = await prisma.product.findFirst({ where: { name: productData.name } });
    if (!existing) {
      await prisma.product.create({
        data: {
          name: productData.name,
          description: productData.description,
          imageUrl: productData.imageUrl,
          categoryId: productData.categoryId,
          variants: {
            create: productData.variants,
          },
        },
      });
    }
  }

  console.log('✅ Seeding complete!');
  console.log('👤 Admin: admin@greengrocer.com / admin123');
  console.log('🛒 User: user@demo.com / user123');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
