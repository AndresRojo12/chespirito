const joi = require('joi');

const id = joi.number().integer();
const name = joi.string().min(5).max(20);
const description = joi.string().min(5).max(50);

const getCategorySchema = joi.object({
  id: id.required(),
});

const createCategorySchema = joi.object({
  name: name.required(),
  description: description.required(),
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
