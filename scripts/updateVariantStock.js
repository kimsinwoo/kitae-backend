const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function updateVariantStock() {
  try {
    console.log('🔄 Updating variant stock...');
    
    // 모든 variant 확인
    const allVariants = await prisma.productVariant.findMany({
      include: {
        product: {
          select: {
            id: true,
            name: true,
          }
        }
      }
    });
    
    console.log(`📊 Found ${allVariants.length} variants`);
    
    if (allVariants.length === 0) {
      console.log('⚠️ No variants found in database');
      return;
    }
    
    // 현재 상태 출력
    console.log('\n📋 Current stock status:');
    allVariants.forEach((v, index) => {
      console.log(`${index + 1}. ${v.product.name} | Stock: ${v.stock}`);
    });
    
    // 모든 variant의 stock을 999로 업데이트 (충분히 큰 값)
    const updateResult = await prisma.productVariant.updateMany({
      data: {
        stock: 999,
      }
    });
    
    console.log(`\n✅ Successfully updated ${updateResult.count} variants stock to 999`);
    
    // 업데이트 후 상태 확인
    const updatedVariants = await prisma.productVariant.findMany({
      include: {
        product: {
          select: {
            id: true,
            name: true,
          }
        }
      }
    });
    
    console.log('\n📋 Updated stock status:');
    updatedVariants.forEach((v, index) => {
      console.log(`${index + 1}. ${v.product.name} | Stock: ${v.stock}`);
    });
    
    console.log('\n✅ Stock update completed successfully!');
    
  } catch (error) {
    console.error('❌ Error updating stock:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// 스크립트 실행
updateVariantStock()
  .then(() => {
    console.log('✅ Script completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });

