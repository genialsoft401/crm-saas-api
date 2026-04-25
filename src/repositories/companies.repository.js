import { query, transaction } from '../config/database.js';
import logger from '../config/logger.js';

/**
 * Repository de Empresas
 */

export const createCompany = async (companyData) => {
  const sql = `
    INSERT INTO companies (name, cnpj, email, phone, website, address, city, state, zipCode, subscriptionPlan, status, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active', NOW(), NOW())
  `;

  const result = await query(sql, [
    companyData.name,
    companyData.cnpj,
    companyData.email,
    companyData.phone || null,
    companyData.website || null,
    companyData.address || null,
    companyData.city || null,
    companyData.state || null,
    companyData.zipCode || null,
    companyData.subscriptionPlan,
  ]);

  logger.info('Company created', { companyId: result.insertId });
  return result;
};

export const getCompanyById = async (id) => {
  const sql = 'SELECT * FROM companies WHERE id = ?';
  const result = await query(sql, [id]);
  return result[0] || null;
};

export const listCompanies = async (filters = {}) => {
  let sql = 'SELECT * FROM companies WHERE 1=1';
  const params = [];

  if (filters.status) {
    sql += ' AND status = ?';
    params.push(filters.status);
  }

  if (filters.subscriptionPlan) {
    sql += ' AND subscriptionPlan = ?';
    params.push(filters.subscriptionPlan);
  }

  if (filters.search) {
    sql += ' AND (name LIKE ? OR cnpj LIKE ? OR email LIKE ?)';
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

export const countCompanies = async (filters = {}) => {
  let sql = 'SELECT COUNT(*) as total FROM companies WHERE 1=1';
  const params = [];

  if (filters.status) {
    sql += ' AND status = ?';
    params.push(filters.status);
  }

  if (filters.subscriptionPlan) {
    sql += ' AND subscriptionPlan = ?';
    params.push(filters.subscriptionPlan);
  }

  if (filters.search) {
    sql += ' AND (name LIKE ? OR cnpj LIKE ? OR email LIKE ?)';
    const searchTerm = `%${filters.search}%`;
    params.push(searchTerm, searchTerm, searchTerm);
  }

  const result = await query(sql, params);
  return result[0].total;
};

export const updateCompany = async (id, companyData) => {
  const updates = [];
  const params = [];

  if (companyData.name !== undefined) {
    updates.push('name = ?');
    params.push(companyData.name);
  }
  if (companyData.email !== undefined) {
    updates.push('email = ?');
    params.push(companyData.email);
  }
  if (companyData.phone !== undefined) {
    updates.push('phone = ?');
    params.push(companyData.phone);
  }
  if (companyData.website !== undefined) {
    updates.push('website = ?');
    params.push(companyData.website);
  }
  if (companyData.address !== undefined) {
    updates.push('address = ?');
    params.push(companyData.address);
  }
  if (companyData.city !== undefined) {
    updates.push('city = ?');
    params.push(companyData.city);
  }
  if (companyData.state !== undefined) {
    updates.push('state = ?');
    params.push(companyData.state);
  }
  if (companyData.zipCode !== undefined) {
    updates.push('zipCode = ?');
    params.push(companyData.zipCode);
  }
  if (companyData.subscriptionPlan !== undefined) {
    updates.push('subscriptionPlan = ?');
    params.push(companyData.subscriptionPlan);
  }
  if (companyData.status !== undefined) {
    updates.push('status = ?');
    params.push(companyData.status);
  }

  if (updates.length === 0) return null;

  updates.push('updatedAt = NOW()');
  params.push(id);

  const sql = `UPDATE companies SET ${updates.join(', ')} WHERE id = ?`;
  const result = await query(sql, params);

  logger.info('Company updated', { companyId: id });
  return result;
};

export const deleteCompany = async (id) => {
  const sql = 'DELETE FROM companies WHERE id = ?';
  const result = await query(sql, [id]);

  logger.info('Company deleted', { companyId: id });
  return result;
};
