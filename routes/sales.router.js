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

router.post('/',
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
});

module.exports = router;
