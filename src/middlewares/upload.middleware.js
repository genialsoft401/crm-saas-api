import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { badRequest } from '../utils/response.js';
import logger from '../config/logger.js';

const uploadDir = process.env.UPLOAD_DIR || './uploads';
const maxFileSize = parseInt(process.env.MAX_FILE_SIZE) || 52428800; // 50MB
const allowedMimeTypes = (process.env.ALLOWED_MIMETYPES || '').split(',');

// Cria pasta de upload se não existir
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  // Validação de tipo MIME
  if (allowedMimeTypes.length > 0 && !allowedMimeTypes.includes(file.mimetype)) {
    logger.warn('File type not allowed', { mimeType: file.mimetype });
    return cb(new Error('Tipo de arquivo não permitido'));
  }

  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: maxFileSize,
  },
});

/**
 * Middleware para upload único
 */
export const uploadSingle = (fieldName = 'file') => {
  return (req, res, next) => {
    const singleUpload = upload.single(fieldName);

    singleUpload(req, res, (err) => {
      if (err) {
        logger.error('Upload error', { error: err.message });
        return badRequest(res, 'Erro ao fazer upload: ' + err.message);
      }
      next();
    });
  };
};

/**
 * Middleware para upload múltiplo
 */
export const uploadMultiple = (fieldName = 'files', maxFiles = 5) => {
  return (req, res, next) => {
    const multipleUpload = upload.array(fieldName, maxFiles);

    multipleUpload(req, res, (err) => {
      if (err) {
        logger.error('Multiple upload error', { error: err.message });
        return badRequest(res, 'Erro ao fazer upload: ' + err.message);
      }
      next();
    });
  };
};

export default upload;
