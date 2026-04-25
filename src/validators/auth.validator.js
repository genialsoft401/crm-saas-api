import Joi from 'joi';

export const registerSchema = Joi.object({
  firstName: Joi.string().required().min(2).max(50).messages({
    'string.empty': 'Primeiro nome é obrigatório',
    'string.min': 'Primeiro nome deve ter no mínimo 2 caracteres',
  }),
  lastName: Joi.string().required().min(2).max(50),
  email: Joi.string().email().required().lowercase().messages({
    'string.email': 'Email inválido',
  }),
  password: Joi.string()
    .required()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .messages({
      'string.pattern.base':
        'Senha deve ter: maiúscula, minúscula, número e caractere especial',
      'string.min': 'Senha deve ter no mínimo 8 caracteres',
    }),
  companyName: Joi.string().required().min(2).max(100),
  phone: Joi.string().optional().allow(''),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
});

export const resetPasswordSchema = Joi.object({
  token: Joi.string().required(),
  newPassword: Joi.string()
    .required()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/),
});

export const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string()
    .required()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/),
  confirmPassword: Joi.string().required().valid(Joi.ref('newPassword')),
});

export const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required(),
});
