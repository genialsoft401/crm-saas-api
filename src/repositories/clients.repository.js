import { query } from '../config/database.js';
import logger from '../config/logger.js';

/**
 * Repository de Clientes
 */

export const createClient = async (clientData, companyId) => {
  const sql = `
    INSERT INTO clients (name, email, phone, cpfCnpj, address, city, state, zipCode, country, notes, companyId, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
  `;

  const result = await query(sql, [
    clientData.name,
    clientData.email,
    clientData.phone,
    clientData.cpfCnpj || null,
    clientData.address || null,
    clientData.city || null,
    clientData.state || null,
    clientData.zipCode || null,
    clientData.country || 'Brasil',
    clientData.notes || null,
    companyId,
  ]);

  logger.info('Client created', { clientId: result.insertId, companyId });
  return result;
};

export const getClientById = async (id, companyId = null) => {
  let sql = 'SELECT * FROM clients WHERE id = ?';
  const params = [id];

  if (companyId) {
    sql += ' AND companyId = ?';
    params.push(companyId);
  }

  const result = await query(sql, params);
  return result[0] || null;
};

export const listClients = async (filters = {}) => {
  let sql = 'SELECT * FROM clients WHERE 1=1';
  const params = [];

  if (filters.companyId) {
    sql += ' AND companyId = ?';
    params.push(filters.companyId);
  }

  if (filters.search) {
    sql += ' AND (name LIKE ? OR email LIKE ? OR phone LIKE ?)';
    const searchTerm = `%${filters.search}%`;
    params.push(searchTerm, searchTerm, searchTerm);
  }

  const offset = filters.offset || 0;
  const limit = filters.limit || 20;

  const sortBy = filters.sortBy || 'createdAt';
  const sortOrder = filters.sortOrder || 'DESC';

  sql += ` ORDER BY ${sortBy} ${sortOrder} LIMIT ? OFFSET ?`;
  params.push(limit, offset);

  const result = await query(sql, params);
  return result;
};

export const countClients = async (filters = {}) => {
  let sql = 'SELECT COUNT(*) as total FROM clients WHERE 1=1';
  const params = [];

  if (filters.companyId) {
    sql += ' AND companyId = ?';
    params.push(filters.companyId);
  }

  if (filters.search) {
    sql += ' AND (name LIKE ? OR email LIKE ? OR phone LIKE ?)';
    const searchTerm = `%${filters.search}%`;
    params.push(searchTerm, searchTerm, searchTerm);
  }

  const result = await query(sql, params);
  return result[0].total;
};

export const updateClient = async (id, clientData) => {
  const updates = [];
  const params = [];

  if (clientData.name !== undefined) {
    updates.push('name = ?');
    params.push(clientData.name);
  }
  if (clientData.email !== undefined) {
    updates.push('email = ?');
    params.push(clientData.email);
  }
  if (clientData.phone !== undefined) {
    updates.push('phone = ?');
    params.push(clientData.phone);
  }
  if (clientData.address !== undefined) {
    updates.push('address = ?');
    params.push(clientData.address);
  }
  if (clientData.city !== undefined) {
    updates.push('city = ?');
    params.push(clientData.city);
  }
  if (clientData.state !== undefined) {
    updates.push('state = ?');
    params.push(clientData.state);
  }
  if (clientData.zipCode !== undefined) {
    updates.push('zipCode = ?');
    params.push(clientData.zipCode);
  }
  if (clientData.notes !== undefined) {
    updates.push('notes = ?');
    params.push(clientData.notes);
  }

  if (updates.length === 0) return null;

  updates.push('updatedAt = NOW()');
  params.push(id);

  const sql = `UPDATE clients SET ${updates.join(', ')} WHERE id = ?`;
  const result = await query(sql, params);

  logger.info('Client updated', { clientId: id });
  return result;
};

export const deleteClient = async (id) => {
  const sql = 'DELETE FROM clients WHERE id = ?';
  const result = await query(sql, [id]);

  logger.info('Client deleted', { clientId: id });
  return result;
};
