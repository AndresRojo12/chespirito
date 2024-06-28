const Joi = require('joi');

const id = Joi.number().integer();
const categoryId = Joi.number().integer();
const name = Joi.string().max(255);
const description = Joi.string().max(500);
const price = Joi.number().integer();

const createProductSchema = Joi.object({
  categoryId: categoryId.required(),
  name: name.required(),
  description: description.required(),
  price: price.required(),
});

const getProductSchema = Joi.object({
  id: id.required(),
});

const updateProductSchema = Joi.object({
  categoryId: categoryId,
  name: name,
  description: description,
  price: price,
});

module.exports = {
  createProductSchema,
  getProductSchema,
  updateProductSchema
}
