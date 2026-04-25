import express from 'express';
const router = express.Router();
import * as invoicesController from '../controllers/invoices.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';
import { validateRequest } from '../middlewares/validation.middleware.js';
import {
  createInvoiceSchema,
  updateInvoiceSchema,
  filterInvoicesSchema,
} from '../validators/invoices.validator.js';

// All routes require authentication
router.use(authenticate);

// List invoices
router.get('/', validateRequest(filterInvoicesSchema, 'query'), invoicesController.listInvoices);

// Get invoice by ID
router.get('/:id', invoicesController.getInvoiceById);

// Create invoice
router.post(
  '/',
  authorize(['owner', 'admin', 'employee']),
  validateRequest(createInvoiceSchema),
  invoicesController.createInvoice
);

// Update invoice
router.put(
  '/:id',
  authorize(['owner', 'admin', 'employee']),
  validateRequest(updateInvoiceSchema),
  invoicesController.updateInvoice
);

// Delete invoice (admin only)
router.delete('/:id', authorize(['owner', 'admin']), invoicesController.deleteInvoice);

// Send invoice
router.patch('/:id/send', authorize(['owner', 'admin', 'employee']), invoicesController.sendInvoice);

// Mark as paid
router.patch('/:id/mark-paid', authorize(['owner', 'admin']), invoicesController.markInvoiceAsPaid);

// Cancel invoice
router.patch('/:id/cancel', authorize(['owner', 'admin']), invoicesController.cancelInvoice);

export default router;
