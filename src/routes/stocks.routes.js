import express from 'express';
const router = express.Router();
import * as stocksController from '../controllers/stocks.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';
import { validateRequest } from '../middlewares/validation.middleware.js';
import {
  createStockSchema,
  updateStockSchema,
  stockMovementSchema,
  filterStocksSchema,
} from '../validators/stocks.validator.js';

// All routes require authentication
router.use(authenticate);

// List stocks
router.get('/', validateRequest(filterStocksSchema, 'query'), stocksController.listStocks);

// Get stock by ID
router.get('/:id', stocksController.getStockById);

// Create stock
router.post(
  '/',
  authorize(['owner', 'admin']),
  validateRequest(createStockSchema),
  stocksController.createStock
);

// Update stock
router.put(
  '/:id',
  authorize(['owner', 'admin']),
  validateRequest(updateStockSchema),
  stocksController.updateStock
);

// Delete stock (admin only)
router.delete('/:id', authorize(['owner', 'admin']), stocksController.deleteStock);

// Register stock movement
router.post(
  '/:id/movement',
  authorize(['owner', 'admin', 'employee']),
  validateRequest(stockMovementSchema),
  stocksController.registerMovement
);

// Get stock movements
router.get('/:id/movements', stocksController.getMovements);

// Get low stock items
router.get('/alert/low-stock', stocksController.getLowStockItems);

export default router;
