const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testPassword() {
  try {
    const email = 'khcstar@gmail.com';
    const testPassword = "Kimsw@1312'";
    
    console.log('🔍 Testing password for:', email);
    console.log('🔍 Test password:', testPassword);
    
    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!user) {
      console.log('❌ User not found');
      return;
    }
    
    console.log('✅ User found:', { id: user.id, email: user.email });
    console.log('🔍 Has password:', !!user.password);
    
    if (user.password) {
      console.log('🔍 Password hash length:', user.password.length);
      console.log('🔍 Password hash (first 30 chars):', user.password.substring(0, 30));
      
      // Test password comparison
      const isValid = await bcrypt.compare(testPassword, user.password);
      console.log('🔍 Password match:', isValid);
      
      // Test creating a new hash
      const newHash = await bcrypt.hash(testPassword, 10);
      console.log('🔍 New hash (first 30 chars):', newHash.substring(0, 30));
      const newHashValid = await bcrypt.compare(testPassword, newHash);
      console.log('🔍 New hash match:', newHashValid);
    } else {
      console.log('❌ User has no password');
    }
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testPassword();

