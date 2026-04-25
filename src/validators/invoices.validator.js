import Joi from 'joi';

export const createInvoiceSchema = Joi.object({
  clientId: Joi.number().required(),
  invoiceNumber: Joi.string().optional(),
  description: Joi.string().required().max(500),
  items: Joi.array()
    .items(
      Joi.object({
        description: Joi.string().required(),
        quantity: Joi.number().required().min(1),
        unitPrice: Joi.number().required().min(0),
      })
    )
    .required()
    .min(1),
  dueDate: Joi.date().required().iso(),
  discount: Joi.number().optional().min(0).max(100),
  notes: Joi.string().optional().allow(''),
});

export const updateInvoiceSchema = Joi.object({
  description: Joi.string().optional().max(500),
  items: Joi.array()
    .items(
      Joi.object({
        description: Joi.string().required(),
        quantity: Joi.number().required().min(1),
        unitPrice: Joi.number().required().min(0),
      })
    )
    .optional(),
  dueDate: Joi.date().optional().iso(),
  discount: Joi.number().optional().min(0).max(100),
  notes: Joi.string().optional().allow(''),
});

export const filterInvoicesSchema = Joi.object({
  page: Joi.number().optional().min(1),
  pageSize: Joi.number().optional().min(1).max(100),
  status: Joi.string().optional().valid('draft', 'issued', 'sent', 'paid', 'overdue', 'cancelled'),
  clientId: Joi.number().optional(),
  search: Joi.string().optional(),
});
