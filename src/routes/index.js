import express from 'express';
import authRoutes from './auth.routes.js';
import usersRoutes from './users.routes.js';
import companiesRoutes from './companies.routes.js';
import clientsRoutes from './clients.routes.js';
import invoicesRoutes from './invoices.routes.js';
import paymentsRoutes from './payments.routes.js';
import stocksRoutes from './stocks.routes.js';
import dashboardRoutes from './dashboard.routes.js';

const router = express.Router();

const apiVersion = process.env.API_VERSION || 'v1';

// API routes
router.use(`/${apiVersion}/auth`, authRoutes);
router.use(`/${apiVersion}/users`, usersRoutes);
router.use(`/${apiVersion}/companies`, companiesRoutes);
router.use(`/${apiVersion}/clients`, clientsRoutes);
router.use(`/${apiVersion}/invoices`, invoicesRoutes);
router.use(`/${apiVersion}/payments`, paymentsRoutes);
router.use(`/${apiVersion}/stocks`, stocksRoutes);
router.use(`/${apiVersion}/dashboard`, dashboardRoutes);

// Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    version: apiVersion,
    timestamp: new Date().toISOString(),
  });
});

export default router;
