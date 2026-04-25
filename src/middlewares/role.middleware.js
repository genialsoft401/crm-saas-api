import { forbidden } from '../utils/response.js';
import { ROLE_PERMISSIONS } from '../utils/constants.js';
import logger from '../config/logger.js';

/**
 * Middleware de autorização baseado em role
 */
export const authorize = (allowedRoles = []) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        logger.warn('User not authenticated in authorize middleware');
        return forbidden(res, 'Usuário não autenticado');
      }

      const userRole = req.user.role;

      // Owner tem acesso a tudo
      if (userRole === 'owner') {
        return next();
      }

      // Verifica se o role do usuário está na lista de roles permitidos
      if (!allowedRoles.includes(userRole)) {
        logger.warn('Unauthorized access attempt', {
          userId: req.user.id,
          userRole,
          requiredRoles: allowedRoles,
        });
        return forbidden(res, 'Acesso não permitido para este perfil');
      }

      next();
    } catch (error) {
      logger.error('Authorization error', { error: error.message });
      return forbidden(res, 'Erro ao autorizar');
    }
  };
};

/**
 * Middleware de autorização por permissão
 */
export const permission = (requiredPermissions = []) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        logger.warn('User not authenticated in permission middleware');
        return forbidden(res, 'Usuário não autenticado');
      }

      const userRole = req.user.role;
      const userPermissions = ROLE_PERMISSIONS[userRole] || [];

      // Owner tem todas as permissões
      if (userPermissions.includes('*')) {
        return next();
      }

      // Verifica se o usuário tem todas as permissões necessárias
      const hasAllPermissions = requiredPermissions.every((perm) =>
        userPermissions.includes(perm)
      );

      if (!hasAllPermissions) {
        logger.warn('Permission denied', {
          userId: req.user.id,
          userRole,
          userPermissions,
          requiredPermissions,
        });
        return forbidden(res, 'Permissão não concedida');
      }

      next();
    } catch (error) {
      logger.error('Permission error', { error: error.message });
      return forbidden(res, 'Erro ao verificar permissão');
    }
  };
};
