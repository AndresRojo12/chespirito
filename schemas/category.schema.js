const joi = require('joi');

const id = joi.number().integer();
const name = joi.string().min(8).max(255);
const description = joi.string().min(10).max(500);

const getCategorySchema = joi.object({
  id: id.required(),
});

const createCategorySchema = joi.object({
  name: name.required().messages({
    'string.base': 'El nombre debe ser de tipo texto',
    'string.empty': 'El nombre es requerido',
    'string.min': 'El nombre debe tener al menos 8 caracteres',
    'string.max': 'El nombre no puede exceder los 255 caracteres',
    'any.required': 'El nombre es requerido',
  }),
  description: description.required().messages({
    'string.base': 'La descripción debe ser de tipo texto',
    'string.empty': 'La descripción es requerida',
    'string.min': 'La descripción debe tener al menos entre 10 y 50 caracteres',
    'string.max': 'La descripción no puede exceder los 500 caracteres',
    'any.required': 'La descripción es requerida',
  }),
});

const updateCategorySchema = joi.object({
  name: name,
  description: description,
});

const deleteCategorySchema = joi.object({
  id: id.required(),
});

module.exports = {
  getCategorySchema,
  createCategorySchema,
  updateCategorySchema,
  deleteCategorySchema,
};
