const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const session = require('express-session');
const { connectDB } = require('./config/database');

// Load environment variables
const envResult = dotenv.config({ path: path.resolve(__dirname, '.env') });
if (envResult.error) {
  console.warn('⚠️ .env file not found or error loading:', envResult.error.message);
} else {
  console.log('✅ .env file loaded successfully');
}

// Debug: Check email configuration on startup
console.log('\n📧 Email Configuration on Startup:');
console.log(`EMAIL_USER: ${process.env.EMAIL_USER ? process.env.EMAIL_USER.substring(0, 5) + '***' : 'NOT SET'}`);
console.log(`EMAIL_PASSWORD: ${process.env.EMAIL_PASSWORD ? '***SET***' : 'NOT SET'}`);
console.log(`EMAIL_SERVICE: ${process.env.EMAIL_SERVICE || 'gmail (default)'}`);
console.log('');

const app = express();

// Middleware
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim().replace(/\/$/, '')) // 끝의 슬래시 제거
  : ['https://web-kitae-front-mhld7hkwfc74f64c.sel3.cloudtype.app', 'http://localhost:3001', 'http://localhost:3000', 'https://kitae.shop'];

if (allowedOrigins.length === 0) {
  console.warn('⚠️ ALLOWED_ORIGINS is not set in environment variables');
}

console.log('🌐 CORS Allowed Origins:', allowedOrigins);

// CORS 설정 - origin 검증 함수 사용
const corsOptions = {
  origin(origin, callback) {
    // 1) Origin 없는 요청: 허용하되 와일드카드 방지 (서버 내부 호출, health check 등)
    if (!origin) {
      // 개발 환경에서만 로그 출력 (프로덕션에서는 로그 제거 가능)
      if (process.env.NODE_ENV === 'development') {
        console.log('ℹ️ CORS: No origin header in request (allowed)');
      }
      // origin이 없을 때는 특정 origin을 반환하지 않고 요청을 허용
      // credentials: true를 사용하므로 와일드카드 대신 null 반환
      return callback(null, true);
    }

    // 2) Origin 있는 요청은 whitelist 체크
    if (allowedOrigins.includes(origin)) {
      if (process.env.NODE_ENV === 'development') {
        console.log(`✅ CORS: Allowed origin: ${origin}`);
      }
      // 명시적으로 origin 반환 (와일드카드 방지)
      return callback(null, origin);
    }

    console.error('❌ CORS: Not allowed origin ->', origin);
    console.error('❌ Allowed origins:', allowedOrigins);
    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Set-Cookie'],
  credentials: true,
  maxAge: 3600,
  preflightContinue: false,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

// CORS 헤더 확인 미들웨어 (디버깅용 - 개발 환경에서만)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin && allowedOrigins.includes(origin)) {
      // 응답 전에 CORS 헤더가 제대로 설정되었는지 확인
      res.on('finish', () => {
        const corsHeader = res.getHeader('Access-Control-Allow-Origin');
        if (corsHeader === '*') {
          console.error('❌ CORS ERROR: Access-Control-Allow-Origin is set to wildcard!');
          console.error('❌ Request origin:', origin);
        } else if (corsHeader && corsHeader !== origin) {
          console.warn('⚠️ CORS WARNING: Access-Control-Allow-Origin mismatch');
          console.warn('⚠️ Expected:', origin);
          console.warn('⚠️ Got:', corsHeader);
        }
      });
    }
    next();
  });
}
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || process.env.JWT_SECRET || 'kitae-session-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // HTTPS에서만 true
    httpOnly: true, // XSS 공격 방지
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7일
    sameSite: 'lax' // CSRF 공격 방지
  },
  name: 'kitae.sid' // 기본 'connect.sid' 대신 커스텀 이름
}));

// Routes
app.use('/auth', require('./routes/auth.routes'));
app.use('/users', require('./routes/user.routes'));
app.use('/products', require('./routes/product.routes'));
app.use('/categories', require('./routes/category.routes'));
app.use('/cart', require('./routes/cart.routes'));
app.use('/favorites', require('./routes/favorite.routes'));
app.use('/orders', require('./routes/order.routes'));
app.use('/reviews', require('./routes/review.routes'));
app.use('/lookbooks', require('./routes/lookbook.routes'));
app.use('/announcements', require('./routes/announcement.routes'));
app.use('/payments', require('./routes/payment.routes'));
app.use('/admin', require('./routes/admin.routes'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'KITAE Backend is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  console.error('❌ Error name:', err.name);
  console.error('❌ Stack:', err.stack);
  console.error('❌ Request:', {
    method: req.method,
    url: req.url,
    origin: req.headers.origin,
    body: req.body,
    session: req.session ? 'exists' : 'missing'
  });
  
  // 에러가 이미 응답되었으면 처리하지 않음
  if (res.headersSent) {
    return next(err);
  }
  
  // CORS 에러인 경우 적절한 CORS 헤더 설정
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }
  
  const statusCode = err.statusCode || err.status || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    errorName: process.env.NODE_ENV === 'development' ? err.name : undefined
  });
});

const PORT = process.env.PORT;
if (!PORT) {
  console.error('❌ PORT is not set in environment variables');
  process.exit(1);
}

// Connect to database and start server
connectDB().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 KITAE Backend Server running on port ${PORT}`);
  });
}).catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

