const { prisma } = require('../config/database');

const authMiddleware = async (req, res, next) => {
  try {
    console.log('🔐 Auth middleware check:', {
      hasSession: !!req.session,
      isAuthenticated: req.session?.isAuthenticated,
      userId: req.session?.userId,
      url: req.url
    });
    
    // 세션 확인
    if (!req.session || !req.session.isAuthenticated || !req.session.userId) {
      console.log('❌ Session not found or invalid');
      return res.status(401).json({
        success: false,
        message: 'No session found. Please login.'
      });
    }

    // 세션에서 사용자 정보 가져오기
    const user = await prisma.user.findUnique({
      where: { id: req.session.userId }
    });

    if (!user) {
      console.log('❌ User not found for userId:', req.session.userId);
      // 세션은 있지만 사용자가 없는 경우 세션 삭제
      req.session.destroy();
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    console.log('✅ User authenticated:', user.email);
    req.user = user;
    next();
  } catch (error) {
    console.error('❌ Auth middleware error:', error);
    console.error('❌ Error stack:', error.stack);
    return res.status(500).json({
      success: false,
      message: 'Authentication error'
    });
  }
};

const adminMiddleware = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }
  next();
};

const mdMiddleware = (req, res, next) => {
  const allowedRoles = ['admin', 'md'];
  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: 'MD or Admin access required'
    });
  }
  next();
};

const csMiddleware = (req, res, next) => {
  const allowedRoles = ['admin', 'cs'];
  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: 'CS or Admin access required'
    });
  }
  next();
};

module.exports = {
  authMiddleware,
  adminMiddleware,
  mdMiddleware,
  csMiddleware
};

