const authService = require('../services/auth.service');

const register = async (req, res, next) => {
  try {
    const { email, password, name, phone } = req.body;
    console.log('📝 Register request:', { email, name, phone, passwordLength: password?.length });
    
    const result = await authService.register(email, password, name, phone);
    
    // 세션에 사용자 정보 저장
    req.session.userId = result.user.id;
    req.session.userEmail = result.user.email;
    req.session.userRole = result.user.role;
    req.session.isAuthenticated = true;
    
    console.log('✅ User registered:', result.user.email);
    console.log('✅ Session created:', req.sessionID);
    
    res.status(201).json({
      success: true,
      data: {
        user: result.user
      },
      message: 'User registered successfully'
    });
  } catch (error) {
    console.error('❌ Register error:', error.message);
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log('📝 Login request:', { email, passwordLength: password?.length });
    
    // 세션 확인
    if (!req.session) {
      console.error('❌ Session not available');
      return res.status(500).json({
        success: false,
        message: 'Session not initialized'
      });
    }
    
    const result = await authService.login(email, password);
    
    // 세션에 사용자 정보 저장
    if (!result || !result.user) {
      console.error('❌ Invalid result from authService:', result);
      return res.status(500).json({
        success: false,
        message: 'Login service returned invalid result'
      });
    }
    
    req.session.userId = result.user.id;
    req.session.userEmail = result.user.email;
    req.session.userRole = result.user.role;
    req.session.isAuthenticated = true;
    
    // 세션 저장
    req.session.save((err) => {
      if (err) {
        console.error('❌ Session save error:', err);
        return res.status(500).json({
          success: false,
          message: 'Failed to save session'
        });
      }
      
      console.log('✅ Login successful:', result.user.email);
      console.log('✅ Session created:', req.sessionID);
      
      res.json({
        success: true,
        data: {
          user: result.user
        },
        message: 'Login successful'
      });
    });
  } catch (error) {
    console.error('❌ Login error:', error.message);
    console.error('❌ Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: error.message || 'Login failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const logout = async (req, res) => {
  // 세션 삭제
  req.session.destroy((err) => {
    if (err) {
      console.error('❌ Session destroy error:', err);
      return res.status(500).json({
        success: false,
        message: 'Logout failed'
      });
    }
    
    res.clearCookie('kitae.sid');
    res.json({
      success: true,
      message: 'Logout successful'
    });
  });
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    await authService.forgotPassword(email);
    res.json({
      success: true,
      message: 'Password reset link sent to your email'
    });
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { password } = req.body;
    // 세션에서 userId 가져오기
    const userId = req.session?.userId || req.body.userId;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }
    
    await authService.resetPassword(userId, password);
    res.json({
      success: true,
      message: 'Password reset successful'
    });
  } catch (error) {
    next(error);
  }
};

const kakaoLogin = async (req, res, next) => {
  try {
    const { accessToken } = req.body;
    const result = await authService.kakaoLogin(accessToken);
    
    // 세션에 사용자 정보 저장
    req.session.userId = result.user.id;
    req.session.userEmail = result.user.email;
    req.session.userRole = result.user.role;
    req.session.isAuthenticated = true;
    
    console.log('✅ Kakao login successful:', result.user.email);
    console.log('✅ Session created:', req.sessionID);
    
    res.json({
      success: true,
      data: {
        user: result.user
      },
      message: 'Kakao login successful'
    });
  } catch (error) {
    next(error);
  }
};

const getCurrentUser = async (req, res) => {
  try {
    // authMiddleware에서 이미 req.user 설정됨
    const { password: _, ...userWithoutPassword } = req.user;
    
    res.json({
      success: true,
      data: {
        user: userWithoutPassword
      },
      message: 'User retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get current user'
    });
  }
};

// Send verification code for finding user ID
const sendFindIdVerification = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }
    await authService.sendFindIdVerification(email);
    res.json({
      success: true,
      message: 'Verification code sent to your email'
    });
  } catch (error) {
    console.error('❌ Error in sendFindIdVerification:', error);
    const statusCode = error.message.includes('migration') ? 503 : 500;
    res.status(statusCode).json({
      success: false,
      message: error.message || 'Failed to send verification code'
    });
  }
};

// Find user ID after verification
const findUserId = async (req, res, next) => {
  try {
    const { email, code } = req.body;
    const result = await authService.findUserId(email, code);
    res.json({
      success: true,
      data: result,
      message: 'User ID found'
    });
  } catch (error) {
    next(error);
  }
};

// Send verification code for password reset
const sendResetPasswordVerification = async (req, res, next) => {
  try {
    const { email } = req.body;
    await authService.sendResetPasswordVerification(email);
    res.json({
      success: true,
      message: 'Verification code sent to your email'
    });
  } catch (error) {
    next(error);
  }
};

// Reset password after verification
const resetPasswordWithVerification = async (req, res, next) => {
  try {
    const { email, code, password } = req.body;
    await authService.resetPasswordWithVerification(email, code, password);
    res.json({
      success: true,
      message: 'Password reset successful'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  logout,
  getCurrentUser,
  forgotPassword,
  resetPassword,
  kakaoLogin,
  sendFindIdVerification,
  findUserId,
  sendResetPasswordVerification,
  resetPasswordWithVerification
};

