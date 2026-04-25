import express from 'express';
const router = express.Router();
import * as paymentsController from '../controllers/payments.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';
import { validateRequest } from '../middlewares/validation.middleware.js';
import {
  createPaymentSchema,
  confirmPaymentSchema,
  filterPaymentsSchema,
} from '../validators/payments.validator.js';

// All routes require authentication
router.use(authenticate);

// List payments
router.get('/', validateRequest(filterPaymentsSchema, 'query'), paymentsController.listPayments);

// Get payment by ID
router.get('/:id', paymentsController.getPaymentById);

// Create payment
router.post(
  '/',
  authorize(['owner', 'admin', 'employee']),
  validateRequest(createPaymentSchema),
  paymentsController.createPayment
);

// Confirm payment
router.patch(
  '/:id/confirm',
  authorize(['owner', 'admin']),
  validateRequest(confirmPaymentSchema),
  paymentsController.confirmPayment
);

// Cancel payment
router.patch('/:id/cancel', authorize(['owner', 'admin']), paymentsController.cancelPayment);

// Get payments by invoice
router.get('/invoice/:invoiceId', paymentsController.getPaymentsByInvoice);

export default router;
