const express = require('express');

const SalesServices = require('../services/sales.services');
const validatorHandler = require('../middlewares/validator.handler');
const { getSaleSchema, createSaleSchema } = require('../schemas/sales.schema');

const router = express.Router();
const service = new SalesServices();

router.get('/', async (req, res, next) => {
  try {
    res.json(await service.find());
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

router.post('/', async (req, res, next) => {
  validatorHandler(createSaleSchema, 'body');
  try {
    const body = req.body;
    res.json(await service.create(body));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
