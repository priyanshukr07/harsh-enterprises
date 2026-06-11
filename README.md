# 🛒 Harsh Enterprises — Full-Stack E-Commerce Platform

A production-grade e-commerce platform built with Next.js 14 (App Router), featuring role-based access control, Redis caching, server-side pagination, and a complete admin dashboard.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Database | MongoDB via Prisma ORM |
| Cache | Redis (Upstash / ioredis) |
| Auth | NextAuth.js |
| State | Redux Toolkit + RTK Query |
| UI | shadcn/ui + Tailwind CSS v4 |

---

## Features

### 🔐 Authentication & Role-Based Access Control
- NextAuth.js session management with `getServerSession()`
- Four-tier role hierarchy: `SUPER_ADMIN` → `ADMIN` → `MANAGER` → `USER`
- `withRole` server-side middleware enforcing route-level permissions
- Permission matrix — each role has scoped access to resources

### 🛍️ Product & Order Management
- Full product catalog with category filtering
- Cart and checkout flow
- Order tracking per user

### 👥 Admin Dashboard
- User management table with per-column sort direction memory
- `RoleSelector` component with gradient badge for SUPER_ADMIN
- Server-side pagination and filtering on `/api/users`
- Real-time role updates without full page reload

### ⚡ Performance
- Redis cache helpers with graceful degradation (falls back if Redis unavailable)
- Server-side rendered product and user data via Next.js RSC
- Optimistic UI updates with RTK Query

---

## Project Structure

```
harsh-enterprises/
├── app/                  # Next.js App Router pages & API routes
│   ├── (admin)/          # Admin dashboard routes
│   ├── (shop)/           # Customer-facing shop routes
│   └── api/              # API handlers
├── components/           # Reusable UI components
│   ├── ui/               # shadcn/ui primitives
│   └── admin/            # Admin-specific components
├── config/               # App configuration
├── db/                   # Prisma client setup
├── hooks/                # Custom React hooks
├── lib/                  # Redis helpers, auth utils
├── prisma/               # Prisma schema (MongoDB)
├── providers/            # Redux, session providers
├── types/                # Shared TypeScript types
├── utils/                # Utility functions
├── proxy.ts              # Next.js 16 middleware
└── next.config.mjs
```

---

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- Redis instance (Upstash recommended for serverless)

### Installation

```bash
git clone https://github.com/priyanshukr07/harsh-enterprises.git
cd harsh-enterprises
yarn install
```

### Environment Variables

Create a `.env.local` file:

```env
# Database
DATABASE_URL="mongodb+srv://..."

# Auth
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=http://localhost:3000

# Redis (Upstash)
REDIS_URL=your_upstash_redis_url
REDIS_TOKEN=your_upstash_token
```

### Database Setup

```bash
# Push Prisma schema to MongoDB
npx prisma db push

# Generate Prisma client
npx prisma generate
```

### Run Locally

```bash
yarn dev
```

App runs at `http://localhost:3000`

---

## Role Permissions

| Feature | USER | MANAGER | ADMIN | SUPER_ADMIN |
|---|---|---|---|---|
| Browse & purchase | ✅ | ✅ | ✅ | ✅ |
| Manage products | ❌ | ✅ | ✅ | ✅ |
| Manage users | ❌ | ❌ | ✅ | ✅ |
| Assign roles | ❌ | ❌ | ❌ | ✅ |

---

## Key Implementation Details

- **Redis caching** — product and user lists cached with TTL; helpers use try/catch for graceful degradation if Redis is unavailable
- **Server-side pagination** — `/api/users?page=1&limit=10&sortBy=createdAt&order=desc` fully handled server-side
- **`withRole` middleware** — wraps API handlers to enforce role checks before reaching business logic
- **Prisma + MongoDB** — schemaless flexibility with type-safe queries via Prisma's MongoDB adapter

---

## Author

**Priyanshu Kumar**
[LinkedIn](https://linkedin.com/in/priyanshukr07) · [GitHub](https://github.com/priyanshukr07)
