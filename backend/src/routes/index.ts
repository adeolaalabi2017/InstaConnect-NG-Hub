import { Router } from 'express';

const router = Router();

// Import route modules here as they are created
// import authRoutes from './auth.routes';
// import businessRoutes from './businesses.routes';
// import reviewRoutes from './reviews.routes';
// import userRoutes from './users.routes';

// Health check for API
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'API is running',
    timestamp: new Date().toISOString(),
  });
});

// Mount routes here
// router.use('/auth', authRoutes);
// router.use('/businesses', businessRoutes);
// router.use('/reviews', reviewRoutes);
// router.use('/users', userRoutes);

// Placeholder for documentation
router.get('/docs', (req, res) => {
  res.json({
    message: 'API Documentation',
    version: '1.0.0',
    endpoints: {
      auth: '/api/v1/auth',
      businesses: '/api/v1/businesses',
      reviews: '/api/v1/reviews',
      users: '/api/v1/users',
      events: '/api/v1/events',
      admin: '/api/v1/admin',
    },
    documentation: 'See BACKEND_API_ARCHITECTURE.md for detailed documentation',
  });
});

export default router;
