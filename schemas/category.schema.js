const joi = require('joi');

const id = joi.number().integer();
const name = joi.string().min(3).max(20);
const description = joi.string().min(15).max(50);
const image = joi.string().uri();

const getCategorySchema = joi.object({
  id: id.required(),
});

const createCategorySchema = joi.object({
  name: name.required(),
  description: description.required(),
  image: image.required(),
});

const updateCategorySchema = joi.object({
  name: name,
  description: description,
  image: image,
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
