import { verifyToken } from '../utils/helpers.js';
import { unauthorized } from '../utils/response.js';
import logger from '../config/logger.js';

/**
 * Middleware de autenticação JWT
 */
export const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      logger.warn('Missing authorization header');
      return unauthorized(res, 'Token não fornecido');
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded) {
      logger.warn('Invalid token');
      return unauthorized(res, 'Token inválido ou expirado');
    }

    // Adiciona dados do usuário ao request
    req.user = decoded;
    req.token = token;

    next();
  } catch (error) {
    logger.error('Authentication error', { error: error.message });
    return unauthorized(res, 'Erro ao autenticar');
  }
};

/**
 * Middleware de autenticação opcional
 */
export const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decoded = verifyToken(token);

      if (decoded) {
        req.user = decoded;
        req.token = token;
      }
    }

    next();
  } catch (error) {
    logger.warn('Optional auth error', { error: error.message });
    next();
  }
};
