import nodemailer from 'nodemailer';
import logger from './logger.js';

let transporter = null;
let isConnected = false;

/**
 * Inicializa Nodemailer
 */
const initMailer = async () => {
  if (!process.env.MAIL_ENABLED || process.env.MAIL_ENABLED === 'false') {
    logger.info('Email desabilitado (MAIL_ENABLED=false)');
    return;
  }

  try {
    transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.MAIL_PORT) || 587,
      secure: process.env.MAIL_SECURE === 'true' || false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    // Verifica conexão
    await transporter.verify();
    isConnected = true;
    logger.info('Email service connected successfully');
  } catch (error) {
    logger.error('Email service initialization error', { error: error.message });
    transporter = null;
  }
};

/**
 * Template de email de boas-vindas
 */
const welcomeTemplate = (name, email, password) => `
  <html>
    <body style="font-family: Arial, sans-serif;">
      <h2>Bem-vindo ao CRM SaaS!</h2>
      <p>Olá <strong>${name}</strong>,</p>
      <p>Sua conta foi criada com sucesso.</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Senha temporária:</strong> ${password}</p>
      <p>Recomendamos alterar sua senha após o primeiro acesso.</p>
      <hr>
      <p>Atenciosamente,<br>Time CRM SaaS</p>
    </body>
  </html>
`;

/**
 * Template de reset de senha
 */
const resetPasswordTemplate = (name, resetLink) => `
  <html>
    <body style="font-family: Arial, sans-serif;">
      <h2>Reset de Senha</h2>
      <p>Olá <strong>${name}</strong>,</p>
      <p>Recebemos uma solicitação para resetar sua senha.</p>
      <p><a href="${resetLink}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Resetar Senha</a></p>
      <p>Este link expira em 24 horas.</p>
      <p>Se não solicitou isto, ignore este email.</p>
      <hr>
      <p>Atenciosamente,<br>Time CRM SaaS</p>
    </body>
  </html>
`;

/**
 * Template de fatura/invoice
 */
const invoiceTemplate = (invoiceNumber, amount, dueDate) => `
  <html>
    <body style="font-family: Arial, sans-serif;">
      <h2>Fatura #${invoiceNumber}</h2>
      <p><strong>Valor:</strong> R$ ${amount.toFixed(2)}</p>
      <p><strong>Vencimento:</strong> ${dueDate}</p>
      <p>Por favor, realize o pagamento até a data de vencimento.</p>
      <hr>
      <p>Atenciosamente,<br>Time CRM SaaS</p>
    </body>
  </html>
`;

/**
 * Template de pagamento realizado
 */
const paymentConfirmationTemplate = (paymentId, amount, date) => `
  <html>
    <body style="font-family: Arial, sans-serif;">
      <h2>Confirmação de Pagamento</h2>
      <p><strong>ID do Pagamento:</strong> ${paymentId}</p>
      <p><strong>Valor:</strong> R$ ${amount.toFixed(2)}</p>
      <p><strong>Data:</strong> ${date}</p>
      <p>Seu pagamento foi processado com sucesso.</p>
      <hr>
      <p>Atenciosamente,<br>Time CRM SaaS</p>
    </body>
  </html>
`;

/**
 * Envia email simples
 * @param {string} to
 * @param {string} subject
 * @param {string} html
 * @returns {Promise<boolean>}
 */
export const sendMail = async (to, subject, html) => {
  if (!isConnected || !transporter) {
    logger.warn('Email service not available');
    return false;
  }

  try {
    await transporter.sendMail({
      from: process.env.MAIL_FROM || 'noreply@crm-saas.com',
      to,
      subject,
      html,
    });

    logger.info('Email sent', { to, subject });
    return true;
  } catch (error) {
    logger.error('Error sending email', { to, subject, error: error.message });
    return false;
  }
};

/**
 * Envia email de boas-vindas
 */
export const sendWelcomeEmail = async (name, email, password) => {
  return sendMail(
    email,
    'Bem-vindo ao CRM SaaS',
    welcomeTemplate(name, email, password)
  );
};

/**
 * Envia email de reset de senha
 */
export const sendResetPasswordEmail = async (name, email, resetLink) => {
  return sendMail(
    email,
    'Reset de Senha - CRM SaaS',
    resetPasswordTemplate(name, resetLink)
  );
};

/**
 * Envia email de fatura
 */
export const sendInvoiceEmail = async (email, invoiceNumber, amount, dueDate) => {
  return sendMail(
    email,
    `Fatura #${invoiceNumber} - CRM SaaS`,
    invoiceTemplate(invoiceNumber, amount, dueDate)
  );
};

/**
 * Envia email de confirmação de pagamento
 */
export const sendPaymentConfirmationEmail = async (email, paymentId, amount, date) => {
  return sendMail(
    email,
    `Pagamento Confirmado #${paymentId}`,
    paymentConfirmationTemplate(paymentId, amount, date)
  );
};

/**
 * Check email connection
 */
export const checkConnection = async () => {
  if (!transporter) return false;

  try {
    await transporter.verify();
    return true;
  } catch (error) {
    logger.error('Email connection check failed', { error: error.message });
    return false;
  }
};

// Inicializar mailer na importação
await initMailer();

export default {
  sendMail,
  sendWelcomeEmail,
  sendResetPasswordEmail,
  sendInvoiceEmail,
  sendPaymentConfirmationEmail,
  checkConnection,
};