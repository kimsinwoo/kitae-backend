const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient({
  log: ['error'],
});

async function exportDataToSQL() {
  try {
    console.log('📦 Exporting database data to SQL INSERT statements...\n');

    const outputDir = path.join(__dirname, '..', 'exports');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const outputFile = path.join(outputDir, `data_export_${timestamp}.sql`);

    let sqlContent = `-- Database Data Export
-- Generated: ${new Date().toISOString()}
-- Database: kitae_db

SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

-- ============================================
-- CATEGORIES
-- ============================================

`;

    // Categories
    console.log('📁 Exporting categories...');
    const categories = await prisma.category.findMany();
    if (categories.length > 0) {
      sqlContent += `DELETE FROM \`categories\`;\n`;
      sqlContent += `ALTER TABLE \`categories\` AUTO_INCREMENT = 1;\n\n`;
      
      categories.forEach(cat => {
        const name = cat.name.replace(/'/g, "''");
        const nameEn = cat.nameEn ? cat.nameEn.replace(/'/g, "''") : null;
        const description = cat.description ? cat.description.replace(/'/g, "''") : null;
        const image = cat.image ? cat.image.replace(/'/g, "''") : null;
        
        sqlContent += `INSERT INTO \`categories\` (\`id\`, \`name\`, \`nameEn\`, \`slug\`, \`description\`, \`image\`, \`createdAt\`, \`updatedAt\`) VALUES `;
        sqlContent += `('${cat.id}', '${name}', ${nameEn ? `'${nameEn}'` : 'NULL'}, '${cat.slug}', ${description ? `'${description}'` : 'NULL'}, ${image ? `'${image}'` : 'NULL'}, '${cat.createdAt.toISOString().slice(0, 19).replace('T', ' ')}', '${cat.updatedAt.toISOString().slice(0, 19).replace('T', ' ')}');\n`;
      });
      sqlContent += '\n';
    }

    // Products
    console.log('📦 Exporting products...');
    const products = await prisma.product.findMany({
      include: {
        variants: true
      }
    });

    if (products.length > 0) {
      sqlContent += `-- ============================================
-- PRODUCTS
-- ============================================

DELETE FROM \`products\`;\n`;
      sqlContent += `ALTER TABLE \`products\` AUTO_INCREMENT = 1;\n\n`;

      products.forEach(product => {
        const name = product.name.replace(/'/g, "''");
        const nameEn = product.nameEn ? product.nameEn.replace(/'/g, "''") : null;
        const description = product.description ? product.description.replace(/'/g, "''") : null;
        const images = JSON.stringify(product.images).replace(/'/g, "''");
        const gender = product.gender ? product.gender.replace(/'/g, "''") : null;
        
        sqlContent += `INSERT INTO \`products\` (\`id\`, \`name\`, \`nameEn\`, \`description\`, \`price\`, \`comparePrice\`, \`sku\`, \`slug\`, \`status\`, \`featured\`, \`gender\`, \`images\`, \`categoryId\`, \`createdAt\`, \`updatedAt\`) VALUES `;
        sqlContent += `('${product.id}', '${name}', ${nameEn ? `'${nameEn}'` : 'NULL'}, ${description ? `'${description}'` : 'NULL'}, ${product.price}, ${product.comparePrice || 'NULL'}, '${product.sku}', '${product.slug}', '${product.status}', ${product.featured ? 1 : 0}, ${gender ? `'${gender}'` : 'NULL'}, '${images}', '${product.categoryId}', '${product.createdAt.toISOString().slice(0, 19).replace('T', ' ')}', '${product.updatedAt.toISOString().slice(0, 19).replace('T', ' ')}');\n`;
      });
      sqlContent += '\n';
    }

    // Product Variants
    console.log('🔧 Exporting product variants...');
    const variants = await prisma.productVariant.findMany();

    if (variants.length > 0) {
      sqlContent += `-- ============================================
-- PRODUCT VARIANTS
-- ============================================

DELETE FROM \`product_variants\`;\n`;
      sqlContent += `ALTER TABLE \`product_variants\` AUTO_INCREMENT = 1;\n\n`;

      variants.forEach(variant => {
        sqlContent += `INSERT INTO \`product_variants\` (\`id\`, \`size\`, \`color\`, \`stock\`, \`sku\`, \`productId\`, \`createdAt\`, \`updatedAt\`) VALUES `;
        sqlContent += `('${variant.id}', '${variant.size}', '${variant.color}', ${variant.stock}, '${variant.sku}', '${variant.productId}', '${variant.createdAt.toISOString().slice(0, 19).replace('T', ' ')}', '${variant.updatedAt.toISOString().slice(0, 19).replace('T', ' ')}');\n`;
      });
      sqlContent += '\n';
    }

    // Users
    console.log('👤 Exporting users...');
    const users = await prisma.user.findMany();

    if (users.length > 0) {
      sqlContent += `-- ============================================
-- USERS
-- ============================================

DELETE FROM \`users\`;\n`;
      sqlContent += `ALTER TABLE \`users\` AUTO_INCREMENT = 1;\n\n`;

      users.forEach(user => {
        const email = user.email.replace(/'/g, "''");
        const password = user.password ? user.password.replace(/'/g, "''") : null;
        const name = user.name ? user.name.replace(/'/g, "''") : null;
        const phone = user.phone ? user.phone.replace(/'/g, "''") : null;
        const address = user.address ? JSON.stringify(user.address).replace(/'/g, "''") : null;
        const provider = user.provider ? user.provider.replace(/'/g, "''") : null;
        const providerId = user.providerId ? user.providerId.replace(/'/g, "''") : null;
        const profileImage = user.profileImage ? user.profileImage.replace(/'/g, "''") : null;
        
        sqlContent += `INSERT INTO \`users\` (\`id\`, \`email\`, \`password\`, \`name\`, \`phone\`, \`address\`, \`role\`, \`language\`, \`provider\`, \`providerId\`, \`profileImage\`, \`createdAt\`, \`updatedAt\`) VALUES `;
        sqlContent += `('${user.id}', '${email}', ${password ? `'${password}'` : 'NULL'}, ${name ? `'${name}'` : 'NULL'}, ${phone ? `'${phone}'` : 'NULL'}, ${address ? `'${address}'` : 'NULL'}, '${user.role}', '${user.language}', ${provider ? `'${provider}'` : 'NULL'}, ${providerId ? `'${providerId}'` : 'NULL'}, ${profileImage ? `'${profileImage}'` : 'NULL'}, '${user.createdAt.toISOString().slice(0, 19).replace('T', ' ')}', '${user.updatedAt.toISOString().slice(0, 19).replace('T', ' ')}');\n`;
      });
      sqlContent += '\n';
    }

    // Orders
    console.log('📋 Exporting orders...');
    const orders = await prisma.order.findMany({
      include: {
        items: true
      }
    });

    if (orders.length > 0) {
      sqlContent += `-- ============================================
-- ORDERS
-- ============================================

DELETE FROM \`orders\`;\n`;
      sqlContent += `ALTER TABLE \`orders\` AUTO_INCREMENT = 1;\n\n`;

      orders.forEach(order => {
        const shippingName = order.shippingName.replace(/'/g, "''");
        const shippingPhone = order.shippingPhone.replace(/'/g, "''");
        const shippingAddress1 = order.shippingAddress1.replace(/'/g, "''");
        const shippingAddress2 = order.shippingAddress2 ? order.shippingAddress2.replace(/'/g, "''") : null;
        const shippingCity = order.shippingCity.replace(/'/g, "''");
        const paymentMethod = order.paymentMethod ? order.paymentMethod.replace(/'/g, "''") : null;
        const notes = order.notes ? order.notes.replace(/'/g, "''") : null;
        
        sqlContent += `INSERT INTO \`orders\` (\`id\`, \`orderNumber\`, \`status\`, \`paymentStatus\`, \`paymentMethod\`, \`userId\`, \`shippingName\`, \`shippingPhone\`, \`shippingAddress1\`, \`shippingAddress2\`, \`shippingCity\`, \`shippingZip\`, \`shippingCountry\`, \`subtotal\`, \`shipping\`, \`tax\`, \`total\`, \`notes\`, \`createdAt\`, \`updatedAt\`) VALUES `;
        sqlContent += `('${order.id}', '${order.orderNumber}', '${order.status}', '${order.paymentStatus}', ${paymentMethod ? `'${paymentMethod}'` : 'NULL'}, '${order.userId}', '${shippingName}', '${shippingPhone}', '${shippingAddress1}', ${shippingAddress2 ? `'${shippingAddress2}'` : 'NULL'}, '${shippingCity}', '${order.shippingZip}', '${order.shippingCountry}', ${order.subtotal}, ${order.shipping}, ${order.tax}, ${order.total}, ${notes ? `'${notes}'` : 'NULL'}, '${order.createdAt.toISOString().slice(0, 19).replace('T', ' ')}', '${order.updatedAt.toISOString().slice(0, 19).replace('T', ' ')}');\n`;
      });
      sqlContent += '\n';

      // Order Items
      console.log('📦 Exporting order items...');
      sqlContent += `-- ============================================
-- ORDER ITEMS
-- ============================================

DELETE FROM \`order_items\`;\n`;
      sqlContent += `ALTER TABLE \`order_items\` AUTO_INCREMENT = 1;\n\n`;

      orders.forEach(order => {
        order.items.forEach(item => {
          sqlContent += `INSERT INTO \`order_items\` (\`id\`, \`quantity\`, \`price\`, \`orderId\`, \`productId\`, \`variantId\`, \`createdAt\`) VALUES `;
          sqlContent += `('${item.id}', ${item.quantity}, ${item.price}, '${item.orderId}', '${item.productId}', '${item.variantId}', '${item.createdAt.toISOString().slice(0, 19).replace('T', ' ')}');\n`;
        });
      });
      sqlContent += '\n';
    }

    // Carts
    console.log('🛒 Exporting carts...');
    const carts = await prisma.cart.findMany({
      include: {
        items: true
      }
    });

    if (carts.length > 0) {
      sqlContent += `-- ============================================
-- CARTS
-- ============================================

DELETE FROM \`carts\`;\n`;
      sqlContent += `ALTER TABLE \`carts\` AUTO_INCREMENT = 1;\n\n`;

      carts.forEach(cart => {
        sqlContent += `INSERT INTO \`carts\` (\`id\`, \`userId\`, \`productId\`, \`createdAt\`, \`updatedAt\`) VALUES `;
        sqlContent += `('${cart.id}', '${cart.userId}', '${cart.productId}', '${cart.createdAt.toISOString().slice(0, 19).replace('T', ' ')}', '${cart.updatedAt.toISOString().slice(0, 19).replace('T', ' ')}');\n`;
      });
      sqlContent += '\n';

      // Cart Items
      console.log('🛍️ Exporting cart items...');
      sqlContent += `-- ============================================
-- CART ITEMS
-- ============================================

DELETE FROM \`cart_items\`;\n`;
      sqlContent += `ALTER TABLE \`cart_items\` AUTO_INCREMENT = 1;\n\n`;

      carts.forEach(cart => {
        cart.items.forEach(item => {
          sqlContent += `INSERT INTO \`cart_items\` (\`id\`, \`quantity\`, \`cartId\`, \`variantId\`, \`createdAt\`, \`updatedAt\`) VALUES `;
          sqlContent += `('${item.id}', ${item.quantity}, '${item.cartId}', '${item.variantId}', '${item.createdAt.toISOString().slice(0, 19).replace('T', ' ')}', '${item.updatedAt.toISOString().slice(0, 19).replace('T', ' ')}');\n`;
        });
      });
      sqlContent += '\n';
    }

    // Favorites
    console.log('❤️ Exporting favorites...');
    const favorites = await prisma.favorite.findMany();

    if (favorites.length > 0) {
      sqlContent += `-- ============================================
-- FAVORITES
-- ============================================

DELETE FROM \`favorites\`;\n`;
      sqlContent += `ALTER TABLE \`favorites\` AUTO_INCREMENT = 1;\n\n`;

      favorites.forEach(fav => {
        sqlContent += `INSERT INTO \`favorites\` (\`id\`, \`userId\`, \`productId\`, \`createdAt\`) VALUES `;
        sqlContent += `('${fav.id}', '${fav.userId}', '${fav.productId}', '${fav.createdAt.toISOString().slice(0, 19).replace('T', ' ')}');\n`;
      });
      sqlContent += '\n';
    }

    // Reviews
    console.log('⭐ Exporting reviews...');
    const reviews = await prisma.review.findMany();

    if (reviews.length > 0) {
      sqlContent += `-- ============================================
-- REVIEWS
-- ============================================

DELETE FROM \`reviews\`;\n`;
      sqlContent += `ALTER TABLE \`reviews\` AUTO_INCREMENT = 1;\n\n`;

      reviews.forEach(review => {
        const comment = review.comment ? review.comment.replace(/'/g, "''") : null;
        const images = JSON.stringify(review.images).replace(/'/g, "''");
        
        sqlContent += `INSERT INTO \`reviews\` (\`id\`, \`rating\`, \`comment\`, \`images\`, \`userId\`, \`productId\`, \`createdAt\`, \`updatedAt\`) VALUES `;
        sqlContent += `('${review.id}', ${review.rating}, ${comment ? `'${comment}'` : 'NULL'}, '${images}', '${review.userId}', '${review.productId}', '${review.createdAt.toISOString().slice(0, 19).replace('T', ' ')}', '${review.updatedAt.toISOString().slice(0, 19).replace('T', ' ')}');\n`;
      });
      sqlContent += '\n';
    }

    sqlContent += `SET FOREIGN_KEY_CHECKS = 1;

-- Export completed successfully!
`;

    // 파일 저장
    fs.writeFileSync(outputFile, sqlContent, 'utf8');

    const stats = fs.statSync(outputFile);
    const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);

    console.log('\n✅ Export completed successfully!');
    console.log(`📁 Output file: ${outputFile}`);
    console.log(`📊 File size: ${fileSizeMB} MB`);
    console.log(`\n📋 Summary:`);
    console.log(`   - Categories: ${categories.length}`);
    console.log(`   - Products: ${products.length}`);
    console.log(`   - Product Variants: ${variants.length}`);
    console.log(`   - Users: ${users.length}`);
    console.log(`   - Orders: ${orders.length}`);
    console.log(`   - Carts: ${carts.length}`);
    console.log(`   - Favorites: ${favorites.length}`);
    console.log(`   - Reviews: ${reviews.length}`);

  } catch (error) {
    console.error('❌ Error exporting data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// 스크립트 실행
if (require.main === module) {
  exportDataToSQL()
    .then(() => {
      console.log('\n✅ Script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Script failed:', error.message);
      process.exit(1);
    });
}

module.exports = { exportDataToSQL };


