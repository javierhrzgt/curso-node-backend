import Joi from 'joi';

const id = Joi.string().uuid();
const email = Joi.string().email().trim();
const password = Joi.string()
  .min(8)
  .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
  .messages({
    'string.pattern.base':
      'La contraseña debe contener al menos una mayúscula, una minúscula y un número',
  });
const firstName = Joi.string().min(2).max(50).trim();
const lastName = Joi.string().min(2).max(50).trim();
const phone = Joi.string().pattern(/^[0-9]{8,15}$/);
const dateOfBirth = Joi.date()
  .max('now') // No futuro
  .min('1900-01-01') // Fecha razonable mínima
  .messages({
    'date.max': 'La fecha de nacimiento no puede ser futura',
    'date.min': 'Fecha inválida',
  });
const gender = Joi.string().valid(
  'male',
  'female',
  'other',
  'prefer_not_to_say',
);

const createUserSchema = Joi.object({
  email: email.required(),
  password: password.required(),
  firstName: firstName.required(),
  lastName: lastName.required(),
  phone: phone,
  gender: gender,
});

const updateUserSchema = Joi.object({
  firstName: firstName,
  lastName: lastName,
  phone: phone,
  dateOfBirth: dateOfBirth,
  gender: gender,
}).min(1);

const getUserSchema = Joi.object({
  id: id.required(),
});

const loginUserSchema = Joi.object({
  email: email.required(),
  password: Joi.string().required(),
});

export { createUserSchema, updateUserSchema, getUserSchema, loginUserSchema };
