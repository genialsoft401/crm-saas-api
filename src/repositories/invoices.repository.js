import { query } from '../config/database.js';
import logger from '../config/logger.js';

/**
 * Repository de Invoices/Faturas
 */

export const createInvoice = async (invoiceData, companyId) => {
  const sql = `
    INSERT INTO invoices (invoiceNumber, clientId, companyId, description, totalAmount, discountAmount, finalAmount, status, dueDate, notes, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, 'draft', ?, ?, NOW(), NOW())
  `;

  const result = await query(sql, [
    invoiceData.invoiceNumber,
    invoiceData.clientId,
    companyId,
    invoiceData.description,
    invoiceData.totalAmount,
    invoiceData.discountAmount || 0,
    invoiceData.finalAmount,
    invoiceData.dueDate,
    invoiceData.notes || null,
  ]);

  logger.info('Invoice created', { invoiceId: result.insertId, companyId });
  return result;
};

export const getInvoiceById = async (id, companyId = null) => {
  let sql = 'SELECT * FROM invoices WHERE id = ?';
  const params = [id];

  if (companyId) {
    sql += ' AND companyId = ?';
    params.push(companyId);
  }

  const result = await query(sql, params);
  return result[0] || null;
};

export const listInvoices = async (filters = {}) => {
  let sql = 'SELECT * FROM invoices WHERE 1=1';
  const params = [];

  if (filters.companyId) {
    sql += ' AND companyId = ?';
    params.push(filters.companyId);
  }

  if (filters.clientId) {
    sql += ' AND clientId = ?';
    params.push(filters.clientId);
  }

  if (filters.status) {
    sql += ' AND status = ?';
    params.push(filters.status);
  }

  if (filters.search) {
    sql += ' AND (invoiceNumber LIKE ? OR description LIKE ?)';
    const searchTerm = `%${filters.search}%`;
    params.push(searchTerm, searchTerm);
  }

  const offset = filters.offset || 0;
  const limit = filters.limit || 20;
  sql += ' ORDER BY createdAt DESC LIMIT ? OFFSET ?';
  params.push(limit, offset);

  const result = await query(sql, params);
  return result;
};

export const countInvoices = async (filters = {}) => {
  let sql = 'SELECT COUNT(*) as total FROM invoices WHERE 1=1';
  const params = [];

  if (filters.companyId) {
    sql += ' AND companyId = ?';
    params.push(filters.companyId);
  }

  if (filters.clientId) {
    sql += ' AND clientId = ?';
    params.push(filters.clientId);
  }

  if (filters.status) {
    sql += ' AND status = ?';
    params.push(filters.status);
  }

  if (filters.search) {
    sql += ' AND (invoiceNumber LIKE ? OR description LIKE ?)';
    const searchTerm = `%${filters.search}%`;
    params.push(searchTerm, searchTerm);
  }

  const result = await query(sql, params);
  return result[0].total;
};

export const updateInvoice = async (id, invoiceData) => {
  const updates = [];
  const params = [];

  if (invoiceData.description !== undefined) {
    updates.push('description = ?');
    params.push(invoiceData.description);
  }
  if (invoiceData.totalAmount !== undefined) {
    updates.push('totalAmount = ?');
    params.push(invoiceData.totalAmount);
  }
  if (invoiceData.discountAmount !== undefined) {
    updates.push('discountAmount = ?');
    params.push(invoiceData.discountAmount);
  }
  if (invoiceData.finalAmount !== undefined) {
    updates.push('finalAmount = ?');
    params.push(invoiceData.finalAmount);
  }
  if (invoiceData.dueDate !== undefined) {
    updates.push('dueDate = ?');
    params.push(invoiceData.dueDate);
  }
  if (invoiceData.status !== undefined) {
    updates.push('status = ?');
    params.push(invoiceData.status);
  }
  if (invoiceData.notes !== undefined) {
    updates.push('notes = ?');
    params.push(invoiceData.notes);
  }

  if (updates.length === 0) return null;

  updates.push('updatedAt = NOW()');
  params.push(id);

  const sql = `UPDATE invoices SET ${updates.join(', ')} WHERE id = ?`;
  const result = await query(sql, params);

  logger.info('Invoice updated', { invoiceId: id });
  return result;
};

export const deleteInvoice = async (id) => {
  const sql = 'DELETE FROM invoices WHERE id = ?';
  const result = await query(sql, [id]);

  logger.info('Invoice deleted', { invoiceId: id });
  return result;
};
