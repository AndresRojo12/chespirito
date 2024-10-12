const Joi = require('joi');

const id = Joi.number().integer();
const salesId = Joi.number().integer();
const status = Joi.string().max(255);

const createInventorySchema = Joi.object({
  salesId: salesId.required(),
  status: status.required().messages({
    'string.base': 'El estado debe ser de tipo texto',
    'string.empty': 'El estado es requerido',
    'string.min': 'El estado debe tener al menos 8 caracteres',
    'string.max': 'El estado no puede exceder los 500 caracteres',
    'any.required': 'El estado es requerido',
  }),
});

const getInventorySchema = Joi.object({
  id: id.required(),
});

const updateInventorySchema = Joi.object({
  salesId: salesId,
  status: status
});


module.exports = {
  createInventorySchema,
  getInventorySchema,
  updateInventorySchema
}
