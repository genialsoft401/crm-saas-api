import Joi from 'joi';

export const createStockSchema = Joi.object({
  name: Joi.string().required().min(2).max(100),
  sku: Joi.string().required().uppercase(),
  description: Joi.string().optional().allow(''),
  quantity: Joi.number().required().min(0),
  minimumQuantity: Joi.number().required().min(1),
  unitPrice: Joi.number().required().min(0),
  category: Joi.string().optional(),
  supplier: Joi.string().optional(),
});

export const updateStockSchema = Joi.object({
  name: Joi.string().optional().min(2).max(100),
  description: Joi.string().optional().allow(''),
  minimumQuantity: Joi.number().optional().min(1),
  unitPrice: Joi.number().optional().min(0),
  category: Joi.string().optional(),
  supplier: Joi.string().optional(),
});

export const stockMovementSchema = Joi.object({
  type: Joi.string().valid('in', 'out', 'adjustment').required(),
  quantity: Joi.number().required().min(1),
  reason: Joi.string().required(),
  reference: Joi.string().optional(),
});

export const filterStocksSchema = Joi.object({
  page: Joi.number().optional().min(1),
  pageSize: Joi.number().optional().min(1).max(100),
  status: Joi.string().optional().valid('in_stock', 'low_stock', 'out_of_stock'),
  category: Joi.string().optional(),
  search: Joi.string().optional(),
});
