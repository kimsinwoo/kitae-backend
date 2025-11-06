const bcrypt = require('bcryptjs');
const { prisma } = require('../config/database');

const getProfile = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      role: true,
      language: true,
      createdAt: true,
      updatedAt: true,
      address: true,
      provider: true,
      providerId: true,
      profileImage: true
    }
  });

  if (!user) {
    throw new Error('User not found');
  }

  return user;
};

const updateProfile = async (userId, data) => {
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!user) {
    throw new Error('User not found');
  }

  // address는 Json 타입이므로 그대로 전달 (프론트엔드에서 이미 객체 형태로 전달됨)
  console.log('📝 Updating user profile:', { userId, data });
  
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data,
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      role: true,
      language: true,
      createdAt: true,
      updatedAt: true,
      address: true,
      provider: true,
      providerId: true,
      profileImage: true
    }
  });
  
  console.log('✅ User profile updated successfully');
  return updatedUser;
};

const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!user) {
    throw new Error('User not found');
  }

  // 소셜 로그인 사용자는 비밀번호가 없을 수 있음
  if (!user.password) {
    throw new Error('Password cannot be changed for social login users');
  }

  // Verify current password
  const isValidPassword = await bcrypt.compare(currentPassword, user.password);

  if (!isValidPassword) {
    throw new Error('Current password is incorrect');
  }

  // Hash new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Update password
  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword }
  });
};

module.exports = {
  getProfile,
  updateProfile,
  changePassword
};

