import redis from 'redis';
import logger from './logger.js';

let client = null;
let isConnected = false;

/**
 * Inicializa cliente Redis
 */
const initRedis = async () => {
  if (!process.env.REDIS_ENABLED || process.env.REDIS_ENABLED === 'false') {
    logger.info('Redis desabilitado (REDIS_ENABLED=false)');
    return;
  }

  try {
    client = redis.createClient({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT) || 6379,
      password: process.env.REDIS_PASSWORD || undefined,
      db: parseInt(process.env.REDIS_DB) || 0,
      socket: {
        reconnectStrategy: (retries) => {
          if (retries > 10) {
            logger.error('Redis max reconnect attempts reached');
            return new Error('Max redis reconnection attempts');
          }
          return retries * 50;
        },
      },
    });

    client.on('error', (err) => {
      logger.error('Redis Client Error', { error: err.message });
      isConnected = false;
    });

    client.on('connect', () => {
      logger.info('Redis connected successfully');
      isConnected = true;
    });

    client.on('ready', () => {
      logger.info('Redis ready');
    });

    await client.connect();
  } catch (error) {
    logger.error('Redis initialization error', { error: error.message });
  }
};

/**
 * Get value from Redis
 * @param {string} key
 * @returns {Promise<any>}
 */
export const get = async (key) => {
  if (!isConnected || !client) return null;

  try {
    const value = await client.get(key);
    if (value) {
      return JSON.parse(value);
    }
    return null;
  } catch (error) {
    logger.warn('Redis GET error', { key, error: error.message });
    return null;
  }
};

/**
 * Set value in Redis
 * @param {string} key
 * @param {any} value
 * @param {number} ttl - Time to live in seconds (optional)
 * @returns {Promise<boolean>}
 */
export const set = async (key, value, ttl = null) => {
  if (!isConnected || !client) return false;

  try {
    const options = ttl ? { EX: ttl } : {};
    await client.set(key, JSON.stringify(value), options);
    return true;
  } catch (error) {
    logger.warn('Redis SET error', { key, error: error.message });
    return false;
  }
};

/**
 * Delete key from Redis
 * @param {string} key
 * @returns {Promise<boolean>}
 */
export const del = async (key) => {
  if (!isConnected || !client) return false;

  try {
    await client.del(key);
    return true;
  } catch (error) {
    logger.warn('Redis DEL error', { key, error: error.message });
    return false;
  }
};

/**
 * Delete multiple keys from Redis
 * @param {array} keys
 * @returns {Promise<boolean>}
 */
export const delMany = async (keys) => {
  if (!isConnected || !client || keys.length === 0) return false;

  try {
    await client.del(keys);
    return true;
  } catch (error) {
    logger.warn('Redis DEL MANY error', { keysCount: keys.length, error: error.message });
    return false;
  }
};

/**
 * Clear all keys in Redis
 * @returns {Promise<boolean>}
 */
export const clear = async () => {
  if (!isConnected || !client) return false;

  try {
    await client.flushDb();
    logger.info('Redis database cleared');
    return true;
  } catch (error) {
    logger.warn('Redis FLUSH error', { error: error.message });
    return false;
  }
};

/**
 * Check Redis connection
 * @returns {Promise<boolean>}
 */
export const checkConnection = async () => {
  if (!isConnected || !client) return false;

  try {
    await client.ping();
    return true;
  } catch (error) {
    logger.error('Redis connection check failed', { error: error.message });
    return false;
  }
};

/**
 * Close Redis connection
 */
export const closeConnection = async () => {
  if (client) {
    try {
      await client.quit();
      logger.info('Redis connection closed');
      isConnected = false;
    } catch (error) {
      logger.error('Error closing Redis connection', { error: error.message });
    }
  }
};

export const isRedisConnected = () => isConnected;

// Inicializar Redis na importação
await initRedis();

export default { get, set, del, delMany, clear, checkConnection, closeConnection, isRedisConnected };