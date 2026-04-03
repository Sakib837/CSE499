import Joi from 'joi';

export const registerSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email',
    'any.required': 'Email is required',
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters',
    'any.required': 'Password is required',
  }),
  firstName: Joi.string().required().messages({
    'any.required': 'First name is required',
  }),
  lastName: Joi.string().required().messages({
    'any.required': 'Last name is required',
  }),
  phone: Joi.string().optional().allow(''),
  role: Joi.string().valid('admin', 'employee', 'user').default('user'),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const updateProfileSchema = Joi.object({
  firstName: Joi.string().optional(),
  lastName: Joi.string().optional(),
  phone: Joi.string().optional().allow(''),
});

export const transactionInitSchema = Joi.object({
  cardId: Joi.string().required(),
  amount: Joi.number().positive().required(),
  machineId: Joi.string().required(),
  fuelType: Joi.string().valid('Diesel', 'Petrol', 'CNG').required(),
});

export const transactionCompleteSchema = Joi.object({
  machineId: Joi.string().required(),
  actualAmount: Joi.number().positive().required(),
  duration: Joi.number().positive().required(),
  sensorData: Joi.object({
    flowRate: Joi.number().optional(),
    temperature: Joi.number().optional(),
    anomalies: Joi.array().items(Joi.string()).optional(),
  }).optional(),
});

export const machineHeartbeatSchema = Joi.object({
  status: Joi.string().valid('online', 'offline', 'maintenance', 'error').required(),
  fuelLevel: Joi.number().min(0).max(100).required(),
  temperature: Joi.number().optional(),
  transactionCount: Joi.number().optional(),
  lastTransaction: Joi.date().optional(),
  systemHealth: Joi.string().valid('normal', 'warning', 'critical').required(),
});

export const registerMachineSchema = Joi.object({
  machineId: Joi.string().required(),
  stationId: Joi.string().required(),
  fuelType: Joi.string().valid('Diesel', 'Petrol', 'CNG').required(),
  serialNumber: Joi.string().optional(),
  model: Joi.string().optional(),
});

export const genaiQuerySchema = Joi.object({
  query: Joi.string().required().max(500),
  context: Joi.object({
    dateRange: Joi.string().valid('today', '24h', '7d', '30d').optional(),
    stationId: Joi.string().optional(),
  }).optional(),
});

export const genaiPresetSchema = Joi.object({
  presetId: Joi.string().required(),
});

export default {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  transactionInitSchema,
  transactionCompleteSchema,
  machineHeartbeatSchema,
  registerMachineSchema,
  genaiQuerySchema,
  genaiPresetSchema,
};
