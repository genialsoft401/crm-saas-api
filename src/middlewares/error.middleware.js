import { serverError } from '../utils/response.js';
import logger from '../config/logger.js';

/**
 * Middleware global de tratamento de erros
 */
export const errorHandler = (err, req, res, next) => {
  logger.error('Unhandled error', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  // Erro de validação do Multer
  if (err.name === 'MulterError') {
    return serverError(res, 'Erro ao fazer upload de arquivo');
  }

  // Erro de sintaxe JSON
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return serverError(res, 'JSON inválido no corpo da requisição');
  }

  // Erro padrão
  return serverError(res, err.message || 'Erro interno do servidor');
};

/**
 * Middleware para rotas não encontradas
 */
export const notFoundHandler = (req, res) => {
  logger.warn('Route not found', { path: req.path, method: req.method });
  return res.status(404).json({
    success: false,
    statusCode: 404,
    message: 'Rota não encontrada',
    timestamp: new Date().toISOString(),
  });
};
