import mysql from 'mysql';
import logger from './logger.js';

const pool = mysql.createPool({
  connectionLimit: parseInt(process.env.DB_POOL_MAX) || 20,
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'crm_saas_db',
  charset: process.env.DB_CHARSET || 'utf8mb4',
  timezone: process.env.DB_TIMEZONE || '+00:00',
  supportBigNumbers: true,
  bigNumberStrings: true,
  multipleStatements: false,
  waitForConnections: true,
  enableKeepAlive: true,
  keepAliveInitialDelayMs: 0,
});

/**
 * Executa uma query com prepared statement
 * @param {string} sql - Query SQL com placeholders (?)
 * @param {array} values - Valores para os placeholders
 * @returns {Promise<Object>} Resultado da query
 */
export const query = (sql, values = []) => {
  return new Promise((resolve, reject) => {
    pool.query(sql, values, (error, results) => {
      if (error) {
        logger.error('Database Query Error', {
          sql,
          error: error.message,
          code: error.code,
        });
        return reject(error);
      }
      resolve(results);
    });
  });
};

/**
 * Executa uma transação
 * @param {Function} callback - Função com as queries da transação
 * @returns {Promise<any>} Resultado da transação
 */
export const transaction = async (callback) => {
  const connection = await new Promise((resolve, reject) => {
    pool.getConnection((error, connection) => {
      if (error) {
        reject(error);
      } else {
        resolve(connection);
      }
    });
  });

  try {
    // Inicia transação
    await new Promise((resolve, reject) => {
      connection.query('START TRANSACTION', (error) => {
        if (error) reject(error);
        else resolve();
      });
    });

    // Executa callback com método para executar queries
    const result = await callback((sql, values) => {
      return new Promise((resolve, reject) => {
        connection.query(sql, values, (error, results) => {
          if (error) reject(error);
          else resolve(results);
        });
      });
    });

    // Commit
    await new Promise((resolve, reject) => {
      connection.query('COMMIT', (error) => {
        if (error) reject(error);
        else resolve();
      });
    });

    connection.release();
    return result;
  } catch (error) {
    // Rollback
    await new Promise((resolve) => {
      connection.query('ROLLBACK', () => {
        connection.release();
        resolve();
      });
    });

    logger.error('Transaction Error', { error: error.message });
    throw error;
  }
};

/**
 * Verifica a conexão com o banco de dados
 * @returns {Promise<boolean>}
 */
export const checkConnection = async () => {
  try {
    await query('SELECT 1');
    logger.info('Database connection successful');
    return true;
  } catch (error) {
    logger.error('Database connection failed', { error: error.message });
    return false;
  }
};

/**
 * Fecha a conexão do pool
 */
export const closePool = () => {
  return new Promise((resolve, reject) => {
    pool.end((error) => {
      if (error) {
        logger.error('Error closing database pool', { error: error.message });
        reject(error);
      } else {
        logger.info('Database pool closed');
        resolve();
      }
    });
  });
};

export default pool;