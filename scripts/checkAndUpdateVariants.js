const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function checkAndUpdateVariants() {
  try {
    console.log('🔄 Checking products and variants...');
    
    // 모든 product와 variant 확인
    const products = await prisma.product.findMany({
      include: {
        variants: true
      }
    });
    
    console.log(`📊 Found ${products.length} products`);
    
    if (products.length === 0) {
      console.log('⚠️ No products found in database');
      return;
    }
    
    // 각 product의 variant 상태 출력
    console.log('\n📋 Current products and variants:');
    products.forEach((p, index) => {
      console.log(`${index + 1}. ${p.name} (${p.variants.length} variants)`);
      p.variants.forEach((v, vIndex) => {
        console.log(`   - Variant ${vIndex + 1}: Size: ${v.size}, Color: ${v.color}`);
      });
    });
    
    // variant가 있는 경우 업데이트
    const allVariants = await prisma.productVariant.findMany();
    
    if (allVariants.length > 0) {
      console.log(`\n🔄 Updating ${allVariants.length} existing variants...`);
      
      const updateResult = await prisma.productVariant.updateMany({
        data: {
          size: 'One Size',
          color: 'One Color',
        }
      });
      
      console.log(`✅ Successfully updated ${updateResult.count} variants`);
    }
    
    // variant가 없는 product에 대해 variant 생성
    const productsWithoutVariants = products.filter(p => p.variants.length === 0);
    
    if (productsWithoutVariants.length > 0) {
      console.log(`\n🔄 Creating variants for ${productsWithoutVariants.length} products without variants...`);
      
      for (const product of productsWithoutVariants) {
        // SKU 생성 (product SKU 기반)
        const variantSku = `${product.sku}-OS-OC`;
        
        try {
          await prisma.productVariant.create({
            data: {
              productId: product.id,
              size: 'One Size',
              color: 'One Color',
              stock: 0,
              sku: variantSku,
            }
          });
          console.log(`✅ Created variant for: ${product.name}`);
        } catch (error) {
          if (error.code === 'P2002') {
            console.log(`⚠️ Variant SKU already exists: ${variantSku}`);
          } else {
            console.error(`❌ Error creating variant for ${product.name}:`, error.message);
          }
        }
      }
    }
    
    // 최종 상태 확인
    const finalProducts = await prisma.product.findMany({
      include: {
        variants: true
      }
    });
    
    console.log('\n📋 Final state:');
    finalProducts.forEach((p, index) => {
      console.log(`${index + 1}. ${p.name} (${p.variants.length} variants)`);
      p.variants.forEach((v, vIndex) => {
        console.log(`   - Variant ${vIndex + 1}: Size: ${v.size}, Color: ${v.color}`);
      });
    });
    
    console.log('\n✅ Update completed successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// 스크립트 실행
checkAndUpdateVariants()
  .then(() => {
    console.log('✅ Script completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });

