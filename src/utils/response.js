/**
 * Resposta de sucesso
 */
export const success = (res, data, message = 'Sucesso', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    statusCode,
    message,
    data,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Resposta paginada
 */
export const paginated = (
  res,
  data,
  page,
  pageSize,
  total,
  message = 'Sucesso',
  statusCode = 200
) => {
  const pages = Math.ceil(total / pageSize);
  return res.status(statusCode).json({
    success: true,
    statusCode,
    message,
    data,
    pagination: {
      page,
      pageSize,
      total,
      pages,
      hasNextPage: page < pages,
      hasPrevPage: page > 1,
    },
    timestamp: new Date().toISOString(),
  });
};

/**
 * Resposta de erro genérico
 */
export const error = (
  res,
  statusCode = 500,
  message = 'Erro interno do servidor',
  details = null
) => {
  const response = {
    success: false,
    statusCode,
    message,
    timestamp: new Date().toISOString(),
  };

  if (details) {
    response.details = details;
  }

  return res.status(statusCode).json(response);
};

/**
 * Bad Request (400)
 */
export const badRequest = (res, message = 'Requisição inválida', details = null) => {
  return error(res, 400, message, details);
};

/**
 * Unauthorized (401)
 */
export const unauthorized = (res, message = 'Não autorizado') => {
  return error(res, 401, message);
};

/**
 * Forbidden (403)
 */
export const forbidden = (res, message = 'Acesso proibido') => {
  return error(res, 403, message);
};

/**
 * Not Found (404)
 */
export const notFound = (res, message = 'Recurso não encontrado') => {
  return error(res, 404, message);
};

/**
 * Conflict (409)
 */
export const conflict = (res, message = 'Conflito com recurso existente') => {
  return error(res, 409, message);
};

/**
 * Unprocessable Entity (422)
 */
export const unprocessable = (res, message = 'Entidade não pode ser processada', details = null) => {
  return error(res, 422, message, details);
};

/**
 * Server Error (500)
 */
export const serverError = (res, message = 'Erro interno do servidor') => {
  return error(res, 500, message);
};

export default {
  success,
  paginated,
  error,
  badRequest,
  unauthorized,
  forbidden,
  notFound,
  conflict,
  unprocessable,
  serverError,
};