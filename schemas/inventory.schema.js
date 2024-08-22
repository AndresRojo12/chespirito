const Joi = require('joi');

const id = Joi.number().integer();
const salesId = Joi.number().integer();
const status = Joi.string().max(255);

const createInventorySchema = Joi.object({
  salesId: salesId.required(),
  status: status.required(),
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
