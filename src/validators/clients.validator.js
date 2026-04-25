import Joi from 'joi';

export const createClientSchema = Joi.object({
  name: Joi.string().required().min(2).max(100),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  cpfCnpj: Joi.string().optional(),
  address: Joi.string().optional(),
  city: Joi.string().optional(),
  state: Joi.string().optional(),
  zipCode: Joi.string().optional(),
  country: Joi.string().optional().default('Brasil'),
  notes: Joi.string().optional().allow(''),
});

export const updateClientSchema = Joi.object({
  name: Joi.string().optional().min(2).max(100),
  email: Joi.string().email().optional(),
  phone: Joi.string().optional(),
  address: Joi.string().optional(),
  city: Joi.string().optional(),
  state: Joi.string().optional(),
  zipCode: Joi.string().optional(),
  notes: Joi.string().optional().allow(''),
});

export const filterClientsSchema = Joi.object({
  page: Joi.number().optional().min(1),
  pageSize: Joi.number().optional().min(1).max(100),
  search: Joi.string().optional(),
  sortBy: Joi.string().optional().valid('name', 'email', 'createdAt'),
  sortOrder: Joi.string().optional().valid('asc', 'desc'),
});
