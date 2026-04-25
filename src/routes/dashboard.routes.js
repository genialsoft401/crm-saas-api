import express from 'express';
const router = express.Router();
import * as dashboardController from '../controllers/dashboard.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

// All dashboard routes require authentication
router.use(authenticate);

// Get dashboard summary
router.get('/summary', dashboardController.getSummary);

// Get revenue analytics
router.get('/revenue', dashboardController.getRevenueAnalytics);

// Get clients analytics
router.get('/clients', dashboardController.getClientsAnalytics);

// Get invoices analytics
router.get('/invoices', dashboardController.getInvoicesAnalytics);

// Get payments analytics
router.get('/payments', dashboardController.getPaymentsAnalytics);

// Get stock analytics
router.get('/stocks', dashboardController.getStockAnalytics);

// Get KPI metrics
router.get('/kpi', dashboardController.getKPIMetrics);

// Get reports
router.get('/reports/:type', dashboardController.getReports);

export default router;
