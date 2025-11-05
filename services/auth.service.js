const bcrypt = require('bcryptjs');
const axios = require('axios');
const { prisma } = require('../config/database');
const emailService = require('./email.service');

const register = async (email, password, name, phone) => {
  // Validate required fields
  if (!email || !password) {
    throw new Error('Email and password are required');
  }

  // Check if user exists
  const existingUser = await prisma.user.findUnique({
    where: { email }
  });

  if (existingUser) {
    throw new Error('Email already registered');
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      phone
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true
    }
  });

  // 세션 기반 인증에서는 token 생성하지 않음
  // 세션은 컨트롤러에서 req.session에 저장
  return {
    user
  };
};

const login = async (email, password) => {
  try {
    console.log('🔐 Login attempt:', { email, passwordLength: password?.length });
    
    // 입력 검증
    if (!email || !password) {
      throw new Error('Email and password are required');
    }
    
    // Find user
    let user;
    try {
      user = await prisma.user.findUnique({
        where: { email }
      });
    } catch (dbError) {
      console.error('❌ Database error:', dbError);
      throw new Error('Database connection error');
    }

    if (!user) {
      console.log('❌ User not found:', email);
      throw new Error('Invalid email or password');
    }

    console.log('✅ User found:', { id: user.id, email: user.email, hasPassword: !!user.password });

    // 소셜 로그인 사용자는 비밀번호가 없을 수 있음
    if (!user.password) {
      console.log('❌ User has no password (social login only)');
      throw new Error('비밀번호로 로그인할 수 없는 계정입니다. 소셜 로그인을 이용해주세요.');
    }

    // Verify password
    console.log('🔍 Verifying password...');
    
    try {
      const isValidPassword = await bcrypt.compare(password, user.password);
      
      if (!isValidPassword) {
        console.log('❌ Password mismatch');
        throw new Error('Invalid email or password');
      }
      
      console.log('✅ Password verified');
    } catch (compareError) {
      console.error('❌ Password comparison error:', compareError.message);
      throw new Error('Invalid email or password');
    }

    // 세션 기반 인증에서는 token 생성하지 않음
    // 세션은 컨트롤러에서 req.session에 저장
    // Return user data without password
    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword
    };
  } catch (error) {
    console.error('❌ Login service error:', error.message);
    console.error('❌ Error stack:', error.stack);
    throw error;
  }
};

const forgotPassword = async (email) => {
  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    throw new Error('User not found');
  }

  // TODO: Send password reset email
  // For now, just return success
  return true;
};

const resetPassword = async (userId, password) => {
  try {
    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user password
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    });

    return true;
  } catch (error) {
    throw new Error('Password reset failed');
  }
};

const kakaoLogin = async (accessToken) => {
  try {
    // 카카오 사용자 정보 가져오기
    const response = await axios.get('https://kapi.kakao.com/v2/user/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    const kakaoUser = response.data;
    const email = kakaoUser.kakao_account?.email;
    const nickname = kakaoUser.kakao_account?.profile?.nickname || kakaoUser.properties?.nickname;

    if (!email) {
      throw new Error('이메일 정보가 없습니다');
    }

    // 기존 사용자 확인 또는 생성
    let user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      // 카카오로 가입된 신규 사용자
      user = await prisma.user.create({
        data: {
          email,
          name: nickname,
          password: '', // 소셜 로그인은 비밀번호 없음
          phone: null
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true
        }
      });
    }

    // 세션 기반 인증에서는 token 생성하지 않음
    // 세션은 컨트롤러에서 req.session에 저장
    return {
      user
    };
  } catch (error) {
    throw new Error('카카오 로그인 실패: ' + error.message);
  }
};

// Send verification code for finding user ID
const sendFindIdVerification = async (email) => {
  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    throw new Error('User not found with this email');
  }

  await emailService.sendVerificationCode(email, 'findId');
  return true;
};

// Find user ID after email verification
const findUserId = async (email, code) => {
  // Verify code
  await emailService.verifyCode(email, code, 'findId');
  
  // Get user email (ID is email in this case)
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      email: true
    }
  });

  if (!user) {
    throw new Error('User not found');
  }

  return { email: user.email };
};

// Send verification code for password reset
const sendResetPasswordVerification = async (email) => {
  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    throw new Error('User not found with this email');
  }

  await emailService.sendVerificationCode(email, 'resetPassword');
  return true;
};

// Reset password after email verification
const resetPasswordWithVerification = async (email, code, newPassword) => {
  // Verify code
  await emailService.verifyCode(email, code, 'resetPassword');
  
  // Find user
  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    throw new Error('User not found');
  }

  // Hash new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Update password
  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword }
  });

  return true;
};

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
  kakaoLogin,
  sendFindIdVerification,
  findUserId,
  sendResetPasswordVerification,
  resetPasswordWithVerification
};

