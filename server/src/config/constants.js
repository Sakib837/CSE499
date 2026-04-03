export const ROLES = {
  ADMIN: 'admin',
  EMPLOYEE: 'employee',
  USER: 'user',
};

export const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
  PENDING: 'pending', // Employees awaiting admin approval
};

export const MACHINE_STATUS = {
  ONLINE: 'online',
  OFFLINE: 'offline',
  MAINTENANCE: 'maintenance',
  ERROR: 'error',
};

export const TRANSACTION_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
};

export const RFID_STATUS = {
  ACTIVE: 'active',
  BLOCKED: 'blocked',
  EXPIRED: 'expired',
};

export const FUEL_TYPES = {
  DIESEL: 'Diesel',
  PETROL: 'Petrol',
  CNG: 'CNG',
};

export const APPROVAL_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
};

export const SYSTEM_HEALTH = {
  NORMAL: 'normal',
  WARNING: 'warning',
  CRITICAL: 'critical',
};

export const MACHINE_EVENT_TYPES = {
  HEARTBEAT: 'heartbeat',
  ALERT: 'alert',
  ERROR: 'error',
  TRANSACTION: 'transaction',
  STATUS_CHANGE: 'status_change',
};

export const ERROR_CODES = {
  CARD_INVALID: 'CARD_INVALID',
  CARD_EXPIRED: 'CARD_EXPIRED',
  CARD_BLOCKED: 'CARD_BLOCKED',
  INSUFFICIENT_BALANCE: 'INSUFFICIENT_BALANCE',
  MINIMUM_BALANCE_NOT_MET: 'MINIMUM_BALANCE_NOT_MET',
  TRANSACTION_TIMEOUT: 'TRANSACTION_TIMEOUT',
  MACHINE_OFFLINE: 'MACHINE_OFFLINE',
  UNAUTHORIZED: 'UNAUTHORIZED',
  INVALID_TOKEN: 'INVALID_TOKEN',
};

export const DEFAULTS = {
  MINIMUM_BALANCE: 50,
  RATE_LIMIT_WINDOW: 15 * 60 * 1000, // 15 minutes
  RATE_LIMIT_MAX: 100,
  AUTH_RATE_LIMIT_MAX: 50,
  TOKEN_LOCK_TIMEOUT: 10 * 60 * 1000, // 10 minutes
  TRANSACTION_MAX_DURATION: 600, // 10 minutes
  HEARTBEAT_TIMEOUT: 2 * 60 * 1000, // 2 minutes
  INVENTORY_LOW_THRESHOLD: 0.3, // 30%
};

export const API_MESSAGES = {
  SUCCESS: 'Operation successful',
  ERROR: 'An error occurred',
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Access forbidden',
  NOT_FOUND: 'Resource not found',
  BAD_REQUEST: 'Invalid request parameters',
  CONFLICT: 'Resource conflict',
  SERVER_ERROR: 'Internal server error',
};
