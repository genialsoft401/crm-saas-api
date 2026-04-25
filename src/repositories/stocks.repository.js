import { query } from '../config/database.js';
import logger from '../config/logger.js';

/**
 * Repository de Stocks/Estoque
 */

export const createStock = async (stockData, companyId) => {
  const sql = `
    INSERT INTO stocks (name, sku, description, quantity, minimumQuantity, unitPrice, status, category, supplier, companyId, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, 'in_stock', ?, ?, ?, NOW(), NOW())
  `;

  const result = await query(sql, [
    stockData.name,
    stockData.sku,
    stockData.description || null,
    stockData.quantity,
    stockData.minimumQuantity,
    stockData.unitPrice,
    stockData.category || null,
    stockData.supplier || null,
    companyId,
  ]);

  logger.info('Stock created', { stockId: result.insertId, companyId });
  return result;
};

export const getStockById = async (id, companyId = null) => {
  let sql = 'SELECT * FROM stocks WHERE id = ?';
  const params = [id];

  if (companyId) {
    sql += ' AND companyId = ?';
    params.push(companyId);
  }

  const result = await query(sql, params);
  return result[0] || null;
};

export const listStocks = async (filters = {}) => {
  let sql = 'SELECT * FROM stocks WHERE 1=1';
  const params = [];

  if (filters.companyId) {
    sql += ' AND companyId = ?';
    params.push(filters.companyId);
  }

  if (filters.status) {
    sql += ' AND status = ?';
    params.push(filters.status);
  }

  if (filters.category) {
    sql += ' AND category = ?';
    params.push(filters.category);
  }

  if (filters.search) {
    sql += ' AND (name LIKE ? OR sku LIKE ? OR description LIKE ?)';
    const searchTerm = `%${filters.search}%`;
    params.push(searchTerm, searchTerm, searchTerm);
  }

  const offset = filters.offset || 0;
  const limit = filters.limit || 20;
  sql += ' ORDER BY createdAt DESC LIMIT ? OFFSET ?';
  params.push(limit, offset);

  const result = await query(sql, params);
  return result;
};

export const countStocks = async (filters = {}) => {
  let sql = 'SELECT COUNT(*) as total FROM stocks WHERE 1=1';
  const params = [];

  if (filters.companyId) {
    sql += ' AND companyId = ?';
    params.push(filters.companyId);
  }

  if (filters.status) {
    sql += ' AND status = ?';
    params.push(filters.status);
  }

  if (filters.category) {
    sql += ' AND category = ?';
    params.push(filters.category);
  }

  if (filters.search) {
    sql += ' AND (name LIKE ? OR sku LIKE ? OR description LIKE ?)';
    const searchTerm = `%${filters.search}%`;
    params.push(searchTerm, searchTerm, searchTerm);
  }

  const result = await query(sql, params);
  return result[0].total;
};

export const updateStock = async (id, stockData) => {
  const updates = [];
  const params = [];

  if (stockData.name !== undefined) {
    updates.push('name = ?');
    params.push(stockData.name);
  }
  if (stockData.description !== undefined) {
    updates.push('description = ?');
    params.push(stockData.description);
  }
  if (stockData.quantity !== undefined) {
    updates.push('quantity = ?');
    params.push(stockData.quantity);
  }
  if (stockData.minimumQuantity !== undefined) {
    updates.push('minimumQuantity = ?');
    params.push(stockData.minimumQuantity);
  }
  if (stockData.unitPrice !== undefined) {
    updates.push('unitPrice = ?');
    params.push(stockData.unitPrice);
  }
  if (stockData.status !== undefined) {
    updates.push('status = ?');
    params.push(stockData.status);
  }
  if (stockData.category !== undefined) {
    updates.push('category = ?');
    params.push(stockData.category);
  }
  if (stockData.supplier !== undefined) {
    updates.push('supplier = ?');
    params.push(stockData.supplier);
  }

  if (updates.length === 0) return null;

  updates.push('updatedAt = NOW()');
  params.push(id);

  const sql = `UPDATE stocks SET ${updates.join(', ')} WHERE id = ?`;
  const result = await query(sql, params);

  logger.info('Stock updated', { stockId: id });
  return result;
};

export const deleteStock = async (id) => {
  const sql = 'DELETE FROM stocks WHERE id = ?';
  const result = await query(sql, [id]);

  logger.info('Stock deleted', { stockId: id });
  return result;
};
