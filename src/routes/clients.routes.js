import express from 'express';
const router = express.Router();
import * as clientsController from '../controllers/clients.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';
import { validateRequest } from '../middlewares/validation.middleware.js';
import {
  createClientSchema,
  updateClientSchema,
  filterClientsSchema,
} from '../validators/clients.validator.js';

// All routes require authentication
router.use(authenticate);

// List clients
router.get('/', validateRequest(filterClientsSchema, 'query'), clientsController.listClients);

// Get client by ID
router.get('/:id', clientsController.getClientById);

// Create client
router.post(
  '/',
  authorize(['owner', 'admin', 'employee']),
  validateRequest(createClientSchema),
  clientsController.createClient
);

// Update client
router.put(
  '/:id',
  authorize(['owner', 'admin', 'employee']),
  validateRequest(updateClientSchema),
  clientsController.updateClient
);

// Delete client (admin only)
router.delete('/:id', authorize(['owner', 'admin']), clientsController.deleteClient);

// Get client financial summary
router.get('/:id/financial-summary', clientsController.getFinancialSummary);

// Get client invoices
router.get('/:id/invoices', clientsController.getClientInvoices);

export default router;
