import { query, transaction } from '../config/database.js';
import logger from '../config/logger.js';

/**
 * Repository de Usuários
 */

export const createUser = async (userData) => {
  const sql = `
    INSERT INTO users (firstName, lastName, email, password, role, phone, department, companyId, status, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active', NOW(), NOW())
  `;

  const result = await query(sql, [
    userData.firstName,
    userData.lastName,
    userData.email,
    userData.password,
    userData.role,
    userData.phone || null,
    userData.department || null,
    userData.companyId,
  ]);

  logger.info('User created', { userId: result.insertId });
  return result;
};

export const getUserById = async (id, includePassword = false) => {
  const sql = includePassword
    ? 'SELECT * FROM users WHERE id = ?'
    : 'SELECT id, firstName, lastName, email, role, phone, department, status, companyId, createdAt, updatedAt FROM users WHERE id = ?';

  const result = await query(sql, [id]);
  return result[0] || null;
};

export const getUserByEmail = async (email, includePassword = false) => {
  const sql = includePassword
    ? 'SELECT * FROM users WHERE email = ? AND status != "suspended"'
    : 'SELECT id, firstName, lastName, email, role, phone, department, status, companyId, createdAt, updatedAt FROM users WHERE email = ? AND status != "suspended"';

  const result = await query(sql, [email.toLowerCase()]);
  return result[0] || null;
};

export const listUsers = async (filters = {}) => {
  let sql = 'SELECT id, firstName, lastName, email, role, phone, status, companyId, createdAt FROM users WHERE 1=1';
  const params = [];

  if (filters.companyId) {
    sql += ' AND companyId = ?';
    params.push(filters.companyId);
  }

  if (filters.role) {
    sql += ' AND role = ?';
    params.push(filters.role);
  }

  if (filters.status) {
    sql += ' AND status = ?';
    params.push(filters.status);
  }

  if (filters.search) {
    sql += ' AND (firstName LIKE ? OR lastName LIKE ? OR email LIKE ?)';
    const searchTerm = `%${filters.search}%`;
    params.push(searchTerm, searchTerm, searchTerm);
  }

  // Paginação
  const offset = filters.offset || 0;
  const limit = filters.limit || 20;
  sql += ' ORDER BY createdAt DESC LIMIT ? OFFSET ?';
  params.push(limit, offset);

  const result = await query(sql, params);
  return result;
};

export const countUsers = async (filters = {}) => {
  let sql = 'SELECT COUNT(*) as total FROM users WHERE 1=1';
  const params = [];

  if (filters.companyId) {
    sql += ' AND companyId = ?';
    params.push(filters.companyId);
  }

  if (filters.role) {
    sql += ' AND role = ?';
    params.push(filters.role);
  }

  if (filters.status) {
    sql += ' AND status = ?';
    params.push(filters.status);
  }

  if (filters.search) {
    sql += ' AND (firstName LIKE ? OR lastName LIKE ? OR email LIKE ?)';
    const searchTerm = `%${filters.search}%`;
    params.push(searchTerm, searchTerm, searchTerm);
  }

  const result = await query(sql, params);
  return result[0].total;
};

export const updateUser = async (id, userData) => {
  const updates = [];
  const params = [];

  if (userData.firstName !== undefined) {
    updates.push('firstName = ?');
    params.push(userData.firstName);
  }
  if (userData.lastName !== undefined) {
    updates.push('lastName = ?');
    params.push(userData.lastName);
  }
  if (userData.phone !== undefined) {
    updates.push('phone = ?');
    params.push(userData.phone);
  }
  if (userData.department !== undefined) {
    updates.push('department = ?');
    params.push(userData.department);
  }
  if (userData.role !== undefined) {
    updates.push('role = ?');
    params.push(userData.role);
  }
  if (userData.status !== undefined) {
    updates.push('status = ?');
    params.push(userData.status);
  }

  if (updates.length === 0) return null;

  updates.push('updatedAt = NOW()');
  params.push(id);

  const sql = `UPDATE users SET ${updates.join(', ')} WHERE id = ?`;
  const result = await query(sql, params);

  logger.info('User updated', { userId: id });
  return result;
};

export const updateUserPassword = async (id, hashedPassword) => {
  const sql = 'UPDATE users SET password = ?, updatedAt = NOW() WHERE id = ?';
  const result = await query(sql, [hashedPassword, id]);

  logger.info('User password updated', { userId: id });
  return result;
};

export const deleteUser = async (id) => {
  const sql = 'DELETE FROM users WHERE id = ?';
  const result = await query(sql, [id]);

  logger.info('User deleted', { userId: id });
  return result;
};

export const activateUser = async (id) => {
  const sql = 'UPDATE users SET status = "active", updatedAt = NOW() WHERE id = ?';
  const result = await query(sql, [id]);

  logger.info('User activated', { userId: id });
  return result;
};

export const deactivateUser = async (id) => {
  const sql = 'UPDATE users SET status = "inactive", updatedAt = NOW() WHERE id = ?';
  const result = await query(sql, [id]);

  logger.info('User deactivated', { userId: id });
  return result;
};
