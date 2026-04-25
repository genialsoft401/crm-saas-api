import Joi from 'joi';

export const createCompanySchema = Joi.object({
  name: Joi.string().required().min(2).max(100),
  cnpj: Joi.string().required().regex(/^\d{14}$/),
  email: Joi.string().email().required(),
  phone: Joi.string().optional(),
  website: Joi.string().optional().uri().allow(''),
  address: Joi.string().optional(),
  city: Joi.string().optional(),
  state: Joi.string().optional(),
  zipCode: Joi.string().optional(),
  subscriptionPlan: Joi.string().valid('basic', 'professional', 'enterprise').required(),
});

export const updateCompanySchema = Joi.object({
  name: Joi.string().optional().min(2).max(100),
  email: Joi.string().email().optional(),
  phone: Joi.string().optional(),
  website: Joi.string().optional().uri().allow(''),
  address: Joi.string().optional(),
  city: Joi.string().optional(),
  state: Joi.string().optional(),
  zipCode: Joi.string().optional(),
  subscriptionPlan: Joi.string().valid('basic', 'professional', 'enterprise').optional(),
});

export const filterCompaniesSchema = Joi.object({
  page: Joi.number().optional().min(1),
  pageSize: Joi.number().optional().min(1).max(100),
  status: Joi.string().optional().valid('active', 'inactive', 'suspended'),
  subscriptionPlan: Joi.string().optional().valid('basic', 'professional', 'enterprise'),
  search: Joi.string().optional(),
});
