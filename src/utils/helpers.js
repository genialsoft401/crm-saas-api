import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

// ================================
// PASSWORD HELPERS
// ================================

/**
 * Hash de senha com bcrypt
 * @param {string} password
 * @returns {Promise<string>}
 */
export const hashPassword = async (password) => {
  const salt = await bcryptjs.genSalt(parseInt(process.env.BCRYPT_ROUNDS) || 10);
  return bcryptjs.hash(password, salt);
};

/**
 * Compara senha com hash
 * @param {string} password
 * @param {string} hash
 * @returns {Promise<boolean>}
 */
export const comparePassword = async (password, hash) => {
  return bcryptjs.compare(password, hash);
};

/**
 * Gera senha aleatória
 * @param {number} length
 * @returns {string}
 */
export const generateRandomPassword = (length = 12) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

// ================================
// JWT HELPERS
// ================================

/**
 * Gera JWT token
 * @param {object} payload
 * @param {string} expiresIn
 * @returns {string}
 */
export const generateToken = (payload, expiresIn = null) => {
  const options = {};
  if (expiresIn) {
    options.expiresIn = expiresIn;
  } else {
    options.expiresIn = process.env.JWT_EXPIRES_IN || '24h';
  }

  return jwt.sign(payload, process.env.JWT_SECRET, options);
};

/**
 * Valida e decodifica JWT token
 * @param {string} token
 * @returns {object|null}
 */
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

/**
 * Gera refresh token
 * @param {object} payload
 * @returns {string}
 */
export const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  });
};

/**
 * Valida refresh token
 * @param {string} token
 * @returns {object|null}
 */
export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (error) {
    return null;
  }
};

/**
 * Decodifica token sem validar assinatura
 * @param {string} token
 * @returns {object|null}
 */
export const decodeToken = (token) => {
  try {
    return jwt.decode(token);
  } catch (error) {
    return null;
  }
};

// ================================
// VALIDATION HELPERS
// ================================

/**
 * Valida email
 * @param {string} email
 * @returns {boolean}
 */
export const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Valida telefone (Brasil)
 * @param {string} phone
 * @returns {boolean}
 */
export const isValidPhone = (phone) => {
  const regex = /^\(?\d{2}\)?\s?\d{4,5}[- ]?\d{4}$/;
  return regex.test(phone?.replace(/\D/g, ''));
};

/**
 * Valida CPF (Brasil)
 * @param {string} cpf
 * @returns {boolean}
 */
export const isValidCPF = (cpf) => {
  if (!cpf || typeof cpf !== 'string') return false;

  cpf = cpf.replace(/\D/g, '');

  if (cpf.length !== 11) return false;
  if (/^\d+$/.test(cpf) === false) return false;
  if (cpf === '00000000000') return false;

  let calculation = 0;
  let ch = 0x0;

  for (let i = 0; i < 9; i++) {
    ch = parseInt(cpf.charAt(i)) * (10 - i);
    calculation += ch;
  }

  let digit1 = calculation % 11 !== 0 ? 11 - (calculation % 11) : 0;
  if (digit1 !== parseInt(cpf.charAt(9))) return false;

  calculation = 0;
  for (let i = 0; i < 10; i++) {
    ch = parseInt(cpf.charAt(i)) * (11 - i);
    calculation += ch;
  }

  let digit2 = calculation % 11 !== 0 ? 11 - (calculation % 11) : 0;
  if (digit2 !== parseInt(cpf.charAt(10))) return false;

  return true;
};

/**
 * Valida CNPJ (Brasil)
 * @param {string} cnpj
 * @returns {boolean}
 */
export const isValidCNPJ = (cnpj) => {
  if (!cnpj || typeof cnpj !== 'string') return false;

  cnpj = cnpj.replace(/\D/g, '');

  if (cnpj.length !== 14) return false;
  if (/^\d+$/.test(cnpj) === false) return false;

  const tamanho = cnpj.length - 2;
  const numeros = cnpj.substring(0, tamanho);
  const digitos = cnpj.substring(tamanho);

  let soma = 0;
  let pos = 0;

  for (let i = tamanho - 1; i >= 0; i--) {
    pos++;
    soma += numeros.charAt(tamanho - pos) * Math.pow(2, (pos % 8) + 1);
  }

  let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado !== parseInt(digitos.charAt(0))) return false;

  soma = 0;
  pos = 0;

  for (let i = tamanho; i >= 0; i--) {
    pos++;
    soma += numeros.charAt(tamanho + 1 - pos) * Math.pow(2, (pos % 8) + 1);
  }

  resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado !== parseInt(digitos.charAt(1))) return false;

  return true;
};

/**
 * Valida URL
 * @param {string} url
 * @returns {boolean}
 */
export const isValidURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};

// ================================
// FORMATTING HELPERS
// ================================

/**
 * Formata valor monetário
 * @param {number} value
 * @param {string} currency
 * @returns {string}
 */
export const formatCurrency = (value, currency = 'BRL') => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency,
  }).format(value);
};

/**
 * Formata data
 * @param {Date|string} date
 * @param {string} format
 * @returns {string}
 */
export const formatDate = (date, format = 'DD/MM/YYYY') => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');

  return format
    .replace('DD', day)
    .replace('MM', month)
    .replace('YYYY', year)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
};

/**
 * Formata telefone (Brasil)
 * @param {string} phone
 * @returns {string}
 */
export const formatPhone = (phone) => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 11) {
    return `(${cleaned.substring(0, 2)}) ${cleaned.substring(2, 7)}-${cleaned.substring(7)}`;
  }
  return phone;
};

/**
 * Formata CPF
 * @param {string} cpf
 * @returns {string}
 */
export const formatCPF = (cpf) => {
  const cleaned = cpf.replace(/\D/g, '');
  if (cleaned.length === 11) {
    return `${cleaned.substring(0, 3)}.${cleaned.substring(3, 6)}.${cleaned.substring(6, 9)}-${cleaned.substring(9)}`;
  }
  return cpf;
};

/**
 * Formata CNPJ
 * @param {string} cnpj
 * @returns {string}
 */
export const formatCNPJ = (cnpj) => {
  const cleaned = cnpj.replace(/\D/g, '');
  if (cleaned.length === 14) {
    return `${cleaned.substring(0, 2)}.${cleaned.substring(2, 5)}.${cleaned.substring(5, 8)}/${cleaned.substring(8, 12)}-${cleaned.substring(12)}`;
  }
  return cnpj;
};

// ================================
// DATE HELPERS
// ================================

/**
 * Retorna intervalo de data para período
 * @param {string} period - 'today', 'week', 'month', 'quarter', 'year'
 * @returns {object} { startDate, endDate }
 */
export const getDateRange = (period = 'month') => {
  const today = new Date();
  let startDate;
  let endDate = today;

  switch (period) {
    case 'today':
      startDate = new Date(today);
      startDate.setHours(0, 0, 0, 0);
      break;
    case 'week':
      startDate = new Date(today);
      startDate.setDate(today.getDate() - today.getDay());
      startDate.setHours(0, 0, 0, 0);
      break;
    case 'month':
      startDate = new Date(today.getFullYear(), today.getMonth(), 1);
      break;
    case 'quarter':
      const quarter = Math.floor(today.getMonth() / 3);
      startDate = new Date(today.getFullYear(), quarter * 3, 1);
      break;
    case 'year':
      startDate = new Date(today.getFullYear(), 0, 1);
      break;
    default:
      startDate = new Date(today);
      startDate.setMonth(today.getMonth() - 1);
  }

  return { startDate, endDate };
};

/**
 * Calcula diferença entre datas em dias
 * @param {Date} startDate
 * @param {Date} endDate
 * @returns {number}
 */
export const daysBetween = (startDate, endDate) => {
  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  return Math.floor((new Date(endDate) - new Date(startDate)) / millisecondsPerDay);
};

/**
 * Verifica se data é no passado
 * @param {Date} date
 * @returns {boolean}
 */
export const isPastDate = (date) => {
  return new Date(date) < new Date();
};

/**
 * Verifica se data é no futuro
 * @param {Date} date
 * @returns {boolean}
 */
export const isFutureDate = (date) => {
  return new Date(date) > new Date();
};

// ================================
// PAGINATION HELPERS
// ================================

/**
 * Extrai parâmetros de paginação seguros
 * @param {object} query
 * @returns {object} { page, pageSize, offset }
 */
export const getPaginationParams = (query) => {
  let page = parseInt(query.page) || 1;
  let pageSize = parseInt(query.pageSize) || parseInt(process.env.DEFAULT_PAGE_SIZE) || 20;

  // Validações de segurança
  page = Math.max(1, page);
  const maxPageSize = parseInt(process.env.MAX_PAGE_SIZE) || 100;
  pageSize = Math.min(Math.max(1, pageSize), maxPageSize);

  const offset = (page - 1) * pageSize;

  return { page, pageSize, offset };
};

// ================================
// OBJECT HELPERS
// ================================

/**
 * Deep clone de objeto
 * @param {object} obj
 * @returns {object}
 */
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Remove propriedades específicas de um objeto
 * @param {object} obj
 * @param {array} keysToOmit
 * @returns {object}
 */
export const omit = (obj, keysToOmit = []) => {
  const result = {};
  Object.keys(obj).forEach((key) => {
    if (!keysToOmit.includes(key)) {
      result[key] = obj[key];
    }
  });
  return result;
};

/**
 * Seleciona apenas propriedades específicas de um objeto
 * @param {object} obj
 * @param {array} keysToPick
 * @returns {object}
 */
export const pick = (obj, keysToPick = []) => {
  const result = {};
  keysToPick.forEach((key) => {
    if (key in obj) {
      result[key] = obj[key];
    }
  });
  return result;
};

/**
 * Verifica se um objeto está vazio
 * @param {object} obj
 * @returns {boolean}
 */
export const isEmpty = (obj) => {
  return Object.keys(obj).length === 0;
};

/**
 * Merge de múltiplos objetos
 * @param {...object} objects
 * @returns {object}
 */
export const mergeObjects = (...objects) => {
  return objects.reduce((result, current) => {
    return { ...result, ...current };
  }, {});
};

// ================================
// STRING HELPERS
// ================================

/**
 * Slugify string
 * @param {string} str
 * @returns {string}
 */
export const slugify = (str) => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Capitalize primeira letra
 * @param {string} str
 * @returns {string}
 */
export const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Remove espaços em branco
 * @param {string} str
 * @returns {string}
 */
export const removeWhitespace = (str) => {
  return str.replace(/\s/g, '');
};

/**
 * Trunca string
 * @param {string} str
 * @param {number} length
 * @returns {string}
 */
export const truncate = (str, length = 50) => {
  return str.length > length ? str.substring(0, length) + '...' : str;
};

export default {
  // Password
  hashPassword,
  comparePassword,
  generateRandomPassword,
  // JWT
  generateToken,
  verifyToken,
  generateRefreshToken,
  verifyRefreshToken,
  decodeToken,
  // Validation
  isValidEmail,
  isValidPhone,
  isValidCPF,
  isValidCNPJ,
  isValidURL,
  // Formatting
  formatCurrency,
  formatDate,
  formatPhone,
  formatCPF,
  formatCNPJ,
  // Date
  getDateRange,
  daysBetween,
  isPastDate,
  isFutureDate,
  // Pagination
  getPaginationParams,
  // Object
  deepClone,
  omit,
  pick,
  isEmpty,
  mergeObjects,
  // String
  slugify,
  capitalize,
  removeWhitespace,
  truncate,
};