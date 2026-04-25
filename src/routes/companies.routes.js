import express from 'express';
const router = express.Router();
import * as companiesController from '../controllers/companies.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';
import { validateRequest } from '../middlewares/validation.middleware.js';
import {
  createCompanySchema,
  updateCompanySchema,
  filterCompaniesSchema,
} from '../validators/companies.validator.js';

// All routes require authentication
router.use(authenticate);

// List companies
router.get('/', validateRequest(filterCompaniesSchema, 'query'), companiesController.listCompanies);

// Get company by ID
router.get('/:id', companiesController.getCompanyById);

// Create company (admin only)
router.post(
  '/',
  authorize(['owner', 'admin']),
  validateRequest(createCompanySchema),
  companiesController.createCompany
);

// Update company (admin only)
router.put(
  '/:id',
  authorize(['owner', 'admin']),
  validateRequest(updateCompanySchema),
  companiesController.updateCompany
);

// Delete company (owner only)
router.delete('/:id', authorize(['owner']), companiesController.deleteCompany);

// Get company subscription info
router.get('/:id/subscription', companiesController.getSubscriptionInfo);

// Update subscription plan
router.patch(
  '/:id/subscription',
  authorize(['owner', 'admin']),
  companiesController.updateSubscription
);

export default router;
