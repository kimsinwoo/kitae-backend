const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

// 모든 요청에 로깅 추가
router.use((req, res, next) => {
  console.log('📋 Auth routes - Request:', {
    method: req.method,
    path: req.path,
    url: req.url,
    hasBody: !!req.body
  });
  next();
});

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/me', authMiddleware, authController.getCurrentUser); // 현재 사용자 정보 가져오기
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authMiddleware, authController.resetPassword);
router.post('/kakao', authController.kakaoLogin);
router.post('/google', authController.googleLogin);
router.post('/naver', authController.naverLogin);

// Email verification endpoints
router.post('/find-id/send-code', authController.sendFindIdVerification);
router.post('/find-id/verify', authController.findUserId);
router.post('/reset-password/send-code', authController.sendResetPasswordVerification);
router.post('/reset-password/verify', authController.resetPasswordWithVerification);

module.exports = router;

