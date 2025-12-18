# InstaConnect-NG Backend API

RESTful API server for InstaConnect-NG business directory platform.

## Tech Stack

- **Runtime:** Node.js v20+
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** PostgreSQL 16
- **ORM:** Prisma
- **Cache:** Redis
- **Authentication:** JWT

## Prerequisites

- Node.js v20 or higher
- PostgreSQL 16
- Redis 7
- npm or yarn

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

Copy the example environment file and configure:

```bash
cp .env.example .env
```

Edit `.env` and add your configuration values.

### 3. Database Setup

```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed database (optional)
npm run prisma:seed

# Open Prisma Studio to view data
npm run prisma:studio
```

### 4. Start Development Server

```bash
npm run dev
```

Server will start on `http://localhost:4000`

## Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Express middleware
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── validators/      # Input validation
│   ├── utils/           # Helper functions
│   ├── types/           # TypeScript types
│   ├── jobs/            # Background jobs
│   ├── prisma/          # Database schema & migrations
│   ├── app.ts           # Express app setup
│   └── server.ts        # Server entry point
├── tests/               # Test files
├── .env.example         # Environment variables template
├── package.json
├── tsconfig.json
└── README.md
```

## Available Scripts

```bash
# Development
npm run dev              # Start dev server with hot reload
npm run build            # Build for production
npm start                # Start production server

# Database
npm run prisma:generate  # Generate Prisma Client
npm run prisma:migrate   # Run database migrations
npm run prisma:studio    # Open Prisma Studio
npm run prisma:seed      # Seed database

# Testing
npm test                 # Run tests
npm run test:ui          # Run tests with UI
npm run test:coverage    # Run tests with coverage

# Code Quality
npm run lint             # Check for linting errors
npm run lint:fix         # Fix linting errors
npm run format           # Format code with Prettier
npm run type-check       # Check TypeScript types
```

## API Documentation

API documentation is available at:

- Development: `http://localhost:4000/api/docs`
- Production: `https://api.instaconnect-ng.com/api/docs`

Base API URL: `/api/v1`

### Key Endpoints

**Authentication:**
- `POST /api/v1/auth/register` - Register user
- `POST /api/v1/auth/login` - Login
- `GET /api/v1/auth/me` - Get current user

**Businesses:**
- `GET /api/v1/businesses` - List businesses
- `POST /api/v1/businesses` - Create business
- `GET /api/v1/businesses/:id` - Get business
- `PUT /api/v1/businesses/:id` - Update business

**Reviews:**
- `GET /api/v1/reviews/business/:id` - Get reviews
- `POST /api/v1/reviews/business/:id` - Create review

See [BACKEND_API_ARCHITECTURE.md](../BACKEND_API_ARCHITECTURE.md) for complete API documentation.

## Database Schema

The database schema is defined in `src/prisma/schema.prisma`.

Key models:
- User
- Business
- Review
- Event
- Transaction
- Promotion
- Analytics

## Authentication

The API uses JWT (JSON Web Tokens) for authentication.

**To authenticate requests:**

```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:4000/api/v1/businesses
```

## Environment Variables

Key environment variables:

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `JWT_SECRET` | Secret key for JWT | Yes |
| `REDIS_URL` | Redis connection string | Yes |
| `PORT` | Server port (default: 4000) | No |
| `NODE_ENV` | Environment (development/production) | Yes |

See `.env.example` for complete list.

## Testing

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test file
npm test auth.test.ts
```

## Deployment

### Docker

```bash
# Build image
docker build -t instaconnect-backend .

# Run container
docker run -p 4000:4000 --env-file .env instaconnect-backend
```

### Docker Compose

```bash
docker-compose up -d
```

### Platform-specific Guides

- **Railway:** Connect GitHub repo, set environment variables, deploy
- **Render:** Create new Web Service, set build command: `npm run build`, start command: `npm start`
- **DigitalOcean:** Use App Platform, configure environment variables
- **AWS:** Use Elastic Beanstalk or ECS

## Monitoring & Logging

Logs are written to:
- Console (development)
- Files in `logs/` directory (production)
- External service (Sentry, if configured)

## Security

- Password hashing with bcrypt
- JWT authentication
- Rate limiting on all endpoints
- CORS configuration
- Helmet for security headers
- Input validation with Zod
- SQL injection prevention (Prisma)

## Performance

- Redis caching for frequent queries
- Database connection pooling
- Query optimization with Prisma
- Index optimization

## Contributing

1. Create a feature branch
2. Make your changes
3. Write tests
4. Run linting and tests
5. Submit pull request

## License

MIT

## Support

For issues and questions:
- GitHub Issues: [Create Issue](https://github.com/yourusername/instaconnect-ng/issues)
- Email: support@instaconnect-ng.com

---

**Built with ❤️ by the InstaConnect NG Team**
