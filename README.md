# KITAE Backend

KITAE Fashion E-commerce Backend built with Express.js and Prisma ORM.

## Features

- User Authentication & Authorization
- Product Management
- Category Management
- Shopping Cart
- Favorites/Wishlist
- Order Management
- Reviews & Ratings
- Lookbook Management
- Announcements
- Admin Dashboard with role-based access (Admin, MD, CS)
- Multilingual Support (i18n ready)

## Tech Stack

- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Validation**: Zod

## Setup

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

3. Update `.env` with your database credentials and JWT secret.

4. Run Prisma migrations:
```bash
npm run prisma:migrate
```

5. Generate Prisma Client:
```bash
npm run prisma:generate
```

6. Start the development server:
```bash
npm run dev
```

The server will run on `http://localhost:5000`.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### Products
- `GET /api/products` - Get all products
- `GET /api/products/featured` - Get featured products
- `GET /api/products/search` - Search products
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/:id/reviews` - Get product reviews
- `POST /api/products` - Create product (Admin/MD)
- `PUT /api/products/:id` - Update product (Admin/MD)
- `DELETE /api/products/:id` - Delete product (Admin/MD)

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category by ID
- `POST /api/categories` - Create category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart/add` - Add to cart
- `PUT /api/cart/update/:id` - Update cart item
- `DELETE /api/cart/remove/:id` - Remove cart item
- `DELETE /api/cart/clear` - Clear cart

### Orders
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order by ID
- `POST /api/orders` - Create order
- `PUT /api/orders/:id/cancel` - Cancel order

### Reviews
- `GET /api/reviews` - Get all reviews
- `POST /api/reviews` - Create review (Authenticated)
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review

### Lookbooks
- `GET /api/lookbooks` - Get all lookbooks
- `GET /api/lookbooks/featured` - Get featured lookbooks
- `GET /api/lookbooks/:id` - Get lookbook by ID
- `POST /api/lookbooks` - Create lookbook
- `PUT /api/lookbooks/:id` - Update lookbook
- `DELETE /api/lookbooks/:id` - Delete lookbook

### Admin
- `GET /api/admin/dashboard` - Get dashboard stats
- `GET /api/admin/users` - Get all users
- `GET /api/admin/orders` - Get all orders
- `GET /api/admin/analytics` - Get analytics

## Database Schema

See `prisma/schema.prisma` for the complete database schema.

## Environment Variables

```
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/kitae_db
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

## License

Copyright © 2024 KITAE. All rights reserved.

