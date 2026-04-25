import Joi from 'joi';

export const createUserSchema = Joi.object({
  firstName: Joi.string().required().min(2).max(50),
  lastName: Joi.string().required().min(2).max(50),
  email: Joi.string().email().required().lowercase(),
  password: Joi.string()
    .required()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/),
  role: Joi.string().valid('owner', 'admin', 'employee', 'viewer').required(),
  phone: Joi.string().optional().allow(''),
  department: Joi.string().optional().allow(''),
});

export const updateUserSchema = Joi.object({
  firstName: Joi.string().optional().min(2).max(50),
  lastName: Joi.string().optional().min(2).max(50),
  phone: Joi.string().optional().allow(''),
  department: Joi.string().optional().allow(''),
  role: Joi.string().valid('owner', 'admin', 'employee', 'viewer').optional(),
});

export const filterUsersSchema = Joi.object({
  page: Joi.number().optional().min(1),
  pageSize: Joi.number().optional().min(1).max(100),
  role: Joi.string().optional().valid('owner', 'admin', 'employee', 'viewer'),
  status: Joi.string().optional().valid('active', 'inactive', 'suspended', 'pending'),
  search: Joi.string().optional(),
});
