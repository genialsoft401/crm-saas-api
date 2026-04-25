// ================================
// ROLES
// ================================
export const ROLES = {
  OWNER: 'owner',
  ADMIN: 'admin',
  EMPLOYEE: 'employee',
  VIEWER: 'viewer',
};

// Permissões por role
export const ROLE_PERMISSIONS = {
  [ROLES.OWNER]: ['*'],
  [ROLES.ADMIN]: [
    'users:create',
    'users:read',
    'users:update',
    'users:delete',
    'users:activate',
    'companies:read',
    'companies:update',
    'clients:create',
    'clients:read',
    'clients:update',
    'clients:delete',
    'invoices:create',
    'invoices:read',
    'invoices:update',
    'payments:read',
    'reports:read',
  ],
  [ROLES.EMPLOYEE]: [
    'users:read',
    'clients:read',
    'clients:create',
    'invoices:read',
    'invoices:create',
    'payments:read',
    'reports:read',
  ],
  [ROLES.VIEWER]: ['users:read', 'clients:read', 'invoices:read', 'payments:read', 'reports:read'],
};

// ================================
// USER STATUS
// ================================
export const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
  PENDING: 'pending',
};

// ================================
// COMPANY STATUS
// ================================
export const COMPANY_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
};

// ================================
// SUBSCRIPTION PLANS
// ================================
export const SUBSCRIPTION_PLANS = {
  BASIC: 'basic',
  PROFESSIONAL: 'professional',
  ENTERPRISE: 'enterprise',
};

export const SUBSCRIPTION_PLAN_DETAILS = {
  [SUBSCRIPTION_PLANS.BASIC]: {
    name: 'Plano Básico',
    price: 99.0,
    users: 3,
    features: ['Gestão de clientes', 'Faturação básica', 'Dashboard simples'],
  },
  [SUBSCRIPTION_PLANS.PROFESSIONAL]: {
    name: 'Plano Profissional',
    price: 299.0,
    users: 10,
    features: [
      'Gestão de clientes',
      'Faturação avançada',
      'Dashboard executivo',
      'Relatórios',
      'Gestão de estoque',
    ],
  },
  [SUBSCRIPTION_PLANS.ENTERPRISE]: {
    name: 'Plano Enterprise',
    price: 999.0,
    users: 100,
    features: [
      'Gestão de clientes',
      'Faturação avançada',
      'Dashboard executivo',
      'Relatórios avançados',
      'Gestão de estoque',
      'API customizada',
      'Suporte prioritário',
    ],
  },
};

// ================================
// INVOICE STATUS
// ================================
export const INVOICE_STATUS = {
  DRAFT: 'draft',
  ISSUED: 'issued',
  SENT: 'sent',
  VIEWED: 'viewed',
  PARTIALLY_PAID: 'partially_paid',
  PAID: 'paid',
  CANCELLED: 'cancelled',
  OVERDUE: 'overdue',
};

// ================================
// PAYMENT STATUS
// ================================
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded',
  CANCELLED: 'cancelled',
};

// ================================
// PAYMENT METHODS
// ================================
export const PAYMENT_METHODS = {
  CREDIT_CARD: 'credit_card',
  DEBIT_CARD: 'debit_card',
  BANK_TRANSFER: 'bank_transfer',
  BOLETO: 'boleto',
  PIX: 'pix',
  CASH: 'cash',
};

// ================================
// STOCK STATUS
// ================================
export const STOCK_STATUS = {
  IN_STOCK: 'in_stock',
  LOW_STOCK: 'low_stock',
  OUT_OF_STOCK: 'out_of_stock',
  DISCONTINUED: 'discontinued',
};

// ================================
// ERROR CODES
// ================================
export const ERROR_CODES = {
  // Auth
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  TOKEN_INVALID: 'TOKEN_INVALID',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  USER_ALREADY_EXISTS: 'USER_ALREADY_EXISTS',
  INVALID_EMAIL: 'INVALID_EMAIL',
  WEAK_PASSWORD: 'WEAK_PASSWORD',
  // Database
  DATABASE_ERROR: 'DATABASE_ERROR',
  TRANSACTION_ERROR: 'TRANSACTION_ERROR',
  DUPLICATE_ENTRY: 'DUPLICATE_ENTRY',
  // Validation
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_INPUT: 'INVALID_INPUT',
  // Not Found
  NOT_FOUND: 'NOT_FOUND',
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
  // Business Logic
  INVALID_STATUS: 'INVALID_STATUS',
  OPERATION_NOT_ALLOWED: 'OPERATION_NOT_ALLOWED',
  INSUFFICIENT_BALANCE: 'INSUFFICIENT_BALANCE',
};

// ================================
// EMAIL TEMPLATES
// ================================
export const EMAIL_TEMPLATES = {
  WELCOME: 'welcome',
  PASSWORD_RESET: 'password_reset',
  INVOICE: 'invoice',
  PAYMENT_CONFIRMATION: 'payment_confirmation',
  USER_SUSPENDED: 'user_suspended',
  SUBSCRIPTION_EXPIRING: 'subscription_expiring',
};

// ================================
// LOG ACTIONS
// ================================
export const LOG_ACTIONS = {
  // Auth
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  PASSWORD_CHANGE: 'PASSWORD_CHANGE',
  PASSWORD_RESET: 'PASSWORD_RESET',
  // Users
  USER_CREATED: 'USER_CREATED',
  USER_UPDATED: 'USER_UPDATED',
  USER_DELETED: 'USER_DELETED',
  USER_ACTIVATED: 'USER_ACTIVATED',
  USER_DEACTIVATED: 'USER_DEACTIVATED',
  // Companies
  COMPANY_CREATED: 'COMPANY_CREATED',
  COMPANY_UPDATED: 'COMPANY_UPDATED',
  // Invoices
  INVOICE_CREATED: 'INVOICE_CREATED',
  INVOICE_UPDATED: 'INVOICE_UPDATED',
  INVOICE_SENT: 'INVOICE_SENT',
  // Payments
  PAYMENT_CREATED: 'PAYMENT_CREATED',
  PAYMENT_PROCESSED: 'PAYMENT_PROCESSED',
  PAYMENT_FAILED: 'PAYMENT_FAILED',
};

// ================================
// HTTP STATUS CODES
// ================================
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
};

export default {
  ROLES,
  ROLE_PERMISSIONS,
  USER_STATUS,
  COMPANY_STATUS,
  SUBSCRIPTION_PLANS,
  SUBSCRIPTION_PLAN_DETAILS,
  INVOICE_STATUS,
  PAYMENT_STATUS,
  PAYMENT_METHODS,
  STOCK_STATUS,
  ERROR_CODES,
  EMAIL_TEMPLATES,
  LOG_ACTIONS,
  HTTP_STATUS,
};