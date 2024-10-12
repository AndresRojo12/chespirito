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
  categoryId: categoryId.required(),
  productId: productId.required(),
  salePrice: salePrice.required().min(1000).max(200000000).messages({
    'number.base': 'El precio debe ser de tipo número',
    'number.empty': 'El precio es requerido',
    'number.min': 'El precio debe ser mayor a 1000 pesos',
    'number.max': 'El precio no debe superar 200000000000',
    'number.required': 'El precio es requerido',
  }),
  quantitySold: quantitySold.required().min(1).max(200000000).messages({
    'number.base': 'La cantidad debe ser de tipo número',
    'number.empty': 'La cantidad es requerida',
    'number.min': 'La cantidad debe ser mayor a 0',
    'number.max': 'La cantidad no debe superar 20000000',
    'number.required': 'La cantidad es requerida',
  }),
});

module.exports = { createSaleSchema, getSaleSchema };
