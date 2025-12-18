# InstaConnect-NG Backend API Architecture

**Version:** 1.0
**Last Updated:** December 18, 2025
**Status:** Design Document

---

## Table of Contents
1. [Overview](#overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Database Schema](#database-schema)
5. [API Endpoints](#api-endpoints)
6. [Authentication & Authorization](#authentication--authorization)
7. [Security Implementation](#security-implementation)
8. [Error Handling](#error-handling)
9. [Performance Optimization](#performance-optimization)
10. [Deployment Strategy](#deployment-strategy)

---

## Overview

### Architecture Pattern: RESTful API with JWT Authentication

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   React     │  HTTPS  │   Express   │   SQL   │ PostgreSQL  │
│   Frontend  │ ◄─────► │   Backend   │ ◄─────► │  Database   │
│  (Port 3000)│         │ (Port 4000) │         │ (Port 5432) │
└─────────────┘         └─────────────┘         └─────────────┘
                              │
                              │ Cache
                              ▼
                        ┌─────────────┐
                        │    Redis    │
                        │  (Port 6379)│
                        └─────────────┘
```

### Key Design Principles

1. **Separation of Concerns**: Clear separation between routes, controllers, services, and data layers
2. **Security First**: JWT authentication, input validation, rate limiting
3. **Scalability**: Stateless API, horizontal scaling ready
4. **Maintainability**: Clean code, comprehensive documentation
5. **Performance**: Caching, query optimization, connection pooling

---

## Technology Stack

### Core Backend
```json
{
  "runtime": "Node.js v20.x LTS",
  "framework": "Express.js 4.x",
  "language": "TypeScript 5.x",
  "orm": "Prisma 5.x",
  "validation": "Zod",
  "authentication": "jsonwebtoken (JWT)"
}
```

### Database & Caching
```json
{
  "primary_database": "PostgreSQL 16.x",
  "cache": "Redis 7.x",
  "file_storage": "Cloudinary / AWS S3"
}
```

### Security & Utilities
```json
{
  "password_hashing": "bcrypt",
  "rate_limiting": "express-rate-limit",
  "cors": "cors",
  "helmet": "helmet",
  "validation": "zod",
  "logger": "winston",
  "email": "nodemailer / SendGrid"
}
```

### Testing & Quality
```json
{
  "testing": "Vitest + Supertest",
  "linting": "ESLint + Prettier",
  "api_docs": "Swagger / OpenAPI 3.0"
}
```

---

## Project Structure

```
backend/
├── src/
│   ├── config/                 # Configuration files
│   │   ├── database.ts         # Database connection
│   │   ├── redis.ts            # Redis connection
│   │   ├── cloudinary.ts       # File upload config
│   │   └── env.ts              # Environment variables validation
│   │
│   ├── types/                  # TypeScript types & interfaces
│   │   ├── index.ts
│   │   ├── express.d.ts        # Express type extensions
│   │   └── models.ts           # Data model types
│   │
│   ├── middleware/             # Express middleware
│   │   ├── auth.ts             # JWT authentication
│   │   ├── validate.ts         # Request validation
│   │   ├── errorHandler.ts    # Global error handler
│   │   ├── rateLimit.ts        # Rate limiting
│   │   └── upload.ts           # File upload handler
│   │
│   ├── routes/                 # API routes
│   │   ├── index.ts            # Route aggregator
│   │   ├── auth.routes.ts      # Authentication routes
│   │   ├── users.routes.ts     # User management
│   │   ├── businesses.routes.ts # Business CRUD
│   │   ├── reviews.routes.ts   # Reviews
│   │   ├── analytics.routes.ts # Analytics
│   │   ├── events.routes.ts    # Events
│   │   ├── promotions.routes.ts # Promotions
│   │   └── admin.routes.ts     # Admin panel
│   │
│   ├── controllers/            # Request handlers
│   │   ├── auth.controller.ts
│   │   ├── users.controller.ts
│   │   ├── businesses.controller.ts
│   │   ├── reviews.controller.ts
│   │   ├── analytics.controller.ts
│   │   ├── events.controller.ts
│   │   ├── promotions.controller.ts
│   │   └── admin.controller.ts
│   │
│   ├── services/               # Business logic
│   │   ├── auth.service.ts
│   │   ├── users.service.ts
│   │   ├── businesses.service.ts
│   │   ├── reviews.service.ts
│   │   ├── analytics.service.ts
│   │   ├── events.service.ts
│   │   ├── promotions.service.ts
│   │   ├── email.service.ts
│   │   ├── upload.service.ts
│   │   └── cache.service.ts
│   │
│   ├── validators/             # Zod validation schemas
│   │   ├── auth.validator.ts
│   │   ├── users.validator.ts
│   │   ├── businesses.validator.ts
│   │   └── reviews.validator.ts
│   │
│   ├── utils/                  # Utility functions
│   │   ├── jwt.ts              # JWT helpers
│   │   ├── password.ts         # Password hashing
│   │   ├── logger.ts           # Winston logger
│   │   ├── errors.ts           # Custom error classes
│   │   └── pagination.ts       # Pagination helper
│   │
│   ├── jobs/                   # Background jobs
│   │   ├── analytics-aggregation.ts
│   │   ├── email-notifications.ts
│   │   └── cleanup.ts
│   │
│   ├── prisma/                 # Database
│   │   ├── schema.prisma       # Database schema
│   │   ├── migrations/         # Migration history
│   │   └── seed.ts             # Seed data
│   │
│   ├── app.ts                  # Express app setup
│   └── server.ts               # Server entry point
│
├── tests/                      # Test files
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
├── docker-compose.yml
└── README.md
```

---

## Database Schema

### Prisma Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============================================
// User Management
// ============================================

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String   // bcrypt hashed
  name      String
  image     String?
  role      UserRole @default(CONSUMER)

  // Gamification
  credits           Int      @default(0)
  reputationPoints  Int      @default(0)
  badges            Badge[]
  referralCode      String   @unique @default(cuid())
  referralCount     Int      @default(0)
  referredBy        String?

  // Preferences
  emailNotifications Boolean  @default(true)
  inAppNotifications Boolean  @default(true)

  // Status
  status            UserStatus @default(ACTIVE)
  emailVerified     Boolean    @default(false)
  verificationToken String?
  resetToken        String?
  resetTokenExpiry  DateTime?

  // Timestamps
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  lastActiveAt DateTime @default(now())

  // Relations
  businesses   Business[]
  reviews      Review[]
  events       Event[]
  notifications Notification[]
  transactions Transaction[]

  @@index([email])
  @@index([role])
  @@index([status])
  @@map("users")
}

enum UserRole {
  CONSUMER
  VENDOR
  ADMIN
}

enum UserStatus {
  ACTIVE
  BANNED
  SUSPENDED
  PENDING
}

// ============================================
// Business Management
// ============================================

model Business {
  id          String   @id @default(uuid())
  ownerId     String
  owner       User     @relation(fields: [ownerId], references: [id], onDelete: Cascade)

  // Basic Info
  name        String
  slug        String   @unique
  description String   @db.Text
  category    Category @relation(fields: [categoryId], references: [id])
  categoryId  String

  // Location
  location    String
  address     String?
  city        String?
  state       String?
  latitude    Float?
  longitude   Float?

  // Contact
  phone       String
  email       String
  website     String?
  instagramHandle String?
  whatsapp    String?

  // Media
  logo        String?
  coverImage  String?
  images      BusinessImage[]

  // Business Details
  priceRange  PriceRange @default(MODERATE)
  tags        String[]
  openingHours Json?    // Store as JSON object

  // Metrics
  rating      Float    @default(0)
  reviewCount Int      @default(0)
  viewCount   Int      @default(0)

  // Status
  isOpen      Boolean  @default(true)
  isPromoted  Boolean  @default(false)
  verificationStatus VerificationStatus @default(PENDING)

  // Credits
  credits     Int      @default(0)

  // Timestamps
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relations
  reviews     Review[]
  promotions  Promotion[]
  analytics   AnalyticsEvent[]
  transactions Transaction[]

  @@index([ownerId])
  @@index([categoryId])
  @@index([slug])
  @@index([rating])
  @@index([isPromoted])
  @@map("businesses")
}

model BusinessImage {
  id         String   @id @default(uuid())
  businessId String
  business   Business @relation(fields: [businessId], references: [id], onDelete: Cascade)
  url        String
  caption    String?
  order      Int      @default(0)
  createdAt  DateTime @default(now())

  @@index([businessId])
  @@map("business_images")
}

enum PriceRange {
  BUDGET
  MODERATE
  EXPENSIVE
  LUXURY
}

enum VerificationStatus {
  PENDING
  VERIFIED
  REJECTED
}

model Category {
  id          String     @id @default(uuid())
  name        String     @unique
  slug        String     @unique
  icon        String
  description String?
  order       Int        @default(0)
  businesses  Business[]

  @@map("categories")
}

// ============================================
// Reviews & Ratings
// ============================================

model Review {
  id         String       @id @default(uuid())
  businessId String
  business   Business     @relation(fields: [businessId], references: [id], onDelete: Cascade)
  userId     String
  user       User         @relation(fields: [userId], references: [id], onDelete: Cascade)

  rating     Int          // 1-5
  text       String       @db.Text
  images     String[]

  helpfulCount Int        @default(0)
  helpfulBy    String[]   // Array of user IDs who found it helpful

  // Moderation
  status     ReviewStatus @default(ACTIVE)
  flaggedBy  String[]     // Array of user IDs who flagged
  flagReason String?

  // Vendor Response
  reply      String?      @db.Text
  repliedAt  DateTime?
  isRead     Boolean      @default(false)

  createdAt  DateTime     @default(now())
  updatedAt  DateTime     @updatedAt

  @@index([businessId])
  @@index([userId])
  @@index([status])
  @@index([createdAt])
  @@map("reviews")
}

enum ReviewStatus {
  ACTIVE
  FLAGGED
  HIDDEN
  DELETED
}

// ============================================
// Events
// ============================================

model Event {
  id          String   @id @default(uuid())
  organizerId String
  organizer   User     @relation(fields: [organizerId], references: [id], onDelete: Cascade)

  title       String
  slug        String   @unique
  description String   @db.Text

  // Date & Time
  date        DateTime
  time        String
  endDate     DateTime?

  // Location
  location    String
  address     String?
  latitude    Float?
  longitude   Float?

  // Details
  category    String
  tags        String[]
  image       String?
  price       String   // e.g., "Free", "₦5,000", "₦10,000 - ₦50,000"

  // Capacity
  maxAttendees Int?
  attendeeCount Int    @default(0)

  // Status
  status      EventStatus @default(UPCOMING)

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  comments    EventComment[]

  @@index([organizerId])
  @@index([date])
  @@index([status])
  @@map("events")
}

model EventComment {
  id        String   @id @default(uuid())
  eventId   String
  event     Event    @relation(fields: [eventId], references: [id], onDelete: Cascade)
  userId    String
  userName  String
  userImage String
  content   String   @db.Text
  status    CommentStatus @default(ACTIVE)
  createdAt DateTime @default(now())

  @@index([eventId])
  @@map("event_comments")
}

enum EventStatus {
  UPCOMING
  ONGOING
  COMPLETED
  CANCELLED
}

enum CommentStatus {
  ACTIVE
  FLAGGED
  HIDDEN
}

// ============================================
// Analytics
// ============================================

model AnalyticsEvent {
  id         String        @id @default(uuid())
  businessId String
  business   Business      @relation(fields: [businessId], references: [id], onDelete: Cascade)

  eventType  AnalyticsType
  userId     String?
  ipAddress  String?
  userAgent  String?

  metadata   Json?         // Additional event data

  createdAt  DateTime      @default(now())

  @@index([businessId])
  @@index([eventType])
  @@index([createdAt])
  @@map("analytics_events")
}

model DailyMetric {
  date            DateTime @db.Date
  businessId      String
  business        Business @relation(fields: [businessId], references: [id], onDelete: Cascade)

  views           Int      @default(0)
  clicks          Int      @default(0)
  shares          Int      @default(0)
  uniqueVisitors  Int      @default(0)

  updatedAt       DateTime @updatedAt

  @@id([date, businessId])
  @@index([date])
  @@index([businessId])
  @@map("daily_metrics")
}

enum AnalyticsType {
  VIEW
  WEBSITE_CLICK
  CALL_CLICK
  EMAIL_CLICK
  WHATSAPP_CLICK
  SHARE
}

// ============================================
// Promotions & Transactions
// ============================================

model Promotion {
  id         String     @id @default(uuid())
  businessId String
  business   Business   @relation(fields: [businessId], references: [id], onDelete: Cascade)

  planName   String
  cost       Int        // Credits

  startDate  DateTime
  endDate    DateTime

  status     PromotionStatus @default(SCHEDULED)

  // Features
  features   Json       // Store plan features

  createdAt  DateTime   @default(now())

  @@index([businessId])
  @@index([status])
  @@index([startDate, endDate])
  @@map("promotions")
}

enum PromotionStatus {
  SCHEDULED
  ACTIVE
  COMPLETED
  CANCELLED
}

model Transaction {
  id          String            @id @default(uuid())
  userId      String?
  user        User?             @relation(fields: [userId], references: [id], onDelete: SetNull)
  businessId  String?
  business    Business?         @relation(fields: [businessId], references: [id], onDelete: SetNull)

  type        TransactionType
  amount      Int               // Credits
  amountNGN   Decimal?          @db.Decimal(10, 2) // Real money

  description String

  // Payment Gateway
  paymentMethod String?
  paymentRef    String?         @unique

  status      TransactionStatus @default(PENDING)

  metadata    Json?             // Additional transaction data

  createdAt   DateTime          @default(now())
  updatedAt   DateTime          @updatedAt

  @@index([userId])
  @@index([businessId])
  @@index([status])
  @@index([createdAt])
  @@map("transactions")
}

enum TransactionType {
  CREDIT_PURCHASE
  PROMOTION_SPEND
  REFUND
}

enum TransactionStatus {
  PENDING
  SUCCESS
  FAILED
  REFUNDED
}

// ============================================
// Gamification
// ============================================

model Badge {
  id          String   @id @default(uuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  name        String
  icon        String
  color       String
  description String

  earnedAt    DateTime @default(now())

  @@index([userId])
  @@map("badges")
}

// ============================================
// Notifications
// ============================================

model Notification {
  id      String           @id @default(uuid())
  userId  String
  user    User             @relation(fields: [userId], references: [id], onDelete: Cascade)

  type    NotificationType
  title   String
  message String           @db.Text
  link    String?

  isRead  Boolean          @default(false)

  createdAt DateTime       @default(now())

  @@index([userId])
  @@index([isRead])
  @@index([createdAt])
  @@map("notifications")
}

enum NotificationType {
  REVIEW
  SYSTEM
  PROMOTION
  EVENT
  TRANSACTION
}

// ============================================
// Admin Configuration
// ============================================

model AdPlacement {
  id             String    @id @default(uuid())
  name           String
  location       AdLocation
  imageUrl       String
  destinationUrl String

  impressions    Int       @default(0)
  clicks         Int       @default(0)

  startDate      DateTime
  endDate        DateTime

  status         AdStatus  @default(ACTIVE)

  // Targeting
  targetCategory String?

  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt

  @@index([status])
  @@index([startDate, endDate])
  @@map("ad_placements")
}

enum AdLocation {
  HOMEPAGE_BANNER
  LISTING_SIDEBAR
  SEARCH_RESULTS_TOP
}

enum AdStatus {
  ACTIVE
  PAUSED
  EXPIRED
}

model SystemSettings {
  id    String @id @default(uuid())
  key   String @unique
  value Json

  updatedAt DateTime @updatedAt

  @@map("system_settings")
}
```

---

## API Endpoints

### Base URL
```
Development: http://localhost:4000/api/v1
Production:  https://api.instaconnect-ng.com/api/v1
```

### Authentication Endpoints

```http
POST   /auth/register              # Register new user
POST   /auth/login                 # Login user
POST   /auth/logout                # Logout user
POST   /auth/refresh               # Refresh JWT token
POST   /auth/forgot-password       # Request password reset
POST   /auth/reset-password        # Reset password
GET    /auth/verify-email/:token   # Verify email address
GET    /auth/me                    # Get current user
```

### User Endpoints

```http
GET    /users/profile              # Get user profile
PUT    /users/profile              # Update user profile
PUT    /users/password             # Change password
GET    /users/:id                  # Get user by ID (public info)
PUT    /users/notifications        # Update notification preferences
GET    /users/notifications        # Get user notifications
PUT    /users/notifications/:id/read # Mark notification as read
```

### Business Endpoints

```http
GET    /businesses                 # List all businesses (paginated, filtered)
GET    /businesses/:id             # Get business by ID
GET    /businesses/slug/:slug      # Get business by slug
POST   /businesses                 # Create new business (auth required)
PUT    /businesses/:id             # Update business (owner/admin only)
DELETE /businesses/:id             # Delete business (owner/admin only)
POST   /businesses/:id/images      # Upload business images
DELETE /businesses/:id/images/:imageId # Delete business image
GET    /businesses/owner/:userId   # Get businesses by owner
GET    /businesses/category/:categoryId # Get businesses by category
```

### Review Endpoints

```http
GET    /reviews/business/:businessId # Get reviews for business
POST   /reviews/business/:businessId # Create review (auth required)
PUT    /reviews/:id                  # Update review (author only)
DELETE /reviews/:id                  # Delete review (author/admin only)
POST   /reviews/:id/reply            # Reply to review (business owner)
POST   /reviews/:id/helpful          # Mark review as helpful
POST   /reviews/:id/flag             # Flag review for moderation
GET    /reviews/user/:userId         # Get reviews by user
```

### Analytics Endpoints

```http
POST   /analytics/track             # Track analytics event
GET    /analytics/business/:id      # Get business analytics
GET    /analytics/business/:id/metrics # Get detailed metrics
GET    /analytics/dashboard         # Get dashboard overview (admin)
```

### Event Endpoints

```http
GET    /events                      # List all events (paginated, filtered)
GET    /events/:id                  # Get event by ID
GET    /events/slug/:slug           # Get event by slug
POST   /events                      # Create new event (auth required)
PUT    /events/:id                  # Update event (organizer/admin only)
DELETE /events/:id                  # Delete event (organizer/admin only)
POST   /events/:id/comments         # Add comment to event
GET    /events/:id/comments         # Get event comments
```

### Promotion Endpoints

```http
GET    /promotions                  # List promotion plans
POST   /promotions/purchase         # Purchase promotion (auth required)
GET    /promotions/business/:id     # Get business promotions
GET    /promotions/active           # Get active promotions
```

### Transaction Endpoints

```http
GET    /transactions                # Get user transactions
POST   /transactions/credits        # Purchase credits
POST   /transactions/webhook        # Payment gateway webhook
GET    /transactions/:id            # Get transaction details
```

### Category Endpoints

```http
GET    /categories                  # List all categories
GET    /categories/:id              # Get category by ID
POST   /categories                  # Create category (admin only)
PUT    /categories/:id              # Update category (admin only)
DELETE /categories/:id              # Delete category (admin only)
```

### Admin Endpoints

```http
GET    /admin/overview              # Dashboard overview
GET    /admin/users                 # List all users
GET    /admin/users/:id             # Get user details
PUT    /admin/users/:id/ban         # Ban user
PUT    /admin/users/:id/unban       # Unban user
GET    /admin/businesses            # List all businesses
PUT    /admin/businesses/:id/verify # Verify business
PUT    /admin/businesses/:id/reject # Reject business
GET    /admin/reviews/flagged       # Get flagged reviews
PUT    /admin/reviews/:id/moderate  # Moderate review
GET    /admin/analytics             # System analytics
GET    /admin/ads                   # List ad placements
POST   /admin/ads                   # Create ad placement
PUT    /admin/ads/:id               # Update ad placement
DELETE /admin/ads/:id               # Delete ad placement
GET    /admin/settings              # Get system settings
PUT    /admin/settings              # Update system settings
```

### Search & Filter

```http
GET    /search                      # Global search
GET    /search/businesses           # Search businesses
GET    /search/events               # Search events
```

---

## Authentication & Authorization

### JWT Authentication Strategy

```typescript
// src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/database';

interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as JWTPayload;

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
      },
    });

    if (!user || user.status !== 'ACTIVE') {
      return res.status(401).json({ error: 'Invalid authentication' });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Role-based authorization
export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
};
```

### Usage Example

```typescript
// Protected route (any authenticated user)
router.get('/profile', authenticate, getProfile);

// Vendor-only route
router.post('/businesses', authenticate, authorize('VENDOR', 'ADMIN'), createBusiness);

// Admin-only route
router.put('/users/:id/ban', authenticate, authorize('ADMIN'), banUser);
```

---

## Security Implementation

### 1. Password Security

```typescript
// src/utils/password.ts
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 12;

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}
```

### 2. Input Validation

```typescript
// src/validators/auth.validator.ts
import { z } from 'zod';

export const RegisterSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain uppercase letter')
    .regex(/[a-z]/, 'Password must contain lowercase letter')
    .regex(/[0-9]/, 'Password must contain number'),
  role: z.enum(['CONSUMER', 'VENDOR']),
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
```

### 3. Rate Limiting

```typescript
// src/middleware/rateLimit.ts
import rateLimit from 'express-rate-limit';

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: 'Too many login attempts, please try again later',
});

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100, // 100 requests per window
  message: 'Too many requests, please try again later',
});
```

### 4. CORS Configuration

```typescript
// src/config/cors.ts
import cors from 'cors';

export const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = process.env.CORS_ORIGIN?.split(',') || [
      'http://localhost:3000',
    ];

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};
```

### 5. SQL Injection Prevention

Prisma automatically prevents SQL injection through parameterized queries.

### 6. XSS Protection

```typescript
// Use helmet middleware
import helmet from 'helmet';
app.use(helmet());

// Sanitize user input
import { escape } from 'html-escaper';

function sanitizeInput(input: string): string {
  return escape(input);
}
```

---

## Error Handling

### Custom Error Classes

```typescript
// src/utils/errors.ts
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400);
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(message, 401);
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Insufficient permissions') {
    super(message, 403);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, 404);
  }
}
```

### Global Error Handler

```typescript
// src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import { logger } from '../utils/logger';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log error
  logger.error(err);

  // Handle known errors
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
  }

  // Handle Prisma errors
  if (err.name === 'PrismaClientKnownRequestError') {
    return res.status(400).json({
      error: 'Database operation failed',
    });
  }

  // Handle Zod validation errors
  if (err.name === 'ZodError') {
    return res.status(400).json({
      error: 'Validation failed',
      details: err.issues,
    });
  }

  // Unknown errors
  return res.status(500).json({
    error: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { message: err.message }),
  });
};
```

---

## Performance Optimization

### 1. Database Indexing

Already defined in Prisma schema with `@@index` directives.

### 2. Query Optimization

```typescript
// Use select to fetch only needed fields
const users = await prisma.user.findMany({
  select: {
    id: true,
    name: true,
    email: true,
    // Don't fetch password hash
  },
});

// Use pagination
const businesses = await prisma.business.findMany({
  skip: (page - 1) * limit,
  take: limit,
});
```

### 3. Caching with Redis

```typescript
// src/services/cache.service.ts
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

export class CacheService {
  async get<T>(key: string): Promise<T | null> {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  }

  async set(key: string, value: any, ttl: number = 3600): Promise<void> {
    await redis.setex(key, ttl, JSON.stringify(value));
  }

  async delete(key: string): Promise<void> {
    await redis.del(key);
  }

  async invalidatePattern(pattern: string): Promise<void> {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  }
}

export const cacheService = new CacheService();
```

### 4. Connection Pooling

```typescript
// Prisma handles connection pooling automatically
// Configure in DATABASE_URL:
// postgresql://user:pass@host:5432/db?connection_limit=20&pool_timeout=20
```

---

## Deployment Strategy

### 1. Environment Setup

```bash
# Production Environment Variables
NODE_ENV=production
PORT=4000
DATABASE_URL=postgresql://user:pass@db-host:5432/instaconnect
REDIS_URL=redis://redis-host:6379
JWT_SECRET=your-production-secret-key
CORS_ORIGIN=https://instaconnect-ng.com
```

### 2. Docker Configuration

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "4000:4000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=redis://redis:6379
    depends_on:
      - postgres
      - redis

  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: instaconnect
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

### 3. Deployment Platforms

**Recommended Options:**

1. **Railway.app** (Easiest)
   - Auto-deploy from GitHub
   - Built-in PostgreSQL and Redis
   - Free tier available

2. **Render.com**
   - Docker support
   - PostgreSQL included
   - Good free tier

3. **DigitalOcean App Platform**
   - Managed databases
   - Auto-scaling
   - $5/month starter

4. **AWS Elastic Beanstalk**
   - Enterprise-grade
   - Full control
   - More complex setup

### 4. CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy Backend

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Railway
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
        run: |
          npm install -g railway
          railway up
```

---

## Next Steps

1. **Initialize Project**
   ```bash
   mkdir backend
   cd backend
   npm init -y
   npm install express prisma @prisma/client typescript ts-node
   ```

2. **Set up Prisma**
   ```bash
   npx prisma init
   # Copy schema from above to prisma/schema.prisma
   npx prisma migrate dev --name init
   ```

3. **Create Basic Server**
   - Copy project structure
   - Implement authentication
   - Create API endpoints
   - Add error handling

4. **Testing**
   - Write unit tests
   - Integration tests
   - Load testing

5. **Deploy**
   - Choose hosting platform
   - Set up databases
   - Deploy backend
   - Update frontend API URLs

---

## Questions?

This architecture provides a solid foundation for the InstaConnect-NG backend. Ready to start implementing?
