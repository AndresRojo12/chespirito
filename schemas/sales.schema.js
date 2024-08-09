const joi = require('joi');

const id = joi.number().integer();
const sale_price = joi.number();
const quantity_sold = joi.number();

const getSaleSchema = joi.object({
  id: id.required(),
});

const createSaleSchema = joi.object({
  sale_price: sale_price.required(),
  quantity_sold: quantity_sold.required(),
});

module.exports = { createSaleSchema, getSaleSchema };
