const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const categories = [
  { name: '상의', nameEn: 'Tops', slug: 'tops', description: 'Shirts, T-shirts, and tops' },
  { name: '하의', nameEn: 'Bottoms', slug: 'bottoms', description: 'Pants, skirts, and bottoms' },
  { name: '아우터', nameEn: 'Outerwear', slug: 'outerwear', description: 'Coats, jackets, and outerwear' },
  { name: '악세서리', nameEn: 'Accessories', slug: 'accessories', description: 'Bags, hats, and accessories' },
];

const products = [
  {
    name: 'Minimalist Black Blazer',
    nameEn: 'Minimalist Black Blazer',
    description: 'Tailored blazer with clean lines and minimal detailing. Perfect for layering.',
    price: 289,
    comparePrice: 350,
    sku: 'BLZ-001',
    slug: 'minimalist-black-blazer',
    status: 'active',
    featured: true,
    gender: 'unisex',
    images: JSON.stringify(['https://images.unsplash.com/photo-1629922949137-e236a5ab497d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwZmFzaGlvbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc2MTU0OTQ3M3ww&ixlib=rb-4.1.0&q=80&w=1080']),
    categorySlug: 'outerwear',
    variants: [
      { size: 'XS', color: 'Black', stock: 10, sku: 'BLZ-001-XS-BLK' },
      { size: 'S', color: 'Black', stock: 15, sku: 'BLZ-001-S-BLK' },
      { size: 'M', color: 'Black', stock: 20, sku: 'BLZ-001-M-BLK' },
      { size: 'L', color: 'Black', stock: 15, sku: 'BLZ-001-L-BLK' },
      { size: 'XL', color: 'Black', stock: 10, sku: 'BLZ-001-XL-BLK' },
      { size: 'XS', color: 'Cream', stock: 8, sku: 'BLZ-001-XS-CRM' },
      { size: 'S', color: 'Cream', stock: 12, sku: 'BLZ-001-S-CRM' },
      { size: 'M', color: 'Cream', stock: 18, sku: 'BLZ-001-M-CRM' },
      { size: 'L', color: 'Cream', stock: 12, sku: 'BLZ-001-L-CRM' },
      { size: 'XL', color: 'Cream', stock: 8, sku: 'BLZ-001-XL-CRM' },
    ]
  },
  {
    name: 'Editorial Coat',
    nameEn: 'Editorial Coat',
    description: 'Oversized coat with dramatic silhouette. Statement piece for any wardrobe.',
    price: 445,
    comparePrice: 550,
    sku: 'COT-002',
    slug: 'editorial-coat',
    status: 'active',
    featured: true,
    gender: 'women',
    images: JSON.stringify(['https://images.unsplash.com/photo-1611702817465-8dedb5de2103?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZGl0b3JpYWwlMjBmYXNoaW9uJTIwYmxhY2t8ZW58MXx8fHwxNzYxNjMyNDgwfDA&ixlib=rb-4.1.0&q=80&w=1080']),
    categorySlug: 'outerwear',
    variants: [
      { size: 'XS', color: 'Black', stock: 5, sku: 'COT-002-XS-BLK' },
      { size: 'S', color: 'Black', stock: 8, sku: 'COT-002-S-BLK' },
      { size: 'M', color: 'Black', stock: 10, sku: 'COT-002-M-BLK' },
      { size: 'L', color: 'Black', stock: 8, sku: 'COT-002-L-BLK' },
    ]
  },
  {
    name: 'Studio Collection Shirt',
    nameEn: 'Studio Collection Shirt',
    description: 'Clean white shirt perfect for professional settings. Versatile and timeless.',
    price: 165,
    comparePrice: 200,
    sku: 'SHT-003',
    slug: 'studio-collection-shirt',
    status: 'active',
    featured: true,
    gender: 'unisex',
    images: JSON.stringify(['https://images.unsplash.com/photo-1715541448446-3369e1cc0ee9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwbW9kZWwlMjBzdHVkaW98ZW58MXx8fHwxNzYxNTUwMzg2fDA&ixlib=rb-4.1.0&q=80&w=1080']),
    categorySlug: 'tops',
    variants: [
      { size: 'XS', color: 'White', stock: 20, sku: 'SHT-003-XS-WHT' },
      { size: 'S', color: 'White', stock: 25, sku: 'SHT-003-S-WHT' },
      { size: 'M', color: 'White', stock: 30, sku: 'SHT-003-M-WHT' },
      { size: 'L', color: 'White', stock: 25, sku: 'SHT-003-L-WHT' },
      { size: 'XL', color: 'White', stock: 20, sku: 'SHT-003-XL-WHT' },
      { size: 'XS', color: 'Black', stock: 15, sku: 'SHT-003-XS-BLK' },
      { size: 'S', color: 'Black', stock: 20, sku: 'SHT-003-S-BLK' },
      { size: 'M', color: 'Black', stock: 25, sku: 'SHT-003-M-BLK' },
      { size: 'L', color: 'Black', stock: 20, sku: 'SHT-003-L-BLK' },
      { size: 'XL', color: 'Black', stock: 15, sku: 'SHT-003-XL-BLK' },
      { size: 'XS', color: 'Cream', stock: 12, sku: 'SHT-003-XS-CRM' },
      { size: 'S', color: 'Cream', stock: 18, sku: 'SHT-003-S-CRM' },
      { size: 'M', color: 'Cream', stock: 22, sku: 'SHT-003-M-CRM' },
      { size: 'L', color: 'Cream', stock: 18, sku: 'SHT-003-L-CRM' },
      { size: 'XL', color: 'Cream', stock: 12, sku: 'SHT-003-XL-CRM' },
    ]
  },
  {
    name: 'Wide Leg Trousers',
    nameEn: 'Wide Leg Trousers',
    description: 'Comfortable wide-leg trousers with a modern fit. Perfect for both casual and formal occasions.',
    price: 220,
    comparePrice: 280,
    sku: 'TRS-004',
    slug: 'wide-leg-trousers',
    status: 'active',
    featured: false,
    gender: 'unisex',
    images: JSON.stringify(['https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=800']),
    categorySlug: 'bottoms',
    variants: [
      { size: 'XS', color: 'Black', stock: 10, sku: 'TRS-004-XS-BLK' },
      { size: 'S', color: 'Black', stock: 15, sku: 'TRS-004-S-BLK' },
      { size: 'M', color: 'Black', stock: 20, sku: 'TRS-004-M-BLK' },
      { size: 'L', color: 'Black', stock: 15, sku: 'TRS-004-L-BLK' },
      { size: 'XL', color: 'Black', stock: 10, sku: 'TRS-004-XL-BLK' },
      { size: 'XS', color: 'Navy', stock: 8, sku: 'TRS-004-XS-NVY' },
      { size: 'S', color: 'Navy', stock: 12, sku: 'TRS-004-S-NVY' },
      { size: 'M', color: 'Navy', stock: 18, sku: 'TRS-004-M-NVY' },
      { size: 'L', color: 'Navy', stock: 12, sku: 'TRS-004-L-NVY' },
      { size: 'XL', color: 'Navy', stock: 8, sku: 'TRS-004-XL-NVY' },
    ]
  },
  {
    name: 'Leather Jacket',
    nameEn: 'Leather Jacket',
    description: 'Classic leather jacket with modern fit. Timeless style that never goes out of fashion.',
    price: 520,
    comparePrice: 650,
    sku: 'JKT-005',
    slug: 'leather-jacket',
    status: 'active',
    featured: true,
    gender: 'unisex',
    images: JSON.stringify(['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800']),
    categorySlug: 'outerwear',
    variants: [
      { size: 'S', color: 'Black', stock: 8, sku: 'JKT-005-S-BLK' },
      { size: 'M', color: 'Black', stock: 12, sku: 'JKT-005-M-BLK' },
      { size: 'L', color: 'Black', stock: 10, sku: 'JKT-005-L-BLK' },
      { size: 'XL', color: 'Black', stock: 8, sku: 'JKT-005-XL-BLK' },
      { size: 'S', color: 'Brown', stock: 6, sku: 'JKT-005-S-BRN' },
      { size: 'M', color: 'Brown', stock: 10, sku: 'JKT-005-M-BRN' },
      { size: 'L', color: 'Brown', stock: 8, sku: 'JKT-005-L-BRN' },
      { size: 'XL', color: 'Brown', stock: 6, sku: 'JKT-005-XL-BRN' },
    ]
  },
  {
    name: 'Cashmere Sweater',
    nameEn: 'Cashmere Sweater',
    description: 'Luxurious cashmere sweater for ultimate comfort and warmth.',
    price: 380,
    comparePrice: 480,
    sku: 'SWT-006',
    slug: 'cashmere-sweater',
    status: 'active',
    featured: true,
    gender: 'unisex',
    images: JSON.stringify(['https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800']),
    categorySlug: 'tops',
    variants: [
      { size: 'XS', color: 'Beige', stock: 10, sku: 'SWT-006-XS-BGE' },
      { size: 'S', color: 'Beige', stock: 15, sku: 'SWT-006-S-BGE' },
      { size: 'M', color: 'Beige', stock: 20, sku: 'SWT-006-M-BGE' },
      { size: 'L', color: 'Beige', stock: 15, sku: 'SWT-006-L-BGE' },
      { size: 'XL', color: 'Beige', stock: 10, sku: 'SWT-006-XL-BGE' },
      { size: 'XS', color: 'Gray', stock: 8, sku: 'SWT-006-XS-GRY' },
      { size: 'S', color: 'Gray', stock: 12, sku: 'SWT-006-S-GRY' },
      { size: 'M', color: 'Gray', stock: 18, sku: 'SWT-006-M-GRY' },
      { size: 'L', color: 'Gray', stock: 12, sku: 'SWT-006-L-GRY' },
      { size: 'XL', color: 'Gray', stock: 8, sku: 'SWT-006-XL-GRY' },
    ]
  },
  {
    name: 'Minimalist Pants',
    nameEn: 'Minimalist Pants',
    description: 'Clean and simple pants perfect for everyday wear.',
    price: 195,
    comparePrice: 250,
    sku: 'PTS-007',
    slug: 'minimalist-pants',
    status: 'active',
    featured: false,
    gender: 'men',
    images: JSON.stringify(['https://images.unsplash.com/photo-1506629905607-db4a7c0b73c5?w=800']),
    categorySlug: 'bottoms',
    variants: [
      { size: '28', color: 'Black', stock: 15, sku: 'PTS-007-28-BLK' },
      { size: '30', color: 'Black', stock: 20, sku: 'PTS-007-30-BLK' },
      { size: '32', color: 'Black', stock: 25, sku: 'PTS-007-32-BLK' },
      { size: '34', color: 'Black', stock: 20, sku: 'PTS-007-34-BLK' },
      { size: '36', color: 'Black', stock: 15, sku: 'PTS-007-36-BLK' },
      { size: '28', color: 'Navy', stock: 12, sku: 'PTS-007-28-NVY' },
      { size: '30', color: 'Navy', stock: 18, sku: 'PTS-007-30-NVY' },
      { size: '32', color: 'Navy', stock: 22, sku: 'PTS-007-32-NVY' },
      { size: '34', color: 'Navy', stock: 18, sku: 'PTS-007-34-NVY' },
      { size: '36', color: 'Navy', stock: 12, sku: 'PTS-007-36-NVY' },
    ]
  },
  {
    name: 'Silk Blouse',
    nameEn: 'Silk Blouse',
    description: 'Elegant silk blouse perfect for special occasions.',
    price: 245,
    comparePrice: 320,
    sku: 'BLS-008',
    slug: 'silk-blouse',
    status: 'active',
    featured: true,
    gender: 'women',
    images: JSON.stringify(['https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800']),
    categorySlug: 'tops',
    variants: [
      { size: 'XS', color: 'White', stock: 10, sku: 'BLS-008-XS-WHT' },
      { size: 'S', color: 'White', stock: 15, sku: 'BLS-008-S-WHT' },
      { size: 'M', color: 'White', stock: 20, sku: 'BLS-008-M-WHT' },
      { size: 'L', color: 'White', stock: 15, sku: 'BLS-008-L-WHT' },
      { size: 'XS', color: 'Pink', stock: 8, sku: 'BLS-008-XS-PNK' },
      { size: 'S', color: 'Pink', stock: 12, sku: 'BLS-008-S-PNK' },
      { size: 'M', color: 'Pink', stock: 18, sku: 'BLS-008-M-PNK' },
      { size: 'L', color: 'Pink', stock: 12, sku: 'BLS-008-L-PNK' },
    ]
  },
  {
    name: 'Wool Scarf',
    nameEn: 'Wool Scarf',
    description: 'Warm and stylish wool scarf for the colder months.',
    price: 85,
    comparePrice: 120,
    sku: 'SCF-009',
    slug: 'wool-scarf',
    status: 'active',
    featured: false,
    gender: 'unisex',
    images: JSON.stringify(['https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800']),
    categorySlug: 'accessories',
    variants: [
      { size: 'One Size', color: 'Gray', stock: 30, sku: 'SCF-009-OS-GRY' },
      { size: 'One Size', color: 'Navy', stock: 25, sku: 'SCF-009-OS-NVY' },
      { size: 'One Size', color: 'Beige', stock: 25, sku: 'SCF-009-OS-BGE' },
      { size: 'One Size', color: 'Black', stock: 30, sku: 'SCF-009-OS-BLK' },
    ]
  },
  {
    name: 'Leather Bag',
    nameEn: 'Leather Bag',
    description: 'Premium leather bag with spacious interior.',
    price: 420,
    comparePrice: 550,
    sku: 'BAG-010',
    slug: 'leather-bag',
    status: 'active',
    featured: true,
    gender: 'unisex',
    images: JSON.stringify(['https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800']),
    categorySlug: 'accessories',
    variants: [
      { size: 'One Size', color: 'Black', stock: 15, sku: 'BAG-010-OS-BLK' },
      { size: 'One Size', color: 'Brown', stock: 12, sku: 'BAG-010-OS-BRN' },
      { size: 'One Size', color: 'Tan', stock: 10, sku: 'BAG-010-OS-TAN' },
    ]
  },
  {
    name: 'Denim Jacket',
    nameEn: 'Denim Jacket',
    description: 'Classic denim jacket with modern fit.',
    price: 180,
    comparePrice: 240,
    sku: 'DNM-011',
    slug: 'denim-jacket',
    status: 'active',
    featured: false,
    gender: 'unisex',
    images: JSON.stringify(['https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=800']),
    categorySlug: 'outerwear',
    variants: [
      { size: 'XS', color: 'Blue', stock: 12, sku: 'DNM-011-XS-BLU' },
      { size: 'S', color: 'Blue', stock: 18, sku: 'DNM-011-S-BLU' },
      { size: 'M', color: 'Blue', stock: 22, sku: 'DNM-011-M-BLU' },
      { size: 'L', color: 'Blue', stock: 18, sku: 'DNM-011-L-BLU' },
      { size: 'XL', color: 'Blue', stock: 12, sku: 'DNM-011-XL-BLU' },
      { size: 'XS', color: 'Black', stock: 10, sku: 'DNM-011-XS-BLK' },
      { size: 'S', color: 'Black', stock: 15, sku: 'DNM-011-S-BLK' },
      { size: 'M', color: 'Black', stock: 20, sku: 'DNM-011-M-BLK' },
      { size: 'L', color: 'Black', stock: 15, sku: 'DNM-011-L-BLK' },
      { size: 'XL', color: 'Black', stock: 10, sku: 'DNM-011-XL-BLK' },
    ]
  },
  {
    name: 'Knit Cardigan',
    nameEn: 'Knit Cardigan',
    description: 'Comfortable knit cardigan perfect for layering.',
    price: 195,
    comparePrice: 260,
    sku: 'CRD-012',
    slug: 'knit-cardigan',
    status: 'active',
    featured: true,
    gender: 'women',
    images: JSON.stringify(['https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=800']),
    categorySlug: 'outerwear',
    variants: [
      { size: 'XS', color: 'Cream', stock: 10, sku: 'CRD-012-XS-CRM' },
      { size: 'S', color: 'Cream', stock: 15, sku: 'CRD-012-S-CRM' },
      { size: 'M', color: 'Cream', stock: 20, sku: 'CRD-012-M-CRM' },
      { size: 'L', color: 'Cream', stock: 15, sku: 'CRD-012-L-CRM' },
      { size: 'XS', color: 'Beige', stock: 8, sku: 'CRD-012-XS-BGE' },
      { size: 'S', color: 'Beige', stock: 12, sku: 'CRD-012-S-BGE' },
      { size: 'M', color: 'Beige', stock: 18, sku: 'CRD-012-M-BGE' },
      { size: 'L', color: 'Beige', stock: 12, sku: 'CRD-012-L-BGE' },
    ]
  },
];

async function main() {
  console.log('🌱 Starting seed...');

  // Create categories
  console.log('📁 Creating categories...');
  const categoryMap = {};
  for (const categoryData of categories) {
    const category = await prisma.category.upsert({
      where: { slug: categoryData.slug },
      update: categoryData,
      create: categoryData,
    });
    categoryMap[categoryData.slug] = category.id;
    console.log(`✅ Category created: ${category.name}`);
  }

  // Create products
  console.log('\n🛍️ Creating products...');
  for (const productData of products) {
    const { categorySlug, variants, ...product } = productData;
    const categoryId = categoryMap[categorySlug];

    if (!categoryId) {
      console.error(`❌ Category not found: ${categorySlug}`);
      continue;
    }

    try {
      const createdProduct = await prisma.product.create({
        data: {
          ...product,
          categoryId,
          variants: {
            create: variants.map(v => ({
              size: v.size,
              color: v.color,
              stock: v.stock,
              sku: v.sku,
            })),
          },
        },
        include: {
          category: true,
          variants: true,
        },
      });
      console.log(`✅ Product created: ${createdProduct.name} (${createdProduct.variants.length} variants)`);
    } catch (error) {
      if (error.code === 'P2002') {
        console.log(`⚠️ Product already exists: ${product.name}`);
      } else {
        console.error(`❌ Error creating product ${product.name}:`, error.message);
      }
    }
  }

  console.log('\n✨ Seed completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

