import { badRequest } from '../utils/response.js';
import logger from '../config/logger.js';

/**
 * Middleware de validação com Joi
 */
export const validateRequest = (schema, location = 'body') => {
  return (req, res, next) => {
    try {
      let dataToValidate;

      switch (location) {
        case 'body':
          dataToValidate = req.body;
          break;
        case 'query':
          dataToValidate = req.query;
          break;
        case 'params':
          dataToValidate = req.params;
          break;
        default:
          dataToValidate = req.body;
      }

      const { error, value } = schema.validate(dataToValidate, {
        abortEarly: false,
        stripUnknown: true,
      });

      if (error) {
        const details = error.details.map((detail) => ({
          field: detail.path.join('.'),
          message: detail.message,
        }));

        logger.warn('Validation error', { details, location });
        return badRequest(res, 'Validação falhou', details);
      }

      // Substitui os dados pelo valor validado e normalizado
      if (location === 'body') {
        req.body = value;
      } else if (location === 'query') {
        req.query = value;
      } else if (location === 'params') {
        req.params = value;
      }

      next();
    } catch (error) {
      logger.error('Validation middleware error', { error: error.message });
      return badRequest(res, 'Erro ao validar requisição');
    }
  };
};
