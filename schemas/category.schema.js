const joi = require('joi');

const id = joi.number().integer();
const name = joi.string().min(8).max(255);
const description = joi.string().min(50).max(500);

const getCategorySchema = joi.object({
  id: id.required(),
});

const createCategorySchema = joi.object({
  name: name.required().messages({
    'string.base': 'El nombre debe ser de tipo texto',
    'string.empty': 'Debe ingresar un nombre',
    'string.min': 'El nombe debe tener al menos 8 caracteres',
    'string.max': 'El nombre no puede exceder los 255 caracteres',
    'any.required': 'El nombre es obligatorio',
  }),
  description: description.required().messages({
    'string.base': 'La descripción debe ser un texto',
    'string.empty': 'La descripción no puede estar vacía',
    'string.min': 'La descripción debe tener al menos 50 caracteres',
    'string.max': 'La descripción no puede exceder los 500 caracteres',
    'any.required': 'La descripción es obligatoria',
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
