const Joi = require('joi');

const id = Joi.number().integer();
const categoryid = Joi.number().integer();
const name = Joi.string().max(255);
const description = Joi.string().max(500);
const price = Joi.number().integer();

const createProductSchema = Joi.object({
  categoryid: categoryid,
  name: name.required(),
  description: description.required(),
  price: price.required(),
});

const getProductSchema = Joi.object({
  id: id.required(),
});

const updateProductSchema = Joi.object({
  categoryid: categoryid,
  name: name,
  description: description,
  price: price,
});

module.exports = {
  createProductSchema,
  getProductSchema,
  updateProductSchema
}
