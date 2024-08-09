const express = require('express');
const passport = require('passport');

const InventoryService = require('../services/inventory.service');

const validatorHandler = require('../middlewares/validator.handler');
const { checkAdmindRole } = require('../middlewares/auth.handler');
const {
  getInventorySchema,
  createInventorySchema,
} = require('../schemas/inventory.schema');

const router = express.Router();
const service = new InventoryService();

router.get('/', async (req, res, next) => {
  try {
    res.json(await service.find());
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  validatorHandler(getInventorySchema, 'params');
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
  validatorHandler(createInventorySchema, 'body'),
  async (req, res, next) => {
    try {
      const inventory = await service.create(req.body);
      res.json(inventory);
    } catch (error) {
      next(error);
    }
  },
);

module.exports = router;
