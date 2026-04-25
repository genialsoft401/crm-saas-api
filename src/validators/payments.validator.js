import Joi from 'joi';

export const createPaymentSchema = Joi.object({
  invoiceId: Joi.number().required(),
  amount: Joi.number().required().min(0),
  paymentMethod: Joi.string()
    .valid('credit_card', 'debit_card', 'bank_transfer', 'boleto', 'pix', 'cash')
    .required(),
  referenceNumber: Joi.string().optional().allow(''),
  notes: Joi.string().optional().allow(''),
});

export const confirmPaymentSchema = Joi.object({
  status: Joi.string().valid('completed', 'failed', 'cancelled').required(),
  transactionId: Joi.string().optional(),
});

export const filterPaymentsSchema = Joi.object({
  page: Joi.number().optional().min(1),
  pageSize: Joi.number().optional().min(1).max(100),
  status: Joi.string()
    .optional()
    .valid('pending', 'processing', 'completed', 'failed', 'refunded', 'cancelled'),
  invoiceId: Joi.number().optional(),
});
