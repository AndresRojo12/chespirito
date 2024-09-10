const express = require('express');

const SalesServices = require('../services/sales.services');
const validatorHandler = require('../middlewares/validator.handler');
const { getSaleSchema, createSaleSchema } = require('../schemas/sales.schema');
const passport = require('passport');
const { checkAdmindRole } = require('../middlewares/auth.handler');

const router = express.Router();
const service = new SalesServices();

router.get('/', async (req, res, next) => {
  try {
    const {
      page = 1,
      pageSize = 10,
      categoryName,
      productName,
      categoryId,
      productId,
      quantitySold,
      salePrice,
      createdAt,
    } = req.query;
    const sale = await service.find({
      page: parseInt(page, 10),
      pageSize: parseInt(pageSize, 10),
      filters: {
        categoryName: categoryName || undefined,
        productName: productName || undefined,
        categoryId: categoryId || undefined,
        productId: productId || undefined,
        quantitySold: quantitySold || undefined,
        salePrice: salePrice || undefined,
        createdAt: createdAt || undefined,
      },
    });
    res.json(sale);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  validatorHandler(getSaleSchema, 'params');
  try {
    const { id } = req.params;
    res.json(await service.findOne(id));
  } catch (error) {
    next(error);
  }
});

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  checkAdmindRole,
  validatorHandler(createSaleSchema, 'body'),
  async (req, res, next) => {
    try {
      const body = await service.create(req.body);
      res.json(body);
    } catch (error) {
      next(error);
    }
  },
);

module.exports = router;
