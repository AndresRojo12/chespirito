const Joi = require('joi');

const id = Joi.number().integer();
const categoryId = Joi.number().integer();
const name = Joi.string().max(255);
const status = Joi.number();
const description = Joi.string().max(500);
const price = Joi.number();

const getProductSchema = Joi.object({
  id: id.required(),
});

const createProductSchema = Joi.object({
  categoryId: categoryId.required(),
  name: name.required().min(8).max(255).messages({
    'string.base': 'El nombre debe ser de tipo texto',
    'string.empty': 'El nombre es requerido',
    'string.min': 'El nombre debe tener por lo menos 8 caracteres',
    'string.max': 'El nombre no puede exceder los 255 caracteres',
    'string.required': 'El nombre es requerido',
  }),
  status: status.required().messages({
    'number.base': 'El estado debe ser un número',
    'number.empty': 'El estado es requerido',
    'number.required': 'El estado es requerido',
  }),
  description: description.required().min(10).max(500).messages({
    'string.base': 'La descripción debe ser de tipo texto',
    'string.empty': 'La descripción es requerida',
    'string.min': 'La descripción debe contener por lo menos 10 caracteres',
    'string.max': 'La descripción no debe exceder los 500 caracteres',
    'string.required': 'La descripción es requerida',
  }),
  price: price.required().min(1000).max(20000000).messages({
    'number.base': 'El precio debe ser de tipo número',
    'number.empty': 'El precio es requerido',
    'number.min': 'El precio debe ser mayor a 1000 pesos',
    'number.max': 'El precio no debe superar 20000000',
    'number.required': 'El precio es requerido',
  }),
});

const updateProductSchema = Joi.object({
  categoryId: categoryId,
  name: name,
  status: status,
  description: description,
  price: price,
});

module.exports = {
  createProductSchema,
  getProductSchema,
  updateProductSchema,
};
