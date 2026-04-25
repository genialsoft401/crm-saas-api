import winston from 'winston';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const logsDir = path.join(__dirname, '../../logs');

// Cria pasta de logs se não existir
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

winston.addColors(colors);

const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.printf(
    (info) =>
      `${info.timestamp} ${info.level}: ${info.message}${info.stack ? '\n' + info.stack : ''}${info.metadata ? '\n' + JSON.stringify(info.metadata, null, 2) : ''}`
  )
);

const transports = [
  // Console
  new winston.transports.Console({
    format: winston.format.combine(winston.format.colorize({ all: true }), format),
  }),
  // Arquivo de erros
  new winston.transports.File({
    filename: path.join(logsDir, 'error.log'),
    level: 'error',
    format,
    maxsize: 10485760, // 10MB
    maxFiles: 5,
  }),
  // Arquivo geral
  new winston.transports.File({
    filename: path.join(logsDir, 'all.log'),
    format,
    maxsize: 10485760, // 10MB
    maxFiles: 14,
  }),
];

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'debug',
  levels,
  format,
  transports,
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join(logsDir, 'exceptions.log'),
      format,
    }),
  ],
  rejectionHandlers: [
    new winston.transports.File({
      filename: path.join(logsDir, 'rejections.log'),
      format,
    }),
  ],
});

/**
 * Extensão do logger com metadados
 */
const logWithMetadata = (level, message, metadata = {}) => {
  logger.log(level, message, { metadata });
};

logger.info = (message, metadata) => logWithMetadata('info', message, metadata);
logger.error = (message, metadata) => logWithMetadata('error', message, metadata);
logger.warn = (message, metadata) => logWithMetadata('warn', message, metadata);
logger.http = (message, metadata) => logWithMetadata('http', message, metadata);
logger.debug = (message, metadata) => logWithMetadata('debug', message, metadata);

export default logger;