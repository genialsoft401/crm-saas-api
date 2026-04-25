import express from 'express';
const router = express.Router();
import * as usersController from '../controllers/users.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';
import { validateRequest } from '../middlewares/validation.middleware.js';
import {
  createUserSchema,
  updateUserSchema,
  filterUsersSchema,
} from '../validators/users.validator.js';

// All routes require authentication
router.use(authenticate);

// List users
router.get('/', validateRequest(filterUsersSchema, 'query'), usersController.listUsers);

// Get user by ID
router.get('/:id', usersController.getUserById);

// Create user (admin only)
router.post(
  '/',
  authorize(['owner', 'admin']),
  validateRequest(createUserSchema),
  usersController.createUser
);

// Update user
router.put(
  '/:id',
  authorize(['owner', 'admin']),
  validateRequest(updateUserSchema),
  usersController.updateUser
);

// Delete user (admin only)
router.delete('/:id', authorize(['owner', 'admin']), usersController.deleteUser);

// Activate user
router.patch('/:id/activate', authorize(['owner', 'admin']), usersController.activateUser);

// Deactivate user
router.patch('/:id/deactivate', authorize(['owner', 'admin']), usersController.deactivateUser);

// Get current user profile
router.get('/profile/me', usersController.getCurrentUser);

export default router;
