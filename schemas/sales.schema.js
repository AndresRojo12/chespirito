const joi = require('joi');

const id = joi.number().integer();
const categoryId = joi.number().integer();
const productId = joi.number().integer();
const salePrice = joi.number();
const quantitySold = joi.number();

const getSaleSchema = joi.object({
  id: id.required(),
});

const createSaleSchema = joi.object({
  categoryId:categoryId.required(),
  productId:productId.required(),
  salePrice: salePrice.required(),
  quantitySold: quantitySold.required(),
});

module.exports = { createSaleSchema, getSaleSchema };
