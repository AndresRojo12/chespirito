const express = require('express');
const passport = require('passport');

const InventoryService = require('../services/inventory.service');

const validatorHandler = require('../middlewares/validator.handler');
const { checkAdmindRole } = require('../middlewares/auth.handler');
const {
  getInventorySchema,
  createInventorySchema,
  updateInventorySchema
} = require('../schemas/inventory.schema');

const router = express.Router();
const service = new InventoryService();

router.get('/', async (req, res, next) => {
  try {
    const { page = 1, pageSize = 10, status, createdAt,salesId,productName,updatedAt  } = req.query
    const inventory = await service.find({
      page: parseInt(page, 10),
      pageSize: parseInt(pageSize, 10),
      filters: {
        status: status || undefined,
        createdAt: createdAt || undefined,
        updatedAt: updatedAt || undefined,
        productName: productName || undefined,
        salesId: salesId || undefined,

      }
    });

    res.json(inventory);
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

router.patch('/:id',
  passport.authenticate('jwt', { session: false }),
  validatorHandler(getInventorySchema, 'params'),
  validatorHandler(updateInventorySchema, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const body = req.body;
      const userId = req.user.id;
      res.json(await service.update(id, body,userId))
    } catch (error) {
      next(error);
    }
  }
)

router.delete(
  '/:id',
  async (req, res, next) => {
    try {
      const { id } = req.params;
      res.json(await service.delete(id));
    } catch (error) {
      next(error);
    }
  }
)
module.exports = router;
