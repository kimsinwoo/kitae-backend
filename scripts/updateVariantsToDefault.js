const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function updateVariantsToDefault() {
  try {
    console.log('🔄 Starting variant update...');
    
    // 먼저 현재 variant 상태 확인
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
    
    console.log(`📊 Found ${allVariants.length} variants to update`);
    
    if (allVariants.length === 0) {
      console.log('⚠️ No variants found in database');
      return;
    }
    
    // 현재 상태 출력
    console.log('\n📋 Current variants:');
    allVariants.forEach((v, index) => {
      console.log(`${index + 1}. Product: ${v.product.name} | Size: ${v.size} | Color: ${v.color}`);
    });
    
    // 모든 variant를 "One Size", "One Color"로 업데이트
    const updateResult = await prisma.productVariant.updateMany({
      data: {
        size: 'One Size',
        color: 'One Color',
      }
    });
    
    console.log(`\n✅ Successfully updated ${updateResult.count} variants`);
    
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
    
    console.log('\n📋 Updated variants:');
    updatedVariants.forEach((v, index) => {
      console.log(`${index + 1}. Product: ${v.product.name} | Size: ${v.size} | Color: ${v.color}`);
    });
    
    console.log('\n✅ Update completed successfully!');
    
  } catch (error) {
    console.error('❌ Error updating variants:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// 스크립트 실행
updateVariantsToDefault()
  .then(() => {
    console.log('✅ Script completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });

