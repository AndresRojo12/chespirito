const express = require('express');
const passport = require('passport');

const InventoryService = require('../services/inventory.service');

const validatorHandler = require('../middlewares/validator.handler');
const { checkAdmindRole } = require('../middlewares/auth.handler');

const router = express.Router();
const service = new InventoryService;

router.post(
  '/',
  passport.authenticate('jwt', { session:false }),
  checkAdmindRole,
  //validatorHandler()
  async (req, res, next) => {
    try {
      const inventory = await service.create(req.body);
      res.json(inventory);
    } catch (error) {
      next(error);
    }
  }
)

module.exports = router;
