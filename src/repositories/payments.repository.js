import { query } from '../config/database.js';
import logger from '../config/logger.js';

/**
 * Repository de Pagamentos
 */

export const createPayment = async (paymentData, companyId) => {
  const sql = `
    INSERT INTO payments (invoiceId, companyId, amount, paymentMethod, status, referenceNumber, notes, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, 'pending', ?, ?, NOW(), NOW())
  `;

  const result = await query(sql, [
    paymentData.invoiceId,
    companyId,
    paymentData.amount,
    paymentData.paymentMethod,
    paymentData.referenceNumber || null,
    paymentData.notes || null,
  ]);

  logger.info('Payment created', { paymentId: result.insertId, companyId });
  return result;
};

export const getPaymentById = async (id, companyId = null) => {
  let sql = 'SELECT * FROM payments WHERE id = ?';
  const params = [id];

  if (companyId) {
    sql += ' AND companyId = ?';
    params.push(companyId);
  }

  const result = await query(sql, params);
  return result[0] || null;
};

export const listPayments = async (filters = {}) => {
  let sql = 'SELECT * FROM payments WHERE 1=1';
  const params = [];

  if (filters.companyId) {
    sql += ' AND companyId = ?';
    params.push(filters.companyId);
  }

  if (filters.invoiceId) {
    sql += ' AND invoiceId = ?';
    params.push(filters.invoiceId);
  }

  if (filters.status) {
    sql += ' AND status = ?';
    params.push(filters.status);
  }

  const offset = filters.offset || 0;
  const limit = filters.limit || 20;
  sql += ' ORDER BY createdAt DESC LIMIT ? OFFSET ?';
  params.push(limit, offset);

  const result = await query(sql, params);
  return result;
};

export const countPayments = async (filters = {}) => {
  let sql = 'SELECT COUNT(*) as total FROM payments WHERE 1=1';
  const params = [];

  if (filters.companyId) {
    sql += ' AND companyId = ?';
    params.push(filters.companyId);
  }

  if (filters.invoiceId) {
    sql += ' AND invoiceId = ?';
    params.push(filters.invoiceId);
  }

  if (filters.status) {
    sql += ' AND status = ?';
    params.push(filters.status);
  }

  const result = await query(sql, params);
  return result[0].total;
};

export const updatePayment = async (id, paymentData) => {
  const updates = [];
  const params = [];

  if (paymentData.status !== undefined) {
    updates.push('status = ?');
    params.push(paymentData.status);
  }
  if (paymentData.referenceNumber !== undefined) {
    updates.push('referenceNumber = ?');
    params.push(paymentData.referenceNumber);
  }
  if (paymentData.notes !== undefined) {
    updates.push('notes = ?');
    params.push(paymentData.notes);
  }

  if (updates.length === 0) return null;

  updates.push('updatedAt = NOW()');
  params.push(id);

  const sql = `UPDATE payments SET ${updates.join(', ')} WHERE id = ?`;
  const result = await query(sql, params);

  logger.info('Payment updated', { paymentId: id });
  return result;
};

export const deletePayment = async (id) => {
  const sql = 'DELETE FROM payments WHERE id = ?';
  const result = await query(sql, [id]);

  logger.info('Payment deleted', { paymentId: id });
  return result;
};
